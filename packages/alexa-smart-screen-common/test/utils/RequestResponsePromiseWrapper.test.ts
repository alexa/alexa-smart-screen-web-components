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

import { RequestResponsePromiseWrapperWithoutTimeout } from '../../src/utils/RequestResponsePromiseWrapperWithoutTimeout';
import { ILogger } from '../../src/logger/ILogger';
import { createMock } from 'ts-auto-mock';
import { assert } from 'chai';

describe('@alexa-smart-screen/common/utils: RequestResponsePromiseWrapper', () => {
    let logger : ILogger;
    let requestResponsePromiseWrapperWithoutTimeout : RequestResponsePromiseWrapperWithoutTimeout<void>;

    beforeEach(() => {
        logger = createMock<ILogger>();
        requestResponsePromiseWrapperWithoutTimeout = new RequestResponsePromiseWrapperWithoutTimeout<void>(logger);
    });

    it('should verify that the request is rejected when onReject() is called', (done) => {
        requestResponsePromiseWrapperWithoutTimeout.onRequest().then(() => {
            done(new Error('Expected method to reject.'));
        }).catch((error : string) => {
            done();
        });
        requestResponsePromiseWrapperWithoutTimeout.onReject("testing");
    });

    it("should verify that the request promise is not resolved until onResponse() is called", async () => {
        let isResolved = false;
    
        /// creates a promise that checks that onRequest() promise resolves within a timeout period, otherwise an error is thrown
        await new Promise<void>(resolve => {
            const timeout_Id = setTimeout(() => {
                /// timed out and onRequest() promise did not resolve
                assert.notOk("Promise does not resolve");
                resolve();
            }, 5000);
            requestResponsePromiseWrapperWithoutTimeout.onRequest().then(() => {
                isResolved = true;
                clearTimeout(timeout_Id);
                resolve();
            });
            assert.strictEqual(isResolved, false);
            requestResponsePromiseWrapperWithoutTimeout.onResponse();
        });
    
        /// onRequest successfully is resolved
        assert.strictEqual(isResolved, true);
      });
});