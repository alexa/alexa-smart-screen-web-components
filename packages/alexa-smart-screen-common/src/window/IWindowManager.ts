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

import { IWindowInstance } from "./IWindowInstance";
import { IWindowElement } from "./IWindowElement";
import { WindowState } from "./WindowState";

/**
 * Interface for window manager
 */
export interface IWindowManager {
    /**
     * Method to hide a window if it is currently rendering.
     * 
     * @param windowId The window id of the window to remove from the view.
     * @param preserveContent Optional flag to preserveContent when hiding the window.
     */
    hideWindowFromView(windowId : string, preserveContent ?: boolean) : Promise<void>;

    /**
     * Method to render a window to the view.
     * 
     * @param windowId The window id of the window to render.
     * @param windowState Optional flag to set window state when rendering the window.
     */
    renderWindowToView(windowId : string, windowState ?: WindowState) : Promise<void>;

    /**
     * Method to set the windows managed by this class, mapped by windowId and in increasing z-order.
     * 
     * @param windowElements The window elements to be set.
     */
    setWindows(windows : IWindowElement[]) : void;

    /**
     * Method to add windows managed by this class, mapped by windowId and in increasing z-order.
     * 
     * @param windows The window elements to be added.
     */
    addWindows(windows : IWindowElement[]) : void;

    /**
     * Method to remove windows managed by this class, mapped by windowId and in increasing z-order.
     * 
     * @param windowIds The window ids of the window elements to be removed.
     */
    removeWindows(windowIds : string[]) : Promise<void>;

    /**
     * Method to get the window by window id.
     * 
     * @param windowId The id of the window to be returned.
     * @return The window element that corresponds to @param windowId.
     */
    getWindow(windowId : string) : IWindowElement | undefined;

    /**
     * Method to get the array of registered window Id's
     * 
     * @return List of window Id's
     */
    getWindowIds() : string[];
    
    /**
     * Method to get the windows by increasing z-order.
     * 
     * @return List of windowElements.
     */
    getWindowsByZOrder() : IWindowElement[];

    /**
     * Method to get the active window id if it exists.
     * 
     * @return The id of the current active window. This will return undefined if there is no active window.
     */
    getActiveWindowId() : string;

    /**
     * Method to get if a window is currently displaying.
     * 
     * @return true if there is currently an active window, false otherwise.
     */
    getIsWindowDisplaying() : boolean;

    /**
     * Method to get window instances for all registered windows elements.
     * 
     * @return List of windowInstances
     */
    getWindowInstances() : IWindowInstance[];
}