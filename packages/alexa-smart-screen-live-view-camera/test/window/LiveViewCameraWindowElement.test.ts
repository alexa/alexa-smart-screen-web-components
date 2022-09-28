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

import { APLEvent } from "@alexa-smart-screen/apl";
import { LiveViewCameraWindowElement, ILiveViewCameraWindowElementProps, LIVE_VIEW_CAMERA_WINDOW_ID } from "../../src/window/LiveViewCameraWindowElement";
import { LiveViewCameraWindowElementBuilder } from "../../src/window/LiveViewCameraWindowElementBuilder";
import { LiveViewRTCMediaPlayerElement } from "../../src/rtcMedia/LiveViewRTCMediaPlayerElement";
import { LiveViewCameraEvent } from "../../src/ipcComponents/LiveViewCameraEvent";
import {
    IGUIActivityTracker,
    IFocusManager,
    ILoggerFactory,
    ViewportShape,
    UIMode,
    DisplayOrientation,
    IClient,
    IWindowConfig,
    LocaleType,
    LocaleLayoutDirection
} from "@alexa-smart-screen/common";
import { SampleStartLiveViewPayload } from "../../src/debug/SampleStartLiveViewPayload";
import { ILiveViewControllerAPLDatasource, LIVE_VIEW_CAMERA_DOCUMENT_TOKEN } from "../../src/apl/LiveViewControllerToAPLResolver";
import { LiveViewCameraAPL } from "../../src/apl/LiveViewCameraAPL";
import { LiveViewCameraSupportedViewports } from "../../src/apl/LiveViewCameraSupportedViewports";
import { LiveViewCameraUIState } from "../../src/constants/LiveViewCameraUIState";
import { LiveViewCameraState } from "../../src/constants/LiveViewCameraState";

describe("@alexa-smart-screen/live-view-camera - LiveViewCamera Window Element", () => {
    const AGENT_NAME = "AlexaSmartScreenWebComponents";
    const AGENT_VERSION1 = "version1";
    const INTERACTION_MODE1 = "interactionMode1";
    const TEMPLATE1 = "template1";
    const SIZE_CONFIGURATION1 = "sizeConfiguration1";
    const RENDER_PLAYER_INFO_WINDOW_ZORDER = 0;
    const DPI = 160;

    let liveViewCameraWindowProps : ILiveViewCameraWindowElementProps;
    let liveViewCameraWindow : LiveViewCameraWindowElement;
    let windowConfig : IWindowConfig;
    let guiActivityTracker : IGUIActivityTracker;
    let focusManager : IFocusManager;
    let loggerFactory : ILoggerFactory;
    let client : IClient;
    let aplEvent : APLEvent;

    const sandbox : sinon.SinonSandbox = sinon.createSandbox();

    // spies
    let debugStartLiveViewUISpy : sinon.SinonSpy;
    let aplEventRenderDocumentRequestSpy : sinon.SinonSpy;
    let aplEventClearDocumentRequest : sinon.SinonSpy;
    let liveViewEventWindowReportSpy : sinon.SinonSpy;
    let liveViewRTCMediaPlayerSetCameraStateSpy : sinon.SinonSpy;
    let liveViewRTCMediaPlayerShutdownClientApy : sinon.SinonSpy;
    let liveViewRTCSetCameraConnectionStateSpy : sinon.SinonSpy;


    beforeEach(() => {
        loggerFactory = createMock<ILoggerFactory>();
        guiActivityTracker = createMock<IGUIActivityTracker>();
        focusManager = createMock<IFocusManager>();
        client = createMock<IClient>();
        aplEvent = new APLEvent(client);

        liveViewEventWindowReportSpy = sandbox.spy(
            LiveViewCameraEvent.prototype,
            "windowIdReport"
        );

        aplEventRenderDocumentRequestSpy = sandbox.spy(
            APLEvent.prototype,
            "renderDocumentRequest"
        );

        aplEventClearDocumentRequest = sandbox.spy(
            APLEvent.prototype,
            "clearDocumentRequest"
        );

        liveViewRTCMediaPlayerSetCameraStateSpy = sandbox.spy(
            LiveViewRTCMediaPlayerElement.prototype as any,
            "setCameraUIState"
        );

        liveViewRTCMediaPlayerShutdownClientApy = sandbox.spy(
            LiveViewRTCMediaPlayerElement.prototype as any,
            "shutdownClient"
        );

        liveViewRTCSetCameraConnectionStateSpy = sandbox.spy(
            LiveViewRTCMediaPlayerElement.prototype as any,
            "setCameraConnectionState"
        );

        debugStartLiveViewUISpy = sandbox.spy(
            LiveViewCameraWindowElement.prototype as any,
            "debugStartLiveViewUI"
        );

        sandbox.stub(
            HTMLVideoElement.prototype,
            "load"
        );

        windowConfig = {
            id : '',
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
        };

        liveViewCameraWindowProps = {
            client,
            windowId : '',
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
        }
    });

    afterEach(() => {
        focusManager.reset();
        sandbox.reset();
        sandbox.restore();
    });

    it(`should be able to handle onStartLiveView observer call to send render doc request for lvc apl ui`, async () => {
        liveViewCameraWindow = LiveViewCameraWindowElementBuilder.createWindow(windowConfig, liveViewCameraWindowProps, DisplayOrientation.LANDSCAPE);
        sinon.assert.calledWithExactly(
            liveViewEventWindowReportSpy,
            LIVE_VIEW_CAMERA_WINDOW_ID
        );

        const document  = LiveViewCameraAPL;
        document.environment.lang = LocaleType.EN_US;
        document.environment.layoutDirection = LocaleLayoutDirection.LEFT_TO_RIGHT;

        const datasources : ILiveViewControllerAPLDatasource = {
            liveView : SampleStartLiveViewPayload,
            options : {}
        };
        // Use debugMode to ignore RTC Media Client initialization failure
        liveViewCameraWindow["debugMode"] = true;
        await liveViewCameraWindow.onStartLiveView(SampleStartLiveViewPayload);

        sinon.assert.calledWithMatch(
            aplEventRenderDocumentRequestSpy,
            {
                token : LIVE_VIEW_CAMERA_DOCUMENT_TOKEN,
                windowId : LIVE_VIEW_CAMERA_WINDOW_ID,
                payload : {
                    document,
                    datasources,
                    supportedViewports : LiveViewCameraSupportedViewports
                }
            }
        )

        sinon.assert.calledOnceWithExactly(
            liveViewRTCMediaPlayerSetCameraStateSpy,
            LiveViewCameraUIState.LOADING
        );
    });

    it(`should not render the camera if media client initialization fails and not in debug mode`, async () => {
        liveViewCameraWindow = LiveViewCameraWindowElementBuilder.createWindow(windowConfig, liveViewCameraWindowProps, DisplayOrientation.LANDSCAPE);
        await liveViewCameraWindow.onStartLiveView(SampleStartLiveViewPayload);

        sinon.assert.notCalled(
            aplEventRenderDocumentRequestSpy
        );
    });

    it(`should call debugStartLiveViewUI on creation if debugMode prop is true`, async () => {
        liveViewCameraWindowProps.debugMode = true;
        liveViewCameraWindow = LiveViewCameraWindowElementBuilder.createWindow(windowConfig, liveViewCameraWindowProps, DisplayOrientation.LANDSCAPE);
        sinon.assert.calledWithExactly(
            liveViewEventWindowReportSpy,
            LIVE_VIEW_CAMERA_WINDOW_ID
        );

        sinon.assert.calledOnce(
            debugStartLiveViewUISpy
        );
    });

    it(`should be able to handle onStopLiveView observer call to clear apl ui, and shutdown the rtc media client`, async () => {
        liveViewCameraWindow = LiveViewCameraWindowElementBuilder.createWindow(windowConfig, liveViewCameraWindowProps, DisplayOrientation.LANDSCAPE);

        liveViewCameraWindow.onStopLiveView();

        sinon.assert.calledWithMatch(
            aplEventClearDocumentRequest,
            {
                token : LIVE_VIEW_CAMERA_DOCUMENT_TOKEN,
                windowId : LIVE_VIEW_CAMERA_WINDOW_ID
            }
        )

        sinon.assert.calledOnce(
            liveViewRTCMediaPlayerShutdownClientApy
        );
    });

    it(`should be able to handle onCameraStateChanged observer call to update camera state on rtc media client`, async () => {
        liveViewCameraWindow = LiveViewCameraWindowElementBuilder.createWindow(windowConfig, liveViewCameraWindowProps, DisplayOrientation.LANDSCAPE);

        liveViewCameraWindow.onCameraStateChanged(LiveViewCameraState.CONNECTED);

        sinon.assert.calledOnceWithExactly(
            liveViewRTCSetCameraConnectionStateSpy,
            LiveViewCameraState.CONNECTED
        );
    });
});
