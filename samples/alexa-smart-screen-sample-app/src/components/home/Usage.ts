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

import { DeviceDescription } from './DeviceDescription';
import { IHomeScreenProps } from './HomeScreen';
import { InteractionDetails } from './InteractionDetails';

export class Usage extends HTMLElement {

  private talkSetting : InteractionDetails;
  private deviceDesc : DeviceDescription;

  constructor() {
    super();
    this.attachShadow({ mode : 'open' });
    this.applyStyle();
    this.deviceDesc = new DeviceDescription();
    this.talkSetting = new InteractionDetails();
    this.shadowRoot.appendChild(this.deviceDesc);
    this.shadowRoot.appendChild(this.talkSetting);
  }

  public updateSettings(homeSettings : IHomeScreenProps) : void {
    this.talkSetting.updateSettings(homeSettings);
    this.deviceDesc.updateSettings(homeSettings);
  }

  private applyStyle() : void {
    this.style.display = 'flex';
    this.style.flexDirection = 'column';
    this.style.alignItems = 'center';
    this.style.justifyContent = 'center';
  }
}

window.customElements.define('alexa-usage', Usage);
