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
    CameraDisplayMode,
    CameraTalkMode,
    ConcurrentTwoWayTalkState,
    IStartLiveViewPayload,
    LiveViewAudioState,
    LiveViewEndpointType,
    LiveViewRole,
    LiveViewTrigger,
    ViewingDeviceState
} from "../ipcComponents/IStartLiveViewPayload";

/**
 * Example Alexa.Camera.LiveViewController 1.7 StartLiveView Payload for debugging purposes
 * https://developer.amazon.com/docs/alexa/alexa-voice-service/alexa-liveviewcontroller.html#start-live-view-directive
 */
export const SampleStartLiveViewPayload : IStartLiveViewPayload = {
    sessionId : "session_id",
    target : {
        type : LiveViewEndpointType.ALEXA_ENDPOINT,
        endpointId : "endpoint_id of the viewing device"
    },
    role : LiveViewRole.VIEWER,
    participants : {
        viewers : [
            {
                name : "Alexa Smart Screen Web Sample App",
                hasCameraControl : true,
                state : ViewingDeviceState.CONNECTING
            }
        ],
        camera : {
            name : "Backyard",
            make : "Ring.com",
            capabilities : []
        }
    },
    viewerExperience : {
        suggestedDisplay : {
            displayMode : CameraDisplayMode.FULL_SCREEN
        },
        audioProperties : {
            talkMode : CameraTalkMode.PRESS_AND_HOLD,
            concurrentTwoWayTalk : ConcurrentTwoWayTalkState.ENABLED,
            microphoneState : LiveViewAudioState.MUTED,
            speakerState : LiveViewAudioState.UNMUTED
        },
        liveViewTrigger : LiveViewTrigger.USER_ACTION,
        idleTimeoutInMilliseconds : 15000
    }
};