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

import { IDirective, IDirectiveHandler } from '@alexa-smart-screen/common';

/**
 * Router to re-route all IPC message to its handlers
 * @ignore
 */
export interface IRouter {
  /**
   * Add the handler that this component will support.
   * @param handler The handler that should be called with this namespace.
   */
  addNamespace(handler : IDirectiveHandler) : void;

  /**
   * Remove namespace with any version.
   * @param namespace The namespace to be removed.
   */
  removeNamespace(namespace : string) : void;

  /**
   * Return if the router can handle the given directive.
   * @param directive Directive from SDK
   */
  canHandle(directive : IDirective) : boolean;

  /**
   * Invoke handleDirective() on the handler registered for the given Directive.
   * @param directive The directive to be handled.
   */
  handleDirective(directive : IDirective) : void;
}
