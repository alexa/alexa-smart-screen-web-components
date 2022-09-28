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

import { AlexaState, AuthorizationState, ICBLAuthorizationRequest, LocaleType } from '@alexa-smart-screen/common';

/**
 * System Directive Names
 */
export const SYSTEM_COMPLETE_AUTHORIZATION_DIRECTIVE_NAME = 'completeAuthorization';
export const SYSTEM_SET_ALEXA_STATE_DIRECTIVE_NAME = 'setAlexaState';
export const SYSTEM_SET_AUTHORIZATION_DIRECTIVE_NAME = 'setAuthorizationState';
export const SYSTEM_SET_LOCALES_DIRECTIVE_NAME = 'setLocales';

 /**
  * System Event Names
  */
 export const SYSTEM_ALEXA_STATE_REQUEST_EVENT_NAME = 'alexaStateRequest';
 export const SYSTEM_AUTHORIZATION_INFO_REQUEST_EVENT_NAME = 'authorizationInfoRequest';
 export const SYSTEM_AUTHORIZATION_STATE_REQUEST_EVENT_NAME = 'authorizationStateRequest';
 export const SYSTEM_LOCALES_REQUEST_EVENT_NAME = 'localesRequest';

/**
 * Interface for setAlexaState directive payload
 * @member state the AlexaState of the client
 */
export interface ISetAlexaStateDirectivePayload {
    state : AlexaState;
}

/**
 * Interface for setAuthorizationState directive payload
 * @member state the AuthorizationState of the client
 */
 export interface ISetAuthorizationStateDirectivePayload {
    state : AuthorizationState;
}

/**
 * Interface for the completeAuthorization directive payload
 */
export type ICompleteAuthorizationDirectivePayload = ICBLAuthorizationRequest;

/**
 * Interface for setLocales directive payload
 * @member locales array of LocaleType
 */
export interface ISetLocalesDirectivePayload {
  locales : LocaleType[];
}

/**
 * Interface for the alexaStateRequest event payload.
 */
 export interface IAlexaStateRequestEventPayload {}

 /**
  * Interface for the authorizationInfoRequest event payload.
  */
 export interface IAuthorizationInfoRequestEventPayload {}

 /**
 * Interface for the authorizationStateRequest event payload.
 */
export interface IAuthorizationStateRequestEventPayload {}

/**
 * Interface for the localesRequest event payload.
 */
export interface ILocalesRequestEventPayload {}