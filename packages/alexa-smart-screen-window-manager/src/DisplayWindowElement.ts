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

import { AVSVisualInterfaces, DisplayOrientation, IDerivedWindowCharacteristics, IDisplayWindowConfig, IDisplayWindowInstanceConfiguration, IWindowConfig, IWindowDimensions, IWindowInstance, VisualCharacteristicsManager, WindowSizeType, WindowType } from '@alexa-smart-screen/common';
import { BaseWindowElement } from './BaseWindowElement';

/**
 * Abstract base class for creating window elements corresponding to Alexa.Display.Window Interface
 */
export abstract class DisplayWindowElement extends BaseWindowElement {
  protected displayWindowConfig : IDisplayWindowConfig;
  protected displayConfiguration : IDisplayWindowInstanceConfiguration;
  protected windowCharacteristics : IDerivedWindowCharacteristics | null;
  protected supportedInterfaces : AVSVisualInterfaces[];
  protected initialized : boolean;

  constructor(windowId : string) {
    super(windowId);
    this.initialized = false;
  }

  protected setStateInternal() : void {
    // No-op
  }

  public setWindowConfig(config : IWindowConfig) : void {
    super.setWindowConfig(config);
    // Cache the Display Window Config
    this.displayWindowConfig = this.config.displayWindowConfig;
    // Cache the Supported AVS Interfaces
    this.supportedInterfaces = this.config.supportedInterfaces;
  }

  public getSizeType() : WindowSizeType {
    return this.windowCharacteristics ? this.windowCharacteristics.sizeType : WindowSizeType.DISCRETE;
  }

  public getDisplayType() : WindowType {
    return this.windowCharacteristics ? this.windowCharacteristics.displayType : WindowType.STANDARD;
  }

  public getDimensions() : IWindowDimensions {
    // For continuous windows, report dimensions using latest width/height values
    if (this.getSizeType() === WindowSizeType.CONTINUOUS || !this.windowCharacteristics) {
      return {
        width : this.width,
        height : this.height,
        minWidth : this.minWidth,
        maxWidth : this.maxWidth,
        minHeight : this.minHeight,
        maxHeight : this.maxHeight
      }
    }
    // For standard windows, report original dimensions from characteristics
    return this.windowCharacteristics.dimensions;
  }

  public setDisplayOrientation(orientation : DisplayOrientation) : void {
    super.setDisplayOrientation(orientation);
    if (!this.displayWindowConfig || this.displayWindowConfig.configurations === undefined) return;
    const landscapeConfig = this.displayWindowConfig.configurations[DisplayOrientation.LANDSCAPE];
    const portraitConfig = this.displayWindowConfig.configurations[DisplayOrientation.PORTRAIT];
    if (landscapeConfig === undefined && portraitConfig === undefined) {
      return;
    }
    switch(this.displayOrientation) {
      case DisplayOrientation.LANDSCAPE:
        this.displayConfiguration = landscapeConfig || portraitConfig;
        break;
      case DisplayOrientation.PORTRAIT:
        this.displayConfiguration = portraitConfig || landscapeConfig;
        break;
    }
    this.applyDisplayConfig();
  }

  protected applyDisplayConfig() {
    const windowInstance : IWindowInstance = this.getWindowInstance();
    if (windowInstance === undefined) {
      return;
    }
    this.windowCharacteristics = VisualCharacteristicsManager.getInstance().getDerivedWindowCharacteristics(windowInstance);
    if (this.windowCharacteristics !== null) {
      this.setDimensions(this.windowCharacteristics.dimensions);
      this.setWindowPosition(this.displayConfiguration.position || this.config.windowPosition);
      if (this.initialized) {
        this.setTransitions();
      }
      this.initialized = true;
    }
  }

  public getWindowInstance() : IWindowInstance {
    if (!this.config || !this.displayWindowConfig || !this.displayConfiguration) {
      return undefined;
    }
    return {
      windowId : this.windowId,
      templateId : this.displayWindowConfig.templateId,
      sizeConfigurationId : this.displayConfiguration.sizeConfigurationId,
      interactionMode : this.displayConfiguration.interactionMode,
      supportedInterfaces : this.supportedInterfaces,
      zOrderIndex : this.zOrder
    };
  }
}
