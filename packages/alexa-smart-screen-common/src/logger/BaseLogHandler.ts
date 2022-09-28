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

import { DefaultLogFormatter } from "./DefaultLogFormatter";
import { ILogFormatter } from "./ILogFormatter";
import { ILogHandler } from "./ILogHandler";
import { LogLevel } from "./LogLevel";

/**
 * Abstract class with common attributes required for log handlers
 */
export abstract class BaseLogHandler implements ILogHandler {
    private level : LogLevel;
    private formatter : ILogFormatter;

    constructor() {
        this.level = LogLevel.WARN;
        this.formatter = new DefaultLogFormatter();
    }
    
    public setLevel(level : LogLevel) : void {
        this.level = level;
    }

    public getLevel() : LogLevel {
        return this.level;
    }

    public setFormatter(formatter : ILogFormatter) : void {
        this.formatter = formatter;
    }

    public getFormatter() : ILogFormatter {
        return this.formatter;
    }

    public abstract handleLog(level : LogLevel, message : string) : void;
}