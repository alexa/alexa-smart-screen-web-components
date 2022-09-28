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
import { createMock } from "ts-auto-mock";
import { IDoNotDisturbManager, ILoggerFactory } from '@alexa-smart-screen/common';
import { TestDoNotDisturbHandler } from './TestDoNotDisturbHandler';
import { IDNDSetStateDirectivePayload } from '../../src/doNotDisturb/ipcComponents/DoNotDisturbMessageInterfaces';

describe('@alexa-smart-screen/app-utils - DoNotDisturbHandler', () => {
    let loggerFactory : ILoggerFactory;
    let doNotDisturbManager : IDoNotDisturbManager;
    let testDoNotDisturbHandler : TestDoNotDisturbHandler;
    
    const sandbox : sinon.SinonSandbox = sinon.createSandbox();

    beforeEach(() => {
        loggerFactory = createMock<ILoggerFactory>({
            getLogger : sandbox.spy()
        });
        doNotDisturbManager = createMock<IDoNotDisturbManager>({
            setDoNotDisturbState : sandbox.spy()
        });
        testDoNotDisturbHandler = new TestDoNotDisturbHandler(loggerFactory, doNotDisturbManager);
    });

    afterEach(() => {
        sandbox.reset();
        sandbox.restore();
    });

    it('should verify that the doNotDisturb manager is notified when setDoNotDisturbState directive is handled', () => {
        const payload : IDNDSetStateDirectivePayload = {
            enabled : true
        }
        testDoNotDisturbHandler.setDoNotDisturbState(payload);
        sinon.assert.calledWith(
            doNotDisturbManager.setDoNotDisturbState as sinon.SinonSpy,
            payload.enabled
        );
    });
});