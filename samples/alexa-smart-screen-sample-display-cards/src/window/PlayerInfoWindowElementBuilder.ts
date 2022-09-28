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

import { DisplayWindowElementBuilder } from '@alexa-smart-screen/window-manager';
import { APLWindowElementBuilder, IAPLWindowConfig, IAPLWindowElementProps } from '@alexa-smart-screen/apl';
import { PlayerInfoWindowElement } from './PlayerInfoWindowElement';
import { DisplayOrientation } from '@alexa-smart-screen/common';

/**
 * Builder class for PlayerInfoWindowElementBuilder
 */
export class PlayerInfoWindowElementBuilder extends DisplayWindowElementBuilder<PlayerInfoWindowElement> {
  private window : PlayerInfoWindowElement;

  /**
   * Creates an APL Based PlayerInfo Window Element
   * 
   * @param windowConfig the base window config
   * @param aplWindowProps APL renderer window props
   * @param orientation display orientation
   * @returns an PlayerInfoWindow Element
   */
  public static createWindow (
    windowConfig : IAPLWindowConfig,
    aplWindowProps : IAPLWindowElementProps,
    orientation : DisplayOrientation
    ) : PlayerInfoWindowElement {

  // Populate supported extensions from config
  aplWindowProps.rendererProps.supportedExtensions = APLWindowElementBuilder.getSupportedExtensionsFromConfig(windowConfig);      

    return new PlayerInfoWindowElementBuilder(aplWindowProps)
      .setWindowConfig(windowConfig)
      .setDisplayOrientation(orientation)
      .build();
  }

  constructor(props : IAPLWindowElementProps) {
    super();
    this.window = new PlayerInfoWindowElement(props);
  }

  /**
   * Return the Player Info window element
   */
  public getWindowElement() : PlayerInfoWindowElement {
    return this.window;
  }

  /**
   * Build the Player Info window element post any initializations required
   */
  public build() {
    super.build();
    return this.window;
  }
}
