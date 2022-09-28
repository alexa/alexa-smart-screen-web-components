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
import { IClient } from '@alexa-smart-screen/common';
import { CaptionsEvent } from "../../src/captions/ipcComponents/CaptionsEvent";
import { ICaptionsStateChangedEventPayload, CAPTIONS_STATE_CHANGED_EVENT_NAME } from '../../src/captions/ipcComponents/CaptionsMessageInterfaces';
import { IPC_CONFIG_CAPTIONS } from '../../src/captions/ipcComponents/IPCNamespaceConfigCaptions';
import { CAPTIONS_STATE_REQUEST_EVENT_NAME } from '../../dist';

describe('@alexa-smart-screen/app-utils - CaptionsEvent', () => {
    let captionsEvent : CaptionsEvent;
    let client : IClient;
    const sandbox : sinon.SinonSandbox = sinon.createSandbox();

    const CAPTIONS_CHANGED_HEADER =  {
        version : IPC_CONFIG_CAPTIONS.version,
        namespace : IPC_CONFIG_CAPTIONS.namespace,
        name : CAPTIONS_STATE_CHANGED_EVENT_NAME
    };

    const CAPTIONS_REQUEST_HEADER =  {
        version : IPC_CONFIG_CAPTIONS.version,
        namespace : IPC_CONFIG_CAPTIONS.namespace,
        name : CAPTIONS_STATE_REQUEST_EVENT_NAME
    };

    beforeEach(() => {
        client = createMock<IClient>({ 
            sendMessage : sandbox.spy()
        });
        captionsEvent = new CaptionsEvent(client);
    });

    afterEach(() => {
        sandbox.reset();
        sandbox.restore();
    });

    it('should send the correct message when captions state is requested.', () => {
        const captionsRequestedMessage  = {
            header : CAPTIONS_REQUEST_HEADER,
            payload : {}
        };
        captionsEvent.captionsStateRequest();
        sinon.assert.calledWith(
            client.sendMessage as sinon.SinonSpy,
            captionsRequestedMessage
        );
    });

    it('should send the correct message when captions are enabled.', () => {
        const captionsEnabledPayload : ICaptionsStateChangedEventPayload = {
            enabled : true
        };
        const captionsEnabledMessage  = {
            header : CAPTIONS_CHANGED_HEADER,
            payload : captionsEnabledPayload
        };
        captionsEvent.captionsStateChanged(captionsEnabledPayload);
        sinon.assert.calledWith(
            client.sendMessage as sinon.SinonSpy,
            captionsEnabledMessage
        );
    });

    it('should send the correct message when captions are disabled.', () => {
        const captionsDisabledPayload : ICaptionsStateChangedEventPayload = {
            enabled : false
        };
        const captionsEnabledMessage  = {
            header : CAPTIONS_CHANGED_HEADER,
            payload : captionsDisabledPayload
        };
        captionsEvent.captionsStateChanged(captionsDisabledPayload);
        sinon.assert.calledWith(
            client.sendMessage as sinon.SinonSpy,
            captionsEnabledMessage
        );
    });
});