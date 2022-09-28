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
import { IFocusManager } from './IFocusManager';

/**
 * A default focus manager
 */
export class DefaultFocusManager implements IFocusManager {
  acquireFocus(
    avsInterface : AVSInterface,
    channelName : ChannelName,
    contentType : ContentType,
    observer : IChannelObserver) : number {
    observer.focusChanged(FocusState.FOREGROUND, undefined);
    return undefined;
  }
  releaseFocus(token : number) {return}
  processFocusResponse(token : number, result : boolean) {return}
  processFocusChanged(token : number, focusState : FocusState) {return}
  reset() {return}
}