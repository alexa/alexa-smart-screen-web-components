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

import { AudioInputInitiator } from "../input/AudioInputConstants";
import { IDeviceKey } from "../input/IDeviceKey";
import { IDoNotDisturbObserver } from "../doNotDisturb/IDoNotDisturbObserver";
import { IVisualCharacteristicsObserver } from "../visualCharacteristics/IVisualCharacteristicsObserver";
import { IAlexaStateObserver } from "./IAlexaStateObserver";
import { ILocaleObserver } from "../locale/ILocaleObserver";

/**
 * Interface for Alexa inputs
 * @member {AudioInputInitiator} audioInput the speech recognition initiator type.
 * @member {IDeviceKey} talkDeviceKey the optional IDeviceKey used for invoking speech recognition.
 */
export interface IAlexaInputs {
    audioInput : AudioInputInitiator,
    talkDeviceKey ?: IDeviceKey
}

/**
 * Interface for a renderer that will implement an Alexa Attention System.
 * https://developer.amazon.com/docs/alexa/alexa-voice-service/ux-design-attention.html
 */
export interface IAttentionSystemRenderer extends IAlexaStateObserver, IDoNotDisturbObserver, ILocaleObserver, IVisualCharacteristicsObserver {
    getRootElement() : HTMLElement;
    setAlexaInputs(inputs : IAlexaInputs) : void;
    updateAttentionSystemState(isVisualContentActive : boolean) : void;
}