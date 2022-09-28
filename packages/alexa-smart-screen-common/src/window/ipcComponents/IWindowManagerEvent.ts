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

import { IWindowInstance } from "../../window/IWindowInstance";
import { VisualCharacteristicsType } from "./WindowManagerMessageInterfaces";

/**
 * Interface for WindowManager Event handler
 */
export interface IWindowManagerEvent {
    visualCharacteristicsRequest(characteristics : VisualCharacteristicsType[]) : void;
    defaultWindowInstanceChanged(defaultWindowId : string) : void;
    windowInstancesReport(audioPlaybackUIWindowId : string, defaultWindowId : string, windowInstances : IWindowInstance[]) : void;
    windowInstancesAdded(windowInstances : IWindowInstance[]) : void;
    windowInstancesRemoved(windowIds : string[]) : void;
    windowInstancesUpdated(windowInstances : IWindowInstance[]) : void;
}