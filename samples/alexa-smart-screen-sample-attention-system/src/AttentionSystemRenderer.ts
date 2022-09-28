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
  AlexaState,
  AudioInputInitiator,
  IAttentionSystemRenderer,
  ISetVisualCharacteristicsDirectivePayload,
  ViewportShape,
  // Css Types
  ColorCssProperty,
  DisplayCssProperty,
  FlexDirectionCssProperty,
  FontFamilyCssProperty,
  JustifyContentCssProperty,
  OpacityCssProperty,
  PointerEventsCssProperty,
  PositionCssProperty,
  VisibilityCssProperty,
  IAlexaInputs,
} from '@alexa-smart-screen/common';
import {
  AttentionSystemState
} from './lib/AttentionSystemState';

export const ATTENTION_SYSTEM_STATE_DIV_ID = 'attentionSystemState';
export const DO_NOT_DISTURB_TIMEOUT = 5000;

export class AttentionSystemRenderer extends HTMLElement implements IAttentionSystemRenderer {
  // Render elements
  private attentionSystemStateViewDiv : HTMLDivElement;

  // Component state
  private attentionSystemState : AttentionSystemState | string = AttentionSystemState.UNKNOWN;
  private alexaState : AlexaState;
  private lastDoNotDisturbAttentionSystemStateTimeout : number;
  private doNotDisturbSettingEnabled = false;
  private expectingPromptString  = '';
  private visualContentActive = false;

  constructor() {
    super();
    this.attachShadow({ mode : 'open' });
    this.render();
  }

  public getRootElement() : HTMLElement {
    return this;
  }

  public setAlexaInputs(inputs : IAlexaInputs) : void {
    switch (inputs.audioInput) {
      case AudioInputInitiator.PRESS_AND_HOLD: {
        const talkKey = inputs.talkDeviceKey.key.toUpperCase();
        this.expectingPromptString = `Press and Hold "${talkKey}" then Speak.`;
        break;
      }
      default: {
        break;
      }
    }
  }

  public onVisualCharacteristicsInit(visualCharacteristics : ISetVisualCharacteristicsDirectivePayload) : void {
    if (visualCharacteristics.deviceDisplay) {
      this.attentionSystemStateViewDiv.style.justifyContent = visualCharacteristics.deviceDisplay.shape === ViewportShape.RECTANGLE ?
        JustifyContentCssProperty.FLEX_END : JustifyContentCssProperty.CENTER;
    }
  }

  public onDoNotDisturbStateChanged(enabled : boolean) : void {
    this.doNotDisturbSettingEnabled = enabled;
    this.flashDoNotDisturbState();
  }

  public onAlexaStateChanged(alexaState : AlexaState) : void {
    this.style.opacity = alexaState !== undefined ? OpacityCssProperty.OPAQUE : OpacityCssProperty.TRANSPARENT;
    this.style.visibility = this.style.opacity === OpacityCssProperty.TRANSPARENT ? VisibilityCssProperty.HIDDEN : VisibilityCssProperty.VISIBLE;
    this.alexaState = alexaState;
    this.updateAttentionSystemState(this.visualContentActive);
    
  }

  public updateAttentionSystemState(isVisualContentActive : boolean) : void {
    this.visualContentActive = isVisualContentActive;
    // Flash DoNotDisturb indicator if enabled
    if (this.alexaState === AlexaState.IDLE && this.doNotDisturbSettingEnabled) {
      this.flashDoNotDisturbState();
    } else {
      this.updateAttentionSystemStateWithAlexaState();
    }
  }

  private flashDoNotDisturbState() {
    this.setAttentionSystemState(this.doNotDisturbSettingEnabled ? AttentionSystemState.DO_NOT_DISTURB_ENABLED : AttentionSystemState.DO_NOT_DISTURB_DISABLED);
      clearTimeout(this.lastDoNotDisturbAttentionSystemStateTimeout);
      this.lastDoNotDisturbAttentionSystemStateTimeout =
        window.setTimeout(this.updateAttentionSystemStateWithAlexaState.bind(this), DO_NOT_DISTURB_TIMEOUT);
  }

  private updateAttentionSystemStateWithAlexaState() : void {
    // Don't show speaking or idle states when we have active visual content
    if ((this.alexaState === AlexaState.SPEAKING || this.alexaState === AlexaState.IDLE) && this.visualContentActive) {
      this.setAttentionSystemState('');
      return;
    }
    // Show expecting string when in expecting state
    if (this.alexaState === AlexaState.EXPECTING) {
      this.setAttentionSystemState(this.expectingPromptString);
      return;
    }
    this.setAttentionSystemState(this.alexaState);
  }

  private setAttentionSystemState(attentionSystemState : AttentionSystemState | string) : void {
    this.attentionSystemState = attentionSystemState;
    this.attentionSystemStateViewDiv.textContent = this.attentionSystemState;
  }

  private renderAttentionSystemStateView() : void {
    this.attentionSystemStateViewDiv = document.createElement('div');
    this.attentionSystemStateViewDiv.className = ATTENTION_SYSTEM_STATE_DIV_ID;
    this.attentionSystemStateViewDiv.style.width = '98%';
    this.attentionSystemStateViewDiv.style.display = DisplayCssProperty.FLEX;
    this.attentionSystemStateViewDiv.style.flexFlow = 'row nowrap';
    this.attentionSystemStateViewDiv.style.fontSize = '20px';
    this.attentionSystemStateViewDiv.style.fontFamily = FontFamilyCssProperty.SANS_SERIF;
    this.attentionSystemStateViewDiv.style.color = ColorCssProperty.LIGHTGRAY;
    this.attentionSystemStateViewDiv.style.paddingBottom = '1vh';
    this.attentionSystemStateViewDiv.style.justifyContent = JustifyContentCssProperty.FLEX_END;
  }

  private setParentStyle() : void {
    this.style.position = PositionCssProperty.ABSOLUTE;
    this.style.height = '144px';
    this.style.width = '100%';
    this.style.display = DisplayCssProperty.FLEX;
    this.style.flexDirection = FlexDirectionCssProperty.COLUMN;
    this.style.transition = 'visibility 0.5s, opacity 0.5s ease-in-out';
    this.style.justifyContent = JustifyContentCssProperty.FLEX_END;
    this.style.pointerEvents = PointerEventsCssProperty.NONE;
    this.style.opacity = OpacityCssProperty.OPAQUE;
    this.style.visibility = VisibilityCssProperty.VISIBLE;
  }

  private render() : void {
    this.setParentStyle();
    this.renderAttentionSystemStateView();
    this.shadowRoot.append(this.attentionSystemStateViewDiv);
  }

}

window.customElements.define('attention-system-scrim', AttentionSystemRenderer);
