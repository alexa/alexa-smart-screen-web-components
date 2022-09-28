/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 *     http://aws.amazon.com/apache2.0/
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

import { 
    AVSInterface, 
    ContentType, 
    ChannelName, 
    FocusState, 
    IGUIActivityTracker, 
    IFocusManager, 
    ILogger, 
    LoggerParamsBuilder,
    PlaybackFocusResolverManager
} from '@alexa-smart-screen/common';
import {
    APLRenderer,
    AudioTrack,
    Component,
    FactoryFunction,
    IVideoFactory,
    PlaybackState,
    Video
} from 'apl-client';

/// Default volume value for the player.
export const DEFAULT_VOLUME = 1;

/// Low volume value for the player.
export const LOW_VOLUME = 0.2;

/**
 * Factory class which creates APLVideo objects
 */
export class APLVideoFactory implements IVideoFactory {
    private focusManager : IFocusManager;
    private guiActivityTracker : IGUIActivityTracker;
    private logger : ILogger;

    private readonly avsInterface : AVSInterface;
    private readonly contentType : ContentType;

    constructor(avsInterface : AVSInterface, 
                contentType : ContentType, 
                focusManager : IFocusManager, 
                guiActivityTracker : IGUIActivityTracker, 
                logger : ILogger) {
        this.focusManager = focusManager;
        this.guiActivityTracker = guiActivityTracker;
        this.logger = logger;
        this.avsInterface = avsInterface;
        this.contentType = contentType;
    }

    public create(renderer : APLRenderer,
                  component : APL.Component,
                  factory : FactoryFunction,
                  parent ?: Component) : APLVideo {
        return new APLVideo(this.avsInterface, 
                            this.contentType, 
                            this.logger, 
                            this.focusManager, 
                            this.guiActivityTracker, 
                            renderer, 
                            component, 
                            factory, 
                            parent);
    }
}

/**
 * A Video component which adds AVS focus support
 */
export class APLVideo extends Video {
    protected static readonly CLASS_NAME = 'APLVideo';
    private focusManager : IFocusManager;
    private focusToken : number;
    private playbackFocusResolverManager : PlaybackFocusResolverManager;
    private guiActivityTracker : IGUIActivityTracker;
    private activityToken : number;
    private loggerAPLVideo : ILogger;
    private readonly avsInterface : AVSInterface;
    private readonly contentType : ContentType;

    constructor(avsInterface : AVSInterface, 
                contentType : ContentType,
                logger : ILogger,
                focusManager : IFocusManager,
                guiActivityTracker : IGUIActivityTracker,
                renderer : APLRenderer,
                component : APL.Component,
                factory : FactoryFunction,
                parent ?: Component) {
        super(renderer, component, factory, parent);
        this.playbackFocusResolverManager = new PlaybackFocusResolverManager(logger);
        this.loggerAPLVideo = logger;
        this.focusManager = focusManager;
        this.guiActivityTracker = guiActivityTracker;
        this.avsInterface = avsInterface;
        this.contentType = contentType;
    }

    protected static getLoggerParamsBuilder() : LoggerParamsBuilder {
        return new LoggerParamsBuilder().setClassName(APLVideo.CLASS_NAME);
    }

    /**
     * Method to indicate a playback event has occurred
     * @param event The new playback state
     */
    public onEvent(event : PlaybackState) : void {
        super.onEvent(event);

        switch (event) {
            case PlaybackState.PAUSED: // FALLTHROUGH
            case PlaybackState.ENDED: // FALLTHROUGH
            case PlaybackState.ERROR: // FALLTHROUGH
            case PlaybackState.IDLE:
                this.releaseFocus();
                if (this.activityToken !== undefined) {
                    this.guiActivityTracker.recordInactive(this.activityToken);
                    this.activityToken = undefined;
                }
                break;

            case PlaybackState.PLAYING:
                this.activityToken = this.guiActivityTracker.recordActive(`APLVideo-${this.id}`);
                break;
            case PlaybackState.BUFFERING: // FALLTHROUGH
            case PlaybackState.LOADED: // FALLTHROUGH
            default:
                break;
        }
    }

    /**
     * Method to start video playback
     */
    public async play(waitForFinish  = false) : Promise<void> {
        const functionName = 'play';
        try {
            if (this.audioTrack === AudioTrack.kAudioTrackNone) {
                // Focus is not required if there is no audio track
                this.player.mute();
                await super.play(waitForFinish);
            } else {
                const focusChannel = this.audioTrack === AudioTrack.kAudioTrackBackground ?
                    ChannelName.CONTENT : ChannelName.DIALOG;
                await this.acquireFocus(focusChannel)
                    .then(() => super.play(waitForFinish));
            }
        }
        catch(error : any) {
            this.loggerAPLVideo.error(APLVideo.getLoggerParamsBuilder()
                                        .setFunctionName(functionName)
                                        .setMessage(`Video not successfully played: ${error}`)
                                        .build());
            return;
        }
    }

    private async acquireFocus(channel : ChannelName) : Promise<void> {
        // Reject the previous focus request immediately (if it exists)
        this.playbackFocusResolverManager.onReject("Promise for focus token expired");
        // Init resolver request before acquiring focus in case it resolves immediately
        const request = this.playbackFocusResolverManager.onRequest();
        this.focusToken = this.focusManager.acquireFocus(this.avsInterface, channel, this.contentType, {
            focusChanged : this.processFocusChanged.bind(this)
        });
        return await request;
    }

    private releaseFocus() {
        if (this.focusToken !== undefined) {
            this.focusManager.releaseFocus(this.focusToken);
        }
    }

    private async processFocusChanged(focusState : FocusState, token : number) {
        const functionName = 'processFocusChanged';
        if (token !== this.focusToken) {
            // This was not the focus token we were expecting, ignore it
            return;
        }

        switch (focusState) {
            case FocusState.NONE:
                if (this.playbackFocusResolverManager.getPlaybackFocusResolver()) {
                    const errorMessage = "Invalid focus transition, initial focus state was NONE";
                    this.loggerAPLVideo.error(APLVideo.getLoggerParamsBuilder()
                                                .setFunctionName(functionName)
                                                .setArg('error', errorMessage)
                                                .build());
                    this.playbackFocusResolverManager.onReject(errorMessage);
                } else {
                    this.pause();
                }

                this.focusToken = undefined;
                break;
            case FocusState.FOREGROUND:
                this.player.setVolume(DEFAULT_VOLUME);
                if (!this.playbackFocusResolverManager.getPlaybackFocusResolver()) {
                    // If focus was changed without a playback focus request, ensure we resume playback
                    await super.play();
                } else {
                    this.playbackFocusResolverManager.onResponse();
                }
                break;
            case FocusState.BACKGROUND:
                // Lower the volume for ducking experience
                this.player.setVolume(LOW_VOLUME);
                if (!this.playbackFocusResolverManager.getPlaybackFocusResolver()) {
                    // If focus was changed without a playback focus request, ensure we resume playback
                    await super.play();
                } else {
                    this.playbackFocusResolverManager.onResponse();
                }
                break;
            default:
                this.loggerAPLVideo.error(APLVideo.getLoggerParamsBuilder()
                                            .setFunctionName(functionName)
                                            .setArg('error', 'Unknown focus state')
                                            .build());
                break;
        }
    }
}
