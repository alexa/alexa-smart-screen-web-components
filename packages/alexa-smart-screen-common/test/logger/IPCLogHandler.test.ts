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
import { createMock } from 'ts-auto-mock';
import { IPCLogHandler } from '../../src/logger/IPCLogHandler';
import { IClient } from '../../src/client/IClient';
import { LogLevel } from '../../src/logger/LogLevel';
import { IEvent } from '../../src/message/Event/EventHandler';
import { IPC_CONFIG_LOGGER } from '../../src/logger/ipcComponents/IPCNamespaceConfigLogger';
import { ILogEventPayload, LOGGER_LOG_EVENT_NAME } from '../../src/logger/ipcComponents/LoggerMessageInterfaces';

describe("@lexa-smart-screen/common/logger: IPCLogHandler", () => {
    let ipcLogHandler : IPCLogHandler;
    let client : IClient;
    const sandbox : sinon.SinonSandbox = sinon.createSandbox();

    beforeEach(() => {
        client = createMock<IClient>({
            sendMessage : sandbox.spy(),
        });
        ipcLogHandler = new IPCLogHandler(client);
    });

    afterEach(() => {
        sandbox.reset();
        sandbox.restore();
    });

    it('should verify that the LogLevel is set correctly and the correct arguments are passed in sendMessage when handleLog is called by ipcLogHandler', () => {
        ipcLogHandler.setLevel(LogLevel.INFO);
        const logLevel = ipcLogHandler.getLevel();
        const message = "testMessage";
        client.isConnected = true;
        ipcLogHandler.handleLog(logLevel, message);
        const logEventPayload : ILogEventPayload = {
            level : LogLevel[logLevel],
            message : message
        };
        const messagePayload : IEvent = {
            header : { name : LOGGER_LOG_EVENT_NAME, namespace : IPC_CONFIG_LOGGER.namespace, version : IPC_CONFIG_LOGGER.version },
            payload : logEventPayload
        };
        sinon.assert.calledWith(
            client.sendMessage as sinon.SinonSpy,
            messagePayload
        );
    });

    it('should verify that the message is not sent to client as client is not connected', () => {
        client.isConnected = false;
        ipcLogHandler.handleLog(LogLevel.INFO, "testMessage");
        sinon.assert.notCalled(
            client.sendMessage as sinon.SinonSpy
        );
    });
});