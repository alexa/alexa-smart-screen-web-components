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

import * as sinon from 'sinon';
import { createMock } from 'ts-auto-mock';
import { IClient, IEventHeader } from '@alexa-smart-screen/common';
import { TemplateRuntimeEvent } from '../../src/ipcComponents/TemplateRuntimeEvent';
import { IPC_CONFIG_TEMPLATE_RUNTIME } from '../../src/ipcComponents/IPCNamespaceConfigTemplateRuntime';
import { ITemplateRuntimeWindowIdReport, TEMPLATE_RUNTIME_WINDOW_ID_REPORT_MESSAGE_NAME } from '../../src/ipcComponents/TemplateRuntimeMessageInterfaces';


describe("@alexa-smart-screen/template-runtime - TemplateRuntimeEvent", () => {
  let templateRuntimeEvent : TemplateRuntimeEvent;
  let client : IClient;
  let header : IEventHeader;
  const sandbox : sinon.SinonSandbox = sinon.createSandbox();

  beforeEach(() => {
    client = createMock<IClient>({ 
        sendMessage : sandbox.spy()
    });
    templateRuntimeEvent = new TemplateRuntimeEvent(client);
    header = {
      version : IPC_CONFIG_TEMPLATE_RUNTIME.version,
      namespace : IPC_CONFIG_TEMPLATE_RUNTIME.namespace,
      name : ''
    }
  });

  afterEach(() => {
      sandbox.reset();
      sandbox.restore();
  });

  it('should send the correct message for windowIdReport event.', () => {
    header.name = TEMPLATE_RUNTIME_WINDOW_ID_REPORT_MESSAGE_NAME;
    const renderTemplateWindowId  = 'renderTemplateWindowId';
    const renderPlayerInfoWindowId  = 'renderPlayerInfoWindowId';
    const payload : ITemplateRuntimeWindowIdReport = {
      renderTemplateWindowId,
      renderPlayerInfoWindowId
    };
    const message = {
      header,
      payload
    };

    templateRuntimeEvent.windowIdReport(payload);
    sinon.assert.calledWith(
        client.sendMessage as sinon.SinonSpy,
        message
    );
  });
});
