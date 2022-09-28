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

import * as sinon from 'sinon';
import { createMock } from 'ts-auto-mock';
import { ISetAuthorizationStateDirectivePayload, ICompleteAuthorizationDirectivePayload, SYSTEM_SET_AUTHORIZATION_DIRECTIVE_NAME, SYSTEM_COMPLETE_AUTHORIZATION_DIRECTIVE_NAME, ISetLocalesDirectivePayload, ISetAlexaStateDirectivePayload } from '../../src/system/ipcComponents/SystemMessageInterfaces';
import { IPC_CONFIG_SYSTEM } from '../../src/system/ipcComponents/IPCNamespaceConfigSystem';
import { AuthorizationState, IAuthorizationObserver, IDirectiveHeader, IDirective, ILocaleManager, ILocales, ILogger, ILoggerFactory, LocaleType, IAlexaStateObserver, AlexaState } from '@alexa-smart-screen/common';
import { TestSystemHandler } from './TestSystemHandler';

describe('@alexa-smart-screen/app-utils - SystemHandler', () => {
    let testSystemHandler : TestSystemHandler;
    let loggerFactory : ILoggerFactory;
    let logger : ILogger;
    let alexaStateObserver : IAlexaStateObserver;
    let localeManagerSpy : ILocaleManager;

    const sandbox : sinon.SinonSandbox = sinon.createSandbox();

    const localesSizeZeroPayload : ISetLocalesDirectivePayload = {
        locales : []
    }
    const localesSizeOnePayload : ISetLocalesDirectivePayload = {
        locales : [LocaleType.EN_US]
    }
    const localesSizeTwoPayload : ISetLocalesDirectivePayload = {
        locales : [LocaleType.EN_US, LocaleType.EN_GB]
    }
    const localesSizeThreePayload : ISetLocalesDirectivePayload = {
        locales : [LocaleType.EN_US, LocaleType.EN_GB, LocaleType.AR_SA]
    }

    const SYS_SET_AUTH_DIRECTIVE_HEADER : IDirectiveHeader = {
        version : IPC_CONFIG_SYSTEM.version,
        namespace : IPC_CONFIG_SYSTEM.namespace,
        name : SYSTEM_SET_AUTHORIZATION_DIRECTIVE_NAME
    };

    const SYS_COMPLETE_AUTH_DIRECTIVE_HEADER : IDirectiveHeader = {
        version : IPC_CONFIG_SYSTEM.version,
        namespace : IPC_CONFIG_SYSTEM.namespace,
        name : SYSTEM_COMPLETE_AUTHORIZATION_DIRECTIVE_NAME
    };

    beforeEach(() => {
        loggerFactory = createMock<ILoggerFactory>({
            getLogger : sandbox.spy()
        });
        logger = createMock<ILogger>({
            error : sandbox.spy()
        });
        alexaStateObserver = createMock<IAlexaStateObserver>({
            onAlexaStateChanged : sandbox.spy()
        });
        localeManagerSpy = createMock<ILocaleManager>({
            setLocales : sandbox.spy()
        });
        testSystemHandler = new TestSystemHandler(loggerFactory, logger, localeManagerSpy);
    });

    it('should verify if observer onAuthorizationStateChanged is called with the correct arguments as per the directive provided', () => {
        const authChangeUninitializedPayload : ISetAuthorizationStateDirectivePayload = {
            state : AuthorizationState.UNINITIALIZED
        }
        const authChangeUninitializedDirective : IDirective = {
            header : SYS_SET_AUTH_DIRECTIVE_HEADER,
            payload : authChangeUninitializedPayload
        };
        const authorizationObserver = createMock<IAuthorizationObserver>();
        authorizationObserver.onAuthorizationStateChanged = sinon.spy();
        testSystemHandler.getAuthorizationObserverManager().addObserver(authorizationObserver);

        testSystemHandler.handleDirective(authChangeUninitializedDirective);
        
        sinon.assert.calledWith(
            authorizationObserver.onAuthorizationStateChanged as sinon.SinonSpy, 
            AuthorizationState.UNINITIALIZED
        );
    });

    it('should verify if observer onAuthorizationRequested is called with the correct arguments as per the directive provided', () => {
        const authRequestedPayload : ICompleteAuthorizationDirectivePayload = {
            url : 'https://api.amazon.com/auth/O2/',
            code : 'AAAAAAA',
            clientId : 'client-id'
        }
        const authRequestedDirective : IDirective = {
            header : SYS_COMPLETE_AUTH_DIRECTIVE_HEADER,
            payload : authRequestedPayload
        };
        const authorizationObserver = createMock<IAuthorizationObserver>();
        authorizationObserver.onAuthorizationRequested = sinon.spy();
        testSystemHandler.getAuthorizationObserverManager().addObserver(authorizationObserver);

        testSystemHandler.handleDirective(authRequestedDirective);
        
        sinon.assert.calledWith(
            authorizationObserver.onAuthorizationRequested as sinon.SinonSpy, 
            authRequestedPayload
        );
    });

    it('should verify that the observer is notified of the change when AlexaState is changed', () => {
        testSystemHandler.getAlexaStateObserverManager().addObserver(alexaStateObserver);
        const payload : ISetAlexaStateDirectivePayload = {
            state : AlexaState.SPEAKING
        }
        testSystemHandler.setAlexaState(payload);
        sinon.assert.calledWith(
            alexaStateObserver.onAlexaStateChanged as sinon.SinonSpy,
            payload.state
        );
    });

    it('should verify that locale is not set when locales size < 1 in payload', () => {
        testSystemHandler.setLocales(localesSizeZeroPayload);
        sinon.assert.notCalled(
            localeManagerSpy.setLocales as sinon.SinonSpy,
        );

        sinon.assert.calledOnce(
            logger.error as sinon.SinonSpy,
        );
    });

    it('should verify if locale is set when locales size = 1 in payload', () => {
        testSystemHandler.setLocales(localesSizeOnePayload);
        const expectedLocale : ILocales = { primaryLocale : localesSizeOnePayload.locales[0] }; 
        sinon.assert.calledWith(
            localeManagerSpy.setLocales as sinon.SinonSpy,
            expectedLocale
        );
    });

    it('should verify if locale is set after setting the secondary locale when locales size === 2 in payload', () => {
        testSystemHandler.setLocales(localesSizeTwoPayload);
        const expectedLocale : ILocales = { primaryLocale : localesSizeTwoPayload.locales[0], secondaryLocale : localesSizeTwoPayload.locales[1] }; 
        sinon.assert.calledWith(
            localeManagerSpy.setLocales as sinon.SinonSpy,
            expectedLocale
        );
    });

    it('should verify that locale is not set when locales size > 2 in payload', () => {
        testSystemHandler.setLocales(localesSizeThreePayload);
        sinon.assert.notCalled(
            localeManagerSpy.setLocales as sinon.SinonSpy,
        );

        sinon.assert.calledOnce(
            logger.error as sinon.SinonSpy,
        );
    });
});