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
import { ILoggerFactory } from '@alexa-smart-screen/common';
import { TestCaptionsHandler } from './TestCaptionsHandler';
import { ICaptionsObserver } from '../../src/captions/ICaptionsObserver';
import { IRenderCaptionsPayload, ISetCaptionsStatePayload } from '../../src/captions/ipcComponents/CaptionsMessageInterfaces';

describe('@alexa-smart-screen/app-utils - CaptionsHandler', () => {
    let loggerFactory : ILoggerFactory;
    let captionsObserver : ICaptionsObserver;
    let testCaptionsHandler : TestCaptionsHandler;

    const sandbox : sinon.SinonSandbox = sinon.createSandbox();

    beforeEach(() => {
        loggerFactory = createMock<ILoggerFactory>();
        captionsObserver = createMock<ICaptionsObserver>({
            onRenderCaptions : sandbox.spy(),
            onSetCaptionsState : sandbox.spy()
        });
        testCaptionsHandler = new TestCaptionsHandler(loggerFactory);
    });

    afterEach(() => {
        sandbox.reset();
        sandbox.restore();
    });

    it('should verify that the captions observer is notified of the message to render captions', () => {
        testCaptionsHandler.getObserverManager().addObserver(captionsObserver);
        const payload : IRenderCaptionsPayload = {
            duration : 10,
            delay : 100,
            captionLines : []
        }
        testCaptionsHandler.renderCaptions(payload);
        sinon.assert.calledWith(
            captionsObserver.onRenderCaptions as sinon.SinonSpy,
            payload.captionLines,
            payload.duration,
            payload.delay
        );
    });

    it('should verify that the captions observer is notified of the message to set captions state', () => {
        testCaptionsHandler.getObserverManager().addObserver(captionsObserver);
        const payload : ISetCaptionsStatePayload = {
            enabled : true
        }
        testCaptionsHandler.setCaptionsState(payload);
        sinon.assert.calledWith(
            captionsObserver.onSetCaptionsState as sinon.SinonSpy,
            payload.enabled
        );
    });
});