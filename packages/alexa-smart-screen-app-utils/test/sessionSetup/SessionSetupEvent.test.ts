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

import * as sinon from "sinon";
import { createMock } from 'ts-auto-mock';

import {
  IVersionManager,
  INamespaceVersionEntry,
  IClient,
  IEvent
} from "@alexa-smart-screen/common";

import { SessionSetupEvent } from "../../src/sessionSetup/ipcComponents/SessionSetupEvent";
import { SESSION_SETUP_CLIENT_CONFIG_REQUEST_EVENT_NAME, SESSION_SETUP_CLIENT_INIT_EVENT_NAME, SESSION_SETUP_NAMESPACE_VERSIONS_REPORT_EVENT_NAME } from "../../src/sessionSetup/ipcComponents/SessionSetupMessageInterfaces";
import { IPC_CONFIG_SESSION_SETUP } from "../../src/sessionSetup/ipcComponents/IPCNamespaceConfigSessionSetup";

describe("@alexa-smart-screen/app-utils - SessionSetupEvent", () => {
  let versionManager : IVersionManager;
  let sessionSetupEvent : SessionSetupEvent;
  let client : IClient;

  const nsVersionEntryA : INamespaceVersionEntry = {namespace : "A", version : 1};
  const nsVersionEntryB : INamespaceVersionEntry = {namespace : "B", version : 2};

  const NAMESPACE_VERSIONS_REPORT_MESSAGE : IEvent = {
    header : { name : SESSION_SETUP_NAMESPACE_VERSIONS_REPORT_EVENT_NAME, namespace : IPC_CONFIG_SESSION_SETUP.namespace, version : IPC_CONFIG_SESSION_SETUP.version },
    payload : { entries : [nsVersionEntryA, nsVersionEntryB] }
  };

  const CLIENT_CONFIG_REQUEST_MESSAGE : IEvent = {
    header : { name : SESSION_SETUP_CLIENT_CONFIG_REQUEST_EVENT_NAME, namespace : IPC_CONFIG_SESSION_SETUP.namespace, version : IPC_CONFIG_SESSION_SETUP.version },
    payload : {}
  };

  const CLIENT_INITIALIZED_SUPPORTED_MESSAGE : IEvent = {
    header : { name : SESSION_SETUP_CLIENT_INIT_EVENT_NAME, namespace : IPC_CONFIG_SESSION_SETUP.namespace, version : IPC_CONFIG_SESSION_SETUP.version },
    payload : {isIPCVersionSupported : true}
  };

  const CLIENT_INITIALIZED_UNSUPPORTED_MESSAGE : IEvent = {
    header : { name : SESSION_SETUP_CLIENT_INIT_EVENT_NAME, namespace : IPC_CONFIG_SESSION_SETUP.namespace, version : IPC_CONFIG_SESSION_SETUP.version },
    payload : {isIPCVersionSupported : false}
  };

  const sandbox : sinon.SinonSandbox = sinon.createSandbox();

  beforeEach(() => {
    client = createMock<IClient>({
      sendMessage : sandbox.spy()
    });
    versionManager = createMock<IVersionManager>();
    sessionSetupEvent = new SessionSetupEvent(client, versionManager);
    versionManager.getNamespaceVersionEntries = sandbox.stub().returns([nsVersionEntryA, nsVersionEntryB])
  });

  afterEach(() => {
    sandbox.reset();
    sandbox.restore();
  });

  it('should send the correct message for the clientInitialized event when IPC framework version is supported', () => {
    sessionSetupEvent.clientInitialized(true);
    sinon.assert.calledWith(
        client.sendMessage as sinon.SinonSpy,
        CLIENT_INITIALIZED_SUPPORTED_MESSAGE
    );
  });

  it('should send the correct message for the clientInitialized event when IPC framework version is NOT supported', () => {
    sessionSetupEvent.clientInitialized(false);
    sinon.assert.calledWith(
        client.sendMessage as sinon.SinonSpy,
        CLIENT_INITIALIZED_UNSUPPORTED_MESSAGE
    );
  });

  it("should send the correct message for the namespaceVersionsReport event", () => {
    sessionSetupEvent.namespaceVersionsReport();
    sinon.assert.calledWith(
      client.sendMessage as sinon.SinonSpy,
      NAMESPACE_VERSIONS_REPORT_MESSAGE
    );
  });

  it('should send the correct message for the clientConfigRequest event', () => {
    sessionSetupEvent.clientConfigRequest();
    sinon.assert.calledWith(
        client.sendMessage as sinon.SinonSpy,
        CLIENT_CONFIG_REQUEST_MESSAGE
    );
  });
});
