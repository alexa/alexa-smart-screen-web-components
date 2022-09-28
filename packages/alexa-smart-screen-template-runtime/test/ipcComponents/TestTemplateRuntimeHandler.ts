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

import { ILoggerFactory } from "@alexa-smart-screen/common";
import { TemplateRuntimeHandler } from "../../src/ipcComponents/TemplateRuntimeHandler";
import { IClearTemplateCardPayload, IRenderTemplateMessagePayload } from "../../src/ipcComponents/IRenderTemplateMessagePayload";
import { IClearPlayerInfoCardPayload, IRenderPlayerInfoMessagePayload } from "../../src/ipcComponents/IRenderPlayerInfoMessagePayload";

export class TestTemplateRuntimeHandler extends TemplateRuntimeHandler {
    constructor(loggerFactory : ILoggerFactory) {
        super(loggerFactory);
    }

    public override renderTemplate(payload : IRenderTemplateMessagePayload) : void {
        super.renderTemplate(payload);
    }

    public override renderPlayerInfo(payload : IRenderPlayerInfoMessagePayload) : void {
        super.renderPlayerInfo(payload);
    }

    public override clearTemplateCard(payload : IClearTemplateCardPayload) : void {
        super.clearTemplateCard(payload);
    }

    public override clearPlayerInfoCard(payload : IClearPlayerInfoCardPayload) : void {
        super.clearPlayerInfoCard(payload);
    }
}