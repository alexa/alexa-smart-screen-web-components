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

import { DisplayWindowElement } from './DisplayWindowElement';
import { BaseWindowElementBuilder } from './BaseWindowElementBuilder';

/**
 * Builder class for creating window elements for Alexa.Display.Window Interface
 */
export abstract class DisplayWindowElementBuilder <T extends DisplayWindowElement> extends BaseWindowElementBuilder <T> {
  /**
   * Abstract method to be overridden by subclasses for returning window elements
   */
  protected abstract getWindowElement() : T;

  /**
   * Build the Window element after setting the display configuration
   */
  public build() : T {
    super.build();
    return this.getWindowElement();
  }
}
