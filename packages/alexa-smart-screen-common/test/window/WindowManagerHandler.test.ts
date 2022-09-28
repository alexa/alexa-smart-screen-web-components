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
import { ILoggerFactory } from '../../src/logger/ILoggerFactory';
import { IWindowManager } from '../../src/window/IWindowManager';
import { IClearWindowDirectivePayload, ISetVisualCharacteristicsDirectivePayload } from '../../src/window/ipcComponents/WindowManagerMessageInterfaces';
import { TestWindowManagerHandler } from './TestWindowManagerHandler';
import { IVisualCharacteristicsObserver } from '../../src/visualCharacteristics/IVisualCharacteristicsObserver';
import { IPC_CONFIG_WINDOW_MANAGER } from '../../src/window/ipcComponents/IPCNamespaceConfigWindowManager';
import { VisualCharacteristicsManager } from '../../src/visualCharacteristics/VisualCharacteristicsManager';

describe('@alexa-smart-screen/common: WindowManagerHandler', () => {
    let loggerFactory : ILoggerFactory;
    let windowManager : IWindowManager;
    let testWindowManagerHandler : TestWindowManagerHandler;
    let visualCharacteristicsObserver : IVisualCharacteristicsObserver;

    // spies
    let setWindowTemplatesSpy : sinon.SinonSpy;
    let setInteractionModesSpy : sinon.SinonSpy;
    let setDisplayCharacteristicsSpy : sinon.SinonSpy;

    const sandbox : sinon.SinonSandbox = sinon.createSandbox();

    beforeEach(() => {
        loggerFactory = createMock<ILoggerFactory>();
        visualCharacteristicsObserver = createMock<IVisualCharacteristicsObserver>({
            onVisualCharacteristicsInit : sandbox.spy()
        });
        testWindowManagerHandler = new TestWindowManagerHandler(windowManager, loggerFactory);

        setWindowTemplatesSpy = sandbox.spy(VisualCharacteristicsManager.prototype, 'setWindowTemplates');
        setInteractionModesSpy = sandbox.spy(VisualCharacteristicsManager.prototype, 'setInteractionModes');
        setDisplayCharacteristicsSpy = sandbox.spy(VisualCharacteristicsManager.prototype, 'setDisplayCharacteristics');
    });

    afterEach(() => {
        sandbox.reset();
        sandbox.restore();
    });

    it('should verify that the window manager handler returns the correct ipc namespace', () => {
        assert.strictEqual(testWindowManagerHandler.getIPCNamespaceConfig(), IPC_CONFIG_WINDOW_MANAGER);
    });

    it('should verify that all charateristics are set on visual characteristics manager and the observer is notified of the setVisualCharacteristics payload', () => {
        testWindowManagerHandler.getObserverManager().addObserver(visualCharacteristicsObserver);
        const payload : ISetVisualCharacteristicsDirectivePayload = {
            deviceDisplay : {} as any,
            interactionModes : [],
            windowTemplates : []
        }
        testWindowManagerHandler.setVisualCharacteristics(payload);

        sandbox.assert.calledWith(setWindowTemplatesSpy, payload.windowTemplates);
        sandbox.assert.calledWith(setInteractionModesSpy, payload.interactionModes);
        sandbox.assert.calledWith(setDisplayCharacteristicsSpy, payload.deviceDisplay);

        sandbox.assert.calledWith(
            visualCharacteristicsObserver.onVisualCharacteristicsInit as sinon.SinonSpy,
            payload
        );
    });

    it('should verify that setWindowTemplates is NOT called on visual characteristics manager if not in characteristics', () => {
        testWindowManagerHandler.getObserverManager().addObserver(visualCharacteristicsObserver);
        const payload : ISetVisualCharacteristicsDirectivePayload = {
            deviceDisplay : {} as any,
            interactionModes : []
        }
        testWindowManagerHandler.setVisualCharacteristics(payload);

        sandbox.assert.notCalled(setWindowTemplatesSpy);
    });

    it('should verify that setInteractionModes is NOT called on visual characteristics manager if not in characteristics', () => {
        testWindowManagerHandler.getObserverManager().addObserver(visualCharacteristicsObserver);
        const payload : ISetVisualCharacteristicsDirectivePayload = {
            deviceDisplay : {} as any,
            windowTemplates : []
        }
        testWindowManagerHandler.setVisualCharacteristics(payload);

        sandbox.assert.notCalled(setInteractionModesSpy);
    });

    it('should verify that setDisplayCharacteristics is NOT called on visual characteristics manager if not in characteristics', () => {
        testWindowManagerHandler.getObserverManager().addObserver(visualCharacteristicsObserver);
        const payload : ISetVisualCharacteristicsDirectivePayload = {
            interactionModes : [],
            windowTemplates : []
        }
        testWindowManagerHandler.setVisualCharacteristics(payload);

        sandbox.assert.notCalled(setDisplayCharacteristicsSpy);
    });

    it('should verify that the promise is resolved when the window is cleared', async () => {
        let isResolved = false;
        const payload : IClearWindowDirectivePayload = {
            windowId : ''
        }

        await new Promise<void>(resolve => {
            const timeout_Id = setTimeout(() => {
                assert.notOk("Promise does not resolve");
                resolve();
            }, 5000);

            testWindowManagerHandler.clearWindow(payload).then(() => {
                isResolved = true;
                clearTimeout(timeout_Id);
                resolve();
            });
            assert.strictEqual(isResolved, false);
        });
        assert.strictEqual(isResolved, true);
    });
});