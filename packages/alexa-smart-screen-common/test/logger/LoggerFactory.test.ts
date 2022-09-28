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

import { assert } from 'chai';
import { LoggerFactory } from '../../src/logger/LoggerFactory'; 

describe('@alexa-smart-screen/common/logger: LoggerFactory', () => {
    let loggerFactory : LoggerFactory;
    
    beforeEach(() => {
        loggerFactory = new LoggerFactory();
    });

    it('should verify that the logHandlerManager obtained from the getter method is not null', () => {
        const expectedLogHandlerManager = loggerFactory.getLogHandlerManager();
        assert.equal(Object.is(expectedLogHandlerManager, null), false);
    });

    it('should verify that the same logger is returned when called with a preexisting loggerId', () => {
        const testLoggerId = "1";
        const expectedLogger1 = loggerFactory.getLogger(testLoggerId);
        const expectedLogger2 = loggerFactory.getLogger(testLoggerId);
        assert.equal(Object.is(expectedLogger1, expectedLogger2), true);
    });
});