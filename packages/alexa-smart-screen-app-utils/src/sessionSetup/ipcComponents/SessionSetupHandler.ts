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

import { IClient, DirectiveHandler, IObserverManager, IIPCNamespaceConfig, IVersionManager, ObserverManager, ILoggerFactory, LoggerParamsBuilder, MIN_SUPPORTED_ACSDK_IPC_FRAMEWORK_VERSION, VersionTools } from '@alexa-smart-screen/common';
import { IPC_CONFIG_SESSION_SETUP } from './IPCNamespaceConfigSessionSetup';
import { ISessionSetupObserver } from '../observers/ISessionSetupObserver';
import { SessionSetupEvent } from './SessionSetupEvent';
import { IConfigureClientDirectivePayload, IInitClientDirectivePayload } from './SessionSetupMessageInterfaces';
import { ISessionSetupHandler } from './ISessionSetupHandler';

export class SessionSetupHandler extends DirectiveHandler implements ISessionSetupHandler {
  protected static readonly CLASS_NAME = 'SessionSetupHandler';
  private sessionSetupEvent : SessionSetupEvent;
  private sessionSetupObserverManager : ObserverManager<ISessionSetupObserver>;

  constructor(client : IClient, loggerFactory : ILoggerFactory, versionManager : IVersionManager) {
    super(loggerFactory.getLogger(IPC_CONFIG_SESSION_SETUP.namespace));
    this.sessionSetupEvent = new SessionSetupEvent(client, versionManager);
    this.sessionSetupObserverManager = new ObserverManager<ISessionSetupObserver>();
  }

  protected static getLoggerParamsBuilder() : LoggerParamsBuilder {
    return new LoggerParamsBuilder().setClassName(SessionSetupHandler.CLASS_NAME);
  }

  public getIPCNamespaceConfig() : IIPCNamespaceConfig {
    return IPC_CONFIG_SESSION_SETUP;
  }

  /**
   * Handles the initializeClient directive
   * @param {IInitClientDirectivePayload} payload The initializeClient directive payload
   */
  public initializeClient(payload : IInitClientDirectivePayload) : void {
    const functionName = 'configureClient';
    const ipcVersion = payload.ipcVersion;
    this.logger.debug(SessionSetupHandler.getLoggerParamsBuilder()
                        .setFunctionName(functionName)
                        .setMessage(`ACSDK IPC Framework Version: ${ipcVersion}`)
                        .build());
    const isSupportedIPCVersion : boolean = (VersionTools.compareVersions(MIN_SUPPORTED_ACSDK_IPC_FRAMEWORK_VERSION, ipcVersion)) <= 0;
    this.sessionSetupEvent.clientInitialized(isSupportedIPCVersion);
    if (isSupportedIPCVersion) {
      this.sessionSetupEvent.namespaceVersionsReport();
      this.sessionSetupEvent.clientConfigRequest();
    } else {
      this.logger.error(SessionSetupHandler.getLoggerParamsBuilder()
                          .setFunctionName(functionName)
                          .setMessage('The ACSDK IPC Framework Version is not supported by this client.')
                          .build());
    }
    this.sessionSetupObserverManager.getObservers().forEach(
      (observer : ISessionSetupObserver) => observer.onInitializeClient(ipcVersion, isSupportedIPCVersion)
    );
  }

  /**
   * Handles the configureClient directive
   * @param {IConfigureClientDirectivePayload} payload The configureClient directive payload
   */
  public configureClient(payload : IConfigureClientDirectivePayload) : void {
    this.sessionSetupObserverManager.getObservers().forEach(
      (observer : ISessionSetupObserver) => observer.onConfigureClient(payload)
    );
  }

  /**
   * Method to return the observer manager for this session setup handler.
   * 
   * @return The session setup handler's observer manager.
   */
  public getObserverManager() : IObserverManager<ISessionSetupObserver> {
    return this.sessionSetupObserverManager;
  }
}
