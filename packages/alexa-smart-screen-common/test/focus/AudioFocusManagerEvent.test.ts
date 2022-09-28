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
import { IClient } from '../../src/client/IClient';
import { AudioFocusManagerEvent } from '../../src/focus/ipcComponents/AudioFocusManagerEvent';
import { ILoggerFactory } from '../../src/logger/ILoggerFactory';
import { IPC_CONFIG_AUDIO_FOCUS_MANAGER } from '../../src/focus/ipcComponents/IPCNamespaceConfigAudioFocusManager';
import { ChannelName } from '../../src/focus/ChannelName';
import { AVSInterface, AVSVisualInterfaces } from '../../src/AVSInterfaces';
import { ContentType } from '../../src/focus/ContentType';
import { AUDIO_FOCUS_ACQUIRE_CHANNEL_REQUEST_EVENT_NAME, AUDIO_FOCUS_CHANGED_REPORT_EVENT_NAME, AUDIO_FOCUS_RELEASE_CHANNEL_REQUEST_EVENT_NAME } from '../../src/focus/ipcComponents/AudioFocusManagerMessageInterfaces';

describe('@alexa-smart-screen/common/focus: AudioFocusManagerEvent', () => {
    let focusEvent : AudioFocusManagerEvent;
    let loggerFactory : ILoggerFactory;
    let client : IClient;
    const sandbox : sinon.SinonSandbox = sinon.createSandbox();
    const EXPECTED_CHANNEL_NAME = ChannelName.COMMUNICATIONS;
    const EXPECTED_TOKEN = 1;
    const EXPECTED_AVS_INTERFACE : AVSInterface = AVSVisualInterfaces.ALEXA_PRESENTATION_APL;
    const EXPECTED_CONTENT_TYPE = ContentType.MIXABLE;

    const FOCUS_ACQUIRE_PAYLOAD = {
        avsInterface : EXPECTED_AVS_INTERFACE,
        contentType : EXPECTED_CONTENT_TYPE,
        token : EXPECTED_TOKEN,
        channelName : EXPECTED_CHANNEL_NAME
    };
    const FOCUS_ACQUIRE_MESSAGE = {
        header : { name : AUDIO_FOCUS_ACQUIRE_CHANNEL_REQUEST_EVENT_NAME, namespace : IPC_CONFIG_AUDIO_FOCUS_MANAGER.namespace, version : IPC_CONFIG_AUDIO_FOCUS_MANAGER.version },
        payload : FOCUS_ACQUIRE_PAYLOAD
    };
    const FOCUS_RELEASE_PAYLOAD = {
        avsInterface : EXPECTED_AVS_INTERFACE,
        token : EXPECTED_TOKEN,
        channelName : EXPECTED_CHANNEL_NAME
    };
    const FOCUS_RELEASE_MESSAGE = {
        header : { name : AUDIO_FOCUS_RELEASE_CHANNEL_REQUEST_EVENT_NAME, namespace : IPC_CONFIG_AUDIO_FOCUS_MANAGER.namespace, version : IPC_CONFIG_AUDIO_FOCUS_MANAGER.version },
        payload : FOCUS_RELEASE_PAYLOAD
    };
    const ON_FOCUS_CHANGED_PAYLOAD = {
        token : EXPECTED_TOKEN
    };
    const ON_FOCUS_CHANGED_MESSAGE = {
        header : { name : AUDIO_FOCUS_CHANGED_REPORT_EVENT_NAME, namespace : IPC_CONFIG_AUDIO_FOCUS_MANAGER.namespace, version : IPC_CONFIG_AUDIO_FOCUS_MANAGER.version },
        payload : ON_FOCUS_CHANGED_PAYLOAD
    };

    beforeEach(() => {
        client = createMock<IClient>({
            sendMessage : sandbox.spy()
        });
        loggerFactory = createMock<ILoggerFactory>();
        focusEvent = new AudioFocusManagerEvent(client, loggerFactory);
    });

    afterEach(() => {
        sandbox.reset();
        sandbox.restore();
    });

    it('should verify that the correct arguments are forwarded by the client once the request for acquiring focus is executed', () => {
        focusEvent.acquireChannelRequest(EXPECTED_TOKEN, EXPECTED_AVS_INTERFACE, EXPECTED_CHANNEL_NAME, EXPECTED_CONTENT_TYPE);
        sinon.assert.calledWith(
            client.sendMessage as sinon.SinonSpy,
            FOCUS_ACQUIRE_MESSAGE
        );
    });

    it('should verify that the correct arguments are forwarded by the client once the request for releasing focus is executed', () => {
        focusEvent.releaseChannelRequest(EXPECTED_TOKEN, EXPECTED_AVS_INTERFACE, EXPECTED_CHANNEL_NAME);
        sinon.assert.calledWith(
            client.sendMessage as sinon.SinonSpy,
            FOCUS_RELEASE_MESSAGE
        );
    });

    it('should verify that the correct arguments are forwarded by the client when focus is changed', () => {
        focusEvent.focusChangedReport(EXPECTED_TOKEN);
        sinon.assert.calledWith(
            client.sendMessage as sinon.SinonSpy,
            ON_FOCUS_CHANGED_MESSAGE
        );
    });
});