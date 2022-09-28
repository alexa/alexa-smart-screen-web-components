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

import { DirectiveHandler, ObserverManager, ILoggerFactory, IObserverManager, IIPCNamespaceConfig } from '@alexa-smart-screen/common';
import { IPC_CONFIG_CAPTIONS } from './IPCNamespaceConfigCaptions';
import { IRenderCaptionsPayload, ISetCaptionsStatePayload } from './CaptionsMessageInterfaces';
import { ICaptionsObserver } from '../ICaptionsObserver';
import { ICaptionsHandler } from './ICaptionsHandler';

export class CaptionsHandler extends DirectiveHandler implements ICaptionsHandler {
  private captionsObserverManager : ObserverManager<ICaptionsObserver>;

  /**
   * Constructor for CaptionsHandler.
   *
   * @param loggerFactory The logger factory to log error messages from this component to.
   */
  constructor(loggerFactory : ILoggerFactory) {
    super(loggerFactory.getLogger(IPC_CONFIG_CAPTIONS.namespace));
    this.captionsObserverManager = new ObserverManager<ICaptionsObserver>();
  }

  public getIPCNamespaceConfig() : IIPCNamespaceConfig {
    return IPC_CONFIG_CAPTIONS;
  }

  /**
   * Method to handle the renderCaptions message.
   *
   * @param payload IRenderCaptionsPayload containing render captions payload.
   */
   public renderCaptions(payload : IRenderCaptionsPayload) : void {
    this.captionsObserverManager.getObservers().forEach(
      (observer : ICaptionsObserver) => observer.onRenderCaptions(payload.captionLines, payload.duration, payload.delay)
    );
  }

  /**
   * Method to handle the setCaptionsState message.
   * 
   * @param payload ISetCaptionsStatePayload containing captions state message.
   */
  public setCaptionsState(payload : ISetCaptionsStatePayload) : void {
    this.captionsObserverManager.getObservers().forEach(
      (observer : ICaptionsObserver) => observer.onSetCaptionsState(payload.enabled)
    );
  }

  /**
   * Method to return the observer manager for this captions handler.
   * 
   * @return The caption handler's observer manager.
   */
   public getObserverManager() : IObserverManager<ICaptionsObserver> {
    return this.captionsObserverManager;
  }

}
