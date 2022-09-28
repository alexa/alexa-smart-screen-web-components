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
import { IClient, IEvent } from '@alexa-smart-screen/common';
import { IPC_CONFIG_SYSTEM } from '../../src/system/ipcComponents/IPCNamespaceConfigSystem';
import { SystemEvent } from '../../src/system/ipcComponents/SystemEvent';
import { SYSTEM_ALEXA_STATE_REQUEST_EVENT_NAME, SYSTEM_AUTHORIZATION_STATE_REQUEST_EVENT_NAME, SYSTEM_AUTHORIZATION_INFO_REQUEST_EVENT_NAME, SYSTEM_LOCALES_REQUEST_EVENT_NAME } from '../../src/system/ipcComponents/SystemMessageInterfaces';

describe('@alexa-smart-screen/app-utils - SystemEvent', () => {
    let systemEvent : SystemEvent;
    let client : IClient;

    const sandbox : sinon.SinonSandbox = sinon.createSandbox();

    const SYSTEM_HEADER =  {
        version : IPC_CONFIG_SYSTEM.version,
        namespace : IPC_CONFIG_SYSTEM.namespace
    };

    const ALEXA_STATE_REQUEST_MESSAGE : IEvent = {
        header : { name : SYSTEM_ALEXA_STATE_REQUEST_EVENT_NAME, ...SYSTEM_HEADER },
        payload : { }
    };

    const AUTHORIZATION_STATE_REQUEST_MESSAGE : IEvent = {
        header : { name : SYSTEM_AUTHORIZATION_STATE_REQUEST_EVENT_NAME, ...SYSTEM_HEADER },
        payload : { }
    };

    const AUTHORIZATION_INFO_REQUEST_MESSAGE : IEvent = {
        header : { name : SYSTEM_AUTHORIZATION_INFO_REQUEST_EVENT_NAME, ...SYSTEM_HEADER },
        payload : { }
    };

    const LOCALES_REQUEST_MESSAGE : IEvent = {
        header : { name : SYSTEM_LOCALES_REQUEST_EVENT_NAME, ...SYSTEM_HEADER },
        payload : { }
    };

    beforeEach(() => {
        client = createMock<IClient>({ 
            sendMessage : sandbox.spy()
        });
        systemEvent = new SystemEvent(client);
    });

    afterEach(() => {
        sandbox.reset();
        sandbox.restore();
    });

    it('should verify event payloads via IClient interface when alexaStateRequest is called', () => {
        systemEvent.alexaStateRequest();
        sinon.assert.calledWith(
            client.sendMessage as sinon.SinonSpy,
            ALEXA_STATE_REQUEST_MESSAGE
        );
    });

    it('should verify event payloads via IClient interface when authorizationStateRequest is called', () => {
        systemEvent.authorizationStateRequest();
        sinon.assert.calledWith(
            client.sendMessage as sinon.SinonSpy,
            AUTHORIZATION_STATE_REQUEST_MESSAGE
        );
    });

    it('should verify event payloads via IClient interface when authorizationInfoRequest is called', () => {
        systemEvent.authorizationInfoRequest();
        sinon.assert.calledWith(
            client.sendMessage as sinon.SinonSpy,
            AUTHORIZATION_INFO_REQUEST_MESSAGE
        );
    });

    it('should verify event payloads via IClient interface when localesRequest is called', () => {
        systemEvent.localesRequest();
        sinon.assert.calledWith(
            client.sendMessage as sinon.SinonSpy,
            LOCALES_REQUEST_MESSAGE
        );
    });
});