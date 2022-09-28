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

import { ILogger } from "../logger/ILogger";
import { LoggerParamsBuilder } from "../logger/LoggerParamsBuilder";

/**
 * Provides a wrapper over Promise to simulate request-response synchronous behavior for promises without timeout
 */
export class RequestResponsePromiseWrapperWithoutTimeout<T> {
  protected static readonly CLASS_NAME = 'RequestResponsePromiseWrapperWithoutTimeout';
  private resolveRequestPromise ?: (arg : T) => void;
  private rejectRequestPromise ?: (reason : string) => void;
  private logger : ILogger;

  public constructor(logger : ILogger) {
    this.logger = logger;
  }

  protected static getLoggerParamsBuilder() : LoggerParamsBuilder {
    return new LoggerParamsBuilder().setClassName(RequestResponsePromiseWrapperWithoutTimeout.CLASS_NAME);
  }

  /**
   * onResponse should be called once response is received for a request.
   * @param arg argument to be passed while resolving the request promise.
   */
  public onResponse(arg : T) : void {
    if (this.resolveRequestPromise) {
      this.resolveRequestPromise(arg);
      this.resetPromise();
    }
  }

  /**
   * onReject should be called to reject a request.
   * @param reason The reason for rejecting the request promise.
   */
  public onReject(reason : string) : void {
    if (this.rejectRequestPromise) {
      this.rejectRequestPromise(reason);
      this.resetPromise();
    }
  }

  /**
   * onRequest should be called once the request is sent.
   * It will return a promise that will get resolved once onResponse is called or reject the promise
   * if onReject gets called.
   */
  public onRequest() : Promise<T> {
    const functionName = 'onRequest';
    this.logger.warn(RequestResponsePromiseWrapperWithoutTimeout.getLoggerParamsBuilder()
                      .setFunctionName(functionName)
                      .setMessage('Promise will not timeout until onReject or onResponse is called explicitly')
                      .build());
    return new Promise<T>((resolve, reject) => {
      this.resolveRequestPromise = resolve;
      this.rejectRequestPromise = reject;
    });
  }

  private resetPromise() : void {
    this.resolveRequestPromise = undefined;
    this.rejectRequestPromise = undefined;
  }
}