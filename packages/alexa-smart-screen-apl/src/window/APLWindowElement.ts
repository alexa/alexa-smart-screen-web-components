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

import { DisplayWindowElement } from '@alexa-smart-screen/window-manager';
import {
  // Css styles
  AlignItemsCssProperty,
  DisplayCssProperty,
  JustifyContentCssProperty,
  WindowResizeType,
  PositionCssProperty,
  IAudioContextControllerSettings,
  WindowState
} from '@alexa-smart-screen/common';
import { IAPLWindowElementProps } from './APLWindowElementProps';
import { APLWindowWebsocketClient } from '../ipcComponents/APLWindowWebsocketClient';
import { APLRendererWrapper } from '../renderer/APLRendererWrapper';
import { DeviceModeConverter } from '../utils/DeviceModeConverter';
import { DisplayState } from 'apl-client';

/**
 * HTMLElement representing the APL Window
 */
export class APLWindowElement extends DisplayWindowElement {

  private props : IAPLWindowElementProps;
  private client : APLWindowWebsocketClient;
  private rendererWrapper : APLRendererWrapper;

  protected rendererElement : HTMLDivElement;
  private renderComplete : boolean;

  private prevHeight : number;
  private prevWidth : number;
  private resetWidth : number;
  private resetHeight : number;

  constructor(props : IAPLWindowElementProps) {
    super(props.windowId);
    this.props = props;
    this.attachShadow({ mode : 'open' });
    this.client = new APLWindowWebsocketClient(props.aplEvent, props.windowId);

    // Init native renderer component
    this.client.initializeRenderer({
      windowId : this.props.windowId,
      supportedExtensions : this.props.rendererProps.supportedExtensions
    })

    this.renderComplete = false;

    this.disableFocusOutline();

    this.resizeElement = this.createResizeContainer();
    this.transformTransitionElement = this.createRendererContainer();
    this.createRendererElement();

    this.transformTransitionElement.appendChild(this.rendererElement);
    this.resizeElement.appendChild(this.transformTransitionElement);
    this.shadowRoot.appendChild(this.resizeElement);

    this.shadowElement = this.transformTransitionElement;
    this.applyWindowShadow();
  }

  protected setHeight(height : number) : void {
    const validHeight = this.getHeightInRange(height);
    this.prevHeight = this.height || validHeight;
    this.height = validHeight;
    this.resetHeight = undefined;
  }

  protected setWidth(width : number) : void {
    const validWidth = this.getWidthInRange(width);
    this.prevWidth = this.width || validWidth;
    this.width = validWidth;
    this.resetWidth = undefined;
  }

  protected applyDisplayConfig() : void {
    super.applyDisplayConfig();
    if (this.windowCharacteristics) {
      this.props.rendererProps.mode = DeviceModeConverter.uiModeToDeviceMode(this.windowCharacteristics.uiMode);
      this.props.rendererProps.disallowVideo = this.windowCharacteristics.disallowVideo;
    }
  }

  public update() {
    if (this.renderComplete) {
      this.rendererWrapper.updateRenderer(this.height, this.width, this.props.rendererProps);
    }
  }

  /**
   * Callback for APL document renderer instances that do not support resizing.
   * https://developer.amazon.com/docs/alexa/alexa-presentation-language/apl-document.html#supportsresizing
   * 
   * Applies artificial rotation and scale to the window based on the config change.
   * 
   * @param ignoredWidth width that was not applied to APL renderer instance.
   * @param ignoredHeight height that was not applied to APL renderer instance.
   */
  public onRendererResizingIgnored(ignoredWidth : number, ignoredHeight : number) {
    // If ignored dimensions are inversions of previous dimensions we treat as a rotation
    if (ignoredWidth === this.prevHeight && ignoredHeight === this.prevWidth) {
      this.resizeWindow(WindowResizeType.ROTATE);
    // If ignored dimenstion match previous dimensions, reset based on current resizeType
    } else if (ignoredWidth === this.prevWidth && ignoredHeight === this.prevHeight) {
      // If last resize was a rotation, we rotate back
      if (this.getResizeType() === WindowResizeType.ROTATE) {
        this.resizeWindow(WindowResizeType.ROTATE);
      } else if (this.getResizeType() === WindowResizeType.SCALE) {
        // If we were scaled due to ignored resize, return to default
        this.resizeWindow(WindowResizeType.RESET);
      }
    // If ignored dimensions are anything other than inversions of, or equal to previous dimensions, treat as a scale 
    } else {
      const scale : number = Math.min(ignoredWidth / this.prevWidth, ignoredHeight / this.prevHeight);
      this.resizeWindow(WindowResizeType.SCALE, scale);
    }

    // Reset to previous dimensions
    this.setHeight(this.prevHeight);
    this.setWidth(this.prevWidth);

    // Store the ignored dimensions as reset values for a new render
    this.resetWidth = ignoredWidth;
    this.resetHeight = ignoredHeight;
  }

  private createRendererWrapper() {
    if (this.rendererWrapper) {
      return;
    }
    this.rendererWrapper = new APLRendererWrapper({
      client : this.client,
      guiActivityTracker : this.props.guiActivityTracker,
      focusManager : this.props.focusManager,
      loggerFactory : this.props.loggerFactory,
      audioContextProvider : this.props.audioContextProvider,
      onResizingIgnoredCallback : this.onRendererResizingIgnored.bind(this),
      ...this.props.rendererProps
    });
  }

  private createResizeContainer() : HTMLDivElement {
    const div = document.createElement('div');
    div.tabIndex = 0;
    div.style.position = PositionCssProperty.ABSOLUTE;
    div.style.display = DisplayCssProperty.FLEX;
    div.style.alignItems = AlignItemsCssProperty.FLEX_END;
    div.style.justifyContent = JustifyContentCssProperty.FLEX_END;
    div.style.height = '100%';
    div.style.width = '100%';
    div.style.transformOrigin = 'center';
    div.setAttribute('name', 'resizeElement');
    return div;
  }

  private createRendererContainer() : HTMLDivElement {
    const div = document.createElement('div');
    div.style.display = DisplayCssProperty.FLEX;
    div.setAttribute('name', 'transformTransitionShadowElement');
    return div;
  }

  private createRendererElement() : void {
    this.rendererElement = document.createElement('div');
    this.rendererElement.setAttribute('name', 'aplRendererElement');
    this.transformTransitionElement.appendChild(this.rendererElement);
  }

  protected async renderInternal() : Promise<void> {
    this.createRendererWrapper();
    this.renderComplete = false;
    // Use reset dimensions as available
    if (this.resetWidth) {
      this.setWidth(this.resetWidth);
    }
    if (this.resetHeight) {
      this.setHeight(this.resetHeight);
    }
    // Wait for renderer before making window active and initiating transition.
    await this.rendererWrapper.createRenderer(this.rendererElement, this.height, this.width);
    this.renderComplete = true;
  }

  protected async hideInternal() : Promise<void> {
    // Flush audioPlayer for this window before destroying renderer
    this.rendererWrapper.flushAudioPlayer();

    await this.rendererWrapper.destroy();

    // re-initialize the renderer div
    this.transformTransitionElement.innerHTML = '';
    this.createRendererElement();
  }

  protected setStateInternal() {
    if (!this.rendererWrapper) return;
    let displayState : DisplayState;
    switch(this.getState()) {
      case WindowState.FOREGROUND:
        displayState = DisplayState.kDisplayStateForeground;
        break;
      case WindowState.BACKGROUND:
        displayState = DisplayState.kDisplayStateBackground;
        break;
      case WindowState.HIDDEN:
        displayState = DisplayState.kDisplayStateHidden;
        break;
    }
    this.rendererWrapper.setDisplayState(displayState);
  }

  /**
   * Get the APL client corresponding to this window element
   */
  public getClient() : APLWindowWebsocketClient {
    return this.client;
  }

  /**
   * Set the audio settings for the APL renderer
   * 
   * @param audioSettings audio settings to apply to the APL renderer
   */
  public setAudioSettings(audioSettings : IAudioContextControllerSettings) : void {
    if (this.rendererWrapper) {
      this.rendererWrapper.setAudioSettings(audioSettings);
    }
  }

  /**
   * Method to stop playing audio for the current APL renderer 
   */
   public flushAudioPlayer() : void {
    if (this.rendererWrapper) {
      this.rendererWrapper.flushAudioPlayer();
    }
  }
}

window.customElements.define('apl-window-element', APLWindowElement);
