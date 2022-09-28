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
  ILoggerFactory,
  IFocusManager,
  IGUIActivityTracker,
  ViewportShape,
  UIMode,
  AVSVisualInterfaces,
  DisplayOrientation,
  IWindowDimensions,
} from "@alexa-smart-screen/common";
import { APLEvent } from "../../src/ipcComponents/APLEvent";
import { APL_INITIALIZE_RENDERERS_REQUEST_MESSAGE_NAME, APL_METRICS_REPORT_MESSAGE_NAME, APL_RENDER_COMPLETED_MESSAGE_NAME, APL_VIEWHOST_EVENT_MESSAGE_NAME, IAPLInitRenderersRequestPayload, IAPLRenderCompletedPayload } from "../../src/ipcComponents/APLMessageInterfaces";
import { APLWindowElement } from "../../src/window/APLWindowElement";
import { APLWindowElementBuilder } from "../../src/window/APLWindowElementBuilder";

describe("@alexa-smart-screen/apl - APL WebSocket events functionality", () => {
  let loggerFactory : ILoggerFactory;
  let client : IClient;
  let focusManager : IFocusManager;
  let guiActivityTracker : IGUIActivityTracker;
  let aplEvent : APLEvent;
  let aplWindow : APLWindowElement;

  const sandbox : sinon.SinonSandbox = sinon.createSandbox();

  // stubs
  let eventHandlerSendResponseEventStub : sinon.SinonStub;

  const WINDOW1_ID = "windowId1";
  const WINDOW1_ID_WIDTH = 1920;
  const WINDOW1_ID_HEIGHT = 1080;
  const WINDOW1_DIMENSIONS : IWindowDimensions = {
    width : WINDOW1_ID_WIDTH,
    height : WINDOW1_ID_HEIGHT
  };
  const WINDOW1_ID_ZORDER = 0;
  const WINDOW1_DPI = 160;
  const INTERACTION_MODE1 = "interactionMode1";
  const TEMPLATE1 = "template1";
  const SIZE_CONFIGURATION1 = "sizeConfiguration1";
  const AGENT_NAME = "AlexaSmartScreenWebComponents";
  const AGENT_VERSION = "version1"
  
  beforeEach(() => {
    loggerFactory = createMock<ILoggerFactory>();
    client = createMock<IClient>();
    focusManager = createMock<IFocusManager>();
    guiActivityTracker = createMock<IGUIActivityTracker>();
    aplEvent = new APLEvent(client);
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
          dpi : WINDOW1_DPI,
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
    aplWindow.setDimensions(WINDOW1_DIMENSIONS);

    eventHandlerSendResponseEventStub = sandbox.stub(
      APLEvent.prototype,
      <any>"sendResponseEvent"
    );
  });

  afterEach(() => {
    focusManager.reset();
    sandbox.reset();
    sandbox.restore();
  });

  it("should send the correct payload for initializeRenderersRequest event", () => {
    const windowId = aplWindow.getWindowId();
    const supportedExtensions : string[] = [];

    const expectedInitializeRenderersRequestMessage : IAPLInitRenderersRequestPayload = {
      rendererInstances : [{
        windowId,
        supportedExtensions
      }]
    };
    aplWindow.getClient().initializeRenderer({
      windowId,
      supportedExtensions
    });

    sinon.assert.calledWith(
      eventHandlerSendResponseEventStub,
      APL_INITIALIZE_RENDERERS_REQUEST_MESSAGE_NAME,
      expectedInitializeRenderersRequestMessage
    );
  });

  it("should send the correct payload for renderCompleted event", () => {
    const windowId = aplWindow.getWindowId();

    const expectedRenderCompleteMessage : IAPLRenderCompletedPayload = {
      windowId : windowId
    };
    aplWindow.getClient().renderComplete();

    sinon.assert.calledWith(
      eventHandlerSendResponseEventStub,
      APL_RENDER_COMPLETED_MESSAGE_NAME,
      expectedRenderCompleteMessage
    );
  });

  it("should send the correct payload for metricsReport event", () => {
    const aplClientDisplayMetricsPayload : any = {
      type : "displayMetrics",
      payload : {},
    };
    aplWindow.getClient().sendMessage(aplClientDisplayMetricsPayload);

    sinon.assert.calledWith(
      eventHandlerSendResponseEventStub,
      APL_METRICS_REPORT_MESSAGE_NAME,
      {
        windowId : aplWindow.getWindowId(),
        type : "displayMetrics",
        payload : {},
      }
    );
  });

  it("should send the correct payload for default apl viewhost events", () => {
    const aplClientMessagePayload : any = {
      type : "otherEvent",
      payload : {},
    };
    aplWindow.getClient().sendMessage(aplClientMessagePayload);

    sinon.assert.calledWith(eventHandlerSendResponseEventStub, APL_VIEWHOST_EVENT_MESSAGE_NAME, {
      windowId : aplWindow.getWindowId(),
      payload : {
        type : "otherEvent",
        payload : {},
      },
    });
  });
});
