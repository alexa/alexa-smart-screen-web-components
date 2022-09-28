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

import { IObserverManager, ObserverManager, ILogger, ILoggerFactory, IWindowElement, IWindowManager, LoggerParamsBuilder, IWindowInstance, WindowSizeType, DisplayOrientation, WindowType, WindowContentType, WindowState } from "@alexa-smart-screen/common";
import { IWindowManagerObserver } from "./observers/IWindowManagerObserver";
import { LOGGER_ID_WINDOW_MANAGER } from "./utils/constants";

/** Map defining the sorting order for WindowType */
const WindowTypeSortOrderMap : Map<WindowType, number> = new Map([
  [WindowType.STANDARD, 0],
  [WindowType.OVERLAY, 1]
]);

/** Map defining the sorting order for WindowContentType */
const WindowContentTypeSortOrderMap : Map<WindowContentType, number> = new Map([
  [WindowContentType.MEDIA, 0],
  [WindowContentType.GENERAL, 1],
  [WindowContentType.CAMERA, 2],
  [WindowContentType.COMMUNICATION, 3],
  [WindowContentType.ALERT, 4]
]);

/**
 * Implementation of IWindowManager
 */
export class WindowManager implements IWindowManager {
  protected static readonly CLASS_NAME = 'WindowManager';
  // map of window id to window elements sorted by increasing z-order
  private windowIdToWindowElementMap : Map<string, IWindowElement>;
  private activeWindowId : string;
  private isWindowDisplaying : boolean;
  private observerManager : ObserverManager<IWindowManagerObserver>;
  private logger : ILogger;

  constructor(loggerFactory : ILoggerFactory) {
    this.logger = loggerFactory.getLogger(LOGGER_ID_WINDOW_MANAGER);
    this.windowIdToWindowElementMap = new Map();
    this.observerManager = new ObserverManager<IWindowManagerObserver>();
    this.isWindowDisplaying = false;
  }

  protected static getLoggerParamsBuilder() : LoggerParamsBuilder {
    return new LoggerParamsBuilder().setClassName(WindowManager.CLASS_NAME);
  }

  /**
   * Method to hide a window if it is currently rendering.
   * 
   * @param windowId The window id of the window to hide from the view.
   * @param preserveContent Optional boolean.  True if the window's content should be preserved upon hiding.
   */
  public async hideWindowFromView(windowId : string, preserveContent ?: boolean) : Promise<void> {
    const functionName = 'hideWindowFromView';
    const window = this.getWindow(windowId);
    if (!window) {
      this.logger.error(WindowManager.getLoggerParamsBuilder()
                          .setFunctionName(functionName)
                          .setMessage(`window is undefined`)
                          .build());
      return;
    }

    if (WindowState.HIDDEN !== window.getState()) {
      await window.hide(preserveContent);
    }

    // Find the first non-hidden window in reverse z-Order to foreground and set as active
    for (const w of this.getWindowsByZOrder().reverse()) {
      if (WindowState.HIDDEN !== w.getState()) {
        if (WindowState.BACKGROUND === w.getState()) {
          w.setState(WindowState.FOREGROUND);
        }
        this.setActiveWindowId(w.getWindowId());
        return;
      }
    }
    this.setActiveWindowId(undefined);
  }

  /**
   * Method to render a window to the view.
   * 
   * @param windowId The window id of the window to render.
   * @param windowState The optional window state to set when rendering.  Defaults to FOREGROUND
   */
  public async renderWindowToView(windowId : string, windowState ?: WindowState) : Promise<void> {
    const functionName = 'renderWindowToView';
    const window : IWindowElement | undefined = this.getWindow(windowId);
    if (!window) {
      this.logger.error(WindowManager.getLoggerParamsBuilder()
                          .setFunctionName(functionName)
                          .setMessage(`window is undefined`)
                          .build());
      return;
    }
    windowState = windowState || WindowState.FOREGROUND;
    await window.render(windowState);

    // Update state of other windows relative to zOrder relationship to rendered window
    for (const w of this.getWindowsByZOrder()) {
      // Ignore the active window
      if (w.getWindowId() === window.getWindowId()) continue;
      // If window is foregrounded and below the active window in z-order, background it
      if (w.getZOrder() < window.getZOrder()) {
        if (WindowState.FOREGROUND === w.getState()) {
          w.setState(WindowState.BACKGROUND);
        }
      } else if (WindowState.FOREGROUND === windowState && WindowState.HIDDEN !== w.getState()) {
        // If active window state is foreground, and another window is ahead of it in z-order and visible, hide it
        await w.hide(true);
      }
    }
    // Only update active window if we've rendered it to the foreground
    if (WindowState.FOREGROUND === windowState) {
      this.setActiveWindowId(windowId);
    }
  }

  /**
   * Method to set the windows managed by this class, mapped by windowId and in increasing z-order.
   * 
   * @param windowElements The window elements to be set.
   */
  public setWindows(windows : IWindowElement[]) : void {
    this.sortWindowsIntoZOrder(windows);
  }

  /**
   * Method to add windows managed by this class, mapped by windowId and in increasing z-order.
   * 
   * @param windowElements The window elements to be added.
   */
  public addWindows(windows : IWindowElement[]) : void {
    this.sortWindowsIntoZOrder(windows.concat([...this.windowIdToWindowElementMap.values()]));
  }

  /**
   * Method to remove windows managed by this class, mapped by windowId and in increasing z-order.
   * 
   * @param windowIds The window ids of the window elements to be removed.
   */
  public async removeWindows(windowIds : string[]) : Promise<void> {
    for (const windowId of windowIds) {
      await this.hideWindowFromView(windowId);
      this.windowIdToWindowElementMap.delete(windowId);
    }
    this.sortWindowsIntoZOrder([...this.windowIdToWindowElementMap.values()]);
  }

  /**
   * Sorts windows by DisplayType, ContentType, and requested Z-Order
   * 
   * @param windowA first window to compare
   * @param windowB second window to complare
   * @returns sort value
   */
  private sortWindowsCompare(windowA : IWindowElement, windowB : IWindowElement) : number {
    // First sort by display type
    const displayTypeSortVal = WindowTypeSortOrderMap.get(windowA.getDisplayType()) - WindowTypeSortOrderMap.get(windowB.getDisplayType());
    if (displayTypeSortVal !== 0) {
      return displayTypeSortVal;
    }
    // Second sort by content type
    const contentTypeSortVal = WindowContentTypeSortOrderMap.get(windowA.getContentType()) - WindowContentTypeSortOrderMap.get(windowB.getContentType());
    if (contentTypeSortVal !== 0) {
      return contentTypeSortVal;
    }
    // Finally sort by requested zOrder
    return windowA.getZOrder() - windowB.getZOrder();
  }

  /**
   * Method to set windows by z-order
   * 
   * @param windows windows to sort
   */
  private sortWindowsIntoZOrder(windows : IWindowElement[]) : void {
    this.windowIdToWindowElementMap.clear();

    // sort windows then insert to maintain insertion order in map
    const sortedWindows = windows.sort(this.sortWindowsCompare);
    let windowZOrder = 0;
    sortedWindows.forEach((window : IWindowElement) => {
      const windowId : string = window.getWindowId();
      // Update ZOrder to reflect sorted index
      window.setZOrder(windowZOrder);
      this.windowIdToWindowElementMap.set(windowId, window);
      windowZOrder++;
    });
  }

  /**
   * Method to set the current active window id.
   * 
   * @param windowId The new active window id.
   */
  private setActiveWindowId(windowId : string | undefined) : void {
    const stateChanged = (this.activeWindowId === undefined) !== (windowId === undefined);
    this.activeWindowId = windowId;

    if (stateChanged) {
      this.setIsWindowDisplaying(windowId  !== undefined);
    }
  }

  /**
   * Method to set the value for if one or more windows is currently displaying. If there is currently
   * an active window, this value should be set to true.
   * 
   * @param isWindowDisplaying The value to set for if a window is currently displaying.
   */
  private setIsWindowDisplaying(isWindowDisplaying : boolean) : void {
    this.isWindowDisplaying = isWindowDisplaying;
    this.observerManager.getObservers().forEach((o : IWindowManagerObserver) => {
      o.onIsWindowDisplayingChanged(this.isWindowDisplaying);
    });
  }

  /**
   * Method to get the window by window id.
   * 
   * @param windowId The id of the window to be returned.
   * @return The window element that corresponds to @param windowId.
   */
  public getWindow(windowId : string) : IWindowElement | undefined {
    return this.windowIdToWindowElementMap.get(windowId);
  }

  /**
  * Method to get the array of registered window Id's
  * 
  * @return List of window Id's
  */
  public getWindowIds() : string[] {
    return [...this.windowIdToWindowElementMap.keys()];
  }

  /**
   * Method to get the windows by increasing z-order.
   * 
   * @return List of windowElements.
   */
   public getWindowsByZOrder() : IWindowElement[] {
     return [...this.windowIdToWindowElementMap.values()];
   }

   /**
   * Method to get the windows instances for the registered window elements.
   * 
   * @return List of windowInstances.
   */
   public getWindowInstances() : IWindowInstance[] {
    const windowInstances : IWindowInstance[] = [];
    this.windowIdToWindowElementMap.forEach((windowElement : IWindowElement) => { 
      windowInstances.push(windowElement.getWindowInstance());
    });
    return windowInstances;
   }

  /**
   * Method to get the active window id if it exists.
   * 
   * @return The id of the current active window. This will return undefined if there is no active window.
   */
  public getActiveWindowId() : string | undefined {
    return this.activeWindowId;
  }

  /**
   * Method to get if a window is currently displaying.
   * 
   * @return true if there is currently an active window, false otherwise.
   */
  public getIsWindowDisplaying() : boolean {
    return this.isWindowDisplaying;
  }

 /**
   * Method to return the observer manager for this window manager.
   * 
   * @return The window manager's observer manager.
   */
  public getObserverManager() : IObserverManager<IWindowManagerObserver> {
    return this.observerManager;
  }

  /**
   * Method to update display orientation changes to all managed windows.
   * 
   * @param orientation the DisplayOrientation
   */
  public updateDisplayOrientationToWindows(orientation : DisplayOrientation) {
    this.getWindowsByZOrder().forEach((windowElement : IWindowElement) => { 
      windowElement.setDisplayOrientation(orientation);
      windowElement.update();
    });
  }

  /**
   * Method to update display size changes to all managed windows that support resizing.
   * 
   * @param displayWidth display width
   * @param diplayHeight display height
   */
  public updateDisplaySizeToWindows(displayWidth : number, diplayHeight : number) {
    this.getWindowsByZOrder().forEach((windowElement : IWindowElement) => { 
      // Alert all continuous windows of size changes so that they can scale as needed
      if (windowElement.getSizeType() === WindowSizeType.CONTINUOUS) {
        windowElement.setDimensions({
          width : displayWidth,
          height : diplayHeight
        })
        windowElement.update();
      }
    });
  }
}