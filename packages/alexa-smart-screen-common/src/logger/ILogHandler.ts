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
import { LogLevel } from "./LogLevel";

/**
 * Interface to be implemented by log handlers
 */
export interface ILogHandler {
    /**
     * Set the level for logging for handler instance
     * @param level log level
     */
    setLevel(level : LogLevel) : void;

    /**
     * Return the logging level set in handler
     */
    getLevel() : LogLevel;

    /**
     * Set the log formatter for handler instance
     * @param formatter log formatter
     */
    setFormatter(formatter : ILogFormatter) : void;

    /**
     * Return the log formatter associated with handler instance
     */
    getFormatter() : ILogFormatter;

    /**
     * Handle the log message
     * @param level level of log to be handled
     * @param message log message
     */
    handleLog(level : LogLevel, message : string) : void;
}