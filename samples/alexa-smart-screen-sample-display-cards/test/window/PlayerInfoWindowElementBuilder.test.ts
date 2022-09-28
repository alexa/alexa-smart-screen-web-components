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

import { APLEvent } from "@alexa-smart-screen/apl";
import { PlayerInfoWindowElement, MEDIA_PLAYER_WINDOW_ID } from "../../src/window/PlayerInfoWindowElement";
import { PlayerInfoWindowElementBuilder } from "../../src/window/PlayerInfoWindowElementBuilder";
import {
    IGUIActivityTracker,
    IFocusManager,
    ILoggerFactory,
    ViewportShape,
    UIMode,
    WindowState,
    AVSVisualInterfaces,
    DisplayOrientation,
    IClient,
    IWindowDimensions
} from "@alexa-smart-screen/common";

describe("@alexa-smart-screen/sample-display-cards - Player Info Window Builder functionality", () => {
    const AGENT_NAME = "AlexaSmartScreenWebComponents";
    const AGENT_VERSION1 = "version1";
    const INTERACTION_MODE1 = "interactionMode1";
    const TEMPLATE1 = "template1";
    const SIZE_CONFIGURATION1 = "sizeConfiguration1";
    const RENDER_PLAYER_INFO_WINDOW_WIDTH = 1920;
    const RENDER_PLAYER_INFO_WINDOW_HEIGHT = 1080;
    const RENDER_PLAYER_INFO_WINDOW_DIMENSIONS : IWindowDimensions = {
        width : RENDER_PLAYER_INFO_WINDOW_WIDTH,
        height : RENDER_PLAYER_INFO_WINDOW_HEIGHT
    };
    const RENDER_PLAYER_INFO_WINDOW_ZORDER = 0;
    const DPI = 160;
    let playerInfoWindow : PlayerInfoWindowElement;
    let guiActivityTracker : IGUIActivityTracker;
    let focusManager : IFocusManager;
    let loggerFactory : ILoggerFactory;
    let client : IClient;
    let aplEvent : APLEvent;

    beforeEach(() => {
        loggerFactory = createMock<ILoggerFactory>();
        guiActivityTracker = createMock<IGUIActivityTracker>();
        focusManager = createMock<IFocusManager>();
        client = createMock<IClient>();
        aplEvent = new APLEvent(client);

        playerInfoWindow = PlayerInfoWindowElementBuilder.createWindow(
            {
                id : "",
                supportedInterfaces : [],
                zOrderIndex : RENDER_PLAYER_INFO_WINDOW_ZORDER,
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
                windowId : "",
                rendererProps : {
                    agentName : AGENT_NAME,
                    agentVersion : AGENT_VERSION1,
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
        playerInfoWindow.setDimensions(RENDER_PLAYER_INFO_WINDOW_DIMENSIONS);    
    });

    it(`should be able to build a player info window and set the correct characteristics`, () => {
        chai.assert.strictEqual(playerInfoWindow.getWindowId(), MEDIA_PLAYER_WINDOW_ID);
        chai.assert.strictEqual(playerInfoWindow.getZOrder(), RENDER_PLAYER_INFO_WINDOW_ZORDER);
        chai.assert.strictEqual(playerInfoWindow.getState(), WindowState.HIDDEN);
        chai.assert.strictEqual(playerInfoWindow.getDimensions().width, RENDER_PLAYER_INFO_WINDOW_DIMENSIONS.width);
        chai.assert.strictEqual(playerInfoWindow.getDimensions().height, RENDER_PLAYER_INFO_WINDOW_DIMENSIONS.height);
        chai.assert.strictEqual(playerInfoWindow.getWindowInstance().templateId, TEMPLATE1);
        chai.assert.strictEqual(playerInfoWindow.getWindowInstance().sizeConfigurationId, SIZE_CONFIGURATION1);
        chai.assert.strictEqual(playerInfoWindow.getWindowInstance().interactionMode, INTERACTION_MODE1);
        chai.assert.strictEqual(playerInfoWindow.getWindowInstance().supportedInterfaces[0], AVSVisualInterfaces.TEMPLATE_RUNTIME);
    });
});
