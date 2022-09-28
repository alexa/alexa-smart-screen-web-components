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

import { ILoggerFactory } from "logger/ILoggerFactory";
import { IVisualCharacteristicsObserver } from "../../visualCharacteristics/IVisualCharacteristicsObserver";
import { IObserverManager } from "../../observers/IObserverManager";
import { ObserverManager } from "../../observers/ObserverManager";
import { DirectiveHandler } from "../../message/Directive/DirectiveHandler";
import { IClearWindowDirectivePayload, ISetVisualCharacteristicsDirectivePayload } from "./WindowManagerMessageInterfaces";
import { VisualCharacteristicsManager } from "../../visualCharacteristics/VisualCharacteristicsManager";
import { IWindowManagerHandler } from "./IWindowManagerHandler";
import { IIPCNamespaceConfig } from "../../message/IIPCNamespaceConfigProvider";
import { IPC_CONFIG_WINDOW_MANAGER } from "./IPCNamespaceConfigWindowManager";
import { IWindowManager } from "../../window/IWindowManager";

export class WindowManagerHandler extends DirectiveHandler implements IWindowManagerHandler {
    private visualCharacteristicsObserverManager : ObserverManager<IVisualCharacteristicsObserver>;
    private windowManager : IWindowManager;

    constructor(windowManager : IWindowManager,
              loggerFactory : ILoggerFactory) {
        super(loggerFactory.getLogger(IPC_CONFIG_WINDOW_MANAGER.namespace));
        VisualCharacteristicsManager.getInstance().setLogger(this.logger);
        this.visualCharacteristicsObserverManager = new ObserverManager<IVisualCharacteristicsObserver>();
        this.windowManager = windowManager;
    }

    public getIPCNamespaceConfig() : IIPCNamespaceConfig {
        return IPC_CONFIG_WINDOW_MANAGER;
    }

    /**
     * Handles the setVisualCharacteristics Directive
     * @param {ISetVisualCharacteristicsDirectivePayload} payload the ISetVisualCharacteristicsDirectivePayload
     */
    public setVisualCharacteristics(payload : ISetVisualCharacteristicsDirectivePayload) : void {
        if (payload.deviceDisplay) {
            VisualCharacteristicsManager.getInstance().setDisplayCharacteristics(payload.deviceDisplay);
        }
        if (payload.interactionModes) {
            VisualCharacteristicsManager.getInstance().setInteractionModes(payload.interactionModes);
        }
        if (payload.windowTemplates) {
            VisualCharacteristicsManager.getInstance().setWindowTemplates(payload.windowTemplates);
        }
        
        this.visualCharacteristicsObserverManager.getObservers().forEach((observer) => {
            observer.onVisualCharacteristicsInit(payload);
        });
    }

    /**
     * Handles the clearWindow Directive
     * @param {IClearWindowDirectivePayload} payload the IClearWindowDirectivePayload
     */
    public async clearWindow(payload : IClearWindowDirectivePayload) : Promise<void> {
        await this.windowManager.hideWindowFromView(payload.windowId);
    }


    public getObserverManager() : IObserverManager<IVisualCharacteristicsObserver> {
        return this.visualCharacteristicsObserverManager;
    }
}