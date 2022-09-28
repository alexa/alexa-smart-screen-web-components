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

import { IWindowSizeConfiguration } from "./IWindowSize";

/**
 * Type of window
 */
export enum WindowType {
    // Permanent, static window
    STANDARD = 'STANDARD',
    // Temporary window that might share the screen with other experiences. Overlay windows could be transparent
    OVERLAY = 'OVERLAY'
}

/**
 * Configuration for window template
 */
export interface IWindowTemplateConfiguration {
    // Sizes supported by this window template.
    sizes : IWindowSizeConfiguration[];

    // Interaction mode supported by this window template.
    interactionModes : string[];
}

/**
 * The window template for Alexa.Display.Window interface.
 * https://developer.amazon.com/docs/alexa/alexa-voice-service/display-window.html
 */
export interface IWindowTemplate {
    // Window template id.
    id : string;

    // Type of of the window template.
    type : WindowType;

    // Window template configuration.
    configuration : IWindowTemplateConfiguration;
}