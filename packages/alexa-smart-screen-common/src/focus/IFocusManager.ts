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

import { AVSInterface } from '../AVSInterfaces';
import { ChannelName } from './ChannelName';
import { ContentType } from './ContentType';
import { FocusState } from './FocusState';
import { IChannelObserver } from './IChannelObserver';

/**
 * Interface for managing audio channel focus acquisition.
 */
export interface IFocusManager {
    /**
     * Acquire channel from AVS SDK.
     *
     * @param avsInterface Name of the avs interface to report as having focus.
     * @param channelName Name of the channel to acquire.
     * @param contentType Type of content acquiring focus. 
     * @param observer Channel state observer.
     * @returns Assigned requestor token.
     */
    acquireFocus(avsInterface : AVSInterface, 
                 channelName : ChannelName, 
                 contentType : ContentType, 
                 observer : IChannelObserver) : number;

    /**
     * Release channel to AVS SDK. It will use same observer that was provided to acquireFocus to report result.
     *
     * @param token Requestor token received while acquiring channel.
     */
    releaseFocus(token : number) : void;

    /**
     * Process AVS SDK FocusManager response on acquire/release request.
     *
     * @param token Requestor token.
     * @param result Request processing result.
     */
    processFocusResponse(token : number, result : boolean) : void;

    /**
     * Process AVS SDK Channel state change.
     *
     * @param token Requestor token.
     * @param focusState Changed FocusState for the requestor.
     */
    processFocusChanged(token : number, focusState : FocusState) : void;

    /**
     * Reset FocusManager state. Release all channels held and clear the list.
     */
    reset() : void;
}