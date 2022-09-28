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

import { createAPLRenderDocumentRequestPayload, IAPLRenderDocumentRequestPayload } from '@alexa-smart-screen/apl';
import { LocaleType, LocaleLayoutDirection } from '@alexa-smart-screen/common';
import { LiveViewCameraAPL } from './LiveViewCameraAPL';
import { LiveViewCameraSupportedViewports } from './LiveViewCameraSupportedViewports';
import { LIVE_VIEW_CAMERA_WINDOW_ID } from '../window/LiveViewCameraWindowElement';
import { ILiveViewCameraUIOptionsConfig } from '../config/ILiveViewCameraUIOptionsConfig';
import { IStartLiveViewPayload } from '../ipcComponents/IStartLiveViewPayload';

export const LIVE_VIEW_CAMERA_DOCUMENT_TOKEN = "LiveViewCameraDocument";

/**
 * Interface for the LVC APL document dataource
 * 
 * @member {IStartLiveViewPayload} liveView the start live view directive payload.
 * @member {ILiveViewCameraUIOptionsConfig} options (Optional) options config.
 */
export interface ILiveViewControllerAPLDatasource {
  liveView : IStartLiveViewPayload,
  options ?: ILiveViewCameraUIOptionsConfig
}

/**
 * Util function to resolve a LVC StartLiveView payload to an APL document for LVC UI
 * @param {ILiveViewControllerAPLDatasource} datasource the ILiveViewControllerAPLDatasource containing the IStartLiveViewPayload
 * @param {LocaleType} primaryLocale the locale to use for APL lang
 * @param {LocaleLayoutDirection} localeLayoutDirection the layoutDirection to use for APL layoutDirection
 * @returns 
 */
export const resolveLiveViewControllerAPLPayload = (
  datasource : ILiveViewControllerAPLDatasource,
  primaryLocale : LocaleType,
  localeLayoutDirection : LocaleLayoutDirection) : IAPLRenderDocumentRequestPayload => {
    LiveViewCameraAPL.environment = {
      lang : primaryLocale,
      layoutDirection : localeLayoutDirection
    };

    return createAPLRenderDocumentRequestPayload(
      LIVE_VIEW_CAMERA_DOCUMENT_TOKEN,
      LIVE_VIEW_CAMERA_WINDOW_ID,
      LiveViewCameraAPL,
      datasource,
      LiveViewCameraSupportedViewports
    );
  };