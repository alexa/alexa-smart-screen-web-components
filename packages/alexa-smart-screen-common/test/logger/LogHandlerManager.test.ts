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
import { LogLevel } from '../../src/logger/LogLevel';
import { ILoggerParams } from '../../src/logger/ILoggerParams';
import { ILogHandler } from '../../src/logger/ILogHandler';
import { createMock } from 'ts-auto-mock';

describe('@alexa-smart-screen/common/log: LogHandlerManager', () => {
    let logHandlerManager : LogHandlerManager;
    let handler1 : ILogHandler;
    let handler2 : ILogHandler;
    const sandbox : sinon.SinonSandbox = sinon.createSandbox();
    
    beforeEach(() => {
        logHandlerManager = new LogHandlerManager();
        handler1 = createMock<ILogHandler>({
            handleLog : sandbox.spy(),
            getLevel : sandbox.stub().returns(LogLevel.WARN)
        });
        handler2 = createMock<ILogHandler>({
            handleLog : sandbox.spy(),
            getLevel : sandbox.stub().returns(LogLevel.INFO)
        });
        logHandlerManager.addHandler(handler1);
        logHandlerManager.addHandler(handler2);
    });

    const loggerParamsMessage : ILoggerParams = {
        message : "testMessage",
        className : "testClassName",
        functionName : "testFunctionName"
    };
    const loggerId = "1";

    afterEach(() => {
        sandbox.reset();
        sandbox.restore();
    });

    it('should verify log messages should be sent to handlers with higher log level', () => {
        logHandlerManager.sendLogToHandlers(LogLevel.ERROR, loggerId, loggerParamsMessage);
        sinon.assert.calledWith( 
            handler1.handleLog as sinon.SinonSpy,
            LogLevel.ERROR,
            handler1.getFormatter().format(loggerId, loggerParamsMessage)
        );

        sinon.assert.calledWith( 
            handler2.handleLog as sinon.SinonSpy,
            LogLevel.ERROR,
            handler2.getFormatter().format(loggerId, loggerParamsMessage)
        );
    });

    it('should verify log messages should be sent to handlers with the same log level', () => {
        logHandlerManager.sendLogToHandlers(LogLevel.INFO, loggerId, loggerParamsMessage);
        sinon.assert.notCalled( 
            handler1.handleLog as sinon.SinonSpy
        );

        sinon.assert.calledWith( 
            handler2.handleLog as sinon.SinonSpy,
            LogLevel.INFO,
            handler2.getFormatter().format(loggerId, loggerParamsMessage)
        );
    });

    it('should verify log messages should not be sent to handlers with lower log level', () => {
        logHandlerManager.sendLogToHandlers(LogLevel.DEBUG, loggerId, loggerParamsMessage);
        sinon.assert.notCalled( 
            handler1.handleLog as sinon.SinonSpy
        );

        sinon.assert.notCalled( 
            handler2.handleLog as sinon.SinonSpy
        );
    });

    it('should verify that log is not sent to a handler removed from logHandlerManager', () => {
        logHandlerManager.removeHandler(handler1);
        logHandlerManager.sendLogToHandlers(LogLevel.ERROR, loggerId, loggerParamsMessage);
        sinon.assert.notCalled( 
            handler1.handleLog as sinon.SinonSpy
        );

        sinon.assert.calledWith( 
            handler2.handleLog as sinon.SinonSpy,
            LogLevel.ERROR,
            handler2.getFormatter().format(loggerId, loggerParamsMessage)
        );
    });
});