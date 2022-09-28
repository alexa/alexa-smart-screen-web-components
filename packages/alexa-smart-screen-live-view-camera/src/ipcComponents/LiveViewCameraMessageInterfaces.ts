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

import { LiveViewCameraState } from "constants/LiveViewCameraState";
import { IStartLiveViewPayload } from "./IStartLiveViewPayload";

export const CAMERA_MICROPHONE_STATE_CHANGED_MESSAGE_NAME  = 'cameraMicrophoneStateChanged';
export const CAMERA_FIRST_FRAME_RENDERED_MESSAGE_NAME  = 'cameraFirstFrameRendered';
export const LIVE_VIEW_WINDOW_ID_REPORT_MESSAGE_NAME  = 'windowIdReport';

/**
 * Interface for cameraStateChanged message payload
 * @member state the LiveViewCameraState of the camera
 */
export interface ISetCameraStateMessagePayload {
  state : LiveViewCameraState;
}

/**
 * Interface for clearCamera message payload
 */
 export interface IClearCameraMessagePayload {}

/**
 * Interface for renderCamera message payload
 * @member startLiveViewPayload the IStartLiveViewPayloaddirective payload
 */
export interface IRenderCameraMessagePayload {
  startLiveViewPayload : IStartLiveViewPayload;
}

/**
 * Interface for outbound windowIdReport message payload
 * @member windowId reported id for the live view window
 */
export interface IWindowIdReport {
  windowId : string;
}

/**
 * Interface for outbound cameraMicrophoneStateChanged message payload
 * @member enabled the state of the camera michrophone
 */
export interface ICameraMicrophoneStateChangedPayload {
  enabled : boolean;
}
