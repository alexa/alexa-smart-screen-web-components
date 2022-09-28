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

import { AVSInterface } from "AVSInterfaces";
import { ChannelName } from "focus/ChannelName";
import { ContentType } from "focus/ContentType";
import { FocusState } from "focus/FocusState";

/**
 * AudioFocusManager Directive Names
 */
export const AUDIO_FOCUS_PROCESS_CHANNEL_RESULT_DIRECTIVE_NAME = 'processChannelResult';
export const AUDIO_FOCUS_PROCESS_FOCUS_CHANGED_DIRECTIVE_NAME = 'processFocusChanged';

/**
 * AudioFocusManager Event Names
 */
 export const AUDIO_FOCUS_ACQUIRE_CHANNEL_REQUEST_EVENT_NAME = 'acquireChannelRequest';
 export const AUDIO_FOCUS_RELEASE_CHANNEL_REQUEST_EVENT_NAME = 'releaseChannelRequest';
 export const AUDIO_FOCUS_CHANGED_REPORT_EVENT_NAME = 'focusChangedReport';

 /**
  * Interface for the processChannelResult directive payload.
  * @member {number} token Token identifying the requestor.
  * @member {boolean} result Result of channel focus acquisition or release request.  TRUE if successful.
  */
export interface IProcessChannelResultDirectivePayload {
    token : number;
    result : boolean;
} 

/**
 * Interface for the processFocusChanged directive payload.
 * @member {number} token Token identifying the requestor.
 * @member {FocusState} focusState The changed focusState of the focus request.
 */
export interface IProcessFocusChangedDirectivePayload {
    token : number;
    focusState : FocusState;
}

/**
 * Interface for the acquireChannelRequest event payload.
 * @member {number} token Unique identifier for the focus request, used in corresponding AudioFocusManager directives.
 * @member {AVSInterface} avsInterface The AVS Interface to acquire audio focus for the channel.
 * @member {ChannelName} channelName The Audio Channel for audio focus acquistion.
 * @member {ContentType} contentType The type of audio content.
 */
export interface IAcquireChannelRequestEventPayload {
    token : number;
    avsInterface : AVSInterface;
    channelName : ChannelName;
    contentType : ContentType;
}

/**
 * Interface for the releaseChannelRequest event payload.
 * @member {number} token Unique identifier for the focus request, used in corresponding AudioFocusManager directives.
 * @member {AVSInterface} avsInterface The AVS Interface releasing audio focus for the channel.
 * @member {ChannelName} channelName The Audio Channel for audio focus release.
 */
export interface IReleaseChannelRequestEventPayload {
    token : number;
    avsInterface : AVSInterface;
    channelName : ChannelName;
}

/**
 * Interface for the focusChangedReport event payload.
 * @member {number} token Token from the IProcessFocusChangedDirectivePayload
 */
export interface IFocusChangedReportEventPayload {
    token : number;
}