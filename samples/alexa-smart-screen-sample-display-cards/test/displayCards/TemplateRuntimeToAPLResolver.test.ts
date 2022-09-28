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

import * as chai from "chai";

import { AVSDisplayCardSupportedViewports } from "../../src/displayCards/AVSDisplayCardSupportedViewports";
import { AVSDisplayCards } from "../../src/displayCards/AVSDisplayCards";
import { MEDIA_PLAYER_WINDOW_ID } from "../../src/window/PlayerInfoWindowElement";
import { 
    resolveRenderTemplate, 
    resolveRenderPlayerInfo,
    resolveRenderPlayerInfoCommand,
    RENDER_PLAYER_INFO_KEY 
} from '../../src/displayCards/TemplateRuntimeToAPLResolver';
import {
    AudioPlayerState,
    IRenderTemplateMessagePayload,
    IRenderTemplateMessageTitle,
    IRenderTemplateMessageImage,
    IRenderPlayerInfoMessagePayload,
    IRenderPlayerInfoControl
} from "@alexa-smart-screen/template-runtime";
import { IAPLExecuteCommandsRequestPayload, IAPLRenderDocumentRequestPayload } from '@alexa-smart-screen/apl';

describe("@alexa-smart-screen/sample-display-cards - Template Runtime directives to APL templates functionality", () => {
    const DEFAULT_WINDOW_ID = "tvFullscreen";
    const TOKEN1 = "token1";
    const TYPE1 = "type1";
    const TEXT_FIELD1 = "textField1";
    const AUDIO_ITEM_ID1 = "audioItemId1";
    const RENDER_TEMPLATE_MESSAGE_TITLE1 : IRenderTemplateMessageTitle = {
        mainTitle : "main_title",
        subTitle : "sub_title"
    };
    const RENDER_TEMPLATE_MESSAGE_MESSAGE1 : IRenderTemplateMessageImage = {
        sources : [{ size : "size", url : "url" }]
    };
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
            type : RENDER_PLAYER_INFO_KEY,
            audioPlayerInfo : {
                state : AudioPlayerState.IDLE,
                mediaOffsetInMilliseconds : 10,
            }
        },
        audioPlayerState : AudioPlayerState.IDLE,
        audioOffset : 10
    };

    it(`should be able to convert an IRenderTemplateMessagePayload payload to a valid IAPLRenderDocumentRequestPayload payload`, () => {
        const renderTemplateMessagePayload : IRenderTemplateMessagePayload = {
            token : TOKEN1,
            type : TYPE1,
            title : RENDER_TEMPLATE_MESSAGE_TITLE1,
            image : RENDER_TEMPLATE_MESSAGE_MESSAGE1,
            textField : TEXT_FIELD1
        }
        const expectedLocalRenderDocumentMessagePayload : IAPLRenderDocumentRequestPayload = {
            token : TOKEN1,
            windowId : DEFAULT_WINDOW_ID,
            payload : {
                document : AVSDisplayCards,
                datasources : renderTemplateMessagePayload,
                supportedViewports : AVSDisplayCardSupportedViewports,
            }
        };

        const localRenderDocumentMessagePayload : IAPLRenderDocumentRequestPayload = resolveRenderTemplate(renderTemplateMessagePayload, DEFAULT_WINDOW_ID);
        chai.assert.deepOwnInclude(
            localRenderDocumentMessagePayload,
            expectedLocalRenderDocumentMessagePayload
        );
    });

    it(`should be able to convert an IRenderPlayerInfoMessagePayload payload to a valid IAPLRenderDocumentRequestPayload payload`, () => {
        const expectedLocalRenderDocumentMessagePayload : IAPLRenderDocumentRequestPayload = {
            token : RENDER_PLAYER_INFO_KEY,
            windowId : MEDIA_PLAYER_WINDOW_ID,
            payload : {
                document : AVSDisplayCards,
                datasources : RENDER_PLAYER_INFO_MESSAGE_PAYLOAD.payload,
                supportedViewports : AVSDisplayCardSupportedViewports,
            }
        }

        const localRenderDocumentMessagePayload : IAPLRenderDocumentRequestPayload = resolveRenderPlayerInfo(RENDER_PLAYER_INFO_MESSAGE_PAYLOAD, MEDIA_PLAYER_WINDOW_ID);
        chai.assert.deepOwnInclude(
            localRenderDocumentMessagePayload,
            expectedLocalRenderDocumentMessagePayload
        );
    });

    it(`should be able to convert an IRenderPlayerInfoMessagePayload payload to a valid IAPLExecuteCommandsRequestPayload payload`, () => {
        const expectedLocalExecuteCommandsMessagePayload : IAPLExecuteCommandsRequestPayload = {
            token : RENDER_PLAYER_INFO_KEY,
            payload : {
                commands : [{
                    type : "updateRenderPlayerInfo",
                    mediaOffsetInMilliseconds : RENDER_PLAYER_INFO_MESSAGE_PAYLOAD.audioOffset,
                    mediaLengthInMilliseconds :
                        RENDER_PLAYER_INFO_MESSAGE_PAYLOAD.payload.content.mediaLengthInMilliseconds,
                    audioPlayerState : RENDER_PLAYER_INFO_MESSAGE_PAYLOAD.audioPlayerState,
                    controls : RENDER_PLAYER_INFO_MESSAGE_PAYLOAD.payload.controls,
                }]
            }
        };

        const localExecuteCommandsMessagePayload : IAPLExecuteCommandsRequestPayload = resolveRenderPlayerInfoCommand(RENDER_PLAYER_INFO_MESSAGE_PAYLOAD);
        chai.assert.deepOwnInclude(
            localExecuteCommandsMessagePayload,
            expectedLocalExecuteCommandsMessagePayload
        );
    });
});
