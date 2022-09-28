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

import { IClient, EventHandler } from '@alexa-smart-screen/common';
import { ICaptionsStateChangedEventPayload, CAPTIONS_STATE_CHANGED_EVENT_NAME, CAPTIONS_STATE_REQUEST_EVENT_NAME } from './CaptionsMessageInterfaces';
import { ICaptionsEvent } from './ICaptionsEvent';
import { IPC_CONFIG_CAPTIONS } from './IPCNamespaceConfigCaptions';
 
export class CaptionsEvent extends EventHandler implements ICaptionsEvent {

  constructor(client : IClient) {
    super(client, IPC_CONFIG_CAPTIONS);
  }

  /**
   * Method to send a captionsStateChanged message to the client
   * 
   * @param payload the ICaptionsStateChangedEventPayload to send
   */
  public captionsStateChanged(payload : ICaptionsStateChangedEventPayload) : void {
    this.sendResponseEvent(CAPTIONS_STATE_CHANGED_EVENT_NAME, payload);
  }

  /**
   * Method to send a captionsStateRequest message to the client
   */
  public captionsStateRequest() : void {
    this.sendResponseEvent(CAPTIONS_STATE_REQUEST_EVENT_NAME, {});
  }
}
