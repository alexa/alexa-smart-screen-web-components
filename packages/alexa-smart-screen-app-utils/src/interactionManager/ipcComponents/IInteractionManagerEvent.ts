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

import { AudioInputInitiator, GUIActivityState, IGUIActivityTracker } from '@alexa-smart-screen/common';
import { NavigationEvent } from '../constants/NavigationEvent';
import { RecognizeSpeechCaptureState } from '../constants/RecognizeSpeechCaptureState';

/**
 * Interface for InteractionManager Event
 */
export interface IInteractionManagerEvent {
  /**
   * Method to return the GUI activity tracker.
   * 
   * @return The activity event's GUI activity tracker.
   */
  get guiActivityTracker() : IGUIActivityTracker;
  
  /**
   * Method to send a guiActivityEvent message to the client
   * 
   * @param {GUIActivityState} event the GUI activity event type.
   */
  guiActivityEvent(event : GUIActivityState) : void;

  /**
   * Method to send a navigationEvent message to the client.
   * 
   * @param {NavigationEvent} event navigation event type.
   */
   navigationEvent(event : NavigationEvent) : void;

   /**
    * 
    * @param {AudioInputInitiator} initiatorType the audio input initiator type for the speech recognition request
    * @param {RecognizeSpeechCaptureState} captureState the capture state of the speech recognition request
    */
   recognizeSpeechRequestEvent(initiatorType : AudioInputInitiator, captureState : RecognizeSpeechCaptureState) : void;
}
