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
import * as sinon from "sinon";
import { createMock } from 'ts-auto-mock';

import {
  IClient,
  ILoggerFactory,
  ViewportShape,
  UIMode,
  WindowPositionType,
  WindowState,
  IGUIActivityTracker,
  IFocusManager,
  IWindowManager,
  AVSVisualInterfaces,
  DisplayOrientation,
  IWindowDimensions,
} from "@alexa-smart-screen/common";
import {
  DEFAULT_WINDOW_TRANSLATE,
  OVERLAY_WINDOW_ACTIVE_IN_MS,
  WINDOW_TRANSITION_IN_MS,
} from "@alexa-smart-screen/window-manager";
import { APLWSRenderer } from "apl-client";
import { APLEvent } from "../../src/ipcComponents/APLEvent";
import { APLWindowElement } from "../../src/window/APLWindowElement";
import { APLWindowElementBuilder } from "../../src/window/APLWindowElementBuilder";
import { IAPLRendererProps } from "../../src/renderer/APLRendererWrapperConfig";
import { APLAudioPlayer } from "../../src/media/APLAudioPlayer";
import { APLRendererWrapper } from "../../src/renderer/APLRendererWrapper";

describe("@alexa-smart-screen/apl - rendering functionality", () => {
  let loggerFactory : ILoggerFactory;
  let client : IClient;
  let windowManager : IWindowManager;
  let focusManager : IFocusManager;
  let guiActivityTracker : IGUIActivityTracker;
  let aplEvent : APLEvent;
  let aplRendererProps : IAPLRendererProps;
  let aplWindow : APLWindowElement, aplWindow2 : APLWindowElement;

  const sandbox : sinon.SinonSandbox = sinon.createSandbox();

  // spies
  let aplRendererWrapperFlushAudioPlayerSpy : sinon.SinonSpy;
  let aplRendererWrapperDestroySpy : sinon.SinonSpy;

  // stubs
  let aplWsRendererInitStub : sinon.SinonStub;
  let aplWsRendererDestroyStub : sinon.SinonStub;

  const WINDOW1_ID = "windowId1";
  const WINDOW2_ID = "windowId2";
  const WINDOW1_ID_WIDTH = 1920;
  const WINDOW1_ID_HEIGHT = 1080;
  const WINDOW1_DIMENSIONS : IWindowDimensions = {
    width : WINDOW1_ID_WIDTH,
    height : WINDOW1_ID_HEIGHT
  };
  const WINDOW2_ID_WIDTH = 1920;
  const WINDOW2_ID_HEIGHT = 400;
  const WINDOW2_DIMENSIONS : IWindowDimensions = {
    width : WINDOW2_ID_WIDTH,
    height : WINDOW2_ID_HEIGHT
  };
  const WINDOW1_ID_ZORDER = 0;
  const WINDOW2_ID_ZORDER = 1;
  const DPI = 160;
  const INTERACTION_MODE1 = "interactionMode1";
  const INTERACTION_MODE2 = "interactionMode2";
  const TEMPLATE1 = "template1";
  const TEMPLATE2 = "template2";
  const SIZE_CONFIGURATION1 = "sizeConfiguration1";
  const SIZE_CONFIGURATION2 = "sizeConfiguration2";
  const AGENT_NAME = "AlexaSmartScreenWebComponents";
  const AGENT_VERSION = "version1"

  beforeEach(() => {
    loggerFactory = createMock<ILoggerFactory>();
    client = createMock<IClient>();
    focusManager = createMock<IFocusManager>();
    guiActivityTracker = createMock<IGUIActivityTracker>();
    windowManager = createMock<IWindowManager>();
    aplEvent = new APLEvent(client);
    aplRendererProps = {
      agentName : AGENT_NAME,
      agentVersion : AGENT_VERSION,
      shape : ViewportShape.RECTANGLE,
      dpi : DPI,
      disallowVideo : false,
      mode : UIMode.HUB,
    };
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
        },
        windowPosition : WindowPositionType.CENTER
      },
      {
        windowId : WINDOW1_ID,
        rendererProps : aplRendererProps,
        guiActivityTracker : guiActivityTracker,
        focusManager : focusManager,
        loggerFactory : loggerFactory,
        aplEvent : aplEvent
      },
      DisplayOrientation.LANDSCAPE
    );
    aplWindow.setDimensions(WINDOW1_DIMENSIONS);  

    aplWindow2 = APLWindowElementBuilder.createWindow(
      {
        id : WINDOW2_ID,
        supportedInterfaces : [AVSVisualInterfaces.ALEXA_PRESENTATION_APL],
        zOrderIndex : WINDOW2_ID_ZORDER,
        displayWindowConfig : {
          templateId : TEMPLATE2,
          configurations : {
            landscape : {
              sizeConfigurationId : SIZE_CONFIGURATION2,
              interactionMode : INTERACTION_MODE2
            }
          }
        },
        windowPosition : WindowPositionType.BOTTOM
      },
      {
        windowId : WINDOW2_ID,
        rendererProps : aplRendererProps,
        guiActivityTracker : guiActivityTracker,
        focusManager : focusManager,
        loggerFactory : loggerFactory,
        aplEvent : aplEvent
      },
      DisplayOrientation.LANDSCAPE
    );
    aplWindow.setDimensions(WINDOW2_DIMENSIONS); 

    windowManager.setWindows([aplWindow, aplWindow2]);

    aplRendererWrapperFlushAudioPlayerSpy = sandbox.spy(
      APLRendererWrapper.prototype,
      "flushAudioPlayer"
    );
    aplRendererWrapperDestroySpy = sandbox.spy(
      APLRendererWrapper.prototype,
      "destroy"
    );
    aplWsRendererInitStub = sandbox.stub(APLWSRenderer.prototype, "init");
    aplWsRendererDestroyStub = sandbox.stub(APLWSRenderer.prototype, "destroy");
  });

  afterEach(() => {
    focusManager.reset();
    sandbox.reset();
    sandbox.restore();
  });

  it(`it should render the new apl document and destroy the old one if we get two consecutive window renders for the same window id`, async () => {
    // window should be hidden before we receive aplRender directive
    chai.assert.strictEqual(aplWindow.getState(), WindowState.HIDDEN);

    // apl window gets rendered with first apl document
    await aplWindow.render();
    chai.assert.strictEqual(
      aplWindow.getState(),
      WindowState.FOREGROUND
    );
    
    // another apl needs to render when window is still rendering first apl document
    await aplWindow.render();
    // window should destroy the previous apl renderer before initializing a new apl renderer
    sinon.assert.called(aplWsRendererDestroyStub);
    sinon.assert.called(aplWsRendererInitStub);
    chai.assert.strictEqual(
      aplWindow.getState(),
      WindowState.FOREGROUND
    );
  });

  it(`it should render the apl window to the foreground`, async () => {
    await aplWindow.render();
    sinon.assert.called(aplWsRendererInitStub);
    chai.assert.strictEqual(aplWindow.getState(), WindowState.FOREGROUND);
  });

  it(`it should render the apl window to the background`, async () => {
    await aplWindow.render(WindowState.BACKGROUND);
    sinon.assert.called(aplWsRendererInitStub);
    chai.assert.strictEqual(aplWindow.getState(), WindowState.BACKGROUND);
  });

  it(`it should initialize the correct css styles for an active and inactive for a window`, async () => {
    const defaultWindowTranslateRegex = DEFAULT_WINDOW_TRANSLATE.replace(
      "(",
      "\\("
    ).replace(")", "\\)");

    const inactiveWindowTranslateRegex =
      `translate(0px, ${aplWindow2.getDimensions().height}px)`
        .replace("(", "\\(")
        .replace(")", "\\)");

    await aplWindow2.render();

    chai.assert.match(
      aplWindow2["transformTransitionElement"].style.getPropertyValue("transition"),
      new RegExp(`transform ${OVERLAY_WINDOW_ACTIVE_IN_MS}ms ease-out 0s`)
    );
    chai.assert.match(
      aplWindow2["transformTransitionElement"].style.getPropertyValue("transform"),
      new RegExp(defaultWindowTranslateRegex)
    );

    await aplWindow2.hide();

    chai.assert.match(
      aplWindow2["transformTransitionElement"].style.getPropertyValue("transition"),
      new RegExp(
        `transform ${OVERLAY_WINDOW_ACTIVE_IN_MS}ms ease-out ${WINDOW_TRANSITION_IN_MS}ms`
      )
    );
    chai.assert.match(
      aplWindow2["transformTransitionElement"].style.getPropertyValue("transform"),
      new RegExp(inactiveWindowTranslateRegex)
    );
  });

  it(`should flush the audio for a destroyed rendererer`, async () => {
    await aplWindow.render();
    await aplWindow.hide();
    sandbox.assert.calledOnce(aplRendererWrapperFlushAudioPlayerSpy);
  });

  it(`should display the second apl renderer if a second apl renderer gets rendered before the first renderer gets hidden`, async () => {
    // render the first apl renderer
    await aplWindow.render();
    // hide the first apl renderer
    aplWindow.hide();
    // ensure the window has been set to hidden per the init of hide
    chai.assert(aplWindow.getState(), WindowState.HIDDEN);
    // while the first apl renderer is transitioning to inactive, the second apl renderer takes over
    await aplWindow.render();
    // ensure the window is still foregrounded and able to display the second renderer
    chai.assert(aplWindow.getState(), WindowState.FOREGROUND);

    sandbox.assert.notCalled(aplRendererWrapperDestroySpy);
  });

  it(`it should only be able to flush audio player for a renderer that exists`, () => {
    const aplAudioPlayerFlushSpy = sandbox.spy(
      APLAudioPlayer.prototype,
      "flush"
    );

    aplWindow.flushAudioPlayer();
    sinon.assert.notCalled(aplAudioPlayerFlushSpy);
  });
});
