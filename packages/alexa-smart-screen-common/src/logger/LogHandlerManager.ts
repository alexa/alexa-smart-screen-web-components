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
import { ILogHandler } from "./ILogHandler";
import { LogLevel } from "./LogLevel";
import { LogLevelUtils } from "./LogLevelUtils";

/**
 * Manages the log handlers and propagates formatted logs to handlers based on log level
 */
export class LogHandlerManager {
    private handlers : Set<ILogHandler>;

    constructor() {
        this.handlers = new Set();
    }
    
    public addHandler(handler : ILogHandler) : void {
        this.handlers.add(handler);
    }

    public removeHandler(handler : ILogHandler) : void {
        this.handlers.delete(handler);
    }

    public sendLogToHandlers(level : LogLevel, loggerId : string, params : ILoggerParams) : void {
        this.handlers.forEach((handler : ILogHandler) => {
            if (LogLevelUtils.getLogLevelIndex(level) <= LogLevelUtils.getLogLevelIndex(handler.getLevel())) {
                const formatter : ILogFormatter = handler.getFormatter();
                const formattedMessage : string = formatter.format(loggerId, params);
                handler.handleLog(level, formattedMessage);
            }
        });
    }
}