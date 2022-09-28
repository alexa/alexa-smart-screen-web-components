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

/**
 * The state of the window relative to zOrder and visibility
 */
export enum WindowState {
  /// Window is hidden from view
  HIDDEN = 'HIDDEN',
  /// Window is in the foregound and visible
  FOREGROUND = 'FOREGROUND',
  /// Window is in the background and either partially or fully occluded by another window
  BACKGROUND = 'BACKGROUND',
}

/**
 * Type of resize being applied to window
 */
export enum WindowResizeType {
  /// Default type
  RESET = 0,
  /// Window has been rotated
  ROTATE = 1,
  /// Window has been scaled
  SCALE = 2
}

/**
 * Type which designates the form of content displaying in the window.
 */
 export enum WindowContentType {
  /// Windows that handle content associated with media playback
  MEDIA = 'MEDIA',
  /// Windows that handle general content, such as Alexa skills or common queries like Weather, or Info.
  GENERAL = 'GENERAL',
  /// Windows that handle camera stream content, such as security cameras
  CAMERA = 'CAMERA',
  /// Windows that handle communication content, such as calling
  COMMUNICATION = 'COMMUNICATION',
  /// Windows that handle alerts content, such as timers, alarms, and reminders
  ALERT = 'ALERT'
}
