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

import { AuthorizationState, MIN_SUPPORTED_ACSDK_IPC_FRAMEWORK_VERSION } from '@alexa-smart-screen/common';
import { ClientConnection, IHomeScreenProps } from './HomeScreen';

export class DeviceDescription extends HTMLElement {
  private homeSettings : IHomeScreenProps;

  constructor() {
    super();
    this.attachShadow({ mode : 'open' });
    this.render();
  }

  public updateSettings(homeSettings : IHomeScreenProps) : void {
    this.homeSettings = homeSettings;
    this.render();
  }

  private applyStyle() : void {
    this.style.fontSize = '40px';
    this.style.fontFamily = 'sans-serif';
    this.style.color = 'lightgray';
    this.style.paddingTop = '5px';
    this.style.textAlign = 'center';
  }

  public render() : void {
    this.applyStyle();
    let deviceDescription  = 'Attempting connection to server...';
    if (this.homeSettings) {
      if (this.homeSettings.clientConnection === ClientConnection.CONNECTED) {
        // If authorized, display device description, otherwise display authorizing notice
        if (this.homeSettings.authorizationState === AuthorizationState.REFRESHED) {
          deviceDescription = `${this.homeSettings.description}<br>Display Mode: ${this.homeSettings.displayMode}`
        } else {
          if (this.homeSettings.authorizationRequest) {
            deviceDescription = 'Authorize Device';
          } else if (this.homeSettings.authorizationState === AuthorizationState.AUTHORIZING) {
            deviceDescription = 'Waiting for authorization code...';
          } else {
            deviceDescription = 'Connecting...';
          }
        }
      } else if (this.homeSettings.clientConnection === ClientConnection.UNSUPPORTED) {
        this.style.fontSize = '25px';
        deviceDescription = `This Sample App version requires ACSDK IPC Version: ${MIN_SUPPORTED_ACSDK_IPC_FRAMEWORK_VERSION}.<br>The requesting ACSDK IPC Version is: ${this.homeSettings.ipcVersion}<br><br>Please upgrade to a supported version.`
      } else if (this.homeSettings.clientConnection === ClientConnection.DISCONNECTED) {
        deviceDescription = 'Client disconnected, please restart'
      }
    }
    this.shadowRoot.innerHTML = deviceDescription;
  }
}

window.customElements.define('alexa-description', DeviceDescription);
