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

import { IClient, EventHandler } from '@alexa-smart-screen/common';
import { ILiveViewCameraEvent } from './ILiveViewCameraEvent';
import { IWindowIdReport, ICameraMicrophoneStateChangedPayload, LIVE_VIEW_WINDOW_ID_REPORT_MESSAGE_NAME, CAMERA_MICROPHONE_STATE_CHANGED_MESSAGE_NAME, CAMERA_FIRST_FRAME_RENDERED_MESSAGE_NAME } from './LiveViewCameraMessageInterfaces';
import { IPC_CONFIG_LIVE_VIEW_CAMERA } from './IPCNamespaceConfigLiveViewCamera';

export class LiveViewCameraEvent extends EventHandler implements ILiveViewCameraEvent {
  constructor(client : IClient) {
    super(client, IPC_CONFIG_LIVE_VIEW_CAMERA);
  }

  /**
   * Method to send a message to the client to set the live view camera microphone state.
   * @param enabled boolean state of microphone
   */
  public cameraMicrophoneStateChanged(enabled : boolean) : void {
    const payload : ICameraMicrophoneStateChangedPayload = {
      enabled
    };
    this.sendResponseEvent(CAMERA_MICROPHONE_STATE_CHANGED_MESSAGE_NAME, payload);
  }

  /**
   * Method to send a message to the client indicating that the first frame of the live view camera has rendered.
   */
  public cameraFirstFrameRendered() : void {
    this.sendResponseEvent(CAMERA_FIRST_FRAME_RENDERED_MESSAGE_NAME, {});
  }

  /**
   * Method to send a message to the client to report the windowId for the live view camera.
   * @param windowId the window id for the live view camera window
   */
  public windowIdReport(windowId : string) : void {
    const payload : IWindowIdReport = {
      windowId
    };
    this.sendResponseEvent(LIVE_VIEW_WINDOW_ID_REPORT_MESSAGE_NAME, payload);
  }
}
