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

import { SampleStartLiveViewPayload } from '../../src/debug/SampleStartLiveViewPayload';

import { LIVE_VIEW_CAMERA_WINDOW_ID } from "../../src/window/LiveViewCameraWindowElement";
import { IAPLRenderDocumentRequestPayload } from '@alexa-smart-screen/apl';
import { ILiveViewControllerAPLDatasource, LIVE_VIEW_CAMERA_DOCUMENT_TOKEN, resolveLiveViewControllerAPLPayload } from "../../src/apl/LiveViewControllerToAPLResolver";
import { LocaleLayoutDirection, LocaleType } from "@alexa-smart-screen/common";
import { LiveViewCameraAPL } from "../../src/apl/LiveViewCameraAPL";
import { LiveViewCameraSupportedViewports } from "../../src/apl/LiveViewCameraSupportedViewports";

describe("@alexa-smart-screen/live-view-camera - Live View Controller StartLiveView directives to APL template functionality", () => {

    it(`should be able to convert an IStartLiveViewPayload payload to a valid IAPLRenderDocumentRequestPayload payload`, () => {
        const locale : LocaleType = LocaleType.EN_US;
        const layoutDirection : LocaleLayoutDirection = LocaleLayoutDirection.LEFT_TO_RIGHT;

        const document : any = LiveViewCameraAPL;
        document.environment = {
            lang : locale,
            layoutDirection : layoutDirection
        };

        const datasources : ILiveViewControllerAPLDatasource = {
            liveView : SampleStartLiveViewPayload,
            options : {}
          };

        const expectedLVCRenderDocumentMessagePayload : IAPLRenderDocumentRequestPayload = {
            token : LIVE_VIEW_CAMERA_DOCUMENT_TOKEN,
            windowId : LIVE_VIEW_CAMERA_WINDOW_ID,
            payload : {
                document,
                datasources,
                supportedViewports : LiveViewCameraSupportedViewports
            }
        };

        const aplRenderDocumentMessagePayload : IAPLRenderDocumentRequestPayload = resolveLiveViewControllerAPLPayload(
            datasources,
            locale,
            layoutDirection);
        
        chai.assert.deepOwnInclude(
            aplRenderDocumentMessagePayload,
            expectedLVCRenderDocumentMessagePayload
        );
    });
});
