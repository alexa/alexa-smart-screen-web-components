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

import { DisplayDimensionUnit, IDisplayDimension } from "./IDisplayDimension";

/**
 * Enum defining the type of the Display
 */
export enum DisplayCharacteristicsType {
    PIXEL = 'PIXEL'
}

/**
 * Enum defining the touch type supported by display
 */
export enum DisplayTouchType {
    // Touch input through one point of contact.
    SINGLE = 'SINGLE',
    // No touch support
    UNSUPPORTED = 'UNSUPPORTED'
}

/**
 * Enum defining the shape of device
 */
export enum ViewportShape {
    RECTANGLE = 'RECTANGLE',
    ROUND = 'ROUND'
}

/**
 * Type for resolution
 */
export interface IResolution extends IDisplayDimension {
    unit : DisplayDimensionUnit.PIXEL;
}

/**
 * Type for density independent resolution
 */
export interface IDensityIndependentResolution extends IDisplayDimension {
    unit : DisplayDimensionUnit.DP;
}

/**
 * Acceptable DPI values
 */
export type ValidDPI = 120 | 160 | 213 | 240 | 320 | 480 | 640;

/**
 * Type for pixel density
 */
export interface IPixelDensity {
    unit : DisplayDimensionUnit.DPI;
    value : ValidDPI;
}

/**
 * Type for physical size
 */
export interface IPhysicalSize extends IDisplayDimension {
    unit : DisplayDimensionUnit.CENTIMETERS | DisplayDimensionUnit.INCHES;
}

/**
 * The display characteristics for Alexa.Display interface.
 * https://developer.amazon.com/docs/alexa/alexa-voice-service/display.html
 */
export interface IDisplayCharacteristics {
    // Type of display.
    type : DisplayCharacteristicsType;
    
    // Collection of supported levels for touch input
    touch : DisplayTouchType[];
    
    // Shape of the device
    shape : ViewportShape;

    // Applicable dimensions of the device
    dimensions : {
        // Resolution of the display
        resolution : IResolution;
        // The dots-per inch (DPI) as reported by the display
        pixelDensity : IPixelDensity;
        // DP size of the display
        densityIndependentResolution : IDensityIndependentResolution;
        // Physical size of the display
        physicalSize : IPhysicalSize;
    }
}