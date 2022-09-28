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

import { LogLevel } from "logger/LogLevel";
import { IClient } from "../../client/IClient";
import { EventHandler } from "../../message/Event/EventHandler";
import { ILoggerEvent } from "./ILoggerEvent";
import { IPC_CONFIG_LOGGER } from "./IPCNamespaceConfigLogger";
import { ILogEventPayload, LOGGER_LOG_EVENT_NAME } from "./LoggerMessageInterfaces";

/**
 * Logger Event for writing logs to SDK console
 */
export class LoggerEvent extends EventHandler implements ILoggerEvent {
    constructor(client : IClient) {
        super(client, IPC_CONFIG_LOGGER);
    }

    public logEvent(level : LogLevel, message : string) : void {
        const payload : ILogEventPayload = {
            level,
            message
        };
        this.sendResponseEvent(LOGGER_LOG_EVENT_NAME, payload);
    }
}