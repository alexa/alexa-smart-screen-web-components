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

import { AudioInputInitiator, AuthorizationState, DisplayMode, ICBLAuthorizationRequest } from '@alexa-smart-screen/common';
import { Logo } from './Logo';
import { Usage } from './Usage';

/**
 * Enumerated state of SampleApp Client used for Home Screen display
 */
export enum ClientConnection {
  /// Client is connecting to server/Alexa service.
  CONNECTING = 'CONNECTING',
  /// Client connected to server/Alexa service.
  CONNECTED = 'CONNECTED',
  /// Client disconnected from server/Alexa service.
  DISCONNECTED = 'DISCONNECTED',
  /// Client version is not supported by server.
  UNSUPPORTED = 'UNSUPPORTED'
}

export interface IHomeScreenProps {
  ipcVersion : string;
  clientConnection : ClientConnection;
  description : string;
  audioInputInitiator : AudioInputInitiator;
  displayMode : DisplayMode;
  talkKey : string;
  authorizationState : AuthorizationState;
  authorizationRequest : ICBLAuthorizationRequest;
}

export class HomeScreen extends HTMLElement {
  private logo : Logo;
  private usage : Usage;

  constructor() {
    super();
    this.attachShadow({ mode : 'open' });
    this.applyStyle();
    this.logo = new Logo();
    this.usage = new Usage();
    this.shadowRoot.appendChild(this.logo);
    this.shadowRoot.appendChild(this.usage);
  }

  private applyStyle() {
    this.style.backgroundColor = '#232F3E';
    this.style.display = 'flex';
    this.style.flexDirection = 'column';
    this.style.alignItems = 'center';
    this.style.justifyContent = 'center';
    this.style.height = '100%';
  }

  public updateScreen(homeSettings : IHomeScreenProps) : void {
    this.usage.updateSettings(homeSettings);
  }
}

window.customElements.define('home-screen', HomeScreen);
