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

import alexaLogoImage from '../../assets/Alexa_Logo_RGB_BLUE.png';

export class Logo extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode : 'open' });
    this.applyStyle();
  }

  private applyStyle() {
    this.style.backgroundImage = `url("${alexaLogoImage}")`;
    this.style.backgroundPosition = 'center';
    this.style.backgroundRepeat = 'no-repeat';
    this.style.backgroundSize = 'contain';
    this.style.width = '175px';
    this.style.height = '112px';
  }
}

window.customElements.define('alexa-logo', Logo);
