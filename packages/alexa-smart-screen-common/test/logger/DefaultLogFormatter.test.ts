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
import { DefaultLogFormatter } from '../../src/logger/DefaultLogFormatter';
import { ILoggerParams } from '../../src/logger/ILoggerParams';
import { LoggerParamsBuilder } from '../../src/logger/LoggerParamsBuilder';

describe("@alexa-smart-screen/common/logger: DefaultFormatter", () => {
    let defaultLogFormatter : DefaultLogFormatter;
    let loggerParamsBuilder : LoggerParamsBuilder;
    const loggerParams : ILoggerParams = {
        message : "testMessage",
        className : "testClassName",
        functionName : "testFunctionName"
    };

    beforeEach(() => {
        defaultLogFormatter = new DefaultLogFormatter();
        loggerParamsBuilder = new LoggerParamsBuilder();
    });

    it('should verify the formatting of messages with all three paramters', () => {
        const loggerId = "1";
        const actualMessage = defaultLogFormatter.format(loggerId, loggerParams);
        const expectedMessage = `LoggerId=${loggerId},ClassName=${loggerParams.className},FunctionName=${loggerParams.functionName},Message=${loggerParams.message}`;
        assert.strictEqual(actualMessage, expectedMessage);
    });

    it('should verify the formatting of messages with only ClassName as a parameter', () => {
        loggerParamsBuilder.setClassName("testClassName");
        const LOGGER_PARAMS_WITH_CLASS_NAME = loggerParamsBuilder.build();
        const loggerId = "2";
        const actualMessage = defaultLogFormatter.format(loggerId, LOGGER_PARAMS_WITH_CLASS_NAME);
        const expectedMessage = `LoggerId=${loggerId},ClassName=${loggerParams.className}`;
        assert.strictEqual(actualMessage, expectedMessage);
    });

    it('should verify the formatting of messages with only FunctionName as a parameter', () => {
        loggerParamsBuilder.setFunctionName("testFunctionName");
        const LOGGER_PARAMS_WITH_FUNCTION_NAME = loggerParamsBuilder.build();
        const loggerId = "3";
        const actualMessage = defaultLogFormatter.format(loggerId, LOGGER_PARAMS_WITH_FUNCTION_NAME);
        const expectedMessage = `LoggerId=${loggerId},FunctionName=${loggerParams.functionName}`;
        assert.strictEqual(actualMessage, expectedMessage);
    });

    it('should verify the formatting of messages with only Message as parameter', () => {
        loggerParamsBuilder.setMessage("testMessage");
        const LOGGER_PARAMS_WITH_MESSAGE = loggerParamsBuilder.build();
        const loggerId = "4";
        const actualMessage = defaultLogFormatter.format(loggerId, LOGGER_PARAMS_WITH_MESSAGE);
        const expectedMessage = `LoggerId=${loggerId},Message=${loggerParams.message}`;
        assert.strictEqual(actualMessage, expectedMessage);
    });
});