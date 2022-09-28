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

import { ILoggerParams } from "./ILoggerParams";

/**
 * Builder class of logger params
 */
export class LoggerParamsBuilder {
    private params : ILoggerParams;
    private args : Map<string, any>;

    constructor() {
        this.params = {};
        this.args = new Map();
    }

    public setClassName(className : string) : LoggerParamsBuilder {
        this.params.className = className;
        return this;
    }

    public setFunctionName(functionName : string) : LoggerParamsBuilder {
        this.params.functionName = functionName;
        return this;
    }

    public setMessage(message : string) : LoggerParamsBuilder {
        this.params.message = message;
        return this;
    }

    public setArg(key : string, value : any) : LoggerParamsBuilder {
        this.args.set(key, value);
        return this;
    }

    public build() : ILoggerParams {
        this.params.args = this.args;
        return this.params;
    }
}