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

import { IIPCNamespaceConfig } from "../../src/message/IIPCNamespaceConfigProvider";
import { IClient } from "../../src/client/IClient";
import { EventHandler } from "../../src/message/Event/EventHandler";
import { ErrorResponseType } from "../../src/message/Event/ErrorResponseType";

export class TestEventHandler extends EventHandler {
    constructor(client : IClient, ipcNamesConfig : IIPCNamespaceConfig){
        super(client, ipcNamesConfig);
    }

    public testSendResponseEvent(name : string, payload : string) : void {
        this.sendResponseEvent(name, payload)
    }

    public testSendErrorResponseEvent(name : string, type : ErrorResponseType, payload : any) : void {
        this.sendErrorResponseEvent(name, type, payload);
    }
}