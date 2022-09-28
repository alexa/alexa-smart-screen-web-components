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

/**
 * Utility class for common operations
 */
export class Calculator {
    /**
     * Returns value within a defined range, wherein the min/max define the lower/upper valid bounds for the value.
     * Will return undefined for any invalid range or undefined values.
     * @param min the min value supported by the range, must be <= max
     * @param max the max value supported by the range, must be >= min
     * @param value the target value (may be outside the range)
     * @returns range bound value
     */
    public static getValueInRange (min : number, max : number, value : number) : number {
        // If range is invalid, return undefined
        if ((min == undefined || max == undefined || value == undefined) || (min > max)) {
            return undefined;
        }
        return Math.min(max, Math.max(min, value));
    }
}