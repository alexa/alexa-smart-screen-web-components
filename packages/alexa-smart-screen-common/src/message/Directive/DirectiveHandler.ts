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

import { ILogger } from '../../logger/ILogger';
import { LoggerParamsBuilder } from '../../logger/LoggerParamsBuilder';
import { IDirective, IDirectiveHandler } from './IDirectiveHandler';
import { IIPCNamespaceConfig, IIPCNamespaceConfigProvider } from '../IIPCNamespaceConfigProvider';

export abstract class DirectiveHandler implements IDirectiveHandler, IIPCNamespaceConfigProvider {
  protected static readonly CLASS_NAME : string = 'DirectiveHandler';
  protected logger : ILogger;

  constructor(logger : ILogger) {
    this.logger = logger;
  }

  protected static getLoggerParamsBuilder() : LoggerParamsBuilder {
    return new LoggerParamsBuilder().setClassName(DirectiveHandler.CLASS_NAME);
  }

  protected succeeded : () => void = () => { 
    // do nothing by default
  };

  protected failed : () => void = () => {
    // do nothing by default
  };

  public abstract getIPCNamespaceConfig() : IIPCNamespaceConfig;

  /**
   * Any directive that come from the core SDK will be handled by a class that implements this interface.
   * Once a directive is received from the SDK it will be rerouted to the corresponding class that will
   * handle the messsage.
   * DirectiveHandler will calls the succeeded() once sucessfullly completed. If handling of this directive
   * fails such that subsequent directives with the same payload should be cancelled, this DirectiveHandler
   * should also call failed() to indicate a failure.
   *
   * @param directive The directive payload that will be handled by the class.
   */
  public handleDirective(directive : IDirective) : void {
    const functionName = 'handleDirective';
    this.logger.info(DirectiveHandler.getLoggerParamsBuilder()
                      .setFunctionName(functionName)
                      .setArg('namespace', directive.header.namespace)
                      .setArg('name', directive.header.name)
                      .build());
    const name = directive.header.name;
    if (typeof (this as any)[name] === 'function') {
      (this as any)[name](directive.payload);
      this.succeeded();
    } else {
      this.logger.error(DirectiveHandler.getLoggerParamsBuilder()
                        .setFunctionName(functionName)
                        .setMessage(`${name} does not exist on ${directive.header.namespace}`)
                        .build());
      this.failed();
    }
  }

}
