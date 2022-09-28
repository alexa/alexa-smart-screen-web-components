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

import * as sinon from 'sinon';
import { ILogger } from "../../src/logger/ILogger";
import { DirectiveHandler } from "../../src/message/Directive/DirectiveHandler";
import { IIPCNamespaceConfig } from "../../src/message/IIPCNamespaceConfigProvider";

export class TestDirectiveHandler extends DirectiveHandler {
    protected logger : ILogger;
    protected ipcNamespaceConfig : IIPCNamespaceConfig;

    constructor(logger : ILogger) {
        super(logger);
    }

    public sampleVariable : number;

    public sampleFunction() {
        // sample function for testing: do nothing
    }
    
    public getIPCNamespaceConfig() : IIPCNamespaceConfig {
        return this.ipcNamespaceConfig;
    }
    
    public override succeeded = sinon.spy();
    public override failed = sinon.spy();
}