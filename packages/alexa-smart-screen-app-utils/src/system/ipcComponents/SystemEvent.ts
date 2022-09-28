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

import { EventHandler, IClient } from "@alexa-smart-screen/common";
import { IPC_CONFIG_SYSTEM } from "./IPCNamespaceConfigSystem";
import { ISystemEvent } from "./ISystemEvent";
import { SYSTEM_ALEXA_STATE_REQUEST_EVENT_NAME, SYSTEM_AUTHORIZATION_STATE_REQUEST_EVENT_NAME, IAlexaStateRequestEventPayload, IAuthorizationStateRequestEventPayload, IAuthorizationInfoRequestEventPayload, SYSTEM_AUTHORIZATION_INFO_REQUEST_EVENT_NAME, ILocalesRequestEventPayload, SYSTEM_LOCALES_REQUEST_EVENT_NAME } from "./SystemMessageInterfaces";

export class SystemEvent extends EventHandler implements ISystemEvent {
    
    constructor(client : IClient) {
        super(client, IPC_CONFIG_SYSTEM);
    }

    /**
     * Method to send the alexaStateRequest event to the client.
     */
    public alexaStateRequest() : void {
        const payload : IAlexaStateRequestEventPayload = {};
        this.sendResponseEvent(SYSTEM_ALEXA_STATE_REQUEST_EVENT_NAME, payload);
    }

    /**
     * Method to send the authorizationInfoRequest event to the client.
     */
    public authorizationInfoRequest() : void {
        const payload : IAuthorizationInfoRequestEventPayload = {};
        this.sendResponseEvent(SYSTEM_AUTHORIZATION_INFO_REQUEST_EVENT_NAME, payload);
    }

    /**
     * Method to send the authorizationStateRequest event to the client.
     */
    public authorizationStateRequest() : void {
        const payload : IAuthorizationStateRequestEventPayload = {};
        this.sendResponseEvent(SYSTEM_AUTHORIZATION_STATE_REQUEST_EVENT_NAME, payload);
    }

    /**
     * Method to send the localesRequest event to the client.
     */
    public localesRequest() : void {
        const payload : ILocalesRequestEventPayload = {};
        this.sendResponseEvent(SYSTEM_LOCALES_REQUEST_EVENT_NAME, payload);
    }
}