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

import { WindowManager } from "@alexa-smart-screen/window-manager";
import { APLEvent, AplExtensionURI, APLWindowElement, APLWindowElementBuilder, APL_CLEAR_DOCUMENT_REQUEST_MESSAGE_NAME, APL_INITIALIZE_RENDERERS_REQUEST_MESSAGE_NAME, APL_RENDER_DOCUMENT_REQUEST_MESSAGE_NAME, IAPLInitRenderersRequestPayload, IAPLRenderDocumentRequestPayload, IAPLWindowConfig, IAPLWindowElementProps } from "@alexa-smart-screen/apl";
import { IRouter } from "@alexa-smart-screen/router";
import { MEDIA_PLAYER_WINDOW_ID } from "../../src/window/PlayerInfoWindowElement";
import { AVSDisplayCardSupportedViewports } from "../../src/displayCards/AVSDisplayCardSupportedViewports";
import { AVSDisplayCardsManager } from "../../src/displayCards/AVSDisplayCardsManager";
import { AVSDisplayCards } from "../../src/displayCards/AVSDisplayCards";
import { RENDER_PLAYER_INFO_KEY } from "../../src/displayCards/TemplateRuntimeToAPLResolver";
import {
    IGUIActivityTracker,
    IClient,
    IFocusManager,
    ILoggerFactory,
    ViewportShape,
    UIMode,
    AVSVisualInterfaces,
    DisplayOrientation,
    WindowPositionType
} from "@alexa-smart-screen/common";
import {
    AudioPlayerState,
    IRenderTemplateMessagePayload,
    IRenderTemplateMessageTitle,
    IRenderTemplateMessageImage,
    IRenderPlayerInfoMessagePayload,
    IRenderPlayerInfoControl
} from "@alexa-smart-screen/template-runtime";

describe("@alexa-smart-screen/sample-display-cards - AVSDisplayCardsManager", () => {
    const DEFAULT_WINDOW_ID = "tvFullscreen";
    const TOKEN1 = "token1";
    const TYPE1 = "type1";
    const TEXT_FIELD1 = "textField1"
    const RENDER_TEMPLATE_MESSAGE_TITLE1 : IRenderTemplateMessageTitle = {
        mainTitle : "main_title",
        subTitle : "sub_title"
    }
    const RENDER_TEMPLATE_MESSAGE_MESSAGE1 : IRenderTemplateMessageImage = {
        sources : [{ size : "size", url : "url" }]
    }
    const AGENT_NAME = "AlexaSmartScreenWebComponents";
    const AGENT_VERSION1 = "version1";
    const INTERACTION_MODE1 = "interactionMode1";
    const TEMPLATE1 = "template1";
    const SIZE_CONFIGURATION1 = "sizeConfiguration1";
    const WINDOW1_ID_ZORDER = 0;
    const RENDER_PLAYER_INFO_WINDOW_ZORDER = 0;
    const DPI = 160;
    const AUDIO_ITEM_ID1 = "audioItemId1";
    const AUDIO_ITEM_ID2 = "audioItemId2";
    const RENDER_TEMPLATE_MESSAGE_PAYLOAD : IRenderTemplateMessagePayload = {
        token : TOKEN1,
        type : TYPE1,
        title : RENDER_TEMPLATE_MESSAGE_TITLE1,
        image : RENDER_TEMPLATE_MESSAGE_MESSAGE1,
        textField : TEXT_FIELD1
    };
    const RENDER_PLAYER_INFO_CONTROL1 : IRenderPlayerInfoControl = {
        enabled : true,
        name : "controlName1",
        selected : true,
        type : "TOGGLE"
    };
    const RENDER_PLAYER_INFO_CONTROL2 : IRenderPlayerInfoControl = {
        enabled : true,
        name : "controlName2",
        selected : true,
        type : "TOGGLE"
    };
    const RENDER_PLAYER_INFO_CONTROL3 : IRenderPlayerInfoControl = {
        enabled : true,
        name : "controlName1",
        selected : false,
        type : "TOGGLE"
    };
    const RENDER_PLAYER_INFO_CONTROL4 : IRenderPlayerInfoControl = {
        enabled : true,
        name : "controlName2",
        selected : true,
        type : "TOGGLE"
    };
    const RENDER_PLAYER_INFO_MESSAGE_PAYLOAD : IRenderPlayerInfoMessagePayload = {
        payload : {
            audioItemId : AUDIO_ITEM_ID1,
            content : {
                art : { sources : [{ size : "artSize" }] },
                header : "contentHeader",
                mediaLengthInMilliseconds : 10,
                provider : { logo : [{ size : "logoSize" }], name : "providerName" },
                title : "contentTitle",
                titleSubtext1 : "contentTitleSubtext1",
                titleSubtext2 : "contentTitleSubtext2"
            },
            controls : [RENDER_PLAYER_INFO_CONTROL1],
            type : RENDER_PLAYER_INFO_KEY,
            audioPlayerInfo : {
                state : AudioPlayerState.IDLE,
                mediaOffsetInMilliseconds : 10,
            }
        },
        audioPlayerState : AudioPlayerState.IDLE,
        audioOffset : 10
    };
    const LOCAL_RENDER_DOCUMENT_PAYLOAD : IAPLRenderDocumentRequestPayload = {
        token : RENDER_PLAYER_INFO_KEY,
        windowId : MEDIA_PLAYER_WINDOW_ID,
        payload : {
            document : AVSDisplayCards,
            datasources : RENDER_PLAYER_INFO_MESSAGE_PAYLOAD.payload,
            supportedViewports : AVSDisplayCardSupportedViewports,
        },
    };
    const MEDIA_PLAYER_APL_INIT_RENDERER_PROPS : IAPLInitRenderersRequestPayload = {
        rendererInstances : [
            {
                windowId : MEDIA_PLAYER_WINDOW_ID,
                supportedExtensions : [AplExtensionURI.AUDIOPLAYER]
            }
        ]
    };

    const renderTemplateAplWindowConfig : IAPLWindowConfig = {
        id : DEFAULT_WINDOW_ID,
        supportedInterfaces : [AVSVisualInterfaces.TEMPLATE_RUNTIME],
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
    };

    const renderTemplateWindowProps = () : IAPLWindowElementProps => {
        return {
            windowId : DEFAULT_WINDOW_ID,
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
        };
    }

    const playerInfoWindowConfig : IAPLWindowConfig = {
        id : MEDIA_PLAYER_WINDOW_ID,
        supportedInterfaces : [AVSVisualInterfaces.TEMPLATE_RUNTIME],
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
    };

    const playerInfoWindowProps = () : IAPLWindowElementProps => {
        return {
            windowId : MEDIA_PLAYER_WINDOW_ID,
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
        };
    };

    let loggerFactory : ILoggerFactory;
    let client : IClient;
    let router : IRouter;
    let windowManager : WindowManager;
    let avsDisplayCardsManager : AVSDisplayCardsManager;
    let guiActivityTracker : IGUIActivityTracker;
    let focusManager : IFocusManager;
    let aplEvent : APLEvent;
    let renderTemplateAPLWindow : APLWindowElement;

    const sandbox : sinon.SinonSandbox = sinon.createSandbox();
    let aplSendResponseEventSpy : sinon.SinonSpy;

    beforeEach(() => {
        loggerFactory = createMock<ILoggerFactory>();
        client = createMock<IClient>();
        router = createMock<IRouter>();
        aplEvent = new APLEvent(client);
        guiActivityTracker = createMock<IGUIActivityTracker>();
        focusManager = createMock<IFocusManager>();
        windowManager = new WindowManager(loggerFactory);

        aplSendResponseEventSpy = sandbox.spy(APLEvent.prototype, <any>"sendResponseEvent");

        avsDisplayCardsManager = new AVSDisplayCardsManager(loggerFactory, client, router, aplEvent);
    });

    afterEach(() => {
        sandbox.reset();
        sandbox.restore();
    });

    it(`should ignore render template messages when no render template window id has been set`, () => {
        avsDisplayCardsManager.onRenderTemplate(RENDER_TEMPLATE_MESSAGE_PAYLOAD);
        sandbox.assert.notCalled(aplSendResponseEventSpy);
    });

    it(`should ignore clear render template messages when no render template window id has been set`, () => {
        avsDisplayCardsManager.onClearTemplateCard();
        sandbox.assert.notCalled(aplSendResponseEventSpy);
    });

    it(`should ignore render player info messages when no render player info window id has been set`, () => {
        avsDisplayCardsManager.onRenderPlayerInfo(RENDER_PLAYER_INFO_MESSAGE_PAYLOAD);
        sandbox.assert.notCalled(aplSendResponseEventSpy);
    });

    it(`should ignore clear render player info messages when no render player info window id has been set`, () => {
        avsDisplayCardsManager.onClearPlayerInfoCard();
        sandbox.assert.notCalled(aplSendResponseEventSpy);
    });

    it(`should be able to successfully handle render template message and send correct response`, () => {
        renderTemplateAPLWindow = APLWindowElementBuilder.createWindow(
            renderTemplateAplWindowConfig,
            renderTemplateWindowProps(),
            DisplayOrientation.LANDSCAPE
        );
        windowManager.addWindows([renderTemplateAPLWindow]);
        avsDisplayCardsManager.initWindows(
            windowManager,
            DEFAULT_WINDOW_ID,
            undefined,
            undefined,
            undefined
        );
        avsDisplayCardsManager.onRenderTemplate(RENDER_TEMPLATE_MESSAGE_PAYLOAD);
        sandbox.assert.calledTwice(aplSendResponseEventSpy);
        sandbox.assert.calledWithExactly(
            aplSendResponseEventSpy.getCall(1),
            APL_RENDER_DOCUMENT_REQUEST_MESSAGE_NAME,
            {
                token : TOKEN1,
                windowId : DEFAULT_WINDOW_ID,
                payload : {
                    document : AVSDisplayCards,
                    datasources : RENDER_TEMPLATE_MESSAGE_PAYLOAD,
                    supportedViewports : AVSDisplayCardSupportedViewports,
                },
            }
        );
    });

    it(`should be able to handle render player info message and send correct response`, () => {
        avsDisplayCardsManager.initWindows(
            windowManager,
            undefined,
            playerInfoWindowConfig,
            playerInfoWindowProps(),
            DisplayOrientation.LANDSCAPE
        );
        avsDisplayCardsManager.onRenderPlayerInfo(RENDER_PLAYER_INFO_MESSAGE_PAYLOAD);
        sandbox.assert.calledTwice(aplSendResponseEventSpy);
        sandbox.assert.calledWithExactly(aplSendResponseEventSpy.getCall(0),
            APL_INITIALIZE_RENDERERS_REQUEST_MESSAGE_NAME,
            MEDIA_PLAYER_APL_INIT_RENDERER_PROPS);
        sandbox.assert.calledWithExactly(aplSendResponseEventSpy.getCall(1),
            APL_RENDER_DOCUMENT_REQUEST_MESSAGE_NAME,
            LOCAL_RENDER_DOCUMENT_PAYLOAD);
    });

    it(`should be able to handle render player info messages with identical payload and only send localRenderDocument response once`, () => {
        avsDisplayCardsManager.initWindows(
            windowManager,
            undefined,
            playerInfoWindowConfig,
            playerInfoWindowProps(),
            DisplayOrientation.LANDSCAPE
        );
        avsDisplayCardsManager.onRenderPlayerInfo(RENDER_PLAYER_INFO_MESSAGE_PAYLOAD);
        avsDisplayCardsManager.onRenderPlayerInfo(RENDER_PLAYER_INFO_MESSAGE_PAYLOAD);
        sandbox.assert.calledTwice(aplSendResponseEventSpy);
        sandbox.assert.calledWithExactly(aplSendResponseEventSpy.getCall(0),
            APL_INITIALIZE_RENDERERS_REQUEST_MESSAGE_NAME,
            MEDIA_PLAYER_APL_INIT_RENDERER_PROPS);
        sandbox.assert.calledWithExactly(aplSendResponseEventSpy.getCall(1),
            APL_RENDER_DOCUMENT_REQUEST_MESSAGE_NAME,
            LOCAL_RENDER_DOCUMENT_PAYLOAD);
    });

    it(`should be able to handle render player info messages with updated audio item and send correct responses`, () => {
        avsDisplayCardsManager.initWindows(
            windowManager,
            undefined,
            playerInfoWindowConfig,
            playerInfoWindowProps(),
            DisplayOrientation.LANDSCAPE
        );
        
        avsDisplayCardsManager.onRenderPlayerInfo(RENDER_PLAYER_INFO_MESSAGE_PAYLOAD);

        RENDER_PLAYER_INFO_MESSAGE_PAYLOAD.payload.audioItemId = AUDIO_ITEM_ID2;
        avsDisplayCardsManager.onRenderPlayerInfo(RENDER_PLAYER_INFO_MESSAGE_PAYLOAD);
        
        sandbox.assert.calledThrice(aplSendResponseEventSpy);
        sandbox.assert.calledWithExactly(aplSendResponseEventSpy.getCall(0),
            APL_INITIALIZE_RENDERERS_REQUEST_MESSAGE_NAME,
            MEDIA_PLAYER_APL_INIT_RENDERER_PROPS);
        sandbox.assert.calledWithExactly(aplSendResponseEventSpy.getCall(1),
            APL_RENDER_DOCUMENT_REQUEST_MESSAGE_NAME,
            LOCAL_RENDER_DOCUMENT_PAYLOAD);
        sandbox.assert.calledWithExactly(aplSendResponseEventSpy.getCall(2),
            APL_RENDER_DOCUMENT_REQUEST_MESSAGE_NAME,
            LOCAL_RENDER_DOCUMENT_PAYLOAD);
    });

    it(`should be able to handle render player info messages with updated toggle controls and send correct responses`, () => {
        avsDisplayCardsManager.initWindows(
            windowManager,
            undefined,
            playerInfoWindowConfig,
            playerInfoWindowProps(),
            DisplayOrientation.LANDSCAPE
        );
        avsDisplayCardsManager.onRenderPlayerInfo(RENDER_PLAYER_INFO_MESSAGE_PAYLOAD);
        
        RENDER_PLAYER_INFO_MESSAGE_PAYLOAD.payload.controls = [RENDER_PLAYER_INFO_CONTROL2];
        avsDisplayCardsManager.onRenderPlayerInfo(RENDER_PLAYER_INFO_MESSAGE_PAYLOAD);
        
        sandbox.assert.calledThrice(aplSendResponseEventSpy);
        sandbox.assert.calledWithExactly(aplSendResponseEventSpy.getCall(0),
            APL_INITIALIZE_RENDERERS_REQUEST_MESSAGE_NAME,
            MEDIA_PLAYER_APL_INIT_RENDERER_PROPS);
        sandbox.assert.calledWithExactly(aplSendResponseEventSpy.getCall(1),
            APL_RENDER_DOCUMENT_REQUEST_MESSAGE_NAME,
            LOCAL_RENDER_DOCUMENT_PAYLOAD);
        sandbox.assert.calledWithExactly(aplSendResponseEventSpy.getCall(2),
            APL_RENDER_DOCUMENT_REQUEST_MESSAGE_NAME,
            LOCAL_RENDER_DOCUMENT_PAYLOAD);
    });

    it(`should ignore render player info messages with audio state STOPPED`, () => {
        RENDER_PLAYER_INFO_MESSAGE_PAYLOAD.audioPlayerState = AudioPlayerState.STOPPED
        avsDisplayCardsManager.onRenderPlayerInfo(RENDER_PLAYER_INFO_MESSAGE_PAYLOAD);
        
        sandbox.assert.notCalled(aplSendResponseEventSpy);
    });

    it(`should be able to successfully handle clear template message`, () => {
        renderTemplateAPLWindow = APLWindowElementBuilder.createWindow(
            renderTemplateAplWindowConfig,
            renderTemplateWindowProps(),
            DisplayOrientation.LANDSCAPE
        );
        windowManager.addWindows([renderTemplateAPLWindow]);
        avsDisplayCardsManager.initWindows(
            windowManager,
            DEFAULT_WINDOW_ID,
            undefined,
            undefined,
            undefined
        );
        avsDisplayCardsManager.setLastRenderTemplatePayload(RENDER_TEMPLATE_MESSAGE_PAYLOAD);
        avsDisplayCardsManager.onClearTemplateCard();
        sandbox.assert.calledTwice(aplSendResponseEventSpy);
        sandbox.assert.calledWithExactly(
            aplSendResponseEventSpy.getCall(1),
            APL_CLEAR_DOCUMENT_REQUEST_MESSAGE_NAME,
            {
                token : TOKEN1,
                windowId : DEFAULT_WINDOW_ID
            }
        );
    });

    it(`should be able to successfully handle clear player info message`, () => {
        avsDisplayCardsManager.initWindows(
            windowManager,
            undefined,
            playerInfoWindowConfig,
            playerInfoWindowProps(),
            DisplayOrientation.LANDSCAPE
        );
        avsDisplayCardsManager.onClearPlayerInfoCard();
        sandbox.assert.calledTwice(aplSendResponseEventSpy);
        sandbox.assert.calledWithExactly(aplSendResponseEventSpy.getCall(0),
            APL_INITIALIZE_RENDERERS_REQUEST_MESSAGE_NAME,
            MEDIA_PLAYER_APL_INIT_RENDERER_PROPS);
        sandbox.assert.calledWithExactly(aplSendResponseEventSpy.getCall(1),
            APL_CLEAR_DOCUMENT_REQUEST_MESSAGE_NAME,
            {
                token : RENDER_PLAYER_INFO_KEY,
                windowId : MEDIA_PLAYER_WINDOW_ID
            }
        );
    });

    it(`should be able to handle toggle controls changes correctly`, () => {
        chai.assert.ok(avsDisplayCardsManager.toggleControlsChanged([RENDER_PLAYER_INFO_CONTROL1]));
        chai.assert.notOk(avsDisplayCardsManager.toggleControlsChanged([RENDER_PLAYER_INFO_CONTROL1]));
        chai.assert.ok(avsDisplayCardsManager.toggleControlsChanged([RENDER_PLAYER_INFO_CONTROL2]));
        chai.assert.ok(avsDisplayCardsManager.toggleControlsChanged([RENDER_PLAYER_INFO_CONTROL3]));
        chai.assert.ok(avsDisplayCardsManager.toggleControlsChanged([RENDER_PLAYER_INFO_CONTROL4]));
    });

    it(`should be able to handle audio item changes correctly`, () => {
        chai.assert.ok(avsDisplayCardsManager.audioItemChanged(AUDIO_ITEM_ID1));
        chai.assert.notOk(avsDisplayCardsManager.audioItemChanged(AUDIO_ITEM_ID1));
        chai.assert.ok(avsDisplayCardsManager.audioItemChanged(AUDIO_ITEM_ID2));
    });
});
