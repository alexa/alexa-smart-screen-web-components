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

import { AlignItemsCssProperty, AVSVisualInterfaces, BackgroundColorCssProperty, ChannelName, ContentType, FocusState, IFocusManager, IGUIActivityTracker, ILogger, JustifyContentCssProperty, LoggerParamsBuilder, OpacityCssProperty, PlaybackFocusResolverManager, PositionCssProperty, VisibilityCssProperty } from "@alexa-smart-screen/common";
import { ILiveViewCameraEvent } from "../ipcComponents/ILiveViewCameraEvent";
import { LiveViewCameraState } from "../constants/LiveViewCameraState";
import { LiveViewCameraUIState } from "../constants/LiveViewCameraUIState";
import { IStartLiveViewPayload, LiveViewAudioState } from "../ipcComponents/IStartLiveViewPayload";

/**
 * Interface for props to configure the LiveViewRTCMediaPlayerElement
 */
export interface ILiveViewRTCMediaPlayerProps {
    liveViewEvent : ILiveViewCameraEvent,
    isDisplayRound : boolean,
    videoTransitionTimeInMS : number;
    focusManager : IFocusManager;
    activityTracker : IGUIActivityTracker;
    logger  : ILogger;
}

/**
 * Name to use in activity tracking for the live view camera
 */
const LIVE_VIEW_CAMERA_ACTIVITY_NAME = 'LiveViewCamera';

/**
 * Element for rendering an RTC Media player stream for LiveViewCamera
 */
export class LiveViewRTCMediaPlayerElement extends HTMLElement {
    protected static readonly CLASS_NAME = 'LiveViewRTCMediaPlayerElement';
    // RTC media components
    private rtcscAdapter : any;
    private mediaClient : any;
    private mediaClientInitialized : boolean;
    
    private firstFrameRendered : boolean;
    private cameraState : LiveViewCameraState;
    private initialSpeakerState : LiveViewAudioState;
    private uiState : LiveViewCameraUIState;

    private videoTransitionInMs : number;
    private liveViewEvent : ILiveViewCameraEvent;

    private activityTracker : IGUIActivityTracker;
    private activityToken : number;

    private focusManager : IFocusManager;
    private focusToken : number;
    private focusState : FocusState;
    private playbackFocusResolverManager : PlaybackFocusResolverManager;

    private videoElement : HTMLVideoElement;

    private logger : ILogger;

    constructor(props : ILiveViewRTCMediaPlayerProps) {
        super();
        this.attachShadow({ mode : 'open' });
        this.style.height = '100%';
        this.style.width = '100%';
        this.style.position = PositionCssProperty.ABSOLUTE;
        this.style.justifyContent = JustifyContentCssProperty.CENTER;
        this.style.alignItems = AlignItemsCssProperty.CENTER;
        this.style.backgroundColor = BackgroundColorCssProperty.BLACK;

        this.logger = props.logger;

        this.videoTransitionInMs = props.videoTransitionTimeInMS;
        this.liveViewEvent = props.liveViewEvent;
        this.focusManager = props.focusManager;
        this.activityTracker = props.activityTracker;
        this.playbackFocusResolverManager = new PlaybackFocusResolverManager(props.logger);

        this.focusToken = 0;
        this.focusState = FocusState.NONE;
        this.activityToken = 0;

        const videoWidth = props.isDisplayRound ? '85%' : '100%';
        this.videoElement = this.createVideoElement(videoWidth);
        this.shadowRoot.appendChild(this.videoElement);

        this.resetCamera();
    }

    protected static getLoggerParamsBuilder() : LoggerParamsBuilder {
        return new LoggerParamsBuilder().setClassName(LiveViewRTCMediaPlayerElement.CLASS_NAME);
    }

    private resetCamera() {
        if (this.videoElement) {
            this.videoElement.srcObject = null;
            this.videoElement.load();
        }
        this.firstFrameRendered = false;
        this.cameraState = LiveViewCameraState.DISCONNECTED;
        this.initialSpeakerState = LiveViewAudioState.DISABLED;
        this.uiState = LiveViewCameraUIState.CLEARED;
    }

    private createVideoElement(width : string) : HTMLVideoElement {
        const video = document.createElement('video');
        video.style.height = '100%';
        video.style.width = width;
        video.style.transition = `opacity ${this.videoTransitionInMs}ms linear`;
        video.muted = true;
        return video;
    }

    private videoStarted(event : Event) {
        if (event.type === 'playing') {
            this.firstFrameRendered = true;
            this.liveViewEvent.cameraFirstFrameRendered();
            this.activityToken = this.activityTracker.recordActive(LIVE_VIEW_CAMERA_ACTIVITY_NAME);
            this.transitionVideoElement();
        }
      }
    
    private videoStopped(event : Event) {
        this.releaseFocusAndRecordInactive();
        this.resetCamera();
    }

    private transitionVideoElement() {
        let videoVisibility : VisibilityCssProperty = VisibilityCssProperty.HIDDEN;
        let videoOpacity : OpacityCssProperty = OpacityCssProperty.TRANSPARENT;
        if (this.uiState === LiveViewCameraUIState.RENDERED && this.firstFrameRendered) {
            // Unmute the video if required for init
            if (this.videoElement && this.shouldUnmuteVideo()) {
                this.videoElement.muted = false;
            }
            videoVisibility = VisibilityCssProperty.VISIBLE;
            videoOpacity = OpacityCssProperty.OPAQUE;
        }
        this.videoElement.style.visibility = videoVisibility;
        this.videoElement.style.opacity = videoOpacity;
    }


    public async initializeClient(startLiveViewPayload : IStartLiveViewPayload) : Promise<boolean> {
        const functionName = 'initializeClient';
        if (!this.rtcscAdapter) {
            this.rtcscAdapter = await import('@amzn/rtcmedia_browser_adapter');
            if (!this.rtcscAdapter) {
                return false;
            }
        }
    
        if (!this.mediaClient) {
          try {
            this.mediaClient = this.rtcscAdapter.getMediaClient();
          } catch(error : any) {
            this.logger.error(LiveViewRTCMediaPlayerElement.getLoggerParamsBuilder()
                                        .setFunctionName(functionName)
                                        .setMessage(`Failed to get RTCSC media client: ${error.message}`)
                                        .build());
            return false;
          }
        }
    
        if (this.mediaClientInitialized) {
            this.shutdownClient();
        }

        this.initialSpeakerState = startLiveViewPayload.viewerExperience.audioProperties.speakerState;
        this.mediaClient.initialize();
        this.mediaClientInitialized = true;
        return true;
    }

    public shutdownClient() {
        if (this.mediaClientInitialized) {
            this.mediaClient.shutdown();
            this.mediaClientInitialized = false;
        }
        this.resetCamera();
        this.transitionVideoElement();
    }

    public async setCameraConnectionState(state : LiveViewCameraState) {
        if (this.cameraState === state) return;
        this.cameraState = state;
        if (this.cameraState === LiveViewCameraState.CONNECTED) {
            await this.playMediaStream();
        }
    }

    public setCameraUIState(state : LiveViewCameraUIState) {
        if (this.uiState === state) return;
        this.uiState = state;
        this.transitionVideoElement();
    }

    private async playMediaStream() : Promise<void> {
        const functionName = 'playMediaStream';
        try {
            const mediaStream = await this.mediaClient.getRemoteStream();
            await this.acquireFocus()
            .then(() => {
                this.setMediaStream(mediaStream);
            })
        } catch(e) {
            this.logger.error(LiveViewRTCMediaPlayerElement.getLoggerParamsBuilder()
                                        .setFunctionName(functionName)
                                        .setMessage(`Media stream not succesfully played: ${e.message}`)
                                        .build());
            return;
        }
    }

    private setMediaStream(mediaStream : MediaStream) {
        const functionName  = 'setMediaStream';
        this.videoElement.onplaying = this.videoStarted.bind(this);
        this.videoElement.onpause = this.videoStopped.bind(this);
        this.videoElement.onended = this.videoStopped.bind(this);
        this.videoElement.onerror = this.videoStopped.bind(this);
        this.videoElement.muted = !this.shouldUnmuteVideo();
        try {
            if (this.videoElement.srcObject !== mediaStream) {
                this.videoElement.srcObject = mediaStream;
            }
            this.videoElement.play();
        } catch (e) {
            this.logger.error(LiveViewRTCMediaPlayerElement.getLoggerParamsBuilder()
                                .setFunctionName(functionName)
                                .setArg('error', e.message)
                                .build());
        }
    }

    private shouldUnmuteVideo() {
        return (this.initialSpeakerState === LiveViewAudioState.UNMUTED &&
            this.firstFrameRendered &&
            this.cameraState === LiveViewCameraState.CONNECTED &&
            this.uiState === LiveViewCameraUIState.RENDERED &&
            this.focusState === FocusState.FOREGROUND);
    }

    private async acquireFocus() : Promise<void> {
        // Reject the previous focus request immediately (if it exists)
        this.playbackFocusResolverManager.onReject("Promise for focus token expired");
        // Init resolver request before acquiring focus in case it resolves immediately
        const request = this.playbackFocusResolverManager.onRequest();
        this.focusToken = this.focusManager.acquireFocus(AVSVisualInterfaces.LIVE_VIEW_CAMERA, ChannelName.CONTENT, ContentType.NONMIXABLE, {
            focusChanged : this.processFocusChanged.bind(this)
        });
        return await request;
    }

    private releaseFocusAndRecordInactive() {
        this.releaseFocus();
        if (this.activityToken !== undefined) {
            this.activityTracker.recordInactive(this.activityToken);
            this.activityToken = undefined;
        }
    }

    private releaseFocus() {
        if (this.focusToken !== undefined) {
            this.focusManager.releaseFocus(this.focusToken);
        }
    }

    private processFocusChanged(focusState : FocusState, token : number) {
        const functionName = 'processFocusChanged';
        if (token !== this.focusToken) {
            // This was not the focus token we were expecting, ignore it
            return;
        }
        switch (focusState) {
            case FocusState.NONE:
                if (this.playbackFocusResolverManager.getPlaybackFocusResolver()) {
                    const errorMessage = "Invalid focus transition, initial focus state was NONE";
                    this.logger.error(LiveViewRTCMediaPlayerElement.getLoggerParamsBuilder()
                                                .setFunctionName(functionName)
                                                .setArg('error', errorMessage)
                                                .build());
                    this.playbackFocusResolverManager.onReject(errorMessage);
                } else if (this.videoElement && this.firstFrameRendered) {
                    this.videoElement.pause();
                }
                this.focusToken = undefined;
                break;
            case FocusState.FOREGROUND:
                this.playbackFocusResolverManager.onResponse();
                if (this.videoElement && this.shouldUnmuteVideo()) {
                    this.videoElement.muted = false;
                }
                break;
            case FocusState.BACKGROUND:
                this.playbackFocusResolverManager.onResponse();
                if (this.videoElement) {
                    this.videoElement.muted = true;
                }
                break;
            default:
                this.logger.error(LiveViewRTCMediaPlayerElement.getLoggerParamsBuilder()
                                            .setFunctionName(functionName)
                                            .setArg('error', 'Unknown focus state')
                                            .build());
                break;
        }
        this.focusState = focusState;
    }
}

window.customElements.define('live-view-camera-rtc-media-player', LiveViewRTCMediaPlayerElement);
