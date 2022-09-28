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

import { UIMode, ViewportShape } from "@alexa-smart-screen/common";

export const APL_METRICS_REPORT_MESSAGE_NAME = 'metricsReport';
export const APL_VIEWHOST_EVENT_MESSAGE_NAME = 'viewhostEvent';
export const APL_INITIALIZE_RENDERERS_REQUEST_MESSAGE_NAME = 'initializeRenderersRequest';
export const APL_RENDER_COMPLETED_MESSAGE_NAME = 'renderCompleted';
export const APL_RENDER_DOCUMENT_REQUEST_MESSAGE_NAME = 'renderDocumentRequest';
export const APL_EXECUTE_COMMANDS_REQUEST_MESSAGE_NAME = 'executeCommandsRequest';
export const APL_CLEAR_DOCUMENT_REQUEST_MESSAGE_NAME = 'clearDocumentRequest';

/**
 * Interface for createRenderer directive payload
 * @member windowId Identifies which window to render the specified APL document.
 * @member token Unique identifier for the APL document.
 */
export interface IAPLCreateRendererPayload {
    windowId : string;
    token : string;
}

/**
 * Interface for sendMessageToViewhost directive payload
 * @member windowId Identifies the APL window/document instance for which the APL core message is intended.
 * @member payload Opaque serialized APL Core message payload to be provided to the IPC APL Viewhost.
 */
export interface IAPLViewhostMessagePayload {
    windowId : string;
    payload : any;
}

/**
 * Interface for renderCompleted event payload
 * @member windowId Identifies the the APL renderer/window instance which has completed rendering an APL document.
 */
export interface IAPLRenderCompletedPayload {
    windowId : string;
}

/**
 * Interface for metricsReport event payload
 * @member type The type of APL Metric (defined by the APL Viewhost)
 * @member windowId Identifies the APL renderer/window instance from which this metric event iminates.
 * @member payload Opaque serialized APL Viewhost message payload to be passed to the native APL Client
 */
export interface IAPLMetricsReportPayload {
    type : string;
    windowId : string;
    payload : any;
}

/**
 * Inteface for APL Renderer Instance
 * @member windowId windowId for the APL renderer instance to initialize
 * @member Array of APL extension URI's for the extensions to be supported by this renderer instance.
 */
export interface IAPLRendererInstance {
    windowId : string;
    supportedExtensions : string[];
}

/**
 * Interface for initializeRenderersRequest event payload
 * @member rendererInstances array of IAPLRendererInstance
 */
export interface IAPLInitRenderersRequestPayload {
    rendererInstances : IAPLRendererInstance[];
}

/**
 * Interface for APL document supportedViewport definition
 * https://developer.amazon.com/docs/alexa/alexa-presentation-language/apl-select-the-viewport-profiles-your-skill-supports.html
 */
export interface IRenderDocumentSupportedViewport {
  mode : UIMode;
  shape : ViewportShape;
  minWidth ?: number;
  maxWidth ?: number;
  minHeight ?: number;
  maxHeight ?: number;
}

/**
 * Interface for APL Render Document payload
 * @member document APL document to be rendered.
 * @member datasources Data sources to bind to the rendered document.
 * @member supportedViewports Array of IRenderDocumentSupportedViewport that the specified APL document supports.
 */
export interface IAPLRenderDocumentPayload {
  document : any;
  datasources : any;
  supportedViewports : IRenderDocumentSupportedViewport[];
}

/**
 * Interface for the renderDocumentRequest event payload
 * @member token A unique identifier for the document.
 * @member windowId Identifies which window to render the specified APL document.
 * @member payload the IAPLRenderDocumentPayload.
 */
export interface IAPLRenderDocumentRequestPayload {
  token : string;
  windowId : string;
  payload : IAPLRenderDocumentPayload;
}

/**
 * Interface for the paylod of the IAPLExecuteCommandsRequestPayload event
 * @member commands array of APL commands
 */
export interface IAPLExecuteCommandsPayload {
    commands : any[];
}

/**
 * Interface for the executeCommandsRequest event payload
 * @member token The unique identifier for the document
 * @member payload the IAPLExecuteCommandsPayload
 */
export interface IAPLExecuteCommandsRequestPayload {
    token : string;
    payload : IAPLExecuteCommandsPayload;
}

/**
 * Interfac for the clearDocumentRequest event payload
 * @member token Identifier for the local APL document to clear.
 * @member windowId Identifies the window to clear for the local APL document.
 */
export interface IAPLClearDocumentRequestPayload {
    token : string;
    windowId : string;
}

/**
 * Util function for generating an IAPLRenderDocumentRequestPayload
 * @param token A unique identifier for the document
 * @param windowId Identifies which window to render the specified APL document.
 * @param document APL document to be rendered.
 * @param datasources Data sources to bind to the rendered document.
 * @param supportedViewports Array of IRenderDocumentSupportedViewport that the specified APL document supports.
 * @returns IAPLRenderDocumentRequestPayload
 */
export const createAPLRenderDocumentRequestPayload = (
    token : string,
    windowId : string,
    document : any,
    datasources : any,
    supportedViewports : IRenderDocumentSupportedViewport[]
  ) : IAPLRenderDocumentRequestPayload => {
    const payload : IAPLRenderDocumentRequestPayload = {
      token : token,
      windowId : windowId,
      payload : {
        document,
        datasources,
        supportedViewports,
      },
    };
    return payload;
}

/**
 * Util function for generating an IAPLExecuteCommandsRequestPayload
 * @param token The unique identifier for the document
 * @param commands array of APL commands
 * @returns IAPLExecuteCommandsRequestPayload
 */
export const createAPLExecuteCommandsRequestPayload = (
    token : string,
    commands : any[]
  ) : IAPLExecuteCommandsRequestPayload => {
    const payload : IAPLExecuteCommandsRequestPayload = {
      token : token,
      payload : {
        commands : commands,
      },
    };
    return payload;
}

/**
 * Util function for generating an IAPLClearDocumentRequestPayload
 * @param token The unique identifier for the document
 * @param windowId The document's windowId
 * @returns IAPLClearDocumentRequestPayload
 */
export const createAPLClearDocumentRequestPayload = (
    token : string,
    windowId : string
  ) : IAPLClearDocumentRequestPayload => {
    
    const payload : IAPLClearDocumentRequestPayload = {
      token : token,
      windowId : windowId
    };
    return payload;
}