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

import { createAPLExecuteCommandsRequestPayload, createAPLRenderDocumentRequestPayload, IAPLExecuteCommandsRequestPayload, IAPLRenderDocumentRequestPayload } from '@alexa-smart-screen/apl';
import { IRenderPlayerInfoMessagePayload, IRenderTemplateMessagePayload } from '@alexa-smart-screen/template-runtime';
import { AVSDisplayCards } from './AVSDisplayCards';
import { AVSDisplayCardSupportedViewports } from './AVSDisplayCardSupportedViewports'

export const RENDER_PLAYER_INFO_KEY = "RenderPlayerInfo";

/**
 * These helper functions handle presentation of TemplateRuntime 'DisplayCard' directives
 * by binding RenderTemplate and RenderPlayerInfo payloads to APL templates that render the
 * visual metadata.
 *
 * The local AVSDisplayCards APL document references a hosted package that manages these templates,
 * and the AVSDisplayCardSupportedViewports defines the collection of supported viewports.
 *
 * For more information on DisplayCards:
 * https://developer.amazon.com/docs/alexa-voice-service/display-cards-overview.html
 */

/**
 * Resolves a RenderTemplate message payload to a local APL RenderDocument payload.
 * The RenderTemplate payload is used as datasource for APL document.
 *
 * @param payload IRenderTemplateMessage containing RenderTemplate payload.
 * @param windowId ID of the window this message will target with an APL render response.
 */
export const resolveRenderTemplate = (
  payload : IRenderTemplateMessagePayload,
  windowId : string
) : IAPLRenderDocumentRequestPayload => {
  return createAPLRenderDocumentRequestPayload(
    payload.token,
    windowId,
    AVSDisplayCards,
    payload,
    AVSDisplayCardSupportedViewports
  );
};

/**
 * Resolves a RenderPlayerInfo message payload to a local APL RenderDocument payload.
 * The RenderPlayerInfo payload is used as datasource for APL document.
 *
 * @param payload IRenderPlayerInfoMessage containing RenderPlayerInfo payload.
 * @param windowId ID of the window this message will target with an APL render response.
 */
export const resolveRenderPlayerInfo = (
  payload : IRenderPlayerInfoMessagePayload,
  windowId : string
) : IAPLRenderDocumentRequestPayload => {
  payload.payload.type = RENDER_PLAYER_INFO_KEY;
  payload.payload.audioPlayerInfo = {
    state : payload.audioPlayerState,
    mediaOffsetInMilliseconds : payload.audioOffset,
  };
  return createAPLRenderDocumentRequestPayload(
    RENDER_PLAYER_INFO_KEY,
    windowId,
    AVSDisplayCards,
    payload.payload,
    AVSDisplayCardSupportedViewports
  );
};

/**
 * Resolves a RenderPlayerInfo message payload to a local APL ExecuteCommands payload.
 * This is used to udpate an active RenderPlayerInfo document.
 *
 * @param payload IRenderPlayerInfoMessage containing RenderPlayerInfo payload.
 */
export const resolveRenderPlayerInfoCommand = (
  payload : IRenderPlayerInfoMessagePayload
) : IAPLExecuteCommandsRequestPayload => {
  const commands = [{
    type : "updateRenderPlayerInfo",
    mediaOffsetInMilliseconds : payload.audioOffset,
    mediaLengthInMilliseconds :
      payload.payload.content.mediaLengthInMilliseconds,
    audioPlayerState : payload.audioPlayerState,
    controls : payload.payload.controls,
  }];
  return createAPLExecuteCommandsRequestPayload(RENDER_PLAYER_INFO_KEY, commands);
};
