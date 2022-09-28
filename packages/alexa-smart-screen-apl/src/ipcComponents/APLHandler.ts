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

import { DirectiveHandler, ILoggerFactory, IWindowManager, LoggerParamsBuilder, IIPCNamespaceConfig } from '@alexa-smart-screen/common';
import { IPC_CONFIG_APL } from './IPCNamespaceConfigAPL'
import { APLWindowElement } from '../window/APLWindowElement';
import { APLWindowWebsocketClient } from './APLWindowWebsocketClient';
import { IAPLViewhostMessagePayload, IAPLCreateRendererPayload } from './APLMessageInterfaces';
import { IAPLHandler } from './IAPLHandler';

export class APLHandler extends DirectiveHandler implements IAPLHandler {
  protected static readonly CLASS_NAME = 'APLHandler';
  private windowManager : IWindowManager;

  constructor(windowManager : IWindowManager,
              loggerFactory : ILoggerFactory
  ) {
    super(loggerFactory.getLogger(IPC_CONFIG_APL.namespace));
    this.windowManager = windowManager;
  }

  protected static getLoggerParamsBuilder() : LoggerParamsBuilder {
    return new LoggerParamsBuilder().setClassName(APLHandler.CLASS_NAME);
  }

  public getIPCNamespaceConfig() : IIPCNamespaceConfig {
    return IPC_CONFIG_APL;
  }

  /**
   * Method to handle createRenderer directive
   * @param payload the IAPLCreateRendererPayload
   */
  public async createRenderer(payload : IAPLCreateRendererPayload) : Promise<void> {
    const functionName = 'createRenderer';
    const targetWindowId : string = payload.windowId;
    const targetWindow : APLWindowElement | undefined = this.windowManager.getWindow(targetWindowId) as APLWindowElement;

    if (!targetWindow) {
      this.logger.error(APLHandler.getLoggerParamsBuilder()
                          .setFunctionName(functionName)
                          .setMessage(`no window found with id ${targetWindowId}`)
                          .build());
      return;
    }

    await this.windowManager.renderWindowToView(targetWindowId);
    targetWindow.getClient().renderComplete();
  }

  /**
   * Method to handle sendMessageToViewhost directive
   * @param payload the IAPLViewhostMessagePayload
   */
  public sendMessageToViewhost(payload : IAPLViewhostMessagePayload) : void {
    const functionName = 'sendMessageToViewhost';
    const targetWindowId : string = payload.windowId;
    const targetWindow : APLWindowElement | undefined = this.windowManager.getWindow(targetWindowId) as APLWindowElement;

    if (!targetWindow) {
      this.logger.error(APLHandler.getLoggerParamsBuilder()
                          .setFunctionName(functionName)
                          .setMessage(`no window found with id ${targetWindowId}`)
                          .build());
      return;
    }

    const aplWindowClient : APLWindowWebsocketClient = targetWindow.getClient();
    const unwrappedPayload = payload.payload;
    aplWindowClient.onMessage(unwrappedPayload);
  }
}
