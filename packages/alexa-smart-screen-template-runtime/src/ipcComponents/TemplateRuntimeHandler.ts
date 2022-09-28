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

import { DirectiveHandler, ILoggerFactory, LoggerParamsBuilder, IIPCNamespaceConfig, ObserverManager, IObserverManager } from '@alexa-smart-screen/common';
import { ITemplateRuntimeObserver } from './ITemplateRuntimeObserver';
import { IClearPlayerInfoCardPayload, IRenderPlayerInfoMessagePayload } from './IRenderPlayerInfoMessagePayload';
import { IClearTemplateCardPayload, IRenderTemplateMessagePayload } from './IRenderTemplateMessagePayload';
import { IPC_CONFIG_TEMPLATE_RUNTIME } from './IPCNamespaceConfigTemplateRuntime';
import { ITemplateRuntimeHandler } from './ITemplateRuntimeHandler';

export class TemplateRuntimeHandler extends DirectiveHandler implements ITemplateRuntimeHandler {
  protected static readonly CLASS_NAME = 'TemplateRuntimeHandler';
  private templateRuntimeObserver : ObserverManager<ITemplateRuntimeObserver>;

  constructor(loggerFactory : ILoggerFactory) {
    super(loggerFactory.getLogger(IPC_CONFIG_TEMPLATE_RUNTIME.namespace));
    this.templateRuntimeObserver = new ObserverManager<ITemplateRuntimeObserver>();
  }

  protected static getLoggerParamsBuilder() : LoggerParamsBuilder {
    return new LoggerParamsBuilder().setClassName(TemplateRuntimeHandler.CLASS_NAME);
  }

  public getIPCNamespaceConfig() : IIPCNamespaceConfig {
    return IPC_CONFIG_TEMPLATE_RUNTIME;
  }

  /**
   * Method to handle renderTemplate directive
   * @param payload the IRenderTemplateMessagePayload
   */
  public renderTemplate(payload : IRenderTemplateMessagePayload) {
    this.templateRuntimeObserver.getObservers().forEach(
      (observer : ITemplateRuntimeObserver) => observer.onRenderTemplate(payload)
    );
  }

  /**
   * Method to handle renderPlayerInfo directive
   * @param payload the IRenderPlayerInfoMessagePayload
   */
  public renderPlayerInfo(payload : IRenderPlayerInfoMessagePayload) {
    this.templateRuntimeObserver.getObservers().forEach(
      (observer : ITemplateRuntimeObserver) => observer.onRenderPlayerInfo(payload)
    );
  }

  /**
   * Method to handle clearTemplateCard directive
   * @param payload the IClearTemplateCardPayload
   */
  public clearTemplateCard(payload : IClearTemplateCardPayload) {
    this.templateRuntimeObserver.getObservers().forEach(
      (observer : ITemplateRuntimeObserver) => observer.onClearTemplateCard()
    );
  }

  /**
   * Method to handle clearPlayerInfoCard directive
   * @param payload the IClearPlayerInfoCardPayload
   */
  public clearPlayerInfoCard(payload : IClearPlayerInfoCardPayload) {
    this.templateRuntimeObserver.getObservers().forEach(
      (observer : ITemplateRuntimeObserver) => observer.onClearPlayerInfoCard()
    );
  }

  /**
   * Method to return the observer manager for this template runtime handler.
   * 
   * @return The template runtime handler's observer manager.
   */
   public getObserverManager() : IObserverManager<ITemplateRuntimeObserver> {
    return this.templateRuntimeObserver;
  }
}
