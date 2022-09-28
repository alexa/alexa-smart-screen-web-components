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

import { AVSVisualInterfaces } from "../AVSInterfaces";
import { WindowContentType } from "./WindowState";

/**
 * Type which designates the on-screeen position of the window.
 */
export enum WindowPositionType {
  CENTER = 'center',
  TOP = 'top',
  BOTTOM = 'bottom',
  LEFT = 'left',
  RIGHT = 'right'
}

/**
 * Configuration for Alexa.Display.Window instance
 */
export interface IDisplayWindowInstanceConfiguration {
  /** Window template size configuration index to use - reported in window state */
  sizeConfigurationId : string;
  /** Window template interaction mode to use - reported in window state */
  interactionMode : string;
  /** Optional position for this display window instance.  Overrides IWindowConfig.windowPosition when present */
  position ?: WindowPositionType;
}

/**
 * Configuration for size, interactionMode, and position configurations for display window per display orientation
 */
export interface IDisplayWindowInstanceOrientationConfigurations {
  /** Optional Landscape Window Instance Configuration */
  landscape ?: IDisplayWindowInstanceConfiguration;
  /** Optional Portrait Window Instance Configuration */
  portrait ?: IDisplayWindowInstanceConfiguration;
}

/**
 * Configuration for windows modeled from Alexa.Display.Window definitions
 */
export interface IDisplayWindowConfig {
  /** Id of window template from device characteristic templates - reported in window state */
  templateId : string;
  /** Configurations for the display window per orientation */
  configurations : IDisplayWindowInstanceOrientationConfigurations;
}

/**
 * Configuration for defining Window Instances
 */
export interface IWindowConfig {
  /** Unique Id used for window targeting - reported in window state */
  id : string;
  /** Optional display window configuration for this window */
  displayWindowConfig ?: IDisplayWindowConfig;
  /** Interfaces supported by this window */
  supportedInterfaces : AVSVisualInterfaces[];
  /** Requested Window zOrder index - final order determined by window manager */
  zOrderIndex : number;
  /** Position of window on display.  Overridden by IDisplayWindowInstanceConfiguration.position when present  Defaults to `center` */
  windowPosition ?: WindowPositionType;
  /** Optional definition of contentType supported by window */
  windowContentType ?: WindowContentType;
}
