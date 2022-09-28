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
import { ILiveViewCameraWindowElementProps, LiveViewCameraWindowElement } from './LiveViewCameraWindowElement';
import { IAPLWindowConfig } from '@alexa-smart-screen/apl';
import { DisplayOrientation } from '@alexa-smart-screen/common';

/**
 * Builder class for LiveViewCameraWindowElement
 */
 export class LiveViewCameraWindowElementBuilder extends DisplayWindowElementBuilder<LiveViewCameraWindowElement> {
  private window : LiveViewCameraWindowElement;
  
  /**
   * Creates an APL Based LiveViewCamera Window Element
   * 
   * @param windowConfig the base window config
   * @param liveViewWindowProps Live View Window props
   * @param orientation display orientation
   * @returns an LiveViewCameraWindowElement Element
   */
  public static createWindow (
    windowConfig : IAPLWindowConfig,
    liveViewWindowProps : ILiveViewCameraWindowElementProps,
    orientation : DisplayOrientation
    ) : LiveViewCameraWindowElement {  

    return new LiveViewCameraWindowElementBuilder(liveViewWindowProps)
      .setWindowConfig(windowConfig)
      .setDisplayOrientation(orientation)
      .build();
  }

  constructor(props : ILiveViewCameraWindowElementProps) {
    super();
    this.window = new LiveViewCameraWindowElement(props);
  }

  /**
   * Return the LiveViewCamera window element
   */
  public getWindowElement() : LiveViewCameraWindowElement {
    return this.window;
  }

  /**
   * Build the LiveViewCamera window element post any initializations required
   */
  public build() {
    super.build();
    return this.window;
  }
}