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
import { IPC_CONFIG_APL } from '../../src/ipcComponents/IPCNamespaceConfigAPL';
import { IClient } from '@alexa-smart-screen/common';
import { APLEvent } from "../../src/ipcComponents/APLEvent";

import { APL_CLEAR_DOCUMENT_REQUEST_MESSAGE_NAME, APL_EXECUTE_COMMANDS_REQUEST_MESSAGE_NAME, APL_RENDER_DOCUMENT_REQUEST_MESSAGE_NAME, createAPLClearDocumentRequestPayload, createAPLExecuteCommandsRequestPayload, createAPLRenderDocumentRequestPayload, IAPLClearDocumentRequestPayload, IAPLExecuteCommandsRequestPayload, IAPLRenderDocumentRequestPayload, IRenderDocumentSupportedViewport } from "../../src/ipcComponents/APLMessageInterfaces";

describe("@alexa-smart-screen/apl - APL Event", () => {
  let aplEvent : APLEvent;
  let client : IClient;
  let header : any;
  const sandbox : sinon.SinonSandbox = sinon.createSandbox();
  
  const WINDOW1_ID = "windowId1";
  const TOKEN1 = "token1";

  beforeEach(() => {
    client = createMock<IClient>({ 
        sendMessage : sandbox.spy()
    });
    aplEvent = new APLEvent(client);
    header = {
      version : IPC_CONFIG_APL.version,
      namespace : IPC_CONFIG_APL.namespace,
      name : ''
    }
  });

  afterEach(() => {
      sandbox.reset();
      sandbox.restore();
  });

  it('should send the correct message payload for render document request.', () => {
    const document : any = {};
    const datasources : any = {};
    const supportedViewports : IRenderDocumentSupportedViewport[] = [];
    const payload : IAPLRenderDocumentRequestPayload = createAPLRenderDocumentRequestPayload(
      TOKEN1,
      WINDOW1_ID,
      document,
      datasources,
      supportedViewports
    );
    header.name = APL_RENDER_DOCUMENT_REQUEST_MESSAGE_NAME;

    const message = {
      header,
      payload
    }

    aplEvent.renderDocumentRequest(payload);
    sinon.assert.calledWith(
        client.sendMessage as sinon.SinonSpy,
        message
    );
  });

  it('should send the correct message payload for execute commands request.', () => {
    const commands : any[] = [];
    const payload : IAPLExecuteCommandsRequestPayload = createAPLExecuteCommandsRequestPayload(
      TOKEN1,
      commands
    );
    header.name = APL_EXECUTE_COMMANDS_REQUEST_MESSAGE_NAME;

    const message = {
      header,
      payload
    }

    aplEvent.executeCommandsRequest(payload);
    sinon.assert.calledWith(
        client.sendMessage as sinon.SinonSpy,
        message
    );
  });

  it('should send the correct message payload for clear document request.', () => {
    const payload : IAPLClearDocumentRequestPayload = createAPLClearDocumentRequestPayload(
      TOKEN1,
      WINDOW1_ID
    );
    header.name = APL_CLEAR_DOCUMENT_REQUEST_MESSAGE_NAME;

    const message = {
      header,
      payload
    }

    aplEvent.clearDocumentRequest(payload);
    sinon.assert.calledWith(
        client.sendMessage as sinon.SinonSpy,
        message
    );
  });
});
