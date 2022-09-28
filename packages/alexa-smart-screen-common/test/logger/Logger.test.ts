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
import { LogHandlerManager } from '../../src/logger/LogHandlerManager';
import { Logger } from '../../src/logger/Logger';
import { ILoggerParams } from '../../src/logger/ILoggerParams';
import { LogLevel } from '../../src/logger/LogLevel';
import { createMock } from 'ts-auto-mock';

describe("@alexa-smart-screen/common/logger: Logger", () => {
    const loggerId  = "1";
    let logHandlerManager : LogHandlerManager;
    let logger : Logger;
    const sandbox : sinon.SinonSandbox = sinon.createSandbox();

    const loggerParamsMessage : ILoggerParams = {
        message : "testMessage",
        className : "testClassName",
        functionName : "testFunctionName"
    };

    afterEach(() => {
        sandbox.reset();
        sandbox.restore();
    });

    beforeEach(() => {
        logHandlerManager = createMock<LogHandlerManager>({
            sendLogToHandlers : sandbox.spy()
        });
        logger = new Logger(loggerId, logHandlerManager);
    });

    it('should verify the parameters and the change in LogLevel sent to logHandlerManager when debug() is called', () => {
        logger.debug(loggerParamsMessage);
        sinon.assert.calledWith(
            logHandlerManager.sendLogToHandlers as sinon.SinonSpy,
            LogLevel.DEBUG, 
            loggerId, 
            loggerParamsMessage
        );
    });

    it('should verify the parameters and the change in LogLevel sent to logHandlerManager when error() is called', () => {
        logger.error(loggerParamsMessage);
        sinon.assert.calledWith(
            logHandlerManager.sendLogToHandlers as sinon.SinonSpy,
            LogLevel.ERROR, 
            loggerId, 
            loggerParamsMessage
        );
    });

    it('should verify the parameters and the change in LogLevel sent to logHandlerManager when info() is called', () => {
        logger.info(loggerParamsMessage);
        sinon.assert.calledWith(
            logHandlerManager.sendLogToHandlers as sinon.SinonSpy,
            LogLevel.INFO, 
            loggerId, 
            loggerParamsMessage
        );
    });

    it('should verify the parameters and the change in LogLevel sent to logHandlerManager when warn() is called', () => {
        logger.warn(loggerParamsMessage);
        sinon.assert.calledWith(
            logHandlerManager.sendLogToHandlers as sinon.SinonSpy,
            LogLevel.WARN, 
            loggerId, 
            loggerParamsMessage
        );
    });
});