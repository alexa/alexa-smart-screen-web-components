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

import { ErrorResponseType } from './ErrorResponseType';
import { IEventHeader } from '../IHeader';
import { IClient } from '../../client/IClient';
import { EventBuilder } from '../EventBuilder';
import { IIPCNamespaceConfig, IIPCNamespaceConfigProvider } from '../IIPCNamespaceConfigProvider';

/**
 * An event that needs to be sent to the SDK
 * @instance header Header Message
 * @instance payload Generic payload message for the specific namespace
 */
export interface IEvent {
  header : IEventHeader;
  payload : any;
}

/**
 * Any error event that needs to be sent to the SDK
 * @instance type Type of error
 * @instance payload Generic payload message for the specific error
 */
export interface IErrorPayload {
  type : ErrorResponseType;
  payload : any;
}

export abstract class EventHandler implements IIPCNamespaceConfigProvider {

  protected client : IClient;
  protected ipcNamespaceConfig : IIPCNamespaceConfig;

  constructor(client : IClient, config : IIPCNamespaceConfig) {
    this.client = client;
    this.ipcNamespaceConfig = config;
  }

  /**
   * Using the IClient IPC this will transmit the message from any EventHandler class.
   * @param name function name that made the response event.
   * @param event the Event message for the response event.
   */
  protected sendResponseEvent(name : string, payload : any) : void {
    const message = EventBuilder.constructEvent(this.ipcNamespaceConfig.version, this.ipcNamespaceConfig.namespace, name, payload);
    this.client.sendMessage(message);
  }

  /**
   * Send an ErrorResponse event.
   * @param errorType the error type.
   * @param errorMessage a string containing the error message.
   */
  protected sendErrorResponseEvent(name : string, type : ErrorResponseType, payload : any) : void {
    const message =
      EventBuilder.constructErrorEvent(this.ipcNamespaceConfig.version, this.ipcNamespaceConfig.namespace, name, type, payload);
    this.client.sendMessage(message);
  }

  /**
   * Get the IPC Namespace configuration associated with event handler
   * @returns IPC namespace config
   */
  public getIPCNamespaceConfig() : IIPCNamespaceConfig {
    return this.ipcNamespaceConfig;
  }
}
