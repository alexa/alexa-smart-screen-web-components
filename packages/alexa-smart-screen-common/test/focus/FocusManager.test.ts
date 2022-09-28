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
import { ChannelName } from '../../src/focus/ChannelName';
import { FocusManager, IRequesterInfo } from '../../src/focus/FocusManager';
import { IChannelObserver } from '../../src/focus/IChannelObserver';
import { IFocusBridge } from '../../src/focus/IFocusBridge';
import { ILoggerFactory } from '../../src/logger/ILoggerFactory';
import { createMock } from 'ts-auto-mock';
import { FocusState } from '../../src/focus/FocusState';
import { AVSInterface, AVSVisualInterfaces } from '../../src/AVSInterfaces';
import { ContentType } from '../../src/focus/ContentType';

describe('@alexa-smart-screen/common/focus: FocusManager', () => {
    let focusManager : FocusManager;
    let focusBridge : IFocusBridge;
    let channelObserver : IChannelObserver;
    let loggerFactory : ILoggerFactory;
    const sandbox : sinon.SinonSandbox = sinon.createSandbox();
    const EXPECTED_AVS_INTERFACE : AVSInterface = AVSVisualInterfaces.ALEXA_PRESENTATION_APL;
    const EXPECTED_CONTENT_TYPE = ContentType.MIXABLE;

    beforeEach(() => {
        loggerFactory = createMock<ILoggerFactory>();
        channelObserver = createMock<IChannelObserver>({
            focusChanged : sandbox.spy()
        });
        focusBridge = createMock<IFocusBridge>({
            acquireFocus : sandbox.spy(),
            releaseFocus : sandbox.spy()
        });
        focusManager = new FocusManager(focusBridge, loggerFactory);
    });

    afterEach(() => {
        sandbox.reset();
        sandbox.restore();
    });

    it('should verify that token is assigned correctly when the channel acquires focus', () => {
        const actualToken = focusManager.acquireFocus(EXPECTED_AVS_INTERFACE, ChannelName.DIALOG, EXPECTED_CONTENT_TYPE, channelObserver);
        sinon.assert.calledWith(
            focusBridge.acquireFocus as sinon.SinonSpy,
            actualToken,
            EXPECTED_AVS_INTERFACE,
            ChannelName.DIALOG,
            EXPECTED_CONTENT_TYPE
        );
    });

    it('should verify that the focusBridge releases the channel with the respective channel name and token', () => {
        const requestorInfo : IRequesterInfo = {
            avsInterface : EXPECTED_AVS_INTERFACE,
            channelName : ChannelName.DIALOG,
            contentType : EXPECTED_CONTENT_TYPE,
            channelObserver : channelObserver
        };
        const actualToken = focusManager.acquireFocus(requestorInfo.avsInterface, requestorInfo.channelName, requestorInfo.contentType, channelObserver);
        focusManager.releaseFocus(actualToken);
        sinon.assert.calledWith(
            focusBridge.releaseFocus as sinon.SinonSpy,
            actualToken,
            requestorInfo.avsInterface,
            requestorInfo.channelName
        );
    });

    it('should verify that all channels are released when focusManager is reset', () => {
        const communicationsToken = focusManager.acquireFocus(EXPECTED_AVS_INTERFACE, ChannelName.COMMUNICATIONS, ContentType.NONMIXABLE, channelObserver);
        const alertsToken = focusManager.acquireFocus(EXPECTED_AVS_INTERFACE, ChannelName.ALERTS, EXPECTED_CONTENT_TYPE, channelObserver);
        const contentToken = focusManager.acquireFocus(EXPECTED_AVS_INTERFACE, ChannelName.CONTENT, ContentType.NONMIXABLE, channelObserver);
        focusManager.reset();
        const releaseFocusSpy = focusBridge.releaseFocus as sinon.SinonSpy;
        sinon.assert.calledWith(
            releaseFocusSpy.firstCall,
            communicationsToken,
            EXPECTED_AVS_INTERFACE,
            ChannelName.COMMUNICATIONS
        );
        sinon.assert.calledWith(
            releaseFocusSpy.secondCall,
            alertsToken,
            EXPECTED_AVS_INTERFACE,
            ChannelName.ALERTS
        );
        sinon.assert.calledWith(
            releaseFocusSpy.thirdCall,
            contentToken,
            EXPECTED_AVS_INTERFACE,
            ChannelName.CONTENT
        );
    });

    it('should verify that the channelObserver is not notified of focus change when focus is changed for a channel after focusManager being reset', () => {
        const actualToken = focusManager.acquireFocus(EXPECTED_AVS_INTERFACE, ChannelName.DIALOG, EXPECTED_CONTENT_TYPE, channelObserver);
        focusManager.reset();
        focusManager.processFocusChanged(actualToken, FocusState.FOREGROUND);
        sinon.assert.notCalled(
            channelObserver.focusChanged as sinon.SinonSpy
        );
    });

    it('should verify that the channelObserver is notified when focus is released for a channel (FocusState = NONE since token deleted)', () => {
        const requestorInfo : IRequesterInfo = {
            avsInterface : EXPECTED_AVS_INTERFACE,
            channelName : ChannelName.DIALOG,
            contentType : EXPECTED_CONTENT_TYPE,
            channelObserver : channelObserver
        };
        const actualToken = focusManager.acquireFocus(requestorInfo.avsInterface, requestorInfo.channelName, requestorInfo.contentType, channelObserver);
        focusManager.processFocusChanged(actualToken, FocusState.NONE);
        sinon.assert.calledWith(
            requestorInfo.channelObserver.focusChanged as sinon.SinonSpy,
            FocusState.NONE,
            actualToken
        );
    });

    it('should verify that the requestor channelObserver is notified when focus is acquired for a channel (FocusState = FOREGROUND)', () => {
        const requestorInfo : IRequesterInfo = {
            avsInterface : EXPECTED_AVS_INTERFACE,
            channelName : ChannelName.DIALOG,
            contentType : EXPECTED_CONTENT_TYPE,
            channelObserver : channelObserver
        };
        const actualToken = focusManager.acquireFocus(requestorInfo.avsInterface, requestorInfo.channelName, requestorInfo.contentType, channelObserver);
        focusManager.processFocusChanged(actualToken, FocusState.FOREGROUND);
        sinon.assert.calledWith(
            requestorInfo.channelObserver.focusChanged as sinon.SinonSpy,
            FocusState.FOREGROUND,
            actualToken
        );
    });
});