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

import { ILogFormatter } from "./ILogFormatter";
import { ILoggerParams } from "./ILoggerParams";

/**
 * Default implementation of log formatter
 */
export class DefaultLogFormatter implements ILogFormatter {
    private static readonly KEY_VALUE_SEPERATOR = '=';
    private static readonly ENTRY_SEPERATOR = ',';
    private static readonly LOGGER_ID_KEY = 'LoggerId';
    private static readonly CLASS_NAME_KEY = 'ClassName';
    private static readonly FUNCTION_NAME_KEY = 'FunctionName';
    private static readonly MESSAGE_KEY = 'Message';

    public format(loggerId : string, params : ILoggerParams) : string {
        const messageStrings : string[] = [`${this.getKeyValueString(DefaultLogFormatter.LOGGER_ID_KEY, loggerId)}`];
        if (params.className) {
            messageStrings.push(`${this.getKeyValueString(DefaultLogFormatter.CLASS_NAME_KEY, params.className)}`);
        }
        if (params.functionName) {
            messageStrings.push(`${this.getKeyValueString(DefaultLogFormatter.FUNCTION_NAME_KEY, params.functionName)}`);
        }
        if (params.message) {
            messageStrings.push(`${this.getKeyValueString(DefaultLogFormatter.MESSAGE_KEY, params.message)}`);
        }
        params.args && params.args.forEach((value : any, key : string, map : Map<string, any>) => {
            const valueToPrint = typeof value === 'string' ? value : JSON.stringify(value);
            messageStrings.push(`${this.getKeyValueString(key, valueToPrint)}`);
        });
        return messageStrings.join(DefaultLogFormatter.ENTRY_SEPERATOR);
    }

    private getKeyValueString(key : string, value : string) : string {
        return `${key}${DefaultLogFormatter.KEY_VALUE_SEPERATOR}${value}`;
    }
}