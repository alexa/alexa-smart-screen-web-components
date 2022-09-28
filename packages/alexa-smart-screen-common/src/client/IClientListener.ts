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

import { IDirective } from '../message/Directive/IDirectiveHandler';

/**
 * Call back definition to handle all incoming message
 */
export interface IOnMessageFunc {
  (message : IDirective) : void;
}

/**
 * Called when client receives a message
 */
export interface IClientListener {
  /**
   * Will be called when the connection is opened.
   */
  onConnect : () => void;
  
  /**
   * Will be called when an error occurs.
   */
  onError : (event : Event) => void;

  /**
   * Will be called when a message is received from the server.
   */
  onMessage : IOnMessageFunc;

  /**
   * Will be called when the connection is closed.
   */
  onDisconnect : () => void;
}
