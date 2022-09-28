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
 * DoNotDisturb Namespace Directive Names
 */
export const DND_SET_STATE_DIRECTIVE_NAME  = 'setDoNotDisturbState';

/**
 * DoNotdisturb Namespace Event Names
 */
export const DND_STATE_CHANGED_EVENT_NAME  = 'doNotDisturbStateChanged';
export const DND_STATE_REQUEST_EVENT_NAME  = 'doNotDisturbStateRequest';

/**
 * Interface for setDoNotDisturbState directive payload
 * 
 * @member {boolean} enabled true if DND state has been enabled by the client
 */
export interface IDNDSetStateDirectivePayload {
    enabled : boolean
}

/**
 * Interface for the doNotDisturbStateChanged event payload
 * 
 * @member {boolean} enabled true if DND state is being enabled by the IPC client
 */
export interface IDNDStateChangedEventPayload {
    enabled : boolean
}

/**
 * Interface for the doNotDisturbStateRequest event payload
 */
export interface IDNDStateRequestPayload {}