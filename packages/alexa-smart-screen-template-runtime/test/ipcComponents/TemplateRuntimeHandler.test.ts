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

import {
    ILoggerFactory
} from "@alexa-smart-screen/common";
import { ITemplateRuntimeObserver } from '../../src/ipcComponents/ITemplateRuntimeObserver';
import { IRenderPlayerInfoControl } from '@alexa-smart-screen/template-runtime';
import { TestTemplateRuntimeHandler } from "./TestTemplateRuntimeHandler";
import { IClearTemplateCardPayload, IRenderTemplateMessageImage, IRenderTemplateMessagePayload, IRenderTemplateMessageTitle } from "../../src/ipcComponents/IRenderTemplateMessagePayload";
import { IClearPlayerInfoCardPayload, IRenderPlayerInfoMessagePayload } from "../../src/ipcComponents/IRenderPlayerInfoMessagePayload";
import { AudioPlayerState } from "../../src/utils/AudioPlayerState";

describe("@alexa-smart-screen/template-runtime - TemplateRuntimeHandler", () => {
    const TOKEN1 = "token1";
    const TYPE1 = "type1";
    const TEXT_FIELD1 = "textField1"
    const RENDER_TEMPLATE_MESSAGE_TITLE1 : IRenderTemplateMessageTitle = {
        mainTitle : "main_title",
        subTitle : "sub_title"
    }
    const RENDER_TEMPLATE_MESSAGE_MESSAGE1 : IRenderTemplateMessageImage = {
        sources : [{ size : "size", url : "url" }]
    }
    const RENDER_TEMPLATE_MESSAGE_PAYLOAD : IRenderTemplateMessagePayload = {
        token : TOKEN1,
        type : TYPE1,
        title : RENDER_TEMPLATE_MESSAGE_TITLE1,
        image : RENDER_TEMPLATE_MESSAGE_MESSAGE1,
        textField : TEXT_FIELD1
    };
    const AUDIO_ITEM_ID1 = "audioItemId1";
    const RENDER_PLAYER_INFO_CONTROL1 : IRenderPlayerInfoControl = {
        enabled : true,
        name : "controlName1",
        selected : true,
        type : "TOGGLE"
    };
    const RENDER_PLAYER_INFO_MESSAGE_PAYLOAD : IRenderPlayerInfoMessagePayload = {
        payload : {
            audioItemId : AUDIO_ITEM_ID1,
            content : {
                art : { sources : [{ size : "artSize" }] },
                header : "contentHeader",
                mediaLengthInMilliseconds : 10,
                provider : { logo : [{ size : "logoSize" }], name : "providerName" },
                title : "contentTitle",
                titleSubtext1 : "contentTitleSubtext1",
                titleSubtext2 : "contentTitleSubtext2"
            },
            controls : [RENDER_PLAYER_INFO_CONTROL1],
            type : "RenderPlayerInfo",
            audioPlayerInfo : {
                state : AudioPlayerState.IDLE,
                mediaOffsetInMilliseconds : 10,
            }
        },
        audioPlayerState : AudioPlayerState.IDLE,
        audioOffset : 10
    };
    let loggerFactory : ILoggerFactory;
    let templateRuntimeObserver : ITemplateRuntimeObserver;
    let testTemplateRuntimeHandler : TestTemplateRuntimeHandler;

    const sandbox : sinon.SinonSandbox = sinon.createSandbox();

    beforeEach(() => {
        loggerFactory = createMock<ILoggerFactory>();
        templateRuntimeObserver = createMock<ITemplateRuntimeObserver>({
            onRenderTemplate : sandbox.spy(),
            onRenderPlayerInfo : sandbox.spy(),
            onClearTemplateCard : sandbox.spy(),
            onClearPlayerInfoCard : sandbox.spy()
        });
        testTemplateRuntimeHandler = new TestTemplateRuntimeHandler(loggerFactory);
        testTemplateRuntimeHandler.getObserverManager().addObserver(templateRuntimeObserver);
    });

    afterEach(() => {
        sandbox.reset();
        sandbox.restore();
    });

    it('should verify that the template runtime observer is notified of the message to render template card', () => {
        testTemplateRuntimeHandler.renderTemplate(RENDER_TEMPLATE_MESSAGE_PAYLOAD);
        sinon.assert.calledWith(
            templateRuntimeObserver.onRenderTemplate as sinon.SinonSpy,
            RENDER_TEMPLATE_MESSAGE_PAYLOAD
        );
    });

    it(`should verify that the template runtime observer is notified of the message to clear template template card`, () => {
        const clearTemplateCardPayload : IClearTemplateCardPayload = {};
        testTemplateRuntimeHandler.clearTemplateCard(clearTemplateCardPayload);
        sinon.assert.calledWith(
            templateRuntimeObserver.onClearTemplateCard as sinon.SinonSpy
        );
    });

    it('should verify that the template runtime observer is notified of the message to render player info', () => {
        testTemplateRuntimeHandler.renderPlayerInfo(RENDER_PLAYER_INFO_MESSAGE_PAYLOAD);
        sinon.assert.calledWith(
            templateRuntimeObserver.onRenderPlayerInfo as sinon.SinonSpy,
            RENDER_PLAYER_INFO_MESSAGE_PAYLOAD
        );
    });

    it(`should verify that the template runtime observer is notified of the message to clear player info`, () => {
        const clearPlayerInfoCardPayload : IClearPlayerInfoCardPayload = {};
        testTemplateRuntimeHandler.clearPlayerInfoCard(clearPlayerInfoCardPayload);
        sinon.assert.calledWith(
            templateRuntimeObserver.onClearPlayerInfoCard as sinon.SinonSpy
        );
    });
});
