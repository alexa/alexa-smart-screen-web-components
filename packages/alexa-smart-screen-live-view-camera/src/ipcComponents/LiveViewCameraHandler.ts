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

import { DirectiveHandler, ILoggerFactory, IIPCNamespaceConfig, LoggerParamsBuilder } from '@alexa-smart-screen/common';
import { ILiveViewCameraHandler } from './ILiveViewCameraHandler';
import { IPC_CONFIG_LIVE_VIEW_CAMERA } from './IPCNamespaceConfigLiveViewCamera';
import {
    ISetCameraStateMessagePayload,
    IClearCameraMessagePayload,
    IRenderCameraMessagePayload
} from './LiveViewCameraMessageInterfaces';
import { ILiveViewCameraHandlerObserver } from 'ipcComponents/ILiveViewCameraHandlerObserver';

export class LiveViewCameraHandler extends DirectiveHandler implements ILiveViewCameraHandler {
    protected static readonly CLASS_NAME = 'LiveViewCameraHandler';
    private liveViewCameraHandlerObserver : ILiveViewCameraHandlerObserver;

    constructor(liveViewCameraHandlerObserver : ILiveViewCameraHandlerObserver,
        loggerFactory : ILoggerFactory) {
        super(loggerFactory.getLogger(IPC_CONFIG_LIVE_VIEW_CAMERA.namespace));
        this.liveViewCameraHandlerObserver = liveViewCameraHandlerObserver;
    }

    protected static getLoggerParamsBuilder() : LoggerParamsBuilder {
        return new LoggerParamsBuilder().setClassName(LiveViewCameraHandler.CLASS_NAME);
    }

    public getIPCNamespaceConfig() : IIPCNamespaceConfig {
        return IPC_CONFIG_LIVE_VIEW_CAMERA;
    }

    public renderCamera(payload : IRenderCameraMessagePayload) {
        this.liveViewCameraHandlerObserver.onStartLiveView(payload.startLiveViewPayload);
    }

    public clearCamera(payload : IClearCameraMessagePayload) {
        this.liveViewCameraHandlerObserver.onStopLiveView();
    }

    public setCameraState(payload : ISetCameraStateMessagePayload) {
        this.liveViewCameraHandlerObserver.onCameraStateChanged(payload.state);
    }
}
