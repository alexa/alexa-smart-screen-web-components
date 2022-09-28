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
    AudioContextController,
    AVSInterface,
    ChannelName, 
    ContentType,
    IGUIActivityTracker,
    IFocusManager, 
    FocusState, 
    ILogger,
    LoggerParamsBuilder,
    PlaybackFocusResolverManager,
    IAudioContextControllerSettings } from '@alexa-smart-screen/common';
import { AudioPlayer, IAudioEventListener, IAudioContextProvider, DefaultAudioContextProvider } from 'apl-client';

// This const is used to reference the APL Audio Player by the SDK
export const APL_PLAYER_TYPE = 'APLAudioPlayer';

export interface IAPLAudioPlayerProps {
    avsInterface : AVSInterface,
    channelName : ChannelName,
    contentType : ContentType,
    guiActivityTracker : IGUIActivityTracker;
    eventListener : IAudioEventListener;
    focusManager : IFocusManager;
    logger : ILogger;
    audioSettings : IAudioContextControllerSettings;
    audioContextProvider ?: IAudioContextProvider;
}

/**
 * Provides an implementation of the AudioPlayer which adds audio focus support
 */
export class APLAudioPlayer extends AudioPlayer {
    protected static readonly CLASS_NAME = APL_PLAYER_TYPE;
    private focusManager : IFocusManager;
    private focusToken : number;
    private playbackFocusResolverManager : PlaybackFocusResolverManager;
    private guiActivityTracker : IGUIActivityTracker;
    private activityToken : number;
    private audioContextProvider : IAudioContextProvider;
    private playing  = false;
    private audioContextController : AudioContextController;
    private audioSettings : IAudioContextControllerSettings;
    private logger : ILogger;
    private readonly avsInterface : AVSInterface;
    private readonly channelName : ChannelName;
    private readonly contentType : ContentType;

    public constructor(props : IAPLAudioPlayerProps) {
        super(props.eventListener);
        this.focusManager = props.focusManager;
        this.guiActivityTracker = props.guiActivityTracker;
        this.logger = props.logger;
        this.audioContextProvider = props.audioContextProvider ? props.audioContextProvider : new DefaultAudioContextProvider();
        this.audioSettings = props.audioSettings;
        this.playbackFocusResolverManager = new PlaybackFocusResolverManager(this.logger);
        this.avsInterface = props.avsInterface;
        this.channelName = props.channelName;
        this.contentType = props.contentType;
    }

    protected static getLoggerParamsBuilder() : LoggerParamsBuilder {
        return new LoggerParamsBuilder().setClassName(APLAudioPlayer.CLASS_NAME);
    }

    /**
     * Method for when media has been downloaded and ready to play
     * @param id a uuid
     */
    public async play(id : string) : Promise<void> {
        const functionName = 'play';
        try {
            const returnValues = await Promise.all([this.audioContextProvider.getAudioContext(), this.acquireFocus()]);
            this.activityToken = this.guiActivityTracker.recordActive(APL_PLAYER_TYPE);
            this.playing = true;
            const audioContext = returnValues[0];
            this.audioContextController = new AudioContextController(audioContext, false, this.logger);
            this.audioContextController.setVolume(
                this.audioSettings.volume, 
                this.audioSettings.isMuted);
            this.audioContextController.setEqualizer(
                this.audioSettings.bass, 
                this.audioSettings.midrange, 
                this.audioSettings.treble);
            this.setCurrentAudioNode(this.audioContextController.getInput());
            this.playWithContext(id, audioContext);
        }
        catch(error : any) {
            this.logger.error(APLAudioPlayer.getLoggerParamsBuilder()
                                .setFunctionName(functionName)
                                .setMessage(`play failed with reason: ${error}`)
                                .build())
            this.releaseFocus();
            this.flush();
        }
    }

    /**
     * Release Audio Context
     */
    public releaseAudioContext() : void {
        this.audioContextProvider.releaseAudioContext(null);
    }

    /**
     * Method for when media finishes playing
     * @param id A uuid
     */
    public onPlaybackFinished(id : string) : void {
        this.playing = false;
        super.onPlaybackFinished(id);
        this.releaseFocus();
        if (this.activityToken !== undefined) {
            this.guiActivityTracker.recordInactive(this.activityToken);
            this.activityToken = undefined;
        }
    }

    /**
     * Method to report an error for a given request. Used to report a download error or parse / playback error
     * @param id a uuid
     * @param reason an arbitrary string
     */
    public onError(id : string, reason : string) : void {
        this.playing = false;
        super.onError(id, reason);
        this.releaseFocus();
        if (this.activityToken !== undefined) {
            this.guiActivityTracker.recordInactive(this.activityToken);
            this.activityToken = undefined;
        }
    }

    /**
     * Method to stop currently playing audio and flush any pending decodes
     */
    public flush() : void {
        this.playing = false;
        super.flush();
    }

    private async acquireFocus() : Promise<void> {
        // Reject the previous focus request immediately (if it exists)
        this.playbackFocusResolverManager.onReject("Promise for focus token expired");
        // Init resolver request before acquiring focus in case it resolves immediately
        const request = this.playbackFocusResolverManager.onRequest();
        this.focusToken = this.focusManager.acquireFocus(this.avsInterface, this.channelName, this.contentType, {
            focusChanged : this.processFocusChanged.bind(this)
        });
        return await request;
    }

    private releaseFocus() : void {
        if (this.focusToken !== undefined) {
            this.focusManager.releaseFocus(this.focusToken);
            this.focusToken = undefined;
        }
    }

    private processFocusChanged(focusState : FocusState, token : number) : void {
        const functionName = 'processFocusChanged';
        if (this.focusToken !== token) {
            // This was not the focus token we were expecting, ignore it
            return;
        }

        // For dialog we do not allow background audio playback and will stop speech if this happens
        if (focusState !== FocusState.FOREGROUND) {
            if (this.playbackFocusResolverManager.getPlaybackFocusResolver()) {
                const errorMessage = "Invalid focus transition, focus state was not FOREGROUND";
                this.logger.error(APLAudioPlayer.getLoggerParamsBuilder()
                                            .setFunctionName(functionName)
                                            .setArg('error', errorMessage)
                                            .build());
                this.playbackFocusResolverManager.onReject("Foreground mode not acquired for audio player");
            } else if (this.playing) {
                this.flush();
            }

            this.focusToken = undefined;
        } else {
            this.playbackFocusResolverManager.onResponse();
        }
    }

    public setAudioSettings(audioSettings : IAudioContextControllerSettings) : void {
        this.audioSettings = audioSettings; 
    }

}
