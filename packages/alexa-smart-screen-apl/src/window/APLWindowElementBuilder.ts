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
import { IAPLWindowElementProps } from './APLWindowElementProps';
import { APLWindowElement } from './APLWindowElement';
import { AVSVisualInterfaces, DisplayOrientation, IWindowConfig } from '@alexa-smart-screen/common';
import { IAPLWindowConfig } from './IAPLWindowConfig';

/**
 * Builder class for APLWindowElement
 */
export class APLWindowElementBuilder extends DisplayWindowElementBuilder<APLWindowElement> {
  private window : APLWindowElement;

  /**
   * Reports if a window config is a valid APL Window Config
   * 
   * @param windowConfig the config to validate
   * @returns true if config is a valid APL Window Config
   */
  public static isAPLWindowConfig(windowConfig : IWindowConfig) : boolean {
    return windowConfig.supportedInterfaces.includes(AVSVisualInterfaces.ALEXA_PRESENTATION_APL);
  }

  /**
   * Returns APL extensions supported as defined in the config
   * 
   * @param windowConfig the config to from which to extract supported APL extensions
   * @returns List of supported APL extension URI's
   */
  public static getSupportedExtensionsFromConfig(windowConfig : IAPLWindowConfig) : string[] {
    const aplRendererParameters = windowConfig.aplRendererParameters;
    return aplRendererParameters && aplRendererParameters.supportedExtensions ? 
                                aplRendererParameters.supportedExtensions : [];  
  }

  /**
   * Creates an APL Window Element
   * 
   * @param windowConfig the base window config
   * @param aplWindowProps APL renderer window props
   * @param orientation display orientation
   * @returns an APL Window Element
   */
  public static createWindow (
    windowConfig : IAPLWindowConfig,
    aplWindowProps : IAPLWindowElementProps,
    orientation : DisplayOrientation
    ) : APLWindowElement {

    // Populate supported extensions from config  
    aplWindowProps.rendererProps.supportedExtensions = APLWindowElementBuilder.getSupportedExtensionsFromConfig(windowConfig); 
    return new APLWindowElementBuilder(aplWindowProps)
      .setWindowConfig(windowConfig)
      .setDisplayOrientation(orientation)
      .build();
  }

  constructor(props : IAPLWindowElementProps) {
    super();
    this.window = new APLWindowElement(props);
  }

  /**
   * Return the APL window element
   */
  public getWindowElement() : APLWindowElement {
    return this.window;
  }

  /**
   * Build the APL window element post any initializations required
   */
  public build() : APLWindowElement {
    super.build();
    return this.window;
  }
}
