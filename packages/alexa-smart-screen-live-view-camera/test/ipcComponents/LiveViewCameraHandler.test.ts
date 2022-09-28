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

import { assert } from 'chai';
import * as sinon from 'sinon';
import { createMock } from "ts-auto-mock";
import { ILoggerFactory } from '@alexa-smart-screen/common';
import { TestLiveViewCameraHandler } from './TestLiveViewCameraHandler';
import { ILiveViewCameraHandlerObserver } from '../../src/ipcComponents/ILiveViewCameraHandlerObserver';
import { LiveViewCameraState } from '../../src/constants/LiveViewCameraState';
import { IClearCameraMessagePayload, IRenderCameraMessagePayload, ISetCameraStateMessagePayload } from '../../src/ipcComponents/LiveViewCameraMessageInterfaces';
import { SampleStartLiveViewPayload } from '../../src/debug/SampleStartLiveViewPayload';
import { IPC_CONFIG_LIVE_VIEW_CAMERA } from '../../src/ipcComponents/IPCNamespaceConfigLiveViewCamera';

describe('@alexa-smart-screen/live-view-camera - LiveViewCameraHandler', () => {
    let loggerFactory : ILoggerFactory;
    let observer : ILiveViewCameraHandlerObserver;
    let testLiveViewCameraHandler : TestLiveViewCameraHandler;

    const sandbox : sinon.SinonSandbox = sinon.createSandbox();

    beforeEach(() => {
        observer = createMock<ILiveViewCameraHandlerObserver>({
            onCameraStateChanged : sandbox.spy(),
            onStartLiveView : sandbox.spy(),
            onStopLiveView : sandbox.spy()
        });
        loggerFactory = createMock<ILoggerFactory>();
        testLiveViewCameraHandler = new TestLiveViewCameraHandler(observer, loggerFactory);
    });

    afterEach(() => {
        sandbox.reset();
        sandbox.restore();
    });

    it('should verify that the live view camera handler returns the correct ipc namespace', () => {
        assert.strictEqual(testLiveViewCameraHandler.getIPCNamespaceConfig(), IPC_CONFIG_LIVE_VIEW_CAMERA);
    });

    it('should verify that the live view camera observer is notified with the StartLiveView payload when the renderCamera directive is handled', () => {
        const payload : IRenderCameraMessagePayload = {
            startLiveViewPayload : SampleStartLiveViewPayload
        };
        testLiveViewCameraHandler.renderCamera(payload);

        sandbox.assert.calledWith(
            observer.onStartLiveView as sinon.SinonSpy,
            SampleStartLiveViewPayload
        );
    });

    it('should verify that the live view camera observer is notified to stop live view when the clearCamera directive is handled', () => {
        const payload : IClearCameraMessagePayload = {};
        testLiveViewCameraHandler.clearCamera(payload);

        sandbox.assert.calledWith(
            observer.onStopLiveView as sinon.SinonSpy
        );
    });

    it('should verify that the live view camera observer is notified to set the camera state when the setCameraState directive is handled', () => {
        const cameraState : LiveViewCameraState = LiveViewCameraState.CONNECTED;
        const payload : ISetCameraStateMessagePayload = {
            state : cameraState
        };
        testLiveViewCameraHandler.setCameraState(payload);

        sandbox.assert.calledWith(
            observer.onCameraStateChanged as sinon.SinonSpy,
            cameraState
        );
    });
});