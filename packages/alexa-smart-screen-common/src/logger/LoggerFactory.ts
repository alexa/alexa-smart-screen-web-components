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

import { ILogger } from "./ILogger";
import { ILoggerFactory } from "./ILoggerFactory";
import { Logger } from "./Logger";
import { LogHandlerManager } from "./LogHandlerManager";

/**
 * Provides an implementation of ILoggerFactory using Logger and LogHandlerManager
 */
export class LoggerFactory implements ILoggerFactory {
    private idToLoggerMap : Map<string, Logger>;
    private logHandlerManager : LogHandlerManager;

    constructor() {
        this.idToLoggerMap = new Map();
        this.logHandlerManager = new LogHandlerManager();
    }

    public getLogger(loggerId : string) : ILogger {
        if (this.idToLoggerMap.has(loggerId)) {
            return this.idToLoggerMap.get(loggerId);
        }

        const logger = new Logger(loggerId, this.logHandlerManager);
        this.idToLoggerMap.set(loggerId, logger);
        return logger;
    }

    public getLogHandlerManager() : LogHandlerManager {
        return this.logHandlerManager;
    }
}