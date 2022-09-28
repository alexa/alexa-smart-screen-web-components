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

import { AuthorizationState } from '@alexa-smart-screen/common';
import { AudioInputInitiator } from '@alexa-smart-screen/common';
import { ClientConnection, IHomeScreenProps } from './HomeScreen';

export class InteractionDetails extends HTMLElement {
  private homeSettings : IHomeScreenProps;

  constructor() {
    super();
    this.attachShadow({ mode : 'open' });
    this.applyStyle();
    this.render();
  }

  private applyStyle() : void {
    this.style.fontSize = '40px';
    this.style.fontWeight = 'bold';
    this.style.fontFamily = 'sans-serif';
    this.style.color = 'lightgray';
    this.style.paddingTop = '5px';
    this.style.textAlign = 'center';
    this.style.userSelect = 'none';
  }

  private applyAuthorizationStyle() : void {
    this.style.fontSize = '25px';
    this.style.fontWeight = 'normal';
    this.style.userSelect = 'text';
  }

  public updateSettings(homeSettings : IHomeScreenProps) : void {
    this.homeSettings = homeSettings;
    this.render();
  }

  public render() : void {
    let interactionString  = '';

    if (this.homeSettings && this.homeSettings.clientConnection === ClientConnection.CONNECTED) {
      if (this.homeSettings.authorizationState === AuthorizationState.REFRESHED) {
        // If authorized, with valid input config values, display details on interacting with Alexa
        const talkKey = this.homeSettings.talkKey.toUpperCase();
        switch (this.homeSettings.audioInputInitiator) {
          case AudioInputInitiator.PRESS_AND_HOLD : {
              interactionString = `Press and Hold "${talkKey}" then Speak`;
              break;
          }
          case AudioInputInitiator.TAP : {
              interactionString = `Tap "${talkKey}" then Speak`;
              break;
          }
          case AudioInputInitiator.WAKEWORD :
          default : {
              interactionString = `Say "Alexa" to Talk`;
              break;
          }
        }
        this.applyStyle();
      } else if (this.homeSettings.authorizationRequest) {
        // If not yet authorized, display details on completing authorization
        interactionString = `
        <style>
        a:link {
          color: #31C3F3;
        }
        a:visited {
          color: #31C3F3;
        }
        a:hover {
          color: white;
        }
        a:active {
          color: #2080A0;
        }
        </style>
        <p>
        To authorize, login with Amazon at: <a href='${this.homeSettings.authorizationRequest.url}'
        target='_blank' rel='noopener noreferrer'>${this.homeSettings.authorizationRequest.url}</a><br>
        and enter this code:<br><br>
        <span style='color:#31C3F3; font-size:40px; font-weight:bold;'>${this.homeSettings.authorizationRequest.code}</span></p>`;
        this.applyAuthorizationStyle();
      } 
    }

    this.shadowRoot.innerHTML = interactionString;
  }
}

window.customElements.define('alexa-interaction', InteractionDetails);
