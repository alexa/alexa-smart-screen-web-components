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

import * as chai from "chai";
import { createMock } from 'ts-auto-mock';

import {
  IClient,
  IFocusManager,
  ILoggerFactory,
  IGUIActivityTracker,
  ViewportShape,
  UIMode,
  WindowPositionType,
  WindowState,
  AVSVisualInterfaces,
  DisplayOrientation,
  IWindowDimensions,
} from "@alexa-smart-screen/common";
import { APLEvent } from "../../src/ipcComponents/APLEvent";
import { APLWindowElement } from "../../src/window/APLWindowElement";
import { APLWindowElementBuilder } from "../../src/window/APLWindowElementBuilder";

describe("@alexa-smart-screen/apl - APL Window Builder functionality", () => {
  let loggerFactory : ILoggerFactory;
  let client : IClient;
  let focusManager : IFocusManager;
  let guiActivityTracker : IGUIActivityTracker;
  let aplEvent : APLEvent;
  let aplWindow : APLWindowElement;

  const WINDOW1_ID = "windowId1";
  const WINDOW1_ID_WIDTH = 1920;
  const WINDOW1_ID_HEIGHT = 1080;
  const WINDOW1_DIMENSIONS : IWindowDimensions = {
    width : WINDOW1_ID_WIDTH,
    height : WINDOW1_ID_HEIGHT
  };
  const WINDOW1_INTERFACES : AVSVisualInterfaces[] = [AVSVisualInterfaces.ALEXA_PRESENTATION_APL];
  const WINDOW1_POSITION : WindowPositionType = WindowPositionType.CENTER;
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
        supportedInterfaces : WINDOW1_INTERFACES,
        zOrderIndex : WINDOW1_ID_ZORDER,
        displayWindowConfig : {
          templateId : TEMPLATE1,
          configurations : {
            landscape : {
              sizeConfigurationId : SIZE_CONFIGURATION1,
              interactionMode : INTERACTION_MODE1
            }
          }
        },
        windowPosition : WINDOW1_POSITION
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
  });

  afterEach(() => {
    focusManager.reset();
  });

  // it should be able to initialize the correct attributes to the window
  it(`should be able to build the window and set the correct characteristics`, () => {
    chai.assert.strictEqual(aplWindow.getWindowId(), WINDOW1_ID);
    chai.assert.strictEqual(aplWindow.getZOrder(), WINDOW1_ID_ZORDER);
    chai.assert.strictEqual(aplWindow.getWindowPosition(), WINDOW1_POSITION);
    chai.assert.strictEqual(aplWindow.getState(), WindowState.HIDDEN);
    chai.assert.strictEqual(aplWindow.getDimensions().width, WINDOW1_DIMENSIONS.width);
    chai.assert.strictEqual(aplWindow.getDimensions().height, WINDOW1_DIMENSIONS.height);
    chai.assert.strictEqual(aplWindow.getWindowInstance().templateId, TEMPLATE1);
    chai.assert.strictEqual(aplWindow.getWindowInstance().sizeConfigurationId, SIZE_CONFIGURATION1);
    chai.assert.strictEqual(aplWindow.getWindowInstance().interactionMode, INTERACTION_MODE1);
    chai.assert.strictEqual(aplWindow.getWindowInstance().supportedInterfaces, WINDOW1_INTERFACES);
  });
});
