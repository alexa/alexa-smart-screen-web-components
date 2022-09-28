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
 * Enum defining the units for dimension
 */
 export enum DisplayDimensionUnit {
  PIXEL = 'PIXEL',
  DPI = 'DPI',
  DP = 'DP',
  CENTIMETERS = 'CENTIMETERS',
  INCHES = 'INCHES'
}

/**
 * The dimension configuration
 */
export interface IDisplayDimension {
  // Unit for this dimension.
  unit : DisplayDimensionUnit;

  value : {
    // Width in unit dimensions.
    width : number;
    // Height in unit dimensions.
    height : number;
  }
}