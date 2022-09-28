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

import { ILoggerFactory, LoggerParamsBuilder, ILogger, IVersionManager, INamespaceVersionEntry } from '@alexa-smart-screen/common';
import { IPC_CONFIG_SESSION_SETUP } from '../sessionSetup/ipcComponents/IPCNamespaceConfigSessionSetup';

export class VersionManager implements IVersionManager {
  protected static readonly CLASS_NAME = 'VersionManager';
  private logger : ILogger;
  private namespaceVersionEntries : Map<string, number>;

  constructor(loggerFactory : ILoggerFactory) {
    this.logger = loggerFactory.getLogger(IPC_CONFIG_SESSION_SETUP.namespace);
    this.namespaceVersionEntries = new Map<string, number>();
  }

  protected static getLoggerParamsBuilder() : LoggerParamsBuilder {
    return new LoggerParamsBuilder().setClassName(VersionManager.CLASS_NAME);
  }

  public addNamespaceVersionEntry(version : number, namespace : string) : void {
    const functionName = 'addNamespaceVersionEntry';
    this.logger.debug(VersionManager.getLoggerParamsBuilder()
                      .setFunctionName(functionName)
                      .setArg('namespace', namespace)
                      .setArg('version', version)
                      .build());

    this.namespaceVersionEntries.set(namespace, version);
  }

  public removeNamespaceVersionEntry(namespace : string) : void {
    const functionName = 'removeNamespaceVersionEntry';
    this.logger.debug(VersionManager.getLoggerParamsBuilder()
                      .setFunctionName(functionName)
                      .setArg('namespace', namespace)
                      .build());
    
    this.namespaceVersionEntries.delete(namespace);
  }

  public validateNamespaceVersion(namespace : string, version : number) : boolean {
    const functionName = 'validateNamespaceVersion';
    this.logger.debug(VersionManager.getLoggerParamsBuilder()
                      .setFunctionName(functionName)
                      .setArg('namespace', namespace)
                      .setArg('server version', version)
                      .setArg('client version', this.namespaceVersionEntries.get(namespace))
                      .build());

    return this.namespaceVersionEntries.get(namespace) === version;
  }

  public getNamespaceVersionEntries() : INamespaceVersionEntry[] {
    const namespaceVersionArray = Array.from(this.namespaceVersionEntries, ([namespace, version]) => ({ namespace, version }));
    return namespaceVersionArray;
  }
}
