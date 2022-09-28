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

import { DirectiveHandler, IDoNotDisturbManager, IIPCNamespaceConfig, ILoggerFactory, LoggerParamsBuilder } from "@alexa-smart-screen/common";
import { IDNDSetStateDirectivePayload } from "./DoNotDisturbMessageInterfaces";
import { IDoNotDisturbHandler } from "./IDoNotDisturbHandler";
import { IPC_CONFIG_DO_NOT_DISTURB } from "./IPCNamespaceConfigDoNotDisturb";

export class DoNotDisturbHandler extends DirectiveHandler implements IDoNotDisturbHandler {
    protected static readonly CLASS_NAME = 'DoNotDisturbHandler';

    private doNotDisturbManager : IDoNotDisturbManager;

    constructor(loggerFactory : ILoggerFactory, doNotDisturbManager : IDoNotDisturbManager) {
        super(loggerFactory.getLogger(IPC_CONFIG_DO_NOT_DISTURB.namespace));
        this.doNotDisturbManager = doNotDisturbManager;
    }

    protected static getLoggerParamsBuilder() : LoggerParamsBuilder {
        return new LoggerParamsBuilder().setClassName(DoNotDisturbHandler.CLASS_NAME);
    }

    public getIPCNamespaceConfig() : IIPCNamespaceConfig {
        return IPC_CONFIG_DO_NOT_DISTURB;
    } 

    /**
     * Handler method for setDoNotDisturbState message.
     * 
     * @param {IDNDSetStateDirectivePayload} payload The payload of the setDoNotDisturbState directive
     */
    public setDoNotDisturbState(payload : IDNDSetStateDirectivePayload) : void {
        this.doNotDisturbManager.setDoNotDisturbState(payload.enabled);
    }
}