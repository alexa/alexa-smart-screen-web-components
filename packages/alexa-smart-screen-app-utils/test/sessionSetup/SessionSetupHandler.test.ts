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
import { IClient, ILoggerFactory, INamespaceVersionPayload, IVersionManager, MIN_SUPPORTED_ACSDK_IPC_FRAMEWORK_VERSION } from '@alexa-smart-screen/common';
import { IClientConfigRequestEventPayload, IClientInitializedEventPayload, IConfigureClientDirectivePayload, IInitClientDirectivePayload, SESSION_SETUP_CLIENT_CONFIG_REQUEST_EVENT_NAME, SESSION_SETUP_CLIENT_INIT_EVENT_NAME, SESSION_SETUP_NAMESPACE_VERSIONS_REPORT_EVENT_NAME } from '../../src/sessionSetup/ipcComponents/SessionSetupMessageInterfaces';
import { TestSessionSetupHandler } from './TestSessionSetupHandler';
import { ISessionSetupObserver } from '../../src/sessionSetup/observers/ISessionSetupObserver';
import { SessionSetupEvent } from '../../src/sessionSetup/ipcComponents/SessionSetupEvent';

describe('@alexa-smart-screen/app-utils - SessionSetupHandler', () => {
    let loggerFactory : ILoggerFactory;
    let client : IClient;
    let versionManager : IVersionManager;
    let sessionSetupObserver : ISessionSetupObserver;
    let testSessionSetupHandler : TestSessionSetupHandler;
    const ipcVersionValue : number = parseInt(MIN_SUPPORTED_ACSDK_IPC_FRAMEWORK_VERSION.split('.').join(''));

    const NAMESPACE_VERSIONS_REPORT_PAYLOAD : INamespaceVersionPayload = {
        entries : []
    };

    const CLIENT_CONFIG_REQUEST_PAYLOAD : IClientConfigRequestEventPayload = {};

    const CLIENT_INIT_SUPPORTED_PAYLOAD : IClientInitializedEventPayload = {
        isIPCVersionSupported : true
    };

    const CLIENT_INIT_UNSUPPORTED_PAYLOAD : IClientInitializedEventPayload = {
        isIPCVersionSupported : false
    };

    const sandbox : sinon.SinonSandbox = sinon.createSandbox();
    let sendEventMessageSpy : sinon.SinonSpy;

    beforeEach(() => {
        sessionSetupObserver = createMock<ISessionSetupObserver>({
            onConfigureClient : sandbox.spy(),
            onInitializeClient : sandbox.spy()
        });
        loggerFactory = createMock<ILoggerFactory>();
        client = createMock<IClient>({
            sendMessage : sandbox.spy()
        });
        versionManager = createMock<IVersionManager>();

        sendEventMessageSpy = sandbox.spy(SessionSetupEvent.prototype, <any>'sendResponseEvent');

        testSessionSetupHandler = new TestSessionSetupHandler(client, loggerFactory, versionManager);
    });

    afterEach(() => {
        sandbox.reset();
        sandbox.restore();
    });

    it('should verify that the session setup observer is notified of client initialization directive when IPC framework version is current and supported', () => {
        testSessionSetupHandler.getObserverManager().addObserver(sessionSetupObserver);
        const payload : IInitClientDirectivePayload = {
            ipcVersion : MIN_SUPPORTED_ACSDK_IPC_FRAMEWORK_VERSION
        }
        testSessionSetupHandler.initializeClient(payload);

        sandbox.assert.calledWith(
            sessionSetupObserver.onInitializeClient as sinon.SinonSpy,
            MIN_SUPPORTED_ACSDK_IPC_FRAMEWORK_VERSION,
            true
        );

        sandbox.assert.calledThrice(sendEventMessageSpy);
        sandbox.assert.calledWithExactly(sendEventMessageSpy.getCall(0),
            SESSION_SETUP_CLIENT_INIT_EVENT_NAME,
            CLIENT_INIT_SUPPORTED_PAYLOAD
        );
        sandbox.assert.calledWithExactly(sendEventMessageSpy.getCall(1),
            SESSION_SETUP_NAMESPACE_VERSIONS_REPORT_EVENT_NAME,
            NAMESPACE_VERSIONS_REPORT_PAYLOAD
        );
        sandbox.assert.calledWithExactly(sendEventMessageSpy.getCall(2),
            SESSION_SETUP_CLIENT_CONFIG_REQUEST_EVENT_NAME,
            CLIENT_CONFIG_REQUEST_PAYLOAD
        );
    });

    it('should verify that the session setup observer is notified of client initialization directive with supported IPC framework version when newer than min supported version', () => {
        testSessionSetupHandler.getObserverManager().addObserver(sessionSetupObserver);
        const ipcVersion = (ipcVersionValue + 1).toString().split('').join('.');
        const payload : IInitClientDirectivePayload = {
            ipcVersion 
        }
        testSessionSetupHandler.initializeClient(payload);
        sinon.assert.calledWith(
            sessionSetupObserver.onInitializeClient as sinon.SinonSpy,
            ipcVersion,
            true
        );
        
        sandbox.assert.calledThrice(sendEventMessageSpy);
        sandbox.assert.calledWithExactly(sendEventMessageSpy.getCall(0),
            SESSION_SETUP_CLIENT_INIT_EVENT_NAME,
            CLIENT_INIT_SUPPORTED_PAYLOAD
        );
        sandbox.assert.calledWithExactly(sendEventMessageSpy.getCall(1),
            SESSION_SETUP_NAMESPACE_VERSIONS_REPORT_EVENT_NAME,
            NAMESPACE_VERSIONS_REPORT_PAYLOAD
        );
        sandbox.assert.calledWithExactly(sendEventMessageSpy.getCall(2),
            SESSION_SETUP_CLIENT_CONFIG_REQUEST_EVENT_NAME,
            CLIENT_CONFIG_REQUEST_PAYLOAD
        );
    });

    it('should verify that the session setup observer is notified of client initialization directive with unsupported IPC framework version when older than min supported version', () => {
        testSessionSetupHandler.getObserverManager().addObserver(sessionSetupObserver);
        const olderIPCVersion = ipcVersionValue - 1;
        let oldIPCVersionString = olderIPCVersion.toString();
        if (olderIPCVersion < 100) {
            oldIPCVersionString = `0${oldIPCVersionString}`;
        }
        const ipcVersion = oldIPCVersionString.split('').join('.');
        const payload : IInitClientDirectivePayload = {
            ipcVersion
        }
        testSessionSetupHandler.initializeClient(payload);
        sandbox.assert.calledWith(
            sessionSetupObserver.onInitializeClient as sinon.SinonSpy,
            ipcVersion,
            false
        );
        
        sandbox.assert.calledOnceWithExactly(sendEventMessageSpy,
            SESSION_SETUP_CLIENT_INIT_EVENT_NAME,
            CLIENT_INIT_UNSUPPORTED_PAYLOAD
        );
    });

    it('should verify that the session setup observer is notified when the configureClient directive is received', () => {
        testSessionSetupHandler.getObserverManager().addObserver(sessionSetupObserver);    
        const payload : IConfigureClientDirectivePayload = {};

        testSessionSetupHandler.configureClient(payload);
        sandbox.assert.calledWith(
            sessionSetupObserver.onConfigureClient as sinon.SinonSpy,
            payload
        );
    });
});