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

export interface ILogger {
    /**
     * Log debug message
     *
     * @param params parameters for logging
     */
    debug(params : ILoggerParams) : void;

    /**
     * Log info message
     *
     * @param params parameters for logging
     */
    info(params : ILoggerParams) : void;

    /**
     * Log warn message
     *
     * @param params parameters for logging
     */
    warn(params : ILoggerParams) : void;

    /**
     * Log error message
     *
     * @param params parameters for logging
     */
    error(params : ILoggerParams) : void;
  }