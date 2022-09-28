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
import { CaptionsHandler } from "../../src/captions/ipcComponents/CaptionsHandler";
import { IRenderCaptionsPayload, ISetCaptionsStatePayload } from "../../src/captions/ipcComponents/CaptionsMessageInterfaces";

export class TestCaptionsHandler extends CaptionsHandler {
    constructor(loggerFactory : ILoggerFactory) {
        super(loggerFactory);
    }

    public override renderCaptions(payload : IRenderCaptionsPayload) : void {
        super.renderCaptions(payload);
    }

    public override setCaptionsState(payload : ISetCaptionsStatePayload) : void {
        super.setCaptionsState(payload);
    }
}