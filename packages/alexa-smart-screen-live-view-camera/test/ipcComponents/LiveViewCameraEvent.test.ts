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

import * as sinon from 'sinon';
import { createMock } from 'ts-auto-mock';
import { IPC_CONFIG_LIVE_VIEW_CAMERA } from '../../src/ipcComponents/IPCNamespaceConfigLiveViewCamera';
import { IClient, IEventHeader } from '@alexa-smart-screen/common';
import { LiveViewCameraEvent } from "../../src/ipcComponents/LiveViewCameraEvent";
import { CAMERA_FIRST_FRAME_RENDERED_MESSAGE_NAME, CAMERA_MICROPHONE_STATE_CHANGED_MESSAGE_NAME, ICameraMicrophoneStateChangedPayload, IWindowIdReport, LIVE_VIEW_WINDOW_ID_REPORT_MESSAGE_NAME } from '../../src/ipcComponents/LiveViewCameraMessageInterfaces';


describe("@alexa-smart-screen/live-view-camera - LiveViewCameraEvent", () => {
  let liveViewCameraEvent : LiveViewCameraEvent;
  let client : IClient;
  let header : IEventHeader;
  const sandbox : sinon.SinonSandbox = sinon.createSandbox();

  beforeEach(() => {
    client = createMock<IClient>({ 
        sendMessage : sandbox.spy()
    });
    liveViewCameraEvent = new LiveViewCameraEvent(client);
    header = {
      version : IPC_CONFIG_LIVE_VIEW_CAMERA.version,
      namespace : IPC_CONFIG_LIVE_VIEW_CAMERA.namespace,
      name : ''
    }
  });

  afterEach(() => {
      sandbox.reset();
      sandbox.restore();
  });

  it('should send the correct message for cameraMicrophoneStateChanged event.', () => {
    header.name = CAMERA_MICROPHONE_STATE_CHANGED_MESSAGE_NAME;
    const enabled  = true;
    const payload : ICameraMicrophoneStateChangedPayload = {
        enabled
    };
    const message = {
      header,
      payload
    }

    liveViewCameraEvent.cameraMicrophoneStateChanged(enabled);
    sinon.assert.calledWith(
        client.sendMessage as sinon.SinonSpy,
        message
    );
  });

  it('should send the correct message for cameraFirstFrameRendered event.', () => {
    header.name = CAMERA_FIRST_FRAME_RENDERED_MESSAGE_NAME;
    const payload = {};
    const message = {
      header,
      payload
    }

    liveViewCameraEvent.cameraFirstFrameRendered();
    sinon.assert.calledWith(
        client.sendMessage as sinon.SinonSpy,
        message
    );
  });

  it('should send the correct message for windowIdReport event.', () => {
    header.name = LIVE_VIEW_WINDOW_ID_REPORT_MESSAGE_NAME;
    const windowId  = 'windowId';
    const payload : IWindowIdReport = {
        windowId
    };
    const message = {
      header,
      payload
    };

    liveViewCameraEvent.windowIdReport(windowId);
    sinon.assert.calledWith(
        client.sendMessage as sinon.SinonSpy,
        message
    );
  });
});
