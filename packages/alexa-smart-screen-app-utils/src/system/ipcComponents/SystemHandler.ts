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

import { DirectiveHandler, IAlexaStateObserver, IAuthorizationObserver, ICBLAuthorizationRequest, IIPCNamespaceConfig, ILocaleManager, ILocales, ILoggerFactory, IObserverManager, LoggerParamsBuilder, ObserverManager } from "@alexa-smart-screen/common";
import { IPC_CONFIG_SYSTEM } from "./IPCNamespaceConfigSystem";
import { ISystemHandler } from "./ISystemHandler";
import { ICompleteAuthorizationDirectivePayload, ISetAlexaStateDirectivePayload, ISetAuthorizationStateDirectivePayload, ISetLocalesDirectivePayload } from "./SystemMessageInterfaces";

export class SystemHandler extends DirectiveHandler implements ISystemHandler {
    protected static readonly CLASS_NAME = 'SystemHandler';
    private alexaStateObserverManager : ObserverManager<IAlexaStateObserver>;
    private authorizationObserverManager : ObserverManager<IAuthorizationObserver>;
    private localeManager : ILocaleManager;

    constructor(loggerFactory : ILoggerFactory, localeManager : ILocaleManager) {
        super(loggerFactory.getLogger(IPC_CONFIG_SYSTEM.namespace));
        this.alexaStateObserverManager = new ObserverManager<IAlexaStateObserver>();
        this.authorizationObserverManager = new ObserverManager<IAuthorizationObserver>();
        this.localeManager = localeManager;
    }

    protected static getLoggerParamsBuilder() : LoggerParamsBuilder {
        return new LoggerParamsBuilder().setClassName(SystemHandler.CLASS_NAME);
    }

    public getIPCNamespaceConfig() : IIPCNamespaceConfig {
        return IPC_CONFIG_SYSTEM;
    }

    /**
     * Handler method for setAlexaState IPC directive.
     * @param payload the ISetAlexaStateDirectivePayload
     */
    public setAlexaState(payload : ISetAlexaStateDirectivePayload) : void {
        this.alexaStateObserverManager.getObservers().forEach((observer : IAlexaStateObserver) => {
            observer.onAlexaStateChanged(payload.state);
        });
    }

    /**
     * Handler method for completeAuthorization IPC directive
     * @param payload the ICompleteAuthorizationDirectivePayload
     */
    public completeAuthorization(payload : ICompleteAuthorizationDirectivePayload) : void {
        // Notify observers when the Alexa client has requested CBL based authorization
        const authRequest = payload as ICBLAuthorizationRequest;
        this.authorizationObserverManager.getObservers().forEach((observer : IAuthorizationObserver) => {
            observer.onAuthorizationRequested(authRequest);
        });
    }

    /**
     * Handler method for setAuthorizationState IPC directive
     * @param payload the ISetAuthorizationStateDirectivePayload
     */
    public setAuthorizationState(payload : ISetAuthorizationStateDirectivePayload) : void {    
        // Notify observers when the Alexa client's authorization state has changed
        const authState = payload.state;
        this.authorizationObserverManager.getObservers().forEach((observer : IAuthorizationObserver) => {
            observer.onAuthorizationStateChanged(authState);
        });
    }
    
    /**
     * Handler method for setLocales IPC directive.
     * @param payload The ISetLocalesDirectivePayload.
     */
    public setLocales(payload : ISetLocalesDirectivePayload) : void {
        const functionName = 'setLocales';

        if (payload.locales.length < 1 || payload.locales.length > 2) {
            this.logger.error(SystemHandler.getLoggerParamsBuilder()
                .setFunctionName(functionName)
                .setMessage('Invalid payload from setLocales directive')
                .build());
            return;
        }
        const locales : ILocales = { primaryLocale : payload.locales[0] };
        if (payload.locales.length === 2) {
            locales.secondaryLocale = payload.locales[1];
        }
        
        this.localeManager.setLocales(locales);
    }

    /**
     * Method to return the alexa state observer manager for this system handler.
     * @return The system handler's alexa state observer manager.
     */
    public getAlexaStateObserverManager() : IObserverManager<IAlexaStateObserver> {
        return this.alexaStateObserverManager;
    }

    /**
     * Method to return the authorization observer manager for this system handler.
     * @returns The system handler's authorization observer manager
     */
    public getAuthorizationObserverManager() : IObserverManager<IAuthorizationObserver> {
        return this.authorizationObserverManager;
    }
}