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

import { ILocaleManager, ILogger, ILoggerFactory } from '@alexa-smart-screen/common';
import { createMock } from 'ts-auto-mock';
import { SystemHandler } from '../../src/system/ipcComponents/SystemHandler';
import { ICompleteAuthorizationDirectivePayload, ISetAlexaStateDirectivePayload, ISetAuthorizationStateDirectivePayload, ISetLocalesDirectivePayload } from '../../src/system/ipcComponents/SystemMessageInterfaces';

export class TestSystemHandler extends SystemHandler {
    protected logger : ILogger = createMock<ILogger>();
    constructor(loggerFactory : ILoggerFactory, logger : ILogger, localeManager : ILocaleManager) {
        super(loggerFactory, localeManager);
        this.logger = logger;
    }

    public completeAuthorization(payload : ICompleteAuthorizationDirectivePayload) : void {
        super.completeAuthorization(payload);
    }

    public setAuthorizationState(payload : ISetAuthorizationStateDirectivePayload) : void {
        super.setAuthorizationState(payload);
    }

    public setAlexaState(payload : ISetAlexaStateDirectivePayload) : void {
        super.setAlexaState(payload);
    }

    public setLocales(payload : ISetLocalesDirectivePayload) : void {
        super.setLocales(payload);
    }
}