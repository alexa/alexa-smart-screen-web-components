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
 * Window size type
 */
export enum WindowSizeType {
  // DISCRETE for a window size with fixed points
  DISCRETE = 'DISCRETE',
  
  // CONTINUOUS to allow any window size under a specified maximum width and height
  CONTINUOUS = 'CONTINUOUS'
}

/**
 * Unit for window size dimension
 */
export enum WindowSizeUnit {
  // Only PIXEL is valid for window sizes
  PIXEL = 'PIXEL'
}

/**
 * Resolution Value for dimension 
 */
export interface WindowSizeDimension {
  // Unit for this dimension.
  unit : WindowSizeUnit;

  value : {
    // Width in unit dimensions.
    width : number;
    // Height in unit dimensions.
    height : number;
  }
}

/**
 * Size configuration for DISCRETE window
 */
export interface IWindowDiscreteSize {
  // Unique identifier for the specified size configuration
  id : string;

  // Window size type
  type : WindowSizeType.DISCRETE;

  // Dimension for the window
  value : WindowSizeDimension;
}

/**
 * Size configuration for CONTINUOUS window
 */
export interface IWindowContinuousSize {
  // Unique identifier for the specified size configuration
  id : string;

  // Window size type
  type : WindowSizeType.CONTINUOUS;

  // Dimension for the window
  minimum : WindowSizeDimension;
  maximum : WindowSizeDimension;
}

export type IWindowSizeConfiguration = IWindowContinuousSize | IWindowDiscreteSize;