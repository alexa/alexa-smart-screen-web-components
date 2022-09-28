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
 * Enumerates the different display modes of a device or app
 * 
 * @enum
 * @exports
 */
 export enum DisplayMode {
    /// Display does not resize or change orientation.  Example: Physical TV Display.
    FIXED = 'FIXED',
    /// Display can be re-oriented, but otherwise doesn't change dimensions.  Example: Tablet.
    ORIENTABLE = 'ORIENTABLE',
    /// Display can be dynamically resize, most commonly as virtual window of an app.  Example: PC.
    RESIZABLE = 'RESIZABLE'
}

/**
 * Enumerates Display Orientations
 * 
 * @enum
 * @exports
 */
export enum DisplayOrientation {
    /// Orientation width is >= height.  Default.
    LANDSCAPE = 'landscape',
    /// Orientation height is > width
    PORTRAIT = 'portrait'
}
