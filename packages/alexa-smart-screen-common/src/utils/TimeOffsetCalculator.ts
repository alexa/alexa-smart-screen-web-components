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

import { ILogger } from '../logger/ILogger';
import { LoggerParamsBuilder } from '../logger/LoggerParamsBuilder';

export class TimeOffsetCalculator {
  protected static readonly CLASS_NAME = 'TimeOffsetCalculator';
  private startTimestamp ?: number;
  private stopTimestamp ?: number;
  private logger : ILogger;

  constructor(logger : ILogger) {
    this.logger = logger;
  }

  protected static getLoggerParamsBuilder() : LoggerParamsBuilder {
    return new LoggerParamsBuilder().setClassName(TimeOffsetCalculator.CLASS_NAME);
  }

  public setStartTimestamp() : void {
      const functionName = 'setStartTimeStamp';
      this.logger.debug(TimeOffsetCalculator.getLoggerParamsBuilder()
                            .setFunctionName(functionName)
                            .build());
      this.stopTimestamp = undefined;
      this.startTimestamp = Date.now();
  }

  public setStopTimestamp() : void {
      const functionName = 'setStopTimestamp';
      this.logger.debug(TimeOffsetCalculator.getLoggerParamsBuilder()
                            .setFunctionName(functionName)
                            .build());
      this.stopTimestamp = Date.now();
  }

  public resetTimestamps() : void {
      const functionName = 'resetTimestamps';
      this.logger.debug(TimeOffsetCalculator.getLoggerParamsBuilder()
                            .setFunctionName(functionName)
                            .build());
      this.startTimestamp = undefined;
      this.stopTimestamp = undefined;
  }

  public millisecondsToSeconds(offset : number) : number {
      return offset / 1000;
  }

  public secondsToMilliseconds(offset : number) : number {
      return offset * 1000;
  }

  public getOffsetInMilliseconds() : number {
      const functionName = 'getOffsetInMilliseconds';
      if (!this.startTimestamp) {
        this.logger.error(TimeOffsetCalculator.getLoggerParamsBuilder()
                            .setFunctionName(functionName)
                            .setArg('error', 'Undefined start timestamp')
                            .build());
        throw ReferenceError('Undefined start timestamp');
      }

      const endTimestamp : number = this.stopTimestamp
          ? this.stopTimestamp
          : Date.now();
      const offsetInMilliseconds = endTimestamp - this.startTimestamp;
      this.logger.debug(TimeOffsetCalculator.getLoggerParamsBuilder()
                            .setFunctionName(functionName)
                            .setArg('endTimestamp', Number(endTimestamp))
                            .setArg('startTimestamp', Number(this.startTimestamp))
                            .setArg('offsetInMilliseconds', offsetInMilliseconds)
                            .build());
      return offsetInMilliseconds;
  }
}
