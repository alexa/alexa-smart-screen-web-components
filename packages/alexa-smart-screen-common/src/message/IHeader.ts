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
 * Header Message Interface for Directives
 * @instance version Version of the IPC message
 * @instance namespace The Handler which will be called
 * @instance name The name of the method to be called within the handler
 */
export interface IDirectiveHeader {
  version : number;
  namespace : string;
  name : string;
}

/**
 * Header Message Interface for Events
 * @instance version Version of the IPC message
 * @instance namespace The Handler which emited the event
 * @instance name The name of the method which emited the event
 * @instance isError Flag to indicate an Error Event
 */
export interface IEventHeader {
  version : number;
  namespace : string;
  name : string;
  isError ?: boolean;
}
