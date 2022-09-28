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

import { ILoggerFactory } from '../../logger/ILoggerFactory';
import { DirectiveHandler } from '../../message/Directive/DirectiveHandler';
import { AudioFocusManagerEvent } from './AudioFocusManagerEvent';
import { IProcessChannelResultDirectivePayload, IProcessFocusChangedDirectivePayload } from './AudioFocusManagerMessageInterfaces';
import { IIPCNamespaceConfig } from '../../message/IIPCNamespaceConfigProvider';
import { IPC_CONFIG_AUDIO_FOCUS_MANAGER } from './IPCNamespaceConfigAudioFocusManager';
import { IAudioFocusManagerHandler } from './IAudioFocusManagerHandler';
 
export class AudioFocusManagerHandler extends DirectiveHandler implements IAudioFocusManagerHandler {
  private focusEvent : AudioFocusManagerEvent;

  constructor(focusEvent : AudioFocusManagerEvent, loggerFactory : ILoggerFactory) {
    super(loggerFactory.getLogger(IPC_CONFIG_AUDIO_FOCUS_MANAGER.namespace));
    this.focusEvent = focusEvent;
  }

  public getIPCNamespaceConfig() : IIPCNamespaceConfig {
    return IPC_CONFIG_AUDIO_FOCUS_MANAGER;
  }

  /**
   * Method that handles the processChannelResult directive.
   * 
   * @param payload The IProcessChannelResultDirectivePayload
   */
  public processChannelResult(payload : IProcessChannelResultDirectivePayload) : void {
    this.focusEvent.focusManager.processFocusResponse(payload.token, payload.result);
  } 

  /**
   * Method that handles the processFocusChanged directive.
   * 
   * @param payload The IProcessFocusChangedDirectivePayload
   */
  public processFocusChanged(payload : IProcessFocusChangedDirectivePayload) : void {
    // Notify client of receipt of directive
    this.focusEvent.focusChangedReport(payload.token);
    this.focusEvent.focusManager.processFocusChanged(payload.token, payload.focusState);
  }
}
