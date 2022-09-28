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

import { AudioInputInitiator, GUIActivityState } from "@alexa-smart-screen/common";
import { RecognizeSpeechCaptureState } from "../constants/RecognizeSpeechCaptureState";
import { NavigationEvent } from "../constants/NavigationEvent";

export const INTERACTION_MANAGER_GUI_ACTIVITY_EVENT_NAME = 'guiActivityEvent';
export const INTERACTION_MANAGER_NAVIGATION_EVENT_NAME = 'navigationEvent';
export const INTERACTION_MANAGER_RECOGNIZE_SPEECH_REQUEST_EVENT_NAME = 'recognizeSpeechRequest';

/**
 * Interface for guiActivityEvent event payload
 * @member {GUIActivityState} event the gui activity state to report in the event
 */
export interface IGUIActivityEventPayload {
    event : GUIActivityState
}

/**
 * Interface for navigationEvent event payload
 * @member {NavigationEvent} event the navigation type to report in the event
 */
export interface INavigationEventPayload {
    event : NavigationEvent
}

/**
 * Interface for recognizeSpeechRequestEvent
 * @member {AudioInputInitiator} initiatorType the type of audio input initiator for the speech request
 * @member {RecognizeSpeechCaptureState} captureState the capture state of the speech request
 */
export interface IRecognizeSpeechRequestEventPayload {
    initiatorType : AudioInputInitiator;
    captureState : RecognizeSpeechCaptureState
}