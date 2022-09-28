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

import { IClient, IDirective, IEvent, IClientConfig, IOnMessageFunc, AlexaState, ILogger, ILoggerFactory, LoggerParamsBuilder } from '@alexa-smart-screen/common';
import { IPC_CONFIG_SYSTEM, SYSTEM_SET_ALEXA_STATE_DIRECTIVE_NAME, ISetAlexaStateDirectivePayload } from '@alexa-smart-screen/app-utils';

// Max backoff value for reconnect attempts.
const MAX_BACKOFF = 10;

const LOGGER_ID_WS_CLIENT = 'WebSocketClient';

/**
 * Default client implementation based on Websockets.
 */
export class WebSocketClient implements IClient {
  protected static readonly CLASS_NAME = 'WebSocketClient';
  private connectRequested  = false;
  private connected  = false;
  private onMessageFn : IOnMessageFunc;
  private onConnectFn : () => void;
  private onErrorFn : (event : Event) => void;
  private onDisconnectFn : () => void;
  private timerId : number;
  private retry : number;
  private url : string;
  private ws : WebSocket;
  private logger : ILogger;

  /**
   * Construct a Websocket connection with Config information
   * @param config IClientConfiguration required for the Websocket
   */
  constructor(config : IClientConfig, loggerFactory : ILoggerFactory) {
    const protocol = config.insecure ? 'ws://' : 'wss://';
    this.url = protocol + config.host + ':' + config.port;
    this.logger = loggerFactory.getLogger(LOGGER_ID_WS_CLIENT);
  }

  protected static getLoggerParamsBuilder() : LoggerParamsBuilder {
    return new LoggerParamsBuilder().setClassName(WebSocketClient.CLASS_NAME);
  }

  /**
   * Schedule to connect to Websocket
   */
  private scheduleConnect() {
    const functionName = 'scheduleConnect';
    const callback = () => {
      this.timerId = undefined;
      this.ws = new WebSocket(this.url);
      this.ws.onmessage = this.wsOnMessage.bind(this);
      this.ws.onclose = this.wsOnDisconnect.bind(this);
      this.ws.onopen = this.wsOnConnect.bind(this);
      this.ws.onerror = this.wsOnError.bind(this);
      this.sendSetAlexaStateMessage(AlexaState.CONNECTING);
    };
    this.logger.info(WebSocketClient.getLoggerParamsBuilder()
                      .setFunctionName(functionName)
                      .setMessage(`Scheduling connection to: ${this.url} with backoff ${this.retry}`)
                      .build());
    this.timerId = window.setTimeout(callback, this.retry * 1000);
  }

  /**
   * Using the Websocket call back function create the necessary message function
   * @param event The message event received by the target object
   */
  private wsOnMessage(event : MessageEvent) : void {
    const functionName = 'wsOnMessage';
    let message : IDirective = undefined;
    try {
      message = JSON.parse(event.data);
    } catch (e) {
      this.logger.error(WebSocketClient.getLoggerParamsBuilder()
                          .setFunctionName(functionName)
                          .setMessage(`error parsing data: ${event.data}`)
                          .build());
    }
    typeof this.onMessageFn === 'function' && this.onMessageFn(message);
  }

  /**
   * Using the Websocket call back function to execute onConnect
   * @param event The event received by the target object
   */
  private wsOnConnect(event : Event) : void {
    const functionName = 'wsOnConnect';
    this.logger.debug(WebSocketClient.getLoggerParamsBuilder()
                        .setFunctionName(functionName)
                        .build());
    this.retry = 0;
    this.connected = true;
    typeof this.onConnectFn === 'function' && this.onConnectFn();
  }

  /**
   * Using the Websocket call back function to emit necessary Errors
   * @param event The event received by the target object
   */
  private wsOnError(event : Event) : void {
    const functionName = 'wsOnError';
    this.ws.close();
    this.logger.error(WebSocketClient.getLoggerParamsBuilder()
                        .setFunctionName(functionName)
                        .build());
    
    typeof this.onErrorFn === 'function' && this.onErrorFn(event);
  }

  /**
   * Using the Websocket call back function to try to reconnect and dispatch onDisconnect event
   * @param event The event received by the target object
   */
  private wsOnDisconnect(event : CloseEvent) : void {
    const functionName = 'wsOnDisconnect';
    this.connected = false;
    this.logger.debug(WebSocketClient.getLoggerParamsBuilder()
                        .setFunctionName(functionName)
                        .build());
    this.ws = undefined;
    if (this.connectRequested) {
      this.logger.info(WebSocketClient.getLoggerParamsBuilder()
                        .setFunctionName(functionName)
                        .build());
      this.retry = this.retry === 0 ? 2 : Math.min(this.retry * 2, MAX_BACKOFF);
      this.scheduleConnect();
    } else {
      this.logger.info(WebSocketClient.getLoggerParamsBuilder()
                        .setFunctionName(functionName)
                        .build());
      this.sendSetAlexaStateMessage(AlexaState.DISCONNECTED);                  
    }
    typeof this.onDisconnectFn === 'function' && this.onDisconnectFn();
  }

  private sendSetAlexaStateMessage(state : AlexaState) : void {
    const payload : ISetAlexaStateDirectivePayload = {
      state
    };
    const systemSetAlexaStateDirective : IDirective = {
      header : {
        version : IPC_CONFIG_SYSTEM.version,
        namespace : IPC_CONFIG_SYSTEM.namespace,
        name : SYSTEM_SET_ALEXA_STATE_DIRECTIVE_NAME
      },
      payload
    };
    typeof this.onMessageFn === 'function' && this.onMessageFn(systemSetAlexaStateDirective);
  }

  /**
   * Initialize the connection to the websocket
   */
  public connect() : void {
    const functionName = 'connect';
    this.logger.debug(WebSocketClient.getLoggerParamsBuilder()
                        .setFunctionName(functionName)
                        .build());
    this.connectRequested = true;
    if (this.ws === undefined && this.timerId === undefined) {
      this.retry = 0;
      this.scheduleConnect();
    }
  }

  /**
   * Disconnect from the websocket
   */
  public disconnect() : void {
    const functionName = 'disconnect';
    this.logger.debug(WebSocketClient.getLoggerParamsBuilder()
                        .setFunctionName(functionName)
                        .build());
    this.connectRequested = false;
    if (this.ws) {
      this.ws.close();
    } else if (this.timerId) {
      window.clearTimeout(this.timerId);
      this.timerId = undefined;
    }
  }

  /**
   * Send event message to the SDK
   * @param message Event Message to the SDK
   */
  public sendMessage(message : IEvent) : void {
    const functionName = 'sendMessage';
    const json = JSON.stringify(message);
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(json);
      // do not log here as it could lead to recursive calls if IPC logging is enabled
    } else {
      this.logger.error(WebSocketClient.getLoggerParamsBuilder()
                        .setFunctionName(functionName)
                        .setMessage(`message: ${json} could not be delivered`)
                        .build());
    }
  }

  /**
   * Check if the websocket connection is alive
   */
  get isConnected() : boolean {
    return this.connected;
  }

  /**
   * Set callback function for any incoming message from the SDK
   * @param callback callback function to be called on receiving a message
   */
  set onMessage(callback : IOnMessageFunc) {
    this.onMessageFn = callback;
  }

  /**
   * Set callback function when Websocket establish a connection
   * @param callback callback function to be called when connected
   */
  set onConnect(callback : () => void) {
    this.onConnectFn = callback;
  }

  /**
   * Set callback function when Websocket error is emitted
   * @param callback callback function to be called when error occurs
   */
  set onError(callback : (event : Event) => void) {
    this.onErrorFn = callback;
  }

  /**
   * Set callback function when Websocket is disconnected
   * @param callback callback function to be called when disconnected
   */
  set onDisconnect(callback : () => void) {
    this.onDisconnectFn = callback;
  }
}
