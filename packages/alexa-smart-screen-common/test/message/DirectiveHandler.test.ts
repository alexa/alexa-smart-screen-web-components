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
import { expect, assert } from "chai";
import { createMock } from "ts-auto-mock";
import { TestDirectiveHandler } from "./TestDirectiveHandler";
import { ILogger } from "../../src/logger/ILogger";
import { IDirectiveHeader } from "../../src/message/IHeader";
import { IDirective } from '../../src/message/Directive/IDirectiveHandler';
import { IIPCNamespaceConfig } from '../../src/message/IIPCNamespaceConfigProvider';

describe("@alexa-smart-screen/common/message: DirectiveHandler", () => {
    let testDirectiveHandler : TestDirectiveHandler;
    let handleDirectiveSampleFunctionSpy : sinon.SinonSpy;
    let logger : ILogger;

    const sampleIPCNamespaceConfig : IIPCNamespaceConfig = {
        namespace : "SampleNamespace",
        version : 1
    };

    const sandbox : sinon.SinonSandbox = sinon.createSandbox();

    const VALID_DIRECTIVE_HEADER : IDirectiveHeader = {
        version : sampleIPCNamespaceConfig.version,
        namespace : sampleIPCNamespaceConfig.namespace,
        name : "sampleFunction"
    };

    const VALID_DIRECTIVE : IDirective = {
        header : VALID_DIRECTIVE_HEADER,
        payload : "sampleValidPayload"
    }

    const INVALID_DIRECTIVE_HEADER : IDirectiveHeader = {
        version : sampleIPCNamespaceConfig.version,
        namespace : sampleIPCNamespaceConfig.namespace,
        name : "sampleVariable"
    };

    const INVALID_DIRECTIVE : IDirective = {
        header : INVALID_DIRECTIVE_HEADER,
        payload : "sampleInvalidPayload"
    }

    beforeEach(() => {
        logger = createMock<ILogger>();
        testDirectiveHandler = new TestDirectiveHandler(logger);
        handleDirectiveSampleFunctionSpy = sandbox.spy(TestDirectiveHandler.prototype as any, "sampleFunction");
    });

    afterEach(() => {
        sandbox.reset();
        sandbox.restore();
    });

    it('should route a directive to the correct handler for handling the message', () => {
        testDirectiveHandler.handleDirective(VALID_DIRECTIVE);
        expect(handleDirectiveSampleFunctionSpy.calledOnce).to.be.true;
    });

    it('should successfully process a directive message that has a corresponding handler', () => {
        testDirectiveHandler.handleDirective(VALID_DIRECTIVE);
        expect(handleDirectiveSampleFunctionSpy.calledOnce).to.be.true;
        assert.equal(testDirectiveHandler.succeeded.calledOnce, true);
    });

    it('should fail to process a directive message that has a does not have corresponding handler', () => {
        testDirectiveHandler.handleDirective(INVALID_DIRECTIVE);
        assert.equal(testDirectiveHandler.failed.calledOnce, true);
    });
});