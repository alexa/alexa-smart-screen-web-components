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
import { IPC_CONFIG_DO_NOT_DISTURB } from "../../src/doNotDisturb/ipcComponents/IPCNamespaceConfigDoNotDisturb";
import { IClient } from '@alexa-smart-screen/common';
import { DoNotDisturbEvent } from "../../src/doNotDisturb/ipcComponents/DoNotDisturbEvent";
import { DND_STATE_CHANGED_EVENT_NAME, DND_STATE_REQUEST_EVENT_NAME, IDNDStateChangedEventPayload } from '../../src/doNotDisturb/ipcComponents/DoNotDisturbMessageInterfaces';

describe('@alexa-smart-screen/app-utils - DoNotDisturbEvent', () => {
    let dndEvent : DoNotDisturbEvent;
    let client : IClient;
    const sandbox : sinon.SinonSandbox = sinon.createSandbox();

    const DND_STATE_CHANGED_HEADER =  {
        version : IPC_CONFIG_DO_NOT_DISTURB.version,
        namespace : IPC_CONFIG_DO_NOT_DISTURB.namespace,
        name : DND_STATE_CHANGED_EVENT_NAME
    };

    const DND_STATE_REQUEST_HEADER =  {
        version : IPC_CONFIG_DO_NOT_DISTURB.version,
        namespace : IPC_CONFIG_DO_NOT_DISTURB.namespace,
        name : DND_STATE_REQUEST_EVENT_NAME
    };

    beforeEach(() => {
        client = createMock<IClient>({ 
            sendMessage : sandbox.spy()
        });
        dndEvent = new DoNotDisturbEvent(client);
    });

    afterEach(() => {
        sandbox.reset();
        sandbox.restore();
    });

    it('should send the correct message when DND state is requested.', () => {
        const dndRequestedMessage  = {
            header : DND_STATE_REQUEST_HEADER,
            payload : {}
        };
        dndEvent.doNotDisturbStateRequest();
        sinon.assert.calledWith(
            client.sendMessage as sinon.SinonSpy,
            dndRequestedMessage
        );
    });

    it('should send the correct message when DND is enabled.', () => {
        const dndEnabledPayload : IDNDStateChangedEventPayload = {
            enabled : true
        };
        const captionsEnabledMessage  = {
            header : DND_STATE_CHANGED_HEADER,
            payload : dndEnabledPayload
        };
        dndEvent.doNotDisturbStateChanged(true);
        sinon.assert.calledWith(
            client.sendMessage as sinon.SinonSpy,
            captionsEnabledMessage
        );
    });

    it('should send the correct message when DND is disabled.', () => {
        const dndEnabledPayload : IDNDStateChangedEventPayload = {
            enabled : false
        };
        const captionsEnabledMessage  = {
            header : DND_STATE_CHANGED_HEADER,
            payload : dndEnabledPayload
        };
        dndEvent.doNotDisturbStateChanged(false);
        sinon.assert.calledWith(
            client.sendMessage as sinon.SinonSpy,
            captionsEnabledMessage
        );
    });
});