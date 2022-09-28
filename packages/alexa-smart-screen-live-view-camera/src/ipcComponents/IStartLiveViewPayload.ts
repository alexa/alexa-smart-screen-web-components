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

/**
 * Enumeration for type of viewing device endpoint
 */
export enum LiveViewEndpointType {
    ALEXA_ENDPOINT = 'ALEXA_ENDPOINT'
}

/**
 * Enumeration of the role of the device for the camera viewing session.
 * https://developer.amazon.com/docs/alexa/alexa-voice-service/alexa-liveviewcontroller.html#role
 */
export enum LiveViewRole {
    /// The device acts as a camera. There can be one camera per streaming session.
    CAMERA = 'CAMERA',
    /// The device acts as a viewer of the security camera streaming session. There can be multiple viewing devices in a streaming session.
    VIEWER = 'VIEWER'
}

/**
 * Enumeration of the viewing device connection state
 */
export enum ViewingDeviceState {
    /// the user cannot see the camera feed. 
    CONNECTING = 'CONNECTING',
    /// the user can see the camera feed. 
    CONNECTED = 'CONNECTED'
}

/**
 * Enumeration of the motion capabilities of the camera.
 * https://developer.amazon.com/docs/alexa/alexa-voice-service/alexa-liveviewcontroller.html#capability
 */
export enum CameraMotionCapability {
    /// The camera supports physical panning. To pan, the camera rotates on the horizontal axis.
    PHYSICAL_PAN = 'PHYSICAL_PAN',
    /// The camera can tilt on the vertical axis.
    PHYSICAL_TILT = 'PHYSICAL_TILT',
    /// The camera supports optical zoom.
    PHYSICAL_ZOOM = 'PHYSICAL_ZOOM'
}

/**
 * Enumeration of the two-way communication support for the camera
 * https://developer.amazon.com/docs/alexa/alexa-voice-service/alexa-liveviewcontroller.html#concurrent-talk
 */
export enum ConcurrentTwoWayTalkState {
    /// Indicates the camera supports two-way audio communication with the viewing device.
    ENABLED = 'ENABLED',
    /// Indicates the camera doesn't support two-way audio communication with the viewing device.
    DISABLED = 'DISABLED'
}

/**
 * Enumeration for the audio communication supported by the camera.
 * https://developer.amazon.com/docs/alexa/alexa-voice-service/alexa-liveviewcontroller.html#talk-mode
 */
export enum CameraTalkMode {
    /// The camera doesn't support audio communication.
    NO_SUPPORT = 'NO_SUPPORT',
    /// The camera supports two-way communication in the style of a walkie-talkie.
    PRESS_AND_HOLD = 'PRESS_AND_HOLD',
    /// The camera supports two-way audio communication via tap ingress.
    TAP = 'TAP'
}

/**
 * Enumeration for the audio states of microphone and speaker of the camera.
 * https://developer.amazon.com/docs/alexa/alexa-voice-service/alexa-liveviewcontroller.html#audio-state 
 */
export enum LiveViewAudioState {
    /// For microphone state, this value opens the microphone on the viewing device. 
    /// For speaker state, this value enables audio from the camera to the viewing device.
    UNMUTED = 'UNMUTED',
    /// For microphone state, this value mutes the microphone on the viewing device. 
    /// For speaker state, this value disables audio from the camera to the viewing device.
    MUTED = 'MUTED',
    /// This value indicates that the camera doesn't support audio communication. In this state, the viewing device doesn't display the microphone and speaker.
    DISABLED = 'DISABLED'
}

/**
 * Enumeration of the supported modes to render the camera stream
 * https://developer.amazon.com/docs/alexa/alexa-voice-service/alexa-liveviewcontroller.html#display-mode
 */
export enum CameraDisplayMode {
    /// The camera live feed stream displays on the entire screen.
    FULL_SCREEN = 'FULL_SCREEN',
    /// The camera live feed stream displays on top of other streams.
    OVERLAY = 'OVERLAY'
}

/**
 * Enumeration for the requested position on the screen to display the overlay.
 * https://developer.amazon.com/docs/alexa/alexa-voice-service/alexa-liveviewcontroller.html#overlay-position
 */
export enum LiveViewOverlayPosition {
    /// display the overlay on the top right of the screen.
    TOP_RIGHT = 'TOP_RIGHT',
    /// display the overlay on the top left of the screen.
    TOP_LEFT = 'TOP_LEFT',
    /// display the overlay on the bottom right of the screen.
    BOTTOM_RIGHT = 'BOTTOM_RIGHT',
    /// display the overlay on the bottom left of the screen.
    BOTTOM_LEFT = 'BOTTOM_LEFT'
}

/**
 * Enumeration for the type of overlay supported by the viewing device.
 * https://developer.amazon.com/docs/alexa/alexa-voice-service/alexa-liveviewcontroller.html#overlay-type
 */
export enum LiveViewOverlayType {
    /// The viewing device supports picture-in-picture display mode.
    PICTURE_IN_PICTURE = 'PICTURE_IN_PICTURE',
    /// The viewing device doesn't support overlay mode.
    NONE = 'NONE'
}

/**
 * Enumeration of the reasons that the live view session started.
 * https://developer.amazon.com/docs/alexa/alexa-voice-service/alexa-liveviewcontroller.html#live-view-trigger
 */
 export enum LiveViewTrigger {
    /// The user started the live view streaming session.
    USER_ACTION = 'USER_ACTION',
    /// An automated event, such as a doorbell press, triggered the streaming session.
    AUTOMATED_EVENT = 'AUTOMATED_EVENT'
}

/**
 * Interface for the Viewing Device Target
 * https://developer.amazon.com/docs/alexa/alexa-voice-service/alexa-liveviewcontroller.html#target-object
 * 
 * @member {string} endpointId Identifier of the device
 * @member {LiveViewEndpointType} type (Optional) Type of endpoint.
 */
export interface ILiveViewViewingDeviceTarget {
    endpointId : string;
    type ?: LiveViewEndpointType;
}

/**
 * Interface for the  Alexa device used to view the streaming session.
 * https://developer.amazon.com/docs/alexa/alexa-voice-service/alexa-liveviewcontroller.html#viewer-object
 * 
 * @member {string} name Friendly name of the viewing device.
 * @member {boolean} hasCameraControl Indicates whether the viewing device has control over the camera.
 * @member {ViewingDeviceState} state Connection state of the viewing device.
 */
export interface ILiveViewViewer {
    name : string;
    hasCameraControl : boolean;
    state : ViewingDeviceState;
}

/**
 * Interface for the details of the camera.
 * https://developer.amazon.com/docs/alexa/alexa-voice-service/alexa-liveviewcontroller.html#camera-object
 * 
 * @member {string} name Friendly name of the camera.
 * @member {string} make Name of the manufacturer of the camera.
 * @member {string} model (Optional) Model name of the camera.
 * @member {CameraMotionCapability[]} capabilities (Optional) Motion capabilities of the camera.
 */
export interface ILiveViewCamera {
    name : string;
    make : string;
    model ?: string;
    capabilities ?: CameraMotionCapability[];
}

/**
 * Interface for the camera source and a list of viewing devices in the current streaming session.
 * https://developer.amazon.com/docs/alexa/alexa-voice-service/alexa-liveviewcontroller.html#participants-object
 * 
 * @member {ILiveViewViewer[]} viewers List of the viewing devices.
 * @member {ILiveViewCamera} camera Camera source of the live feed.
 */
export interface ILiveViewParticipants {
    viewers : ILiveViewViewer[];
    camera : ILiveViewCamera;
}

/**
 * Interface for the requested display experience of the camera on the viewing device.
 * https://developer.amazon.com/docs/alexa/alexa-voice-service/alexa-liveviewcontroller.html#display-properties
 * 
 * @member {CameraDisplayMode} displayMode Display mode in which to render the live stream.
 * @member {LiveViewOverlayType} overlayType (Optional) If displayMode=OVERLAY, the type of overlay to use to render the live stream.
 * @member {LiveViewOverlayPosition} overlayPosition (Optional) If displayMode=OVERLAY, overlayPosition indicates the position on the screen to display the overlay.
 */
export interface ILiveViewSuggestedDisplay {
    displayMode : CameraDisplayMode;
    overlayType ?: LiveViewOverlayType;
    overlayPosition ?: LiveViewOverlayPosition;
}

/**
 * Interface for the audio details of the streaming session.
 * https://developer.amazon.com/docs/alexa/alexa-voice-service/alexa-liveviewcontroller.html#audio-properties
 * 
 * @member {CameraTalkMode} talkMode Audio communication capability of the camera.
 * @member {ConcurrentTwoWayTalkState} concurrentTwoWayTalk Defines whether the camera supports concurrent two-way communication.
 * @member {LiveViewAudioState} microphoneState State of the microphone at the start of the streaming session.
 * @member {LiveViewAudioState} speakerState State of the speaker at the start of the streaming session.
 */
export interface ILiveViewAudioProperties {
    talkMode : CameraTalkMode;
    concurrentTwoWayTalk : ConcurrentTwoWayTalkState;
    microphoneState : LiveViewAudioState;
    speakerState : LiveViewAudioState;
}

/**
 * Interface for the display and audio properties of the streaming session.
 * https://developer.amazon.com/docs/alexa/alexa-voice-service/alexa-liveviewcontroller.html#viewer-experience
 * 
 * @member {ILiveViewSuggestedDisplay} suggestedDisplay Display properties of the live view streaming session.
 * @member {ILiveViewAudioProperties} audioProperties Audio communication properties of the live view streaming session.
 * @member {LiveViewTrigger} liveViewTrigger Reason the live view streaming session started.
 * @member {number} idleTimeoutInMilliseconds Timeout value in milliseconds. Any user interaction with the viewing device cancels the timer. 
 */
export interface ILiveViewViewerExperience {
    suggestedDisplay : ILiveViewSuggestedDisplay;
    audioProperties : ILiveViewAudioProperties;
    liveViewTrigger : LiveViewTrigger;
    idleTimeoutInMilliseconds : number;
}

/**
 * Interface for a StartLiveView directive payload to instruct the client to start streaming.
 * https://developer.amazon.com/docs/alexa/alexa-voice-service/alexa-liveviewcontroller.html#startliveview-directive-payload-details
 * 
 * @member {string} sessionId Live streaming session identifier.
 * @member {ILiveViewViewingDeviceTarget} target Identifies the viewing device.
 * @member {LiveViewRole} role Specifies the role of the device for the streaming session.
 * @member {ILiveViewParticipants} participants Camera source and a list of viewing devices in the requested streaming session.
 * @member {ILiveViewViewerExperience} viewerExperience Defines the display and audio properties of the streaming session.
 */
export interface IStartLiveViewPayload {
    sessionId : string;
    target : ILiveViewViewingDeviceTarget;
    role : LiveViewRole;
    participants : ILiveViewParticipants;
    viewerExperience : ILiveViewViewerExperience;
}