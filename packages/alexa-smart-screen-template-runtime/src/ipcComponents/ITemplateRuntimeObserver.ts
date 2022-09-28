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
import { IRenderPlayerInfoMessagePayload } from './IRenderPlayerInfoMessagePayload';
import { IRenderTemplateMessagePayload } from './IRenderTemplateMessagePayload';

export interface ITemplateRuntimeObserver extends IObserver {
    /**
     * Informs the observer to render the payload of the RenderTemplate directive.
     * @param payload IRenderTemplateMessagePayload
     */
    onRenderTemplate(payload : IRenderTemplateMessagePayload) : void;
    
    /**
     * Informs the observer to render the payload of the RenderPlayerInfo directive.
     * @param payload IRenderPlayerInfoMessagePayload
     */
    onRenderPlayerInfo(payload : IRenderPlayerInfoMessagePayload) : void;

    /**
     * Informs the observer to clear the RenderTemplate card.
     */
    onClearTemplateCard() : void;

    /**
     * Informs the observer to clear the PlayerInfo card.
     */
    onClearPlayerInfoCard() : void;
}
