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

import { IClient, EventHandler } from '@alexa-smart-screen/common';
import { ITemplateRuntimeEvent } from './ITemplateRuntimeEvent';
import { IPC_CONFIG_TEMPLATE_RUNTIME } from './IPCNamespaceConfigTemplateRuntime';
import { ITemplateRuntimeWindowIdReport, TEMPLATE_RUNTIME_WINDOW_ID_REPORT_MESSAGE_NAME } from './TemplateRuntimeMessageInterfaces';

export class TemplateRuntimeEvent extends EventHandler implements ITemplateRuntimeEvent {
  constructor(client : IClient) {
    super(client, IPC_CONFIG_TEMPLATE_RUNTIME);
  }

  /**
   * Method to send a message to the client to report the window id's for template runtime.
   * @param templateRuntimeWindowIdReport the window id's for template runtime cards
   */
  public windowIdReport(templateRuntimeWindowIdReport : ITemplateRuntimeWindowIdReport) : void {
      this.sendResponseEvent(TEMPLATE_RUNTIME_WINDOW_ID_REPORT_MESSAGE_NAME, templateRuntimeWindowIdReport);
  }
}
