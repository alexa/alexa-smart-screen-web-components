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

import { APLClient } from 'apl-client';
import { APLEvent } from './APLEvent';
import { IAPLRendererInstance, IAPLRenderCompletedPayload } from './APLMessageInterfaces';

export class APLWindowWebsocketClient extends APLClient {
  private aplEvent : APLEvent;
  private windowId : string;

  constructor(aplEvent : APLEvent, windowId : string) {
    super();
    this.windowId = windowId;
    this.aplEvent = aplEvent;
  }

  /**
   * Method to send a message to the client to initialize an APL renderer instance
   * @param rendererInstance the IAPLRendererInstance for the renderer to initialize
   */
  public initializeRenderer(rendererInstance : IAPLRendererInstance) {
    this.aplEvent.initializeRenderersRequest([rendererInstance]);
  }

  /**
   * Method to handle a message from the viewhost
   * @param message the viewhost message
   */
  public sendMessage(message : any) : void {
    switch (message.type) {
      // send metrics report
      case 'displayMetrics': {
        // append windowID to message for IAPLMetricsReportPayload
        message.windowId = this.windowId;
        this.aplEvent.metricsReport(message);
        break;
      }
      // send viewhost event
      default : {
        const viewhostEventPayload = {
            windowId : this.windowId,
            payload : message
        };
        this.aplEvent.viewhostEvent(viewhostEventPayload);
      }
    }
  }

  /**
   * Method to send a renderCompleted message to the client
   */
  public renderComplete() : void {
    const message : IAPLRenderCompletedPayload = {
      windowId : this.windowId
    };
    this.aplEvent.renderCompleted(message);
  }
}
