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

import { LogLevel } from "./LogLevel";
import { ILogger } from "./ILogger";
import { ILoggerParams } from "./ILoggerParams";
import { LogHandlerManager } from "./LogHandlerManager";

/**
 * Provides an implementation of ILogger using LogHandlerManager
 */
export class Logger implements ILogger {
    private loggerId : string;
    private logHandlerManager : LogHandlerManager;

    constructor(loggerId : string, logHandlerManager : LogHandlerManager) {
        this.loggerId = loggerId;
        this.logHandlerManager = logHandlerManager;
    }

    public debug(params : ILoggerParams) : void {
        this.logHandlerManager.sendLogToHandlers(LogLevel.DEBUG, this.loggerId, params);
    }

    public warn(params : ILoggerParams) : void {
        this.logHandlerManager.sendLogToHandlers(LogLevel.WARN, this.loggerId, params);
    }

    public info(params : ILoggerParams) : void {
        this.logHandlerManager.sendLogToHandlers(LogLevel.INFO, this.loggerId, params);
    }

    public error(params : ILoggerParams) : void {
        this.logHandlerManager.sendLogToHandlers(LogLevel.ERROR, this.loggerId, params);
    }
}
