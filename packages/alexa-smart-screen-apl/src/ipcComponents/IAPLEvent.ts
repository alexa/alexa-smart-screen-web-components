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

import { IAPLMetricsReportPayload, IAPLRendererInstance, IAPLRenderCompletedPayload, IAPLClearDocumentRequestPayload, IAPLExecuteCommandsRequestPayload, IAPLRenderDocumentRequestPayload } from "./APLMessageInterfaces";

/**
 * Interface for APL Events
 */
export interface IAPLEvent {
    viewhostEvent(payload : any) : void;
    renderCompleted(payload : IAPLRenderCompletedPayload) : void;
    metricsReport(payload : IAPLMetricsReportPayload) : void;
    initializeRenderersRequest(rendererInstances : IAPLRendererInstance[]) : void;
    renderDocumentRequest(payload : IAPLRenderDocumentRequestPayload) : void;
    executeCommandsRequest(payload : IAPLExecuteCommandsRequestPayload) : void;
    clearDocumentRequest(payload : IAPLClearDocumentRequestPayload) : void;
}
