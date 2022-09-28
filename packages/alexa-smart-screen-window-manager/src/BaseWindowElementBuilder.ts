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

import { DisplayOrientation, IWindowConfig, WindowContentType } from '@alexa-smart-screen/common';
import { BaseWindowElement } from './BaseWindowElement';

/**
 * Builder class for creating instances of BaseWindowElement
 */
export abstract class BaseWindowElementBuilder <T extends BaseWindowElement> {
  /**
   * Abstract method to be overridden by subclasses for returning window elements
   */
  protected abstract getWindowElement() : T;

  /**
   * Set the window config for this Window
   * @param config IWindowConfig
   */
  public setWindowConfig(config : IWindowConfig) {
    this.getWindowElement().setWindowConfig(config);
    return this;
  }

  /**
   * Set the display orientation for this Window
   * @param orientation DisplayOrientation
   */
  public setDisplayOrientation(orientation : DisplayOrientation) {
    this.getWindowElement().setDisplayOrientation(orientation);
    return this;
  }

  /**
   * Set the content type for this Window
   * @param contentType WindowContentType
   */
  public setContentType(contentType : WindowContentType) {
    this.getWindowElement().setContentType(contentType);
    return this;
  }

  /**
   * Build the Window element after setting transitions
   */
  public build() : T {
    this.getWindowElement().setTransitions();
    return this.getWindowElement();
  }
}
