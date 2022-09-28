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

import { IAudioFocusManagerEvent } from './IAudioFocusManagerEvent';
import { IClient } from '../../client/IClient';
import { FocusManager } from '../FocusManager';
import { IFocusManager } from '../IFocusManager';
import { ILoggerFactory } from '../../logger/ILoggerFactory';
import { IPC_CONFIG_AUDIO_FOCUS_MANAGER } from './IPCNamespaceConfigAudioFocusManager';
import { ContentType } from '../ContentType';
import { AVSInterface } from '../../AVSInterfaces';
import { ChannelName } from '../../focus/ChannelName';
import { EventHandler } from '../../message/Event/EventHandler';
import { AUDIO_FOCUS_ACQUIRE_CHANNEL_REQUEST_EVENT_NAME, AUDIO_FOCUS_CHANGED_REPORT_EVENT_NAME, AUDIO_FOCUS_RELEASE_CHANNEL_REQUEST_EVENT_NAME, IAcquireChannelRequestEventPayload, IFocusChangedReportEventPayload, IReleaseChannelRequestEventPayload } from './AudioFocusManagerMessageInterfaces';

export class AudioFocusManagerEvent extends EventHandler implements IAudioFocusManagerEvent {
  private _focusManager : IFocusManager;

  constructor(client : IClient, loggerFactory : ILoggerFactory) {
    super(client, IPC_CONFIG_AUDIO_FOCUS_MANAGER);
    this._focusManager = new FocusManager({
      acquireFocus : this.acquireChannelRequest.bind(this),
      releaseFocus : this.releaseChannelRequest.bind(this)
    },
    loggerFactory);
  }

  public get focusManager() : IFocusManager {
    return this._focusManager;
  }

  /**
   * Method to send the acquireChannelRequest event to the client.
   * 
   * @param {number} token Unique identifier for the focus request, used in corresponding AudioFocusManager directives.
   * @param {AVSInterface} avsInterface The AVS Interface to acquire audio focus for the channel.
   * @param {ChannelName} channelName The Audio Channel for audio focus acquistion.
   * @param {ContentType} contentType The type of audio content.
   */
  public acquireChannelRequest(token : number, avsInterface : AVSInterface, channelName : ChannelName, contentType : ContentType) : void {
    const payload : IAcquireChannelRequestEventPayload = {
      token,
      avsInterface,
      channelName,
      contentType,
    };
    this.sendResponseEvent(AUDIO_FOCUS_ACQUIRE_CHANNEL_REQUEST_EVENT_NAME, payload);
  }

  /**
   * Method to send the releaseChannelRequest event to the client.
   * 
   * @param {number} token Unique identifier for the focus request, used in corresponding AudioFocusManager directives.
   * @param {AVSInterface} avsInterface The AVS Interface releasing audio focus for the channel.
   * @param {ChannelName} channelName The Audio Channel for audio focus release.
   */
  public releaseChannelRequest(token : number, avsInterface : AVSInterface, channelName : ChannelName) : void {
    const payload : IReleaseChannelRequestEventPayload = {
      token,
      avsInterface,
      channelName
    };
    this.sendResponseEvent(AUDIO_FOCUS_RELEASE_CHANNEL_REQUEST_EVENT_NAME, payload);
  }

  /**
   * Method to send the focusChangedReport event to the client.
   * 
   * @param {number} token Token from the IProcessFocusChangedDirectivePayload
   */
  public focusChangedReport(token : number) : void {
    const payload : IFocusChangedReportEventPayload = {
      token : token
    };
    this.sendResponseEvent(AUDIO_FOCUS_CHANGED_REPORT_EVENT_NAME, payload);
  }
}
