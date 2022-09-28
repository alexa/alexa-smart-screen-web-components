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
import { IClearCameraMessagePayload, IRenderCameraMessagePayload, ISetCameraStateMessagePayload } from "../../src";
import { ILiveViewCameraHandlerObserver } from "../../src/ipcComponents/ILiveViewCameraHandlerObserver";
import { LiveViewCameraHandler } from "../../src/ipcComponents/LiveViewCameraHandler";

export class TestLiveViewCameraHandler extends LiveViewCameraHandler {
    constructor(observer : ILiveViewCameraHandlerObserver, loggerFactory : ILoggerFactory) {
        super(observer, loggerFactory);
    }

    public override renderCamera(payload : IRenderCameraMessagePayload) : void {
        super.renderCamera(payload);
    }

    public override clearCamera(payload : IClearCameraMessagePayload) : void {
        super.clearCamera(payload);
    }

    public override setCameraState(payload : ISetCameraStateMessagePayload) : void {
        super.setCameraState(payload);
    }
}