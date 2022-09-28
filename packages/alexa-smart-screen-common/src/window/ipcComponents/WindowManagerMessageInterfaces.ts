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

import { IWindowInstance } from "../IWindowInstance";
import { IDisplayCharacteristics } from "../../visualCharacteristics/deviceDisplay/IDisplayCharacteristics";
import { IInteractionMode } from "../../visualCharacteristics/interactionModes/IInteractionMode";
import { IWindowTemplate } from "../../visualCharacteristics/windowTemplates/IWindowTemplate";

/**
 * Window Manager Directive Names
 */
export const WINDOW_MANAGER_SET_VC_DIRECTIVE_NAME = 'setVisualCharacteristics';
export const WINDOW_MANAGER_CLEAR_WINDOW_DIRECTIVE_NAME = 'clearWindow';

/**
 * Window Manager Event Names
 */
export const WINDOW_MANAGER_VC_REQUEST_EVENT_NAME = 'visualCharacteristicsRequest';
export const WINDOW_MANAGER_DEFAULT_WINDOW_CHANGED_EVENT_NAME = 'defaultWindowInstanceChanged';
export const WINDOW_MANAGER_WINDOW_INSTANCES_REPORT_EVENT_NAME = 'windowInstancesReport';
export const WINDOW_MANAGER_WINDOW_INSTANCES_ADDED_EVENT_NAME = 'windowInstancesAdded';
export const WINDOW_MANAGER_WINDOW_INSTANCES_REMOVED_EVENT_NAME = 'windowInstancesRemoved';
export const WINDOW_MANAGER_WINDOW_INSTANCES_UPDATED_EVENT_NAME = 'windowInstancesUpdated';

/**
 * Enum specifying type of visual characteristics
 */
export enum VisualCharacteristicsType {
    DEVICE_DISPLAY = 'deviceDisplay',
    WINDOW_TEMPLATES = 'windowTemplates',
    INTERACTION_MODES = 'interactionModes'
}

/**
 * Interface for setVisualCharacteristics directive payload
 * See: https://developer.amazon.com/docs/alexa/alexa-voice-service/avs-apl-overview.html#alexa-apis-for-publishing-device-characteristics
 * @member {IDisplayCharacteristics} deviceDisplay optional device display characteristics.
 * @member {IInteractionMode[]} interactionModes optional interaction mode characteristics.
 * @member {IWindowTemplate[]} windowTemplates optional window templates characteristics.
 */
 export interface ISetVisualCharacteristicsDirectivePayload {
    deviceDisplay ?: IDisplayCharacteristics;
    interactionModes ?: IInteractionMode[];
    windowTemplates ?: IWindowTemplate[];
}

/**
 * Interface for clearWindow directive payload
 * @member {string} windowId the id of the window to clear
 */
 export interface IClearWindowDirectivePayload {
    windowId : string;
}

/**
 * Interface for visualCharacteristicsRequest event payload
 * @member {VisualCharacteristicsType[]} characteristics array of requested visual characteristics
 */
 export interface IVisualCharacteristicsRequestEventPayload {
    characteristics : VisualCharacteristicsType[];
}

/**
 * Interface for windowInstancesReport event payload
 * @member {string} audioPlaybackUIWindowId the window id of the window defined by the client for presenting audio media playback UI.
 * @member {string} defaultWindowId the window id of the default window for the client.
 * @member {IWindowInstance[]} windowInstances array of window instances created in the client.
 */
export interface IWindowInstancesReportEventPayload {
    audioPlaybackUIWindowId : string;
    defaultWindowId : string;
    windowInstances : IWindowInstance[];
}

/**
 * Interface for windowInstancesAdded event payload
 * @member {IWindowInstance[]} windowInstances array of window instances added in the client.
 */
 export interface IWindowInstancesAddedEventPayload {
    windowInstances : IWindowInstance[];
}

/**
 * Interface for windowInstancesRemoved event payload
 * @member {string[]} windowIds array of window id's for instances removed in the client.
 */
export interface IWindowInstancesRemovedEventPayload {
    windowIds : string[];
}

/**
 * Interface for windowInstancesUpdated event payload
 * @member {IWindowInstance[]} windowInstances array of window instances updated in the client.
 */
export interface IWindowInstancesUpdatedEventPayload {
    windowInstances : IWindowInstance[];
}

/**
 * Interface for defaultWindowInstanceChanged event payload
 * @member {string} defaultWindowId the window id of the changed default window for the client.
 */
export interface IDefaultWindowInstanceChangedEventPayload {
    defaultWindowId : string;
}
