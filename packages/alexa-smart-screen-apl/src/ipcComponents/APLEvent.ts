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

import { IClient, EventHandler } from '@alexa-smart-screen/common';
import { 
  APL_METRICS_REPORT_MESSAGE_NAME, 
  APL_VIEWHOST_EVENT_MESSAGE_NAME, 
  APL_INITIALIZE_RENDERERS_REQUEST_MESSAGE_NAME, 
  APL_CLEAR_DOCUMENT_REQUEST_MESSAGE_NAME, 
  APL_EXECUTE_COMMANDS_REQUEST_MESSAGE_NAME, 
  APL_RENDER_DOCUMENT_REQUEST_MESSAGE_NAME, 
  APL_RENDER_COMPLETED_MESSAGE_NAME, 
  IAPLMetricsReportPayload, 
  IAPLInitRenderersRequestPayload, 
  IAPLRendererInstance, 
  IAPLRenderCompletedPayload, 
  IAPLClearDocumentRequestPayload, 
  IAPLExecuteCommandsRequestPayload, 
  IAPLRenderDocumentRequestPayload } from './APLMessageInterfaces';
import { IAPLEvent } from './IAPLEvent';
import { IPC_CONFIG_APL } from './IPCNamespaceConfigAPL'

export class APLEvent extends EventHandler implements IAPLEvent {

  constructor(client : IClient) {
    super(client, IPC_CONFIG_APL);
  }

  /**
   * Method to send an viewhostEvent message to the client
   * @param payload
   */
   public viewhostEvent(payload : any) : void {
    this.sendResponseEvent(APL_VIEWHOST_EVENT_MESSAGE_NAME, payload);
  }

  /**
   * Method to send a renderCompleted message to the client
   * @param payload the IAPLRenderCompletePayload
   */
  public renderCompleted(payload : IAPLRenderCompletedPayload) : void {
    this.sendResponseEvent(APL_RENDER_COMPLETED_MESSAGE_NAME, payload);
  }

  /**
   * Method to send a metricsReport message to the client
   * @param payload the IAPLMetricsReportPayload
   */
  public metricsReport(payload : IAPLMetricsReportPayload) : void {
    this.sendResponseEvent(APL_METRICS_REPORT_MESSAGE_NAME, payload );
  }

  /**
   * Method to send an initializeRenderersRequest to the client to initialize the native APL renderer instances.
   * @param rendererInstances array of IAPLRendererInstance definitions
   */
  public initializeRenderersRequest(rendererInstances : IAPLRendererInstance[]) : void {
    const payload : IAPLInitRenderersRequestPayload = {
      rendererInstances
    };
    this.sendResponseEvent(APL_INITIALIZE_RENDERERS_REQUEST_MESSAGE_NAME, payload);
  }

  /**
   * Method to send a renderDocumentRequest message to the client to initialize a local document render.
   * @param payload the IAPLRenderDocumentRequestPayload
   */
  public renderDocumentRequest(payload : IAPLRenderDocumentRequestPayload) : void {
    this.sendResponseEvent(APL_RENDER_DOCUMENT_REQUEST_MESSAGE_NAME, payload);
  }

  /**
   * Method to send a executeCommandsRequest message to the client to execute commands against a local document.
   * @param payload the IAPLExecuteCommandsRequestPayload
   */
  public executeCommandsRequest(payload : IAPLExecuteCommandsRequestPayload) : void {
    this.sendResponseEvent(APL_EXECUTE_COMMANDS_REQUEST_MESSAGE_NAME, payload);
  }

  /**
   * Method to send a clearDocumentRequest message to the client to clear the local document.
   * @param payload the IAPLClearDocumentRequestPayload
   */
  public clearDocumentRequest(payload : IAPLClearDocumentRequestPayload) : void {
    this.sendResponseEvent(APL_CLEAR_DOCUMENT_REQUEST_MESSAGE_NAME, payload);
  }
}
