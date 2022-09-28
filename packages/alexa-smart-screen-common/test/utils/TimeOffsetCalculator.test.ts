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

import 'mocha';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { TimeOffsetCalculator } from '../../src/utils/TimeOffsetCalculator';
import { ILogger } from '../../src/logger/ILogger';
import { createMock } from 'ts-auto-mock';

describe('@alexa-smart-screen-common/utils: TimeOffsetCalculator', () => {
    let timeOffsetCalculator : TimeOffsetCalculator;
    let logger : ILogger;
    let clock : any;

    beforeEach(() => {
        logger = createMock<ILogger>();
        timeOffsetCalculator = new TimeOffsetCalculator(logger);
        clock = sinon.useFakeTimers();
    });

    afterEach(() => {
        clock.restore();
    });

    it('should verify the offset when setStartTimestamp and setStopTimestamp is called during the delay that is set', () => {
        const START_TIME_MILLISECONDS = 1000;
        const DELAY_MILLISECONDS = 2000;

        clock.tick(START_TIME_MILLISECONDS);
        timeOffsetCalculator.setStartTimestamp();

        clock.tick(DELAY_MILLISECONDS);
        timeOffsetCalculator.setStopTimestamp();
        const offset = timeOffsetCalculator.getOffsetInMilliseconds();

        expect(offset).equal(DELAY_MILLISECONDS);
    });

    it('should verify the value of offsets after getOffsetInMilliseconds() is called repeatedly', () => {
        const START_TIME_MILLISECONDS = 1000;
        const DELAY_MILLISECONDS = 2000;

        clock.tick(START_TIME_MILLISECONDS);
        timeOffsetCalculator.setStartTimestamp();

        clock.tick(DELAY_MILLISECONDS);
        timeOffsetCalculator.setStopTimestamp();
        const offset1 = timeOffsetCalculator.getOffsetInMilliseconds();

        clock.tick(1000);
        const offset2 = timeOffsetCalculator.getOffsetInMilliseconds();

        expect(offset1).equal(offset2);
    });

    it('should throw an error when getOffsetInMilliseconds() is called without setStartTimestamp() being called', () => {
        const DELAY_MILLISECONDS = 2000;

        clock.tick(DELAY_MILLISECONDS);
        timeOffsetCalculator.setStopTimestamp();

        expect(() => timeOffsetCalculator.getOffsetInMilliseconds()).to.throw(ReferenceError);
    });

    it('should throw an error when getOffsetInMilliseconds() is called after resetTimestamp() is called', () => {
        const START_TIME_MILLISECONDS = 1000;
        const DELAY_MILLISECONDS = 2000;

        clock.tick(START_TIME_MILLISECONDS);
        timeOffsetCalculator.setStartTimestamp();

        clock.tick(DELAY_MILLISECONDS);
        timeOffsetCalculator.setStopTimestamp();

        timeOffsetCalculator.resetTimestamps();

        expect(() => timeOffsetCalculator.getOffsetInMilliseconds()).to.throw(ReferenceError);
    });
});