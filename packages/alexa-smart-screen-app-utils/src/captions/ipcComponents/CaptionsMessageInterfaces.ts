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

export const CAPTIONS_STATE_CHANGED_EVENT_NAME  = 'captionsStateChanged';
export const CAPTIONS_STATE_REQUEST_EVENT_NAME  = 'captionsStateRequest';

/**
 * Interface for @interface IRenderCaptionsPayload caption styles.
 * 
 * @interface ICaptionsActiveStyle
 * @member bold Indicates whether style is bold.
 * @member italic Indicates whether style is in italics.
 * @member underline Inidicates whether style is underlined.
 */
 export interface ICaptionsActiveStyle {
  bold : boolean;
  italic : boolean;
  underline : boolean;
}

/**
 * Interface for @interface IRenderCaptionsPayload captions content styled per character.
 * 
 * @interface ICaptionStyle
 * @member activeStyle The captions styles to apply.
 * @member charIndex The caption content index to apply @member activeStyle to.
 */
export interface ICaptionStyle {
  activeStyle : ICaptionsActiveStyle;
  charIndex : string; 
}

/**
 * Interface for @interface IRenderCaptionsPayload one caption line's content.
 * 
 * @interface ICaptionsLine
 * @member text The caption line text content.
 * @member styles The caption line styling to apply @member text's content to.
 */
export interface ICaptionsLine {
  text : string;
  styles : ICaptionStyle[];
}

/**
 * Interface for render captions message payload.
 *
 * @interface IRenderCaptionsPayload
 * @member duration A number in milliseconds to determine how long the caption should be displayed on the screen.
 * @member delay The amount of time that should pass before this frame is shown on the screen.
 * @member captionLines The caption contents.
 */
 export interface IRenderCaptionsPayload {
  duration : number;
  delay : number; 
  captionLines : ICaptionsLine[];
}

/**
 * Interface for the set captions state payload message.
 * @member enabled A boolean indicating the state of captions in the client.
 */
export interface ISetCaptionsStatePayload {
  enabled : boolean;
}

/**
 * Interface for captionsStateChanged event payload message.
 * @member enabled A boolean indicating if captions should be enabled in the client
 */
 export interface ICaptionsStateChangedEventPayload {
  enabled : boolean;
}