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

import { AplExtensionURI, APLWindowElement } from '@alexa-smart-screen/apl';
import { IAPLWindowElementProps } from '@alexa-smart-screen/apl';
import { AVSVisualInterfaces, IWindowConfig, WindowContentType } from '@alexa-smart-screen/common';

export const MEDIA_PLAYER_WINDOW_ID  = 'mediaPlayerWindow';

export class PlayerInfoWindowElement extends APLWindowElement {

  constructor(props : IAPLWindowElementProps) {
    props.windowId = MEDIA_PLAYER_WINDOW_ID;
    // Ensure APL AudioPlayer Extension is always included 
    if (!props.rendererProps.supportedExtensions.includes(AplExtensionURI.AUDIOPLAYER)) {
      props.rendererProps.supportedExtensions.push(AplExtensionURI.AUDIOPLAYER);
    }  
    super(props);
    this.contentType = WindowContentType.MEDIA;
  }

  public setWindowConfig(config : IWindowConfig) : void {
    super.setWindowConfig(config);
    // Ensure window only supports the TemplateRuntime Interface
    this.supportedInterfaces = [AVSVisualInterfaces.TEMPLATE_RUNTIME];
  }
}

window.customElements.define('player-info-window-element', PlayerInfoWindowElement);
