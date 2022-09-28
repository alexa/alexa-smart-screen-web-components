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
 * Enum defining the type of interaction mode
 */
export enum UIMode {
    AUTO = 'AUTO',
    HUB = 'HUB',
    TV = 'TV',
    MOBILE = 'MOBILE',
    PC = 'PC',
    HEADLESS = 'HEADLESS'
}

/**
 * Enum class defining the unit for the interaction mode
 */
export enum InteractionModeUnit {
    CENTIMETERS = 'CENTIMETERS',
    INCHES = 'INCHES'
}

/**
 * Interface for specifying interaction distance of the user from the device.
 */
export interface IInteractionDistance {
    // Unit of the interaction distance for this interaction mode.
    unit : InteractionModeUnit;

    // Value of the interaction distance for this interaction mode.
    value : number;
}

/**
 * Enum indicating support of characteristics
 */
export enum SupportedType {
    SUPPORTED = 'SUPPORTED',
    UNSUPPORTED = 'UNSUPPORTED'
}

/**
 * The interaction mode for Alexa.InteractionMode interface.
 * https://developer.amazon.com/docs/alexa/alexa-voice-service/interaction-mode.html
 */
export interface IInteractionMode {
    // UI mode for this interaction mode.
    uiMode : UIMode;

    // ID of this interaction mode.
    id : string;

    // Expected interaction distance of the user from the device.
    interactionDistance : IInteractionDistance;    

    // Touch support.
    touchSupported : SupportedType;

    // Keyboard support.
    keyboardSupported : SupportedType;

    // Video support.
    videoSupported : SupportedType;

    // Dialog support.
    dialogSupported : SupportedType;
}