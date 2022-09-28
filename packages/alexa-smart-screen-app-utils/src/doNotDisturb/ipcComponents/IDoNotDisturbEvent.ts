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
 * Interface for DoNotDisturb Event
 */
 export interface IDoNotDisturbEvent {
    /**
     * Method to send a doNotDisturbStateChanged message to the client
     * 
     * @param {boolean} enabled true if the IPC client is turning on DND state.
     */
     doNotDisturbStateChanged(enabled : boolean) : void;

     /**
      * Method to send a doNotDisturbStateRequest message to the client
      */
     doNotDisturbStateRequest() : void;
  }