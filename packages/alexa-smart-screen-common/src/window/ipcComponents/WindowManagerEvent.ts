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

import { ILogger } from "../../logger/ILogger";
import { ILoggerFactory } from "../../logger/ILoggerFactory";
import { LoggerParamsBuilder } from "../../logger/LoggerParamsBuilder";
import { IClient } from "../../client/IClient";
import { EventHandler } from "../../message/Event/EventHandler";
import { IWindowInstancesReportEventPayload, IWindowInstancesRemovedEventPayload, IDefaultWindowInstanceChangedEventPayload, IWindowInstancesUpdatedEventPayload, IVisualCharacteristicsRequestEventPayload, VisualCharacteristicsType, IWindowInstancesAddedEventPayload, WINDOW_MANAGER_VC_REQUEST_EVENT_NAME, WINDOW_MANAGER_DEFAULT_WINDOW_CHANGED_EVENT_NAME, WINDOW_MANAGER_WINDOW_INSTANCES_UPDATED_EVENT_NAME, WINDOW_MANAGER_WINDOW_INSTANCES_REPORT_EVENT_NAME, WINDOW_MANAGER_WINDOW_INSTANCES_ADDED_EVENT_NAME, WINDOW_MANAGER_WINDOW_INSTANCES_REMOVED_EVENT_NAME } from "./WindowManagerMessageInterfaces";
import { IPC_CONFIG_WINDOW_MANAGER } from "./IPCNamespaceConfigWindowManager";
import { IWindowManagerEvent } from "./IWindowManagerEvent";
import { IWindowInstance } from "../../window/IWindowInstance";

/**
 * Event handler for Window Manager
 */
export class WindowManagerEvent extends EventHandler implements IWindowManagerEvent {
  protected static readonly CLASS_NAME = 'WindowManagerEvent';
  protected logger : ILogger;
    
  constructor(client : IClient, loggerFactory : ILoggerFactory) {
        super(client, IPC_CONFIG_WINDOW_MANAGER);
        this.ipcNamespaceConfig = IPC_CONFIG_WINDOW_MANAGER;
        this.logger = loggerFactory.getLogger(IPC_CONFIG_WINDOW_MANAGER.namespace);
    }

    protected static getLoggerParamsBuilder() : LoggerParamsBuilder {
      return new LoggerParamsBuilder().setClassName(WindowManagerEvent.CLASS_NAME);
    }

    /**
     * Method to send visualCharacteristicsRequest event
     * @param {VisualCharacteristicsType[]} characteristics visual characteristics to request
     */
    public visualCharacteristicsRequest(characteristics : VisualCharacteristicsType[]) : void {
        const payload : IVisualCharacteristicsRequestEventPayload = {
          characteristics
        };
        this.sendResponseEvent(WINDOW_MANAGER_VC_REQUEST_EVENT_NAME, payload);
    }

    /**
     * Method to send windowInstancesReport event
     * @param audioPlaybackUIWindowId ID of the window defined by the client for presenting audio media playback UI. Corresponding instance should be added in this message.
     * @param defaultWindowId ID of window instance to be set as default. Corresponding instance should be added in this message.
     * @param windowInstances window instances to be added
     */
    public windowInstancesReport(audioPlaybackUIWindowId : string, defaultWindowId : string, windowInstances : IWindowInstance[]) : void {
        const functionName = 'windowInstancesReport';
        // check if the default window ID exists among the window instances being added
        const isDefaultWindowIdValid = windowInstances.some((windowInstance : IWindowInstance) => {
          return windowInstance.windowId === defaultWindowId;
        });

        if (!isDefaultWindowIdValid) {
          this.logger.error(WindowManagerEvent.getLoggerParamsBuilder()
                              .setFunctionName(functionName)
                              .setMessage('Default window ID does not exist in specified window instances')
                              .setArg('defaultWindowId', defaultWindowId)
                              .setArg('windowInstances', windowInstances)
                              .build());
          return;
        }

        // check if the audio playback UI window ID exists among the window instances being added
        const isAudioPlaybackUIWindowValid = windowInstances.some((windowInstance : IWindowInstance) => {
          return windowInstance.windowId === audioPlaybackUIWindowId;
        });

        if (!isAudioPlaybackUIWindowValid) {
          this.logger.error(WindowManagerEvent.getLoggerParamsBuilder()
                              .setFunctionName(functionName)
                              .setMessage('Audio Playback UI window ID does not exist in specified window instances')
                              .setArg('audioPlaybackUIWindowId', audioPlaybackUIWindowId)
                              .setArg('windowInstances', windowInstances)
                              .build());
          return;
        }

        const payload : IWindowInstancesReportEventPayload = {
          audioPlaybackUIWindowId,
          defaultWindowId,
          windowInstances
        };
        this.sendResponseEvent(WINDOW_MANAGER_WINDOW_INSTANCES_REPORT_EVENT_NAME, payload);
    }

    /**
     * Method to send windowInstancesAdded event
     * @param {IWindowInstance[]} windowInstances array of window instances to be added
     */
    public windowInstancesAdded(windowInstances : IWindowInstance[]) : void {
      const payload : IWindowInstancesAddedEventPayload = {
        windowInstances
      };
      this.sendResponseEvent(WINDOW_MANAGER_WINDOW_INSTANCES_ADDED_EVENT_NAME, payload);
    }

    /**
     * Method to send removeWindowInstances message
     * @param {string[]} windowIds IDs of windows to be removed
     */
    public windowInstancesRemoved(windowIds : string[]) : void {
        const payload : IWindowInstancesRemovedEventPayload = {
          windowIds
        };
        this.sendResponseEvent(WINDOW_MANAGER_WINDOW_INSTANCES_REMOVED_EVENT_NAME, payload);
    }

    /**
     * Method to send windowInstancesUpdated event
     * @param {IWindowInstance[]} windowInstances window instances to be updated
     */
    public windowInstancesUpdated(windowInstances : IWindowInstance[]) : void {
        const payload : IWindowInstancesUpdatedEventPayload = {
          windowInstances
        };
        this.sendResponseEvent(WINDOW_MANAGER_WINDOW_INSTANCES_UPDATED_EVENT_NAME, payload);
    }

    /**
     * Method to send a defaultWindowInstanceChanged event
     * @param {string} defaultWindowId ID of window instance to be set as default. window instance corresponding to this ID should have already been added.
     */
    public defaultWindowInstanceChanged(defaultWindowId : string) : void {
      const payload : IDefaultWindowInstanceChangedEventPayload = {
        defaultWindowId
      };
      this.sendResponseEvent(WINDOW_MANAGER_DEFAULT_WINDOW_CHANGED_EVENT_NAME, payload);
  }
}