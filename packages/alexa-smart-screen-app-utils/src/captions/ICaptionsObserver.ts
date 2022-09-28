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

import { IObserver } from '@alexa-smart-screen/common';
import { ICaptionsLine } from './ipcComponents/CaptionsMessageInterfaces';

export interface ICaptionsObserver extends IObserver {
    /**
     * Informs the observer to render the captions lines at the given times
     * @param captionLines list of caption lines to present
     * @param duration A number in milliseconds to determine how long the caption should be displayed on the screen.
     * @param delay The amount of time that should pass before these captionas are shown on the screen.
     */
    onRenderCaptions(captionLines : ICaptionsLine[], duration : number, delay : number) : void;

    /**
     * Informs the observer to set the captions state.
     * @param enabled state of captions.
     */
    onSetCaptionsState(enabled : boolean) : void;
}
