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

import * as sinon from "sinon";
import { createMock } from 'ts-auto-mock';

import {
  IClient,
  IFocusManager,
  ILoggerFactory,
  IGUIActivityTracker,
  IWindowManager,
  ViewportShape,
  UIMode,
  AVSVisualInterfaces,
  DisplayOrientation,
} from "@alexa-smart-screen/common";
import { APLEvent } from "../../src/ipcComponents/APLEvent";
import { APLHandler } from "../../src/ipcComponents/APLHandler";
import { APL_RENDER_COMPLETED_MESSAGE_NAME, IAPLCreateRendererPayload, IAPLViewhostMessagePayload } from "../../src/ipcComponents/APLMessageInterfaces";
import { APLWindowElement } from "../../src/window/APLWindowElement";
import { APLWindowElementBuilder } from "../../src/window/APLWindowElementBuilder";
import { APLWindowWebsocketClient } from "../../src/ipcComponents/APLWindowWebsocketClient";

describe("@alexa-smart-screen/apl - APL messages functionality", () => {
  let loggerFactory : ILoggerFactory;
  let client : IClient;
  let windowManager : IWindowManager;
  let focusManager : IFocusManager;
  let guiActivityTracker : IGUIActivityTracker;
  let aplEvent : APLEvent;
  let aplHandler : APLHandler;
  let aplWindow : APLWindowElement;

  const sandbox : sinon.SinonSandbox = sinon.createSandbox();

  // spies
  let renderCompletedSpy : sinon.SinonSpy;
  let onMessageSpy : sinon.SinonSpy;

  // stubs
  let windowManagerRenderWindowToViewStub : sinon.SinonStub;
  let windowManagerGetWindowStub : sinon.SinonStub;

  const WINDOW1_ID = "windowId1";
  const INVALID_WINDOW_ID = "invalidWindowId";
  const WINDOW1_ID_ZORDER = 0;
  const DPI = 160;
  const INTERACTION_MODE1 = "interactionMode1";
  const TEMPLATE1 = "template1";
  const SIZE_CONFIGURATION1 = "sizeConfiguration1";
  const TOKEN1 = "token1";
  const AGENT_NAME = "AlexaSmartScreenWebComponents";
  const AGENT_VERSION = "version1"

  beforeEach(() => {
    loggerFactory = createMock<ILoggerFactory>();
    client = createMock<IClient>();
    focusManager = createMock<IFocusManager>();
    guiActivityTracker = createMock<IGUIActivityTracker>();
    windowManager = createMock<IWindowManager>();
    aplEvent = new APLEvent(client);
    aplHandler = new APLHandler(windowManager, loggerFactory);
    aplWindow = APLWindowElementBuilder.createWindow(
      {
        id : WINDOW1_ID,
        supportedInterfaces : [AVSVisualInterfaces.ALEXA_PRESENTATION_APL],
        zOrderIndex : WINDOW1_ID_ZORDER,
        displayWindowConfig : {
          templateId : TEMPLATE1,
          configurations : {
            landscape : {
              sizeConfigurationId : SIZE_CONFIGURATION1,
              interactionMode : INTERACTION_MODE1
            }
          }
        }
      },
      {
        windowId : WINDOW1_ID,
        rendererProps : {
          agentName : AGENT_NAME,
          agentVersion : AGENT_VERSION,
          shape : ViewportShape.RECTANGLE,
          dpi : DPI,
          disallowVideo : false,
          mode : UIMode.HUB,
        },
        guiActivityTracker : guiActivityTracker,
        focusManager : focusManager,
        loggerFactory : loggerFactory,
        aplEvent : aplEvent
      },
      DisplayOrientation.LANDSCAPE
    );

    windowManager.renderWindowToView = sandbox.stub();
    windowManagerRenderWindowToViewStub = windowManager.renderWindowToView as sinon.SinonStub;
    windowManager.getWindow = sandbox.stub();
    windowManagerGetWindowStub = windowManager.getWindow as sinon.SinonStub;
    windowManager.hideWindowFromView = sandbox.stub();

    renderCompletedSpy = sandbox.spy(APLEvent.prototype, APL_RENDER_COMPLETED_MESSAGE_NAME);
    onMessageSpy = sandbox.spy(APLWindowWebsocketClient.prototype, "onMessage");
  });

  afterEach(() => {
    focusManager.reset();
    sandbox.reset();
    sandbox.restore();
  });

  it(`should be able to successfully handle createRenderer message and send the correct response`, async () => {
    const windowId = aplWindow.getWindowId();
    const createRendererPayload : IAPLCreateRendererPayload = {
      windowId : windowId,
      token : TOKEN1,
    };
    windowManagerGetWindowStub.withArgs(windowId).returns(aplWindow);

    await aplHandler.createRenderer(createRendererPayload);
    sandbox.assert.calledOnceWithExactly(
      windowManagerRenderWindowToViewStub,
      windowId
    );
    sandbox.assert.calledWith(renderCompletedSpy, {
      windowId : windowId
    });
  });

  it(`should be able to handle createRenderer message with invalid windowId and not send a renderCompleted message response`, async () => {
    const createRendererInvalidWindowIdPayload : IAPLCreateRendererPayload = {
      windowId : INVALID_WINDOW_ID,
      token : TOKEN1,
    };
    windowManagerGetWindowStub.withArgs(INVALID_WINDOW_ID).returns(undefined);

    await aplHandler.createRenderer(createRendererInvalidWindowIdPayload);
    sandbox.assert.notCalled(windowManagerRenderWindowToViewStub);
    sandbox.assert.notCalled(renderCompletedSpy);
  });

  it(`should be able to successfully handle sendMessageToViewhost message and pass the message to apl client`, async () => {
    const windowId = aplWindow.getWindowId();
    const createRendererPayload : IAPLCreateRendererPayload = {
      windowId : windowId,
      token : TOKEN1,
    };
    windowManagerGetWindowStub.withArgs(windowId).returns(aplWindow);

    const aplViewhostMessagePayload : IAPLViewhostMessagePayload = {
      windowId : windowId,
      payload : {
        seqno : 12,
        type : "type",
        payload : {},
      },
    };

    await aplHandler.createRenderer(createRendererPayload);
    aplHandler.sendMessageToViewhost(aplViewhostMessagePayload);

    sandbox.assert.calledWithMatch(onMessageSpy, {
      seqno : aplViewhostMessagePayload.payload.seqno,
      type : aplViewhostMessagePayload.payload.type,
      payload : {},
    });
  });

  it(`should be able to handle sendMessageToViewhost message with invalid windowId and not send message to apl client`, async () => {
    const windowId = aplWindow.getWindowId();
    const createRendererPayload : IAPLCreateRendererPayload = {
      windowId : windowId,
      token : TOKEN1,
    };

    const aplViewhostInvalidWindowIdPayload : IAPLViewhostMessagePayload = {
      windowId : INVALID_WINDOW_ID,
      payload : {
        seqno : 12,
        type : "type",
        payload : {},
      },
    };

    await aplHandler.createRenderer(createRendererPayload);
    aplHandler.sendMessageToViewhost(aplViewhostInvalidWindowIdPayload);

    sandbox.assert.notCalled(onMessageSpy);
  });
});
