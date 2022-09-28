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
 * Enumerates the different states of the Alexa service.
 */
 export enum AlexaState {
    /// Guard for unknown state.
    UNKNOWN = 'UNKNOWN',
    /// Alexa is disconnected.
    DISCONNECTED = 'DISCONNECTED',
    /// Alexa is pending connection.
    CONNECTING = 'CONNECTING',
    /// Alexa connected.
    CONNECTED = 'CONNECTED',
    /// Alexa is idle and ready for an interaction.
    IDLE = 'IDLE',
    /// Alexa is currently listening.
    LISTENING = 'LISTENING',
    /// Alexa is currently expecting a response from the customer.
    EXPECTING = 'EXPECTING',
    /// Alexa is waiting for a response from AVS
    THINKING = 'THINKING',
    /// Alexa is responding to a request with speech.
    SPEAKING = 'SPEAKING'
  }