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

import { IClient, ILoggerFactory, IVersionManager } from "@alexa-smart-screen/common";
import { SessionSetupHandler } from "../../src/sessionSetup/ipcComponents/SessionSetupHandler";
import { IConfigureClientDirectivePayload, IInitClientDirectivePayload } from "../../src/sessionSetup/ipcComponents/SessionSetupMessageInterfaces";

export class TestSessionSetupHandler extends SessionSetupHandler {
    constructor(client : IClient, loggerFactory : ILoggerFactory, versionManager : IVersionManager) {
        super(client, loggerFactory, versionManager);
    }

    public override initializeClient(payload : IInitClientDirectivePayload) : void {
        super.initializeClient(payload);
    }

    public override configureClient(payload : IConfigureClientDirectivePayload) : void {
        super.configureClient(payload);
    }
}