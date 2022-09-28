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

import { ILoggerFactory } from '../../src/logger/ILoggerFactory';
import { IWindowManager } from '../../src/window/IWindowManager';
import { WindowManagerHandler } from '../../src/window/ipcComponents/WindowManagerHandler';
import { IClearWindowDirectivePayload, ISetVisualCharacteristicsDirectivePayload } from '../../src/window/ipcComponents/WindowManagerMessageInterfaces';
import { IIPCNamespaceConfig } from '../../src/message/IIPCNamespaceConfigProvider';

export class TestWindowManagerHandler extends WindowManagerHandler {
    constructor(windowManager : IWindowManager, loggerFactory : ILoggerFactory) {
        super(windowManager, loggerFactory);
    }

    public override getIPCNamespaceConfig() : IIPCNamespaceConfig {
        return super.getIPCNamespaceConfig();
    }

    public override setVisualCharacteristics(payload : ISetVisualCharacteristicsDirectivePayload) : void {
        super.setVisualCharacteristics(payload);
    }

    public override async clearWindow(payload : IClearWindowDirectivePayload) : Promise<void> {
        super.clearWindow(payload);
    }
}