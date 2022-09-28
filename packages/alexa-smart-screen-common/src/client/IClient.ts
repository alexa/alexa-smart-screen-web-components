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

import { IEvent } from '../message/Event/EventHandler';
import { IClientListener } from './IClientListener';

/**
 * IPC Client Configuration
 * @instance host Host URL
 * @instance port Port for IPC connection
 * @instance insecure Security
 */
export interface IClientConfig {
  host : string;
  port : number;
  insecure : boolean;
}

/**
 * IPC Client Interface
 */
export interface IClient extends IClientListener {
  /**
   * Connect to server.
   */
  connect() : void;

  /**
   * Disconnect from server.
   */
  disconnect() : void;

  /**
   * Send message using current client.
   * @param message message to send.
   */
  sendMessage(message : IEvent) : void;

  /**
   * Client state. true if connected, false otherwise.
   */
  isConnected : boolean;

}
