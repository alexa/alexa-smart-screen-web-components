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

'use strict';

/**
 * AVS Interfaces that support visual presentations
 */
 export enum AVSVisualInterfaces {
  TEMPLATE_RUNTIME = 'TemplateRuntime',
  ALEXA_PRESENTATION_APL = 'Alexa.Presentation.APL',
  LIVE_VIEW_CAMERA = 'Alexa.Camera.LiveViewController'
}
 
/**
 * AVS Interfaces that can acquire Audio Focus from the GUI client.
 * @see https://developer.amazon.com/docs/alexa-voice-service/focus-management.html
 *
 * @type
 * @exports
 */
 export type AVSInterface = AVSVisualInterfaces

