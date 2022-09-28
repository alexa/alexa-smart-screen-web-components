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

import {ILogger, LoggerFactory, IClient, IOnMessageFunc, IEvent, LoggerParamsBuilder } from '@alexa-smart-screen/common';

const LOGGER_ID_BINDER_CLIENT = 'BinderClient';

export interface IBinderClientConfig {
    loggerFactory : LoggerFactory;
    messageHandlerFunctionName : string;
    messageSenderFunctionName : string;
    messageSenderClassName : string;
}

/**
 * A client implementation that binds connection to a function of browser window.
 * Client -> Server : Client invokes a method registered by Server (MessageSender).
 * Server -> Client : Server invokes a method registered by Client (MessageHandler).
 */
export class BinderClient implements IClient {
    protected static readonly CLASS_NAME = 'BinderClient';
    protected logger : ILogger;
    private readonly messageHandlerFunctionName : string;
    private readonly messageSenderFunctionName : string;
    private readonly messageSenderClassName : string;

    constructor(config : IBinderClientConfig) {
        this.logger = config.loggerFactory.getLogger(LOGGER_ID_BINDER_CLIENT);
        this.messageHandlerFunctionName = config.messageHandlerFunctionName;
        this.messageSenderFunctionName = config.messageSenderFunctionName;
        this.messageSenderClassName = config.messageSenderClassName;
    }

    protected static getLoggerParamsBuilder() : LoggerParamsBuilder {
        return new LoggerParamsBuilder().setClassName(BinderClient.CLASS_NAME);
    }

    public sendMessage(message : IEvent) : void {
        const functionName = 'sendMessage';
        const json = JSON.stringify(message);
        if (this.sendRawMessage(json)) {
            this.logger.info(BinderClient.getLoggerParamsBuilder()
                                .setFunctionName(functionName)
                                .setArg('messageName', message.header.name)
                                .build());
        } else {
            this.logger.error(BinderClient.getLoggerParamsBuilder()
                                .setFunctionName(functionName)
                                .setMessage('message could not be delivered')
                                .build());
        }
    }

    public sendRawMessage(rawMessage : string) : boolean {
        // Message sender function is accessed using the class name followed by function name.
        (window as any)[this.messageSenderClassName][this.messageSenderFunctionName](rawMessage);
        return true;
    }

    set onMessage(callback : IOnMessageFunc) {
        const functionName = 'onMessage';
        const messageHandler = (msg : string) => {
            try {
                const message = JSON.parse(msg);
                callback(message);
            } catch (e) {
                this.logger.error(BinderClient.getLoggerParamsBuilder()
                                    .setFunctionName(functionName)
                                    .setArg('error', e)
                                    .build());
            }
        };

        // Message handler function is registered on the window using specified function name.
        (window as any)[this.messageHandlerFunctionName] = messageHandler;
    }

    get isConnected() : boolean {
        return true;
    }

    public connect() : void {
        // no-op
    }

    public disconnect() : void {
        // no-op
    }

    set onConnect(callback : () => void) {
        // no-op
    }

    set onError(callback : (event : Event) => void) {
        // no-op
    }

    set onDisconnect(callback : () => void) {
        // no-op
    }
}
