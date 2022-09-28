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

import { LocaleManager } from '@alexa-smart-screen/app-utils';
import {
  AlignItemsCssProperty,
  IObserverManager,
  IWindowElement,
  IWindowObserver,
  JustifyContentCssProperty,
  ObserverManager,
  OpacityCssProperty,
  PositionCssProperty,
  WindowContentType,
  WindowPositionType,
  WindowState,
  WindowResizeType,
  DisplayCssProperty,
  OverflowCssProperty,
  Timer,
  WindowSizeType,
  IWindowConfig,
  DisplayOrientation,
  IWindowInstance,
  WindowType,
  Calculator,
  IWindowDimensions,
  VisibilityCssProperty,
  LocaleType,
  LocaleLayoutDirection,
  ILocales,
} from '@alexa-smart-screen/common';
import { DEFAULT_WINDOW_TRANSLATE, OVERLAY_WINDOW_ACTIVE_IN_MS, OVERLAY_WINDOW_INACTIVE_IN_MS, WINDOW_TRANSITION_IN_MS } from './WindowProperties';

/**
 * Abstract base class for creating window elements
 */
export abstract class BaseWindowElement extends HTMLElement implements IWindowElement {
  protected windowId : string;
  protected config : IWindowConfig;
  protected contentType : WindowContentType
  protected displayOrientation : DisplayOrientation;
  protected height : number;
  protected width : number;
  protected minWidth : number;
  protected maxWidth : number;
  protected minHeight : number;
  protected maxHeight : number;
  protected zOrder : number;
  protected windowPosition : WindowPositionType;
  protected windowFlexAlignItems : AlignItemsCssProperty;
  protected windowFlexJustifyContent : JustifyContentCssProperty;
  protected windowActiveTransform : string;
  protected windowInactiveTransform : string;
  protected windowActiveTransition : string;
  protected windowInactiveTransition : string;
  protected windowActiveTransitionInMS : number;
  protected windowInactiveTransitionInMS : number;
  protected windowOpacityActiveTransitionInMs : number;
  protected primaryLocale : LocaleType;
  protected localeLayoutDirection : LocaleLayoutDirection;

  /**
   * abstract methods internal to the window element
   */
  public abstract update() : void;
  public abstract getWindowInstance() : IWindowInstance;
  public abstract getDisplayType() : WindowType;
  public abstract getSizeType() : WindowSizeType;
  protected abstract setHeight(height : number) : void;
  protected abstract setWidth(width : number) : void;
  protected abstract renderInternal() : Promise<void>;
  protected abstract hideInternal() : Promise<void>;
  protected abstract setStateInternal() : void;
  
  /** Element in the window used for resizing - usually lowest level */
  protected resizeElement : HTMLElement;
  /** Element in the window used for transitioning - usually one layer down from resize */
  protected transformTransitionElement : HTMLElement;
  /** Element in the window to apply shadow style too - usually wrapper on all other content */
  protected shadowElement : HTMLElement;

  private state : WindowState;
  private visibility : VisibilityCssProperty;
  private rendering : boolean;
  private rotated : boolean;
  private windowResizeType : WindowResizeType;

  private windowObserverManager : ObserverManager<IWindowObserver>;

  constructor(windowId : string) {
    super();
    this.style.position = PositionCssProperty.ABSOLUTE;
    this.style.height = '100%';
    this.style.width = '100%';
    this.style.display = DisplayCssProperty.FLEX;
    this.style.alignItems = AlignItemsCssProperty.CENTER;
    this.style.justifyContent = JustifyContentCssProperty.CENTER;
    this.style.flexGrow = '1';
    this.style.overflow = OverflowCssProperty.HIDDEN;
    this.displayOrientation = DisplayOrientation.LANDSCAPE;
    this.contentType = WindowContentType.GENERAL;
    this.windowId = windowId;
    this.windowObserverManager = new ObserverManager<IWindowObserver>();
    this.setState(WindowState.HIDDEN);
    this.setVisibility(VisibilityCssProperty.HIDDEN);
    this.windowFlexAlignItems = AlignItemsCssProperty.CENTER;
    this.windowFlexJustifyContent = JustifyContentCssProperty.CENTER;
    this.windowPosition = WindowPositionType.CENTER;

    this.primaryLocale = LocaleManager.getInstance().getPrimaryLocale();
    this.localeLayoutDirection = LocaleManager.getInstance().getLocaleLayoutDirection();
    LocaleManager.getInstance().getObserverManager().addObserver(this);

    // Default elements
    this.transformTransitionElement = this;
    this.resizeElement = this;
    this.shadowElement = this;
  }

  public onLocaleChanged(locales : ILocales, localeLayoutDirection : LocaleLayoutDirection) : void {
    this.primaryLocale = locales.primaryLocale;
    this.localeLayoutDirection = localeLayoutDirection; 
  }

  public setWindowConfig(config : IWindowConfig) : void {
    this.config = config;
    this.setZOrder(config.zOrderIndex);
    this.setWindowPosition(config.windowPosition);
    if (this.config.windowContentType) {
      this.setContentType(this.config.windowContentType);
    }
  }

  public setDisplayOrientation(orientation : DisplayOrientation) : void {
    this.displayOrientation = orientation;
  }

  public getWindowId() : string {
    return this.windowId;
  }

  public setContentType(contentType : WindowContentType) : void {
    this.contentType = contentType;
  }

  public getContentType() : WindowContentType {
    return this.contentType;
  }

  public setZOrder(zOrder : number) : void {
    this.zOrder = zOrder;
  }

  public getZOrder() : number {
    return this.zOrder;
  }

  public setDimensions(dimensions : IWindowDimensions) {
    this.minHeight = dimensions.minHeight;
    this.maxHeight = dimensions.maxHeight;
    this.minWidth = dimensions.minWidth;
    this.maxWidth = dimensions.maxWidth;
    this.setHeight(dimensions.height);
    this.setWidth(dimensions.width);
  }

  public getDimensions() : IWindowDimensions {
    return {
      width : this.width,
      height : this.height,
      minWidth : this.minWidth,
      maxWidth : this.maxWidth,
      minHeight : this.minHeight,
      maxHeight : this.maxHeight
    }
  }

  protected getHeightInRange(height : number) : number {
    return Calculator.getValueInRange(this.minHeight, this.maxHeight, height) || height;
  }

  protected getWidthInRange(width : number) : number {
    return Calculator.getValueInRange(this.minWidth, this.maxWidth, width) || width;
  }

  public setState(state : WindowState) : void {
    if (this.state !== state) {
      this.state = state;
      this.setStateInternal();

      this.windowObserverManager.getObservers().forEach((observer : IWindowObserver) =>
        observer.onWindowStateChanged(this.windowId, this.state)
      );
    }
  }

  public getState() : WindowState {
    return this.state;
  }

  public isRendering() : boolean {
    return this.rendering;
  }

  public getVisibility() : VisibilityCssProperty {
    return this.visibility;
  }

  protected setVisibility(visibility : VisibilityCssProperty ) : void {
    if (this.visibility !== visibility) {
      this.visibility = visibility;
      this.style.visibility = visibility;

      this.windowObserverManager.getObservers().forEach((observer : IWindowObserver) =>
        observer.onWindowVisibilityChanged(this.windowId, this.visibility)
      );
    }
  }

  public getResizeType() : WindowResizeType {
    return this.windowResizeType;
  }

  public setWindowPosition(windowPosition : WindowPositionType) : void {
    this.windowPosition = windowPosition;
  }

  public getWindowPosition() : WindowPositionType {
    return this.windowPosition;
  }

  public async render(windowState ?: WindowState) : Promise<void> {
    this.rendering = true;
    this.resizeWindow(WindowResizeType.RESET);
    await this.renderInternal();

    if (this.rendering) {
      await this.showWindow();
      this.setState(windowState || WindowState.FOREGROUND);
    }
  }

  public async hide(preserveContent ?: boolean) : Promise<void> {
    this.rendering = false;
    // Hide window before updating internal elements
    await this.hideWindow(!preserveContent);

    if (!this.rendering) {
      if (!preserveContent) {
        await this.hideInternal();
      }
      this.setState(WindowState.HIDDEN);
    }
  }

  /**
   * Animates the window into view based on preset transitions.
   */
  protected async showWindow() : Promise<void> {
    let delay = this.windowOpacityActiveTransitionInMs;
    this.style.transition = this.windowActiveTransition;
    this.style.opacity = OpacityCssProperty.OPAQUE;
    this.setVisibility(VisibilityCssProperty.VISIBLE);

    if (this.transformTransitionElement) {
      delay = this.windowActiveTransitionInMS;
      this.transformTransitionElement.style.transition = `transform ${this.windowActiveTransitionInMS}ms ease-out 0s`;
      this.transformTransitionElement.style.transform = this.windowActiveTransform;
    }

    await Timer.delay(delay);
  }

  /**
   * Animates the window out of view based on preset transitions.
   * @param {boolean} resetOnHide true if the window should reset size on hide
   */
  protected async hideWindow(resetOnHide  = true) : Promise<void> {
    this.style.transition = this.windowInactiveTransition;
    this.style.opacity = OpacityCssProperty.TRANSPARENT;
    this.setVisibility(VisibilityCssProperty.HIDDEN);

    if (this.transformTransitionElement) {
      const windowTransitionDelay = this.windowInactiveTransitionInMS + 'ms';
      this.transformTransitionElement.style.transition = `transform ${this.windowActiveTransitionInMS}ms ease-out ${windowTransitionDelay}`;
      this.transformTransitionElement.style.transform = this.windowInactiveTransform;
    }

    await Timer.delay(this.windowInactiveTransitionInMS);

    if (resetOnHide) {
      this.resizeWindow(WindowResizeType.RESET);
    }
  }

  /**
   * Disables focus outline on all elements for this window.
   */
  protected disableFocusOutline() {
    const style = document.createElement('style');
    style.innerHTML = `:focus { outline: none; }`;
    this.shadowRoot.appendChild(style);
  }

  /**
   * Applies a default box shadow to the window's specified shadow element.
   */
  protected applyWindowShadow() {
    if (this.shadowElement) {
      this.shadowElement.style.boxShadow = '0px 0px 40px 0px rgba(0,0,0,0.5)';
    }
  }

  /**
   * Resizes the window based on type, dimensions, and scale
   * 
   * @param resizeType the type of window resize (RESET, ROTATE, or SCALE)
   * @param scale optional: the target scale if resize is SCALE
   */
  protected resizeWindow(resizeType : WindowResizeType, scale ?: number) {
    if (!this.resizeElement || (this.windowResizeType === WindowResizeType.RESET && resizeType === WindowResizeType.RESET)) {
      return;
    }
    this.windowResizeType = resizeType;
    // Resize Logic
    let resizeScale = 1;
    let resizeRotateDeg = 0;
    let resizeWidth = '100%';
    let resizeHeight = '100%';
    let windowResizeTransition = 'unset';
    if (this.windowResizeType === WindowResizeType.SCALE && scale) {
      // Resize by scaling
      resizeScale = scale;
    } else if (this.windowResizeType === WindowResizeType.ROTATE) {
      this.rotated = !this.rotated;
      if (this.state === WindowState.FOREGROUND) {
        // Always animate the rotation for active windows
        windowResizeTransition = 'transform 250ms ease-in-out';
      }
      // Resize by rotating
      if (this.rotated) {
        // If we're rotating lock the dimensions instead of using %'s
        resizeWidth = `${this.resizeElement.offsetWidth}px`;
        resizeHeight = `${this.resizeElement.offsetHeight}px`;
        resizeRotateDeg = -90;
      }
    } else {
      this.rotated = false;
    }

    this.resizeElement.style.transform = `scale(${resizeScale}) rotate(${resizeRotateDeg}deg)`;
    this.resizeElement.style.transition = windowResizeTransition;
    this.resizeElement.style.height = resizeHeight;
    this.resizeElement.style.width = resizeWidth;
  }

  /**
   * Sets all transforms, timing, and alignments for preset window transitions
   */
  public setTransitions() : void {
    this.windowInactiveTransform = DEFAULT_WINDOW_TRANSLATE;
    this.windowActiveTransform = DEFAULT_WINDOW_TRANSLATE;
    this.windowActiveTransitionInMS = OVERLAY_WINDOW_ACTIVE_IN_MS;
    this.windowInactiveTransitionInMS = OVERLAY_WINDOW_INACTIVE_IN_MS;
    this.windowOpacityActiveTransitionInMs  = 0;

    let translateX  = 0;
    let translateY  = 0;

    switch (this.windowPosition) {
      case WindowPositionType.BOTTOM: {
        this.windowFlexAlignItems = AlignItemsCssProperty.FLEX_END;
        translateY = this.height;
        break;
      }
      case WindowPositionType.TOP: {
        this.windowFlexAlignItems = AlignItemsCssProperty.FLEX_START;
        translateY = -this.height;
        break;
      }
      case WindowPositionType.RIGHT: {
        this.windowFlexJustifyContent = JustifyContentCssProperty.FLEX_END;
        translateX = this.width;
        break;
      }
      case WindowPositionType.LEFT: {
        this.windowFlexJustifyContent = JustifyContentCssProperty.FLEX_START;
        translateX = -this.width;
        break;
      }
      case WindowPositionType.CENTER:
      default: {
        this.windowActiveTransitionInMS = WINDOW_TRANSITION_IN_MS;
        this.windowInactiveTransitionInMS = WINDOW_TRANSITION_IN_MS;
        this.windowOpacityActiveTransitionInMs = WINDOW_TRANSITION_IN_MS;
      }
    }

    this.windowActiveTransition = `visibility 1s, opacity ${this.windowOpacityActiveTransitionInMs}ms linear`;
    this.windowInactiveTransition = `visibility 1s, opacity ${this.windowInactiveTransitionInMS}ms linear`;
    this.windowInactiveTransform = `translate(${translateX}px, ${translateY}px)`;

    if (this.resizeElement) {
      this.resizeElement.style.alignItems = this.windowFlexAlignItems;
      this.resizeElement.style.justifyContent = this.windowFlexJustifyContent;
    }

    if (this.state === WindowState.HIDDEN) {
      this.hideWindow(true);
    }
  }

  public getObserverManager() : IObserverManager<IWindowObserver> {
    return this.windowObserverManager;
  }
}
