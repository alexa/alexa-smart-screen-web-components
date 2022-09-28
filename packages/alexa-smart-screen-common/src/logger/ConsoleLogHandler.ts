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

import { BaseLogHandler } from "./BaseLogHandler";
import { LogLevel } from "./LogLevel";

/**
 * Handler for console logging
 */
export class ConsoleLogHandler extends BaseLogHandler {
    public handleLog(level : LogLevel, message : string) : void {
        switch (level) {
            case LogLevel.ERROR : {
                console.error(message);
                break;
            }
            case LogLevel.WARN : {
                console.warn(message);
                break;
            }
            case LogLevel.INFO : {
                console.info(message);
                break;
            }
            case LogLevel.DEBUG : {
                console.debug(message);
                break;
            }
        }
    }   
}