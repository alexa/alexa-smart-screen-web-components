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
import { AudioInputInitiator, GUIActivityState, IClient, IEvent } from '@alexa-smart-screen/common';
import { InteractionManagerEvent } from '../../src/interactionManager/ipcComponents/InteractionManagerEvent';
import { NavigationEvent } from '../../src/interactionManager/constants/NavigationEvent';
import { IPC_CONFIG_INTERACTION_MANAGER } from '../../src/interactionManager/ipcComponents/IPCNamespaceConfigInteractionManager';
import { INTERACTION_MANAGER_GUI_ACTIVITY_EVENT_NAME, INTERACTION_MANAGER_NAVIGATION_EVENT_NAME, INTERACTION_MANAGER_RECOGNIZE_SPEECH_REQUEST_EVENT_NAME } from '../../src/interactionManager/ipcComponents/InteractionManagerInterfaces';
import { RecognizeSpeechCaptureState } from '../../src/interactionManager/constants/RecognizeSpeechCaptureState';

describe('@alexa-smart-screen/app-utils - InteractionManagerEvent', () => {
    let interactionManagerEvent : InteractionManagerEvent;
    let client : IClient;

    const sandbox : sinon.SinonSandbox = sinon.createSandbox();

    const GUI_ACTIVITY_EVENT_HEADER = {
        namespace : IPC_CONFIG_INTERACTION_MANAGER.namespace, 
        version : IPC_CONFIG_INTERACTION_MANAGER.version,
        name : INTERACTION_MANAGER_GUI_ACTIVITY_EVENT_NAME
    };

    const GUI_ACTIVATED_MESSAGE : IEvent = {
        header : GUI_ACTIVITY_EVENT_HEADER,
        payload : {event : GUIActivityState.ACTIVATED}
    };

    const GUI_DEACTIVATED_MESSAGE : IEvent = {
        header : GUI_ACTIVITY_EVENT_HEADER,
        payload : {event : GUIActivityState.DEACTIVATED}
    };

    const RECOGNIZE_SPEECH_REQUEST_EVENT_HEADER =  {
        version : IPC_CONFIG_INTERACTION_MANAGER.version,
        namespace : IPC_CONFIG_INTERACTION_MANAGER.namespace,
        name : INTERACTION_MANAGER_RECOGNIZE_SPEECH_REQUEST_EVENT_NAME
    };

    const PRESS_AND_HOLD_START_MESSAGE : IEvent  = {
        header : RECOGNIZE_SPEECH_REQUEST_EVENT_HEADER,
        payload : { initiatorType : AudioInputInitiator.PRESS_AND_HOLD, captureState : RecognizeSpeechCaptureState.START }
    };

    const PRESS_AND_HOLD_STOP_MESSAGE : IEvent  = {
        header : RECOGNIZE_SPEECH_REQUEST_EVENT_HEADER,
        payload : { initiatorType : AudioInputInitiator.PRESS_AND_HOLD, captureState : RecognizeSpeechCaptureState.STOP }
    };

    const TAP_TO_TALK_MESSAGE : IEvent  = {
        header : RECOGNIZE_SPEECH_REQUEST_EVENT_HEADER,
        payload : { initiatorType : AudioInputInitiator.TAP, captureState : RecognizeSpeechCaptureState.START }
    };

    const NAV_HEADER =  {
        version : IPC_CONFIG_INTERACTION_MANAGER.version,
        namespace : IPC_CONFIG_INTERACTION_MANAGER.namespace,
        name : INTERACTION_MANAGER_NAVIGATION_EVENT_NAME
    };

    const NAV_BACK_MESSAGE : IEvent = {
        header : NAV_HEADER,
        payload : { event : NavigationEvent.BACK }
    };

    const NAV_EXIT_MESSAGE : IEvent = {
        header : NAV_HEADER,
        payload : { event : NavigationEvent.EXIT }
    };


    beforeEach(() => {
        client = createMock<IClient>({ 
            sendMessage : sandbox.spy()
        });
        interactionManagerEvent = new InteractionManagerEvent(client);
    });

    afterEach(() => {
        sandbox.reset();
        sandbox.restore();
    });

    it('should verify event payloads via IClient interface when guiActivityEvent is called in ACTIVATED state', () => {
        interactionManagerEvent.guiActivityEvent(GUIActivityState.ACTIVATED);
        sinon.assert.calledWith(
            client.sendMessage as sinon.SinonSpy,
            GUI_ACTIVATED_MESSAGE
        );
    });

    it('should verify event payloads via IClient when guiActivityEvent is called in DEACTIVATED state', () => {
        interactionManagerEvent.guiActivityEvent(GUIActivityState.DEACTIVATED);
        sinon.assert.calledWith(
            client.sendMessage as sinon.SinonSpy,
            GUI_DEACTIVATED_MESSAGE
        );
    });

    it('should verify the message to client with initiator type PRESS_AND_HOLD, and capture state START', () => {
        interactionManagerEvent.recognizeSpeechRequestEvent(AudioInputInitiator.PRESS_AND_HOLD, RecognizeSpeechCaptureState.START);
        sinon.assert.calledWith(
            client.sendMessage as sinon.SinonSpy,
            PRESS_AND_HOLD_START_MESSAGE
        );
    });

    it('should verify the message to client with initiator type PRESS_AND_HOLD, and capture state STOP', () => {
        interactionManagerEvent.recognizeSpeechRequestEvent(AudioInputInitiator.PRESS_AND_HOLD, RecognizeSpeechCaptureState.STOP);
        sinon.assert.calledWith(
            client.sendMessage as sinon.SinonSpy,
            PRESS_AND_HOLD_STOP_MESSAGE
        );
    });

    it('should verify the message to client with initiator type TAP, and capture state START', () => {
        interactionManagerEvent.recognizeSpeechRequestEvent(AudioInputInitiator.TAP, RecognizeSpeechCaptureState.START);
        sinon.assert.calledWith(
            client.sendMessage as sinon.SinonSpy,
            TAP_TO_TALK_MESSAGE
        );
    });

    it('should verify that no message is sent to client when initiator type = WAKEWORD', () => {
        interactionManagerEvent.recognizeSpeechRequestEvent(AudioInputInitiator.WAKEWORD, RecognizeSpeechCaptureState.START);
        sinon.assert.notCalled(
            client.sendMessage as sinon.SinonSpy,
        );
    });

    it('should verify the message to client when NavigationEvent = BACK', () => {
        interactionManagerEvent.navigationEvent(NavigationEvent.BACK);
        sinon.assert.calledWith(
            client.sendMessage as sinon.SinonSpy,
            NAV_BACK_MESSAGE
        );
    });

    it('should verify the message to client when NavigationEvent = EXIT', () => {
        interactionManagerEvent.navigationEvent(NavigationEvent.EXIT);
        sinon.assert.calledWith(
            client.sendMessage as sinon.SinonSpy,
            NAV_EXIT_MESSAGE
        );
    });
});