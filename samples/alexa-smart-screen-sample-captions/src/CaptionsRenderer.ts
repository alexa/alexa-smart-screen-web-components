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

import {
  CaptionsHandler,
  ICaptionsLine,
  ICaptionsObserver
} from '@alexa-smart-screen/app-utils';

import {
  BackgroundColorCssProperty,
  ColorCssProperty,
  FlexDirectionCssProperty,
  FontFamilyCssProperty,
  OpacityCssProperty,
  PointerEventsCssProperty,
  PositionCssProperty,
  TextAlignCssProperty,
  DirectionCssProperty,
  ILocales, 
  ILocaleObserver, 
  LocaleLayoutDirection
} from '@alexa-smart-screen/common';

export const CAPTIONS_VIEW_DIV_ID  = 'captionsView';
export const CAPTION_LINE_DIV_CLASSNAME  = 'captionLine';

export class CaptionsRenderer extends HTMLElement implements ICaptionsObserver, ILocaleObserver {
  // Render elements
  private captionsViewDiv : HTMLDivElement;

  // Component state
  private lastCaptionTimeoutId : number;

  constructor(captionsHandler : CaptionsHandler) {
    super();
    captionsHandler.getObserverManager().addObserver(this);
    this.attachShadow({ mode : 'open' });
    this.render();
  }

  public onRenderCaptions(captionLines : ICaptionsLine[], duration : number, delay : number) : void {
    window.setTimeout(this.updateCaptionsView.bind(this, captionLines, duration), delay);
  }

  public onSetCaptionsState(enabled : boolean) {
    // no-op
  }

  private updateCaptionsView(captionLines : ICaptionsLine[], duration : number) : void {
    clearTimeout(this.lastCaptionTimeoutId);
    this.clearCaptionsView();
    captionLines.forEach((captionLine : ICaptionsLine) => {
      this.captionsViewDiv.appendChild(this.renderCaptionLine(captionLine.text));
    });
    this.lastCaptionTimeoutId = window.setTimeout(this.clearCaptionsView.bind(this), duration);
  }

  private clearCaptionsView() : void {
    this.captionsViewDiv.innerHTML = '';
  }

  private renderCaptionLine(message : string) : HTMLDivElement {
    const div = document.createElement('div');
    div.className = CAPTION_LINE_DIV_CLASSNAME;
    div.style.backgroundColor = BackgroundColorCssProperty.BLACK;
    div.style.padding = '1%';
    div.textContent = message;
    return div;
  }

  private renderCaptionsView() : void {
    this.captionsViewDiv = document.createElement('div')
    this.captionsViewDiv.className = CAPTIONS_VIEW_DIV_ID;
    this.captionsViewDiv.style.position = PositionCssProperty.FIXED;
    this.captionsViewDiv.style.bottom = '0';
    this.captionsViewDiv.style.left = '5%';
    this.captionsViewDiv.style.width = '90%';
    this.captionsViewDiv.style.fontSize = '6vmin';
    this.captionsViewDiv.style.fontFamily = FontFamilyCssProperty.SANS_SERIF;
    this.captionsViewDiv.style.color = ColorCssProperty.WHITE;
    this.captionsViewDiv.style.textAlign = TextAlignCssProperty.LEFT;
    this.captionsViewDiv.style.paddingBottom = '2vh';
    this.captionsViewDiv.style.margin = '0 auto';
  }

  private setParentStyle() : void {
    this.style.position = PositionCssProperty.FIXED;
    this.style.bottom = '0';
    this.style.height = '100%';
    this.style.width = '100%';
    this.style.flexDirection = FlexDirectionCssProperty.COLUMN;
    this.style.pointerEvents = PointerEventsCssProperty.NONE;
    this.style.opacity = OpacityCssProperty.OPAQUE;
  }

  private render() : void {
    this.setParentStyle();
    this.renderCaptionsView();
    this.shadowRoot.appendChild(this.captionsViewDiv);
  }

  public onLocaleChanged(locales : ILocales, localeLayoutDirection : LocaleLayoutDirection) : void {
    let captionsViewTextAlign : TextAlignCssProperty;
    let captionsViewDirection : DirectionCssProperty;
    switch (localeLayoutDirection) {
      case LocaleLayoutDirection.RIGHT_TO_LEFT:
        captionsViewTextAlign = TextAlignCssProperty.RIGHT;
        captionsViewDirection = DirectionCssProperty.RTL;
        break;
      default:
        captionsViewTextAlign = TextAlignCssProperty.LEFT;
        captionsViewDirection = DirectionCssProperty.LTR;
    }
    this.captionsViewDiv.style.textAlign = captionsViewTextAlign;
    this.captionsViewDiv.style.direction = captionsViewDirection;
  }
}

window.customElements.define('captions-renderer', CaptionsRenderer);
