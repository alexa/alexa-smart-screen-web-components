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

import { AudioInputInitiator, EventHandler, GUIActivityState, GUIActivityTracker, IClient, IGUIActivityTracker } from '@alexa-smart-screen/common';
import { IPC_CONFIG_INTERACTION_MANAGER } from './IPCNamespaceConfigInteractionManager';
import { IInteractionManagerEvent } from './IInteractionManagerEvent';
import { NavigationEvent } from '../constants/NavigationEvent';
import { RecognizeSpeechCaptureState } from '../constants/RecognizeSpeechCaptureState';
import { IGUIActivityEventPayload, INavigationEventPayload, INTERACTION_MANAGER_GUI_ACTIVITY_EVENT_NAME, INTERACTION_MANAGER_NAVIGATION_EVENT_NAME, INTERACTION_MANAGER_RECOGNIZE_SPEECH_REQUEST_EVENT_NAME, IRecognizeSpeechRequestEventPayload } from './InteractionManagerInterfaces';

export class InteractionManagerEvent extends EventHandler implements IInteractionManagerEvent {
  private _guiActivityTracker : IGUIActivityTracker;

  constructor(client : IClient) {
    super(client, IPC_CONFIG_INTERACTION_MANAGER);
    this._guiActivityTracker = new GUIActivityTracker(this.guiActivityEvent.bind(this));
  }

  /**
   * Method to return the GUI activity tracker.
   * 
   * @return The activity event's GUI activity tracker.
   */
  public get guiActivityTracker() : IGUIActivityTracker {
    return this._guiActivityTracker;
  }

  /**
   * Method to send a guiActivityEvent message to the client
   * 
   * @param {GUIActivityState} event the GUI activity event.
   */
  public guiActivityEvent(event : GUIActivityState) : void {
    const payload : IGUIActivityEventPayload = {
      event
    };
    this.sendResponseEvent(INTERACTION_MANAGER_GUI_ACTIVITY_EVENT_NAME, payload);
  }

  /**
   * Method to send a navigationEvent message to the client.
   * 
   * @param {NavigationEvent} event event of the navigation event payload.
   */
   public navigationEvent(event : NavigationEvent) : void {
    const payload : INavigationEventPayload = {
      event
    };
    this.sendResponseEvent(INTERACTION_MANAGER_NAVIGATION_EVENT_NAME, payload);
  }

  /**
   * Method to send a recognizeSpeechRequestEvent to the client.
   * 
   * @param {AudioInputInitiator} initiatorType the type of audio input initiator for the speech request.
   * @param {RecognizeSpeechCaptureState} captureState the capture state of the speech request.
   */
  public recognizeSpeechRequestEvent(initiatorType : AudioInputInitiator, captureState : RecognizeSpeechCaptureState) : void {
    // If initiatorType is WAKEWORD, ignore any UI initiated speech requests
    if (AudioInputInitiator.WAKEWORD === initiatorType) {
      return;
    }
    const payload : IRecognizeSpeechRequestEventPayload = {
      initiatorType,
      captureState
    };
    this.sendResponseEvent(INTERACTION_MANAGER_RECOGNIZE_SPEECH_REQUEST_EVENT_NAME, payload);
  }
}
