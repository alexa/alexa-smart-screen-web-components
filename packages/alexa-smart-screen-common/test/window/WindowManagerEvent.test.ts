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

import * as sinon from "sinon";
import { createMock } from 'ts-auto-mock';

import { ILoggerFactory, IClient, IEvent } from "@alexa-smart-screen/common";
import { WindowManagerEvent } from "../../src/window/ipcComponents/WindowManagerEvent";
import { IPC_CONFIG_WINDOW_MANAGER } from "../../src/window/ipcComponents/IPCNamespaceConfigWindowManager";
import { IDefaultWindowInstanceChangedEventPayload, IWindowInstancesAddedEventPayload, IWindowInstancesRemovedEventPayload, IWindowInstancesReportEventPayload, VisualCharacteristicsType, WINDOW_MANAGER_DEFAULT_WINDOW_CHANGED_EVENT_NAME, WINDOW_MANAGER_VC_REQUEST_EVENT_NAME, WINDOW_MANAGER_WINDOW_INSTANCES_ADDED_EVENT_NAME, WINDOW_MANAGER_WINDOW_INSTANCES_REMOVED_EVENT_NAME, WINDOW_MANAGER_WINDOW_INSTANCES_REPORT_EVENT_NAME, WINDOW_MANAGER_WINDOW_INSTANCES_UPDATED_EVENT_NAME } from "../../src/window/ipcComponents/WindowManagerMessageInterfaces";
import { IEventHeader } from "../../src/message/IHeader";
import { IWindowInstance } from "../../src/window/IWindowInstance";

describe("@alexa-smart-screen/common - WindowManagerEvent", () => {
  let windowManagerEvent : WindowManagerEvent;
  let loggerFactory : ILoggerFactory;
  let client : IClient;

  const DEFAULT_WINDOW_ID  = 'defaultWindow'
  const AUDIO_PLAYBACK_UI_WINDOW_ID  = 'mediaPlayerWindow';
  
  const DEFAULT_WINDOW_INSTANCE : IWindowInstance = {
    windowId : DEFAULT_WINDOW_ID,
    templateId : '',
    sizeConfigurationId : '',
    interactionMode : '',
    supportedInterfaces : [],
    zOrderIndex : 0
  };

  const AUDIO_PLAYBACK_UI_WINDOW_INSTANCE : IWindowInstance = {
    windowId : AUDIO_PLAYBACK_UI_WINDOW_ID,
    templateId : '',
    sizeConfigurationId : '',
    interactionMode : '',
    supportedInterfaces : [],
    zOrderIndex : 1
  };

  const WINDOW_INSTANCES : IWindowInstance[] = [
    DEFAULT_WINDOW_INSTANCE,
    AUDIO_PLAYBACK_UI_WINDOW_INSTANCE
  ];

  const WINDOW_MANAGER_NAMESPACE_HEADER : IEventHeader = {
      namespace : IPC_CONFIG_WINDOW_MANAGER.namespace,
      version : IPC_CONFIG_WINDOW_MANAGER.version,
      name : ''
  };

  const sandbox : sinon.SinonSandbox = sinon.createSandbox();

  beforeEach(() => {
    loggerFactory = createMock<ILoggerFactory>();
    client = createMock<IClient>({
      sendMessage : sandbox.spy()
    });
    windowManagerEvent = new WindowManagerEvent(client, loggerFactory);
  });

  afterEach(() => {
    sandbox.reset();
    sandbox.restore();
  });

  it('should send the correct message for the visualCharacteristicsRequest event', () => {
    const characteristics : VisualCharacteristicsType[] = [
        VisualCharacteristicsType.DEVICE_DISPLAY,
        VisualCharacteristicsType.INTERACTION_MODES,
        VisualCharacteristicsType.WINDOW_TEMPLATES
    ];
    WINDOW_MANAGER_NAMESPACE_HEADER.name = WINDOW_MANAGER_VC_REQUEST_EVENT_NAME;
    const event : IEvent = {
        header : WINDOW_MANAGER_NAMESPACE_HEADER,
        payload : {characteristics}
    }
    windowManagerEvent.visualCharacteristicsRequest(characteristics);
    sinon.assert.calledWith(
        client.sendMessage as sinon.SinonSpy,
        event
    );
  });

  it('should send the correct message for a valid windowInstancesReport event', () => {
    WINDOW_MANAGER_NAMESPACE_HEADER.name = WINDOW_MANAGER_WINDOW_INSTANCES_REPORT_EVENT_NAME;
    const payload : IWindowInstancesReportEventPayload = {
        audioPlaybackUIWindowId : AUDIO_PLAYBACK_UI_WINDOW_ID,
        defaultWindowId : DEFAULT_WINDOW_ID,
        windowInstances : WINDOW_INSTANCES
    }
    const event : IEvent = {
        header : WINDOW_MANAGER_NAMESPACE_HEADER,
        payload
    }
    windowManagerEvent.windowInstancesReport(AUDIO_PLAYBACK_UI_WINDOW_ID, DEFAULT_WINDOW_ID, WINDOW_INSTANCES);
    sinon.assert.calledWith(
        client.sendMessage as sinon.SinonSpy,
        event
    );
  });

  it('should send NOT send a message for an invalid windowInstancesReport with an invalid defaultWindowId', () => {
    const invalidDefaultWindowId = 'noWindowInstanceId';

    windowManagerEvent.windowInstancesReport(AUDIO_PLAYBACK_UI_WINDOW_ID, invalidDefaultWindowId, WINDOW_INSTANCES);
    sinon.assert.notCalled(
        client.sendMessage as sinon.SinonSpy
    );
  });

  it('should send NOT send a message for an invalid windowInstancesReport with an invalid audioPlaybackUIWindowId', () => {
    const invalidDAudioPlaybackUIWindowId = 'noWindowInstanceId';

    windowManagerEvent.windowInstancesReport(invalidDAudioPlaybackUIWindowId, DEFAULT_WINDOW_ID, WINDOW_INSTANCES);
    sinon.assert.notCalled(
        client.sendMessage as sinon.SinonSpy
    );
  });

  it('should send the correct message for a windowInstancesAdded event', () => {
    WINDOW_MANAGER_NAMESPACE_HEADER.name = WINDOW_MANAGER_WINDOW_INSTANCES_ADDED_EVENT_NAME;
    const payload : IWindowInstancesAddedEventPayload = {
        windowInstances : WINDOW_INSTANCES
    };
    const event : IEvent = {
        header : WINDOW_MANAGER_NAMESPACE_HEADER,
        payload
    };
    windowManagerEvent.windowInstancesAdded(WINDOW_INSTANCES);
    sinon.assert.calledWith(
        client.sendMessage as sinon.SinonSpy,
        event
    );
  });

  it('should send the correct message for a windowInstancesRemoved event', () => {
    WINDOW_MANAGER_NAMESPACE_HEADER.name = WINDOW_MANAGER_WINDOW_INSTANCES_REMOVED_EVENT_NAME;
    const payload : IWindowInstancesRemovedEventPayload = {
        windowIds : [
            DEFAULT_WINDOW_ID
        ]
    };
    const event : IEvent = {
        header : WINDOW_MANAGER_NAMESPACE_HEADER,
        payload
    };
    windowManagerEvent.windowInstancesRemoved([DEFAULT_WINDOW_ID]);
    sinon.assert.calledWith(
        client.sendMessage as sinon.SinonSpy,
        event
    );
  });

  it('should send the correct message for a windowInstancesUpdated event', () => {
    WINDOW_MANAGER_NAMESPACE_HEADER.name = WINDOW_MANAGER_WINDOW_INSTANCES_UPDATED_EVENT_NAME;
    const payload : IWindowInstancesAddedEventPayload = {
        windowInstances : WINDOW_INSTANCES
    };
    const event : IEvent = {
        header : WINDOW_MANAGER_NAMESPACE_HEADER,
        payload
    };
    windowManagerEvent.windowInstancesUpdated(WINDOW_INSTANCES);
    sinon.assert.calledWith(
        client.sendMessage as sinon.SinonSpy,
        event
    );
  });

  it('should send the correct message for a defaultWindowInstanceChanged event', () => {
    WINDOW_MANAGER_NAMESPACE_HEADER.name = WINDOW_MANAGER_DEFAULT_WINDOW_CHANGED_EVENT_NAME;
    const payload : IDefaultWindowInstanceChangedEventPayload = {
        defaultWindowId : DEFAULT_WINDOW_ID
    };
    const event : IEvent = {
        header : WINDOW_MANAGER_NAMESPACE_HEADER,
        payload
    };
    windowManagerEvent.defaultWindowInstanceChanged(DEFAULT_WINDOW_ID);
    sinon.assert.calledWith(
        client.sendMessage as sinon.SinonSpy,
        event
    );
  });
});
