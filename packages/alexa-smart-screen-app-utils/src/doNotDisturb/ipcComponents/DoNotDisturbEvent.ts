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
import { DND_STATE_CHANGED_EVENT_NAME, DND_STATE_REQUEST_EVENT_NAME, IDNDStateChangedEventPayload, IDNDStateRequestPayload } from "./DoNotDisturbMessageInterfaces";
import { IDoNotDisturbEvent } from "./IDoNotDisturbEvent";
import { IPC_CONFIG_DO_NOT_DISTURB } from "./IPCNamespaceConfigDoNotDisturb";

export class DoNotDisturbEvent extends EventHandler implements IDoNotDisturbEvent {

    constructor(client : IClient) {
        super(client, IPC_CONFIG_DO_NOT_DISTURB);
    }

    /**
     * Method to send a doNotDisturbStateChanged message to the client
     * 
     * @param {boolean} enabled true if the IPC client is turning on DND state.
     */
    public doNotDisturbStateChanged(enabled : boolean) : void {
        const payload : IDNDStateChangedEventPayload = {
            enabled
        };
        this.sendResponseEvent(DND_STATE_CHANGED_EVENT_NAME, payload);
    }

    /**
    * Method to send a doNotDisturbStateRequest message to the client
    */
    public doNotDisturbStateRequest() : void {
        const payload : IDNDStateRequestPayload = {};
        this.sendResponseEvent(DND_STATE_REQUEST_EVENT_NAME, payload);
    }
}