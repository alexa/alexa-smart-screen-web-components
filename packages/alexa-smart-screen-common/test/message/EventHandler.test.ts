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
import { IClient } from "../../src/client/IClient";
import { TestEventHandler } from "./TestEventHandler";
import { EventBuilder } from '../../src/message/EventBuilder';
import { ErrorResponseType } from '../../src/message/Event/ErrorResponseType';
import { IIPCNamespaceConfig } from '../../src/message/IIPCNamespaceConfigProvider';

describe('@alexa-smart-screen/common/message: EventHandler', () => {
    let testEventHandler : TestEventHandler;
    let client : IClient;
    const sandbox : sinon.SinonSandbox = sinon.createSandbox();
    const name = "funcName";
    const payload = "testPayload";

    const sampleIPCNamespaceConfig : IIPCNamespaceConfig = {
        namespace : "SampleNamespace",
        version : 1
    };

    beforeEach(() => {
        client = createMock<IClient>({
            sendMessage : sandbox.spy()
        });
        testEventHandler = new TestEventHandler(client, sampleIPCNamespaceConfig);
    });

    afterEach(() => {
        sandbox.reset();
        sandbox.restore();
    });

    it('should verify that client forwards the correct message when response is sent from EventHandler', () => {
        const ipcConfig = testEventHandler.getIPCNamespaceConfig();
        testEventHandler.testSendResponseEvent(name, payload);
        const expectedMessage = EventBuilder.constructEvent(ipcConfig.version, ipcConfig.namespace, name, payload);
        sinon.assert.calledWith(
            client.sendMessage as sinon.SinonSpy,
            expectedMessage
         );
    });

    it('should verify that client forwards the correct error message when an error response is sent from EventHandler', () => {
        const error_type = ErrorResponseType.INTERNAL_ERROR;
        const ipcConfig = testEventHandler.getIPCNamespaceConfig();
        testEventHandler.testSendErrorResponseEvent(name, error_type, payload);
        const expectedMessage = EventBuilder.constructErrorEvent(ipcConfig.version, ipcConfig.namespace, name, error_type, payload);
        sinon.assert.calledWith(
            client.sendMessage as sinon.SinonSpy,
            expectedMessage
         );
    });
});