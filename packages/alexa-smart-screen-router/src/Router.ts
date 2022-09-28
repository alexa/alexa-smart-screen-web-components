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

import { IRouter } from './IRouter';
import { IDirective, DirectiveHandler, IDirectiveHeader, ILoggerFactory, ILogger, LoggerParamsBuilder, IVersionManager } from '@alexa-smart-screen/common';
import { LOGGER_ID_ROUTER } from './utils/constants';

const CHAR_ALLOWED = RegExp('[^A-Za-z]');

export class Router implements IRouter {
  protected static readonly CLASS_NAME = 'Router';
  // namespace-version -> handler
  private supportedNamespace = new Map<string, DirectiveHandler>();
  private logger : ILogger;
  private versionManager : IVersionManager;

  constructor(loggerFactory : ILoggerFactory, versionManager : IVersionManager) {
    this.logger = loggerFactory.getLogger(LOGGER_ID_ROUTER);
    this.versionManager = versionManager;
  }

  protected static getLoggerParamsBuilder() : LoggerParamsBuilder {
    return new LoggerParamsBuilder().setClassName(Router.CLASS_NAME);
  }

  /**
   * Register the handler that the Web Component will support
   * @param handler The handler containing the namespace to be registered
   */
  public addNamespace(handler : DirectiveHandler) : void {
    const functionName = 'addNamespace';
    const config = handler.getIPCNamespaceConfig();
    if (CHAR_ALLOWED.test(config.namespace)) {
      this.logger.error(Router.getLoggerParamsBuilder()
                          .setFunctionName(functionName)
                          .setMessage('Invalid characters found within the namespace. Namespace was ignored.')
                          .build());
      return;
    }
    this.supportedNamespace.set(config.namespace, handler);
    this.versionManager.addNamespaceVersionEntry(config.version, config.namespace);
  }

  /**
   * Remove namespace with any version.
   * @param namespace The namespace to be removed.
   */
  public removeNamespace(namespace : string) : void {
    const functionName = 'removeNamespace';
    const found  = this.supportedNamespace.has(namespace);
    if(found) {
      this.supportedNamespace.delete(namespace);
      this.versionManager.removeNamespaceVersionEntry(namespace);
    }    

    !found && this.logger.warn(Router.getLoggerParamsBuilder()
                                .setFunctionName(functionName)
                                .setMessage(`Did not find any namespace of ${namespace} within the handler.`)
                                .build());
  }

  /**
   * Return if the router can handle the given directive.
   * @param directive Directive from SDK
   */
  public canHandle(directive : IDirective) : boolean {
    const header : IDirectiveHeader = directive.header;
    const version : number = header.version;
    const namespace : string = header.namespace;
    return this.supportedNamespace.has(namespace) && this.versionManager.validateNamespaceVersion(namespace, version);
  }

  /**
   * Return all the supported handlers on this component
   */
  public get handler() : Map<string, DirectiveHandler> {
    return this.supportedNamespace;
  }

  /**
   * Reroute the directive from SDK to their corresponding Class and call handleDirective(),
   * if it's in the supported namespace and with correct version.
   * @param directive Directive from SDK
   */
  public handleDirective(directive : IDirective) : void {
    const functionName = 'handleDirective';
    const header : IDirectiveHeader = directive.header;
    const namespace : string = header.namespace;

    if (this.supportedNamespace.has(namespace)) {
      const supportedHandler = this.supportedNamespace.get(namespace);
      supportedHandler.handleDirective(directive);
    } else {
      this.logger.warn(Router.getLoggerParamsBuilder()
                        .setFunctionName(functionName)
                        .setMessage(`${namespace} is not registered. Discarding ${JSON.stringify(directive)}.`)
                        .build());
    }
  }
}
