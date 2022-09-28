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

import { IClient, EventHandler, IVersionManager, INamespaceVersionEntry, INamespaceVersionPayload } from '@alexa-smart-screen/common';
import { IPC_CONFIG_SESSION_SETUP } from './IPCNamespaceConfigSessionSetup';
import { ISessionSetupEvent } from './ISessionSetupEvent';
import { IClientConfigRequestEventPayload, IClientInitializedEventPayload, SESSION_SETUP_CLIENT_CONFIG_REQUEST_EVENT_NAME, SESSION_SETUP_CLIENT_INIT_EVENT_NAME, SESSION_SETUP_NAMESPACE_VERSIONS_REPORT_EVENT_NAME } from './SessionSetupMessageInterfaces';

export class SessionSetupEvent extends EventHandler implements ISessionSetupEvent {

  private versionManager : IVersionManager;

  constructor(client : IClient, versionManager : IVersionManager) {
    super(client, IPC_CONFIG_SESSION_SETUP);

    this.versionManager = versionManager;
  }

  /**
   * Method to send the namespaceVersionsReport event to the client.
   */
  public namespaceVersionsReport() : void {
    const entries : INamespaceVersionEntry[] = this.versionManager.getNamespaceVersionEntries();
    const payload : INamespaceVersionPayload = {
      entries
    };
    this.sendResponseEvent(SESSION_SETUP_NAMESPACE_VERSIONS_REPORT_EVENT_NAME, payload);
  }

  /**
   * Method to send the clientInitialized event to the client.
   * 
   * @param {boolean} isIPCVersionSupported True if this client supports the requesting ACSDK IPC Framework version.
   */
  public clientInitialized(isIPCVersionSupported : boolean) : void {
    const payload : IClientInitializedEventPayload = {
      isIPCVersionSupported
    };
    this.sendResponseEvent(SESSION_SETUP_CLIENT_INIT_EVENT_NAME, payload);
  }

  /**
   * Method to send the clientConfigRequest event to the client.
   */
  public clientConfigRequest() : void {
    const payload : IClientConfigRequestEventPayload = {};
    this.sendResponseEvent(SESSION_SETUP_CLIENT_CONFIG_REQUEST_EVENT_NAME, payload);
  }
}
