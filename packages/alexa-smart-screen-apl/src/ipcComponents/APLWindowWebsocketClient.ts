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

import { AVSVisualInterfaces, ContentType, DefaultActivityTracker, DefaultFocusManager } from '@alexa-smart-screen/common';
import { APLClient } from 'apl-client';
import { APLVideo } from '../media/APLVideo';
import { IAPLWindowElementProps } from '../window/APLWindowElementProps';
import { APLEvent } from './APLEvent';
import { IAPLRendererInstance, IAPLRenderCompletedPayload } from './APLMessageInterfaces';
import { IPC_CONFIG_APL } from './IPCNamespaceConfigAPL';

export class APLWindowWebsocketClient extends APLClient {
  private aplEvent : APLEvent;
  private windowId : string;

  constructor(props : IAPLWindowElementProps) {
    // Factory func for creating the APLVideo component that extends the APL MediaPlayerHandle
    const mediaPlayerFactory = (mediaPlayer : APL.MediaPlayer) => new APLVideo(
      mediaPlayer, AVSVisualInterfaces.ALEXA_PRESENTATION_APL, ContentType.MIXABLE, 
      props.loggerFactory.getLogger(IPC_CONFIG_APL.namespace), 
      props.focusManager || new DefaultFocusManager(), 
      props.guiActivityTracker || new DefaultActivityTracker());
    super(mediaPlayerFactory);
    this.windowId = props.windowId;
    this.aplEvent = props.aplEvent;
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
