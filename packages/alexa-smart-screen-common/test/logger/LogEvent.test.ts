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
import { LoggerEvent } from '../../src/logger/ipcComponents/LoggerEvent';
import { ILogEventPayload, LOGGER_LOG_EVENT_NAME } from '../../src/logger/ipcComponents/LoggerMessageInterfaces';
import { IClient } from '../../src/client/IClient';
import { createMock } from 'ts-auto-mock';
import { IPC_CONFIG_LOGGER } from '../../src/logger/ipcComponents/IPCNamespaceConfigLogger';
import { LogLevel } from '../../src/logger/LogLevel';

describe('@alexa-smart-screen/common/logger: LogEvent', () => {
    let client : IClient;
    let loggerEvent : LoggerEvent;
    const sandbox : sinon.SinonSandbox = sinon.createSandbox();
    const LOG_EVENT_PAYLOAD : ILogEventPayload = {
        level : LogLevel.INFO, 
        message : "testMessage"
    }

    const LOG_EVENT_HEADER = {
        name : LOGGER_LOG_EVENT_NAME,
        namespace : IPC_CONFIG_LOGGER.namespace,
        version : IPC_CONFIG_LOGGER.version
    }

    const expectedMessage = {
        header : LOG_EVENT_HEADER,
        payload : LOG_EVENT_PAYLOAD
    };

    beforeEach(() => {
        client = createMock<IClient>({
            sendMessage : sandbox.spy()
        });
        loggerEvent = new LoggerEvent(client);
    });

    afterEach(() => {
        sandbox.reset();
        sandbox.restore();
    });

    it('should verify if sendResponseEvent is called with the correct payload', () => {
        loggerEvent.logEvent(LogLevel.INFO, "testMessage");
        sinon.assert.calledWith(
            client.sendMessage as sinon.SinonSpy,
            expectedMessage
        );
    });
});