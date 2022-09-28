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
import { Calculator } from '../../src/utils/Calculator';

describe('@alexa-smart-screen-common/utils: Calculator', () => {

    const MIN_VALUE = 10;
    const MAX_VALUE = 100;

    it('should verify that an undefined value returns as undefined value', () => {
        const rangeVal = Calculator.getValueInRange(MIN_VALUE, MAX_VALUE, undefined);

        expect(rangeVal).equal(undefined);
    });

    it('should verify that an undefined min returns as undefined value', () => {
        const VALUE = 50;
        const rangeVal = Calculator.getValueInRange(undefined, MAX_VALUE, VALUE);

        expect(rangeVal).equal(undefined);
    });

    it('should verify that an undefined max returns as undefined value', () => {
        const VALUE = 50;
        const rangeVal = Calculator.getValueInRange(MIN_VALUE, undefined, VALUE);

        expect(rangeVal).equal(undefined);
    });

    it('should verify that an undefined value returns as undefined value', () => {
        const VALUE = 50;
        const rangeVal = Calculator.getValueInRange(200, MAX_VALUE, VALUE);

        expect(rangeVal).equal(undefined);
    });

    it('should verify that an invalid range of min > max is returned as undefined value', () => {
        const VALUE = 100;
        const rangeVal = Calculator.getValueInRange(200, MAX_VALUE, VALUE);

        expect(rangeVal).equal(undefined);
    });

    it('should verify that a value within the valid range is the returned value', () => {
        const VALUE = 25;
        const rangeVal = Calculator.getValueInRange(MIN_VALUE, MAX_VALUE, VALUE);

        expect(rangeVal).equal(VALUE);
    });

    it('should verify that a value less than the min value of the range is returned as the min val', () => {
        const VALUE = 5;
        const rangeVal = Calculator.getValueInRange(MIN_VALUE, MAX_VALUE, VALUE);

        expect(rangeVal).equal(MIN_VALUE);
    });

    it('should verify that a value more than the max value of the range is returned as the max val', () => {
        const VALUE = 200;
        const rangeVal = Calculator.getValueInRange(MIN_VALUE, MAX_VALUE, VALUE);

        expect(rangeVal).equal(MAX_VALUE);
    });

    it('should verify that when min val is 0, and value is < 0, min val 0 is returned', () => {
        const VALUE = -10;
        const rangeVal = Calculator.getValueInRange(0, MAX_VALUE, VALUE);

        expect(rangeVal).equal(0);
    });

    it('should verify that when min val is < 0, max value is 0, and value is > 0, max val 0 is returned', () => {
        const VALUE = 10;
        const rangeVal = Calculator.getValueInRange(-100, 0, VALUE);

        expect(rangeVal).equal(0);
    });
});