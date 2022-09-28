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

import { IDirectiveHeader } from 'message/IHeader';

/**
 * Directive Interface
 * @instance header Header Message
 * @instance payload Generic payload message for the specific namespace
 */
export interface IDirective {
  header : IDirectiveHeader;
  payload : any;
}

/**
 * Interface for handling directives received from IPC Server
 */
export interface IDirectiveHandler {

  /**
   * Any directive that come from the core SDK will be handled by a class that implements this interface.
   * Once a directive is received from the SDK it will be rerouted to the corresponding class that will
   * handle the messsage.
   *
   * @param payload The directive payload that will be handled by the class.
   */
  handleDirective(directive : IDirective) : void;
}