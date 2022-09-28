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

import { AVSVisualInterfaces } from "AVSInterfaces";

/**
 * Interface defining a Window Instance for purposes of WindowState context reporting.
 * See: https://developer.amazon.com/docs/alexa/alexa-voice-service/display-window.html#windowstate-context-object
 * 
 * @member {string} windowId a unique identifier for the window instance to target content to the window instance.
 * @member {string} templateId identifies the window template in the Alexa.Display.Window capability which is the basis for the instance.
 * @member {string} sizeConfigurationId indicates the active size configuration of the window instance.
 * @member {string} interactionMode id of the current interaction mode of the window instance.
 * @member {AVSVisualInterfaces[]} supportedInterfaces the AVS Visual interfaces supported by this window instance.
 * @member {number} zOrderIndex the zOrder index of the window instance in the client.
 */
 export interface IWindowInstance {
    windowId : string;
    templateId : string;
    sizeConfigurationId : string;
    interactionMode : string;
    supportedInterfaces : AVSVisualInterfaces[];
    zOrderIndex : number;
}