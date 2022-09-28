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
 * Session Setup Directive Names
 */
export const SESSION_SETUP_CONFIGURE_CLIENT_DIRECTIVE_NAME = 'configureClient';
export const SESSION_SETUP_INIT_CLIENT_DIRECTIVE_NAME = 'initializeClient';
/**
 * Session Setup Event Names
 */
export const SESSION_SETUP_NAMESPACE_VERSIONS_REPORT_EVENT_NAME = 'namespaceVersionsReport';
export const SESSION_SETUP_CLIENT_INIT_EVENT_NAME = 'clientInitialized';
export const SESSION_SETUP_CLIENT_CONFIG_REQUEST_EVENT_NAME = 'clientConfigRequest';

/**
 * Interface for the initializeClient directive payload
 * @member {string} ipcVersion The version of the ACSDK IPC Framework requesting initialization of the client
 */
export interface IInitClientDirectivePayload {
    ipcVersion : string;
}

/**
 * Interface for the configureClient directive payload.
 */
export interface IConfigureClientDirectivePayload {}

/**
 * Interface for the clientInitialized event payload.
 * @member {boolean} isIPCVersionSupported True if the client supports the requesting IPC framework version.
 */
export interface IClientInitializedEventPayload {
    isIPCVersionSupported : boolean;
}

/**
 * Interface for the clientConfigRequest event payload.
 */
export interface IClientConfigRequestEventPayload {}
