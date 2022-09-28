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

import { APLEvent, AplExtensionURI, APLWindowElement, createAPLClearDocumentRequestPayload, IAPLWindowElementProps, IAPLClearDocumentRequestPayload, IAPLRenderDocumentRequestPayload } from '@alexa-smart-screen/apl';
import { AVSVisualInterfaces, BackgroundColorCssProperty, DefaultFocusManager, IClient, IFocusManager, ILogger, IWindowConfig, LoggerParamsBuilder, ViewportShape, WindowContentType } from '@alexa-smart-screen/common';
import { ILiveViewCameraUIOptionsConfig } from '../config/ILiveViewCameraUIOptionsConfig';
import { IPC_CONFIG_LIVE_VIEW_CAMERA } from '../ipcComponents/IPCNamespaceConfigLiveViewCamera';
import { LiveViewCameraEvent } from '../ipcComponents/LiveViewCameraEvent';
import { ILiveViewControllerAPLDatasource, LIVE_VIEW_CAMERA_DOCUMENT_TOKEN, resolveLiveViewControllerAPLPayload } from '../apl/LiveViewControllerToAPLResolver';
import { LiveViewCameraState } from '../constants/LiveViewCameraState';
import { ILiveViewCameraHandlerObserver } from '../ipcComponents/ILiveViewCameraHandlerObserver';
import { SampleLiveViewCameraOptions } from '../debug/SampleLiveViewControllerOptions';
import { SampleStartLiveViewPayload } from '../debug/SampleStartLiveViewPayload';
import { LiveViewRTCMediaPlayerElement } from '../rtcMedia/LiveViewRTCMediaPlayerElement';
import { LiveViewCameraUIState } from '../constants/LiveViewCameraUIState';
import { IStartLiveViewPayload } from '../ipcComponents/IStartLiveViewPayload';

export const LIVE_VIEW_CAMERA_WINDOW_ID  = 'liveViewCameraWindow';

/**
 * Interface for props to configure the LiveViewCameraWindowElement
 */
export interface ILiveViewCameraWindowElementProps extends IAPLWindowElementProps {
  client : IClient;
  options ?: ILiveViewCameraUIOptionsConfig;
  debugMode ?: boolean;
}

/**
 * Implementation of a window for rendering live view RTC camera streams that includes an APL-based GUI layer for camera interaction
 */
export class LiveViewCameraWindowElement extends APLWindowElement implements ILiveViewCameraHandlerObserver {
  protected static readonly CLASS_NAME = 'LiveViewCameraWindowElement';
  private aplEvent : APLEvent;
  private liveViewEvent : LiveViewCameraEvent;
  private logger  : ILogger;
  private options : ILiveViewCameraUIOptionsConfig;
  private debugMode : boolean;
  
  private liveViewRtcMediaPlayer : LiveViewRTCMediaPlayerElement;

  constructor(props : ILiveViewCameraWindowElementProps) {
    const focusManager : IFocusManager = props.focusManager;
    props.windowId = LIVE_VIEW_CAMERA_WINDOW_ID;
    props.rendererProps.supportedExtensions = [AplExtensionURI.LIVEVIEW];
    props.rendererProps.backgroundColorOverride = BackgroundColorCssProperty.TRANSPARENT;
    props.focusManager = new DefaultFocusManager();
    super(props as IAPLWindowElementProps);
    this.contentType = WindowContentType.CAMERA;
    this.aplEvent = props.aplEvent;
    this.liveViewEvent = new LiveViewCameraEvent(props.client);
    this.logger = props.loggerFactory.getLogger(IPC_CONFIG_LIVE_VIEW_CAMERA.namespace);
    this.options = props.options || undefined;
    this.debugMode = props.debugMode || false;

    this.transformTransitionElement.style.backgroundColor = BackgroundColorCssProperty.BLACK;

    // Init RTC MediaPlayer Element
    this.liveViewRtcMediaPlayer = new LiveViewRTCMediaPlayerElement({
      liveViewEvent : this.liveViewEvent,
      isDisplayRound : props.rendererProps.shape === ViewportShape.ROUND,
      videoTransitionTimeInMS : this.windowActiveTransitionInMS,
      focusManager,
      activityTracker : props.guiActivityTracker,
      logger : this.logger
    });

    // Report the window ID
    this.liveViewEvent.windowIdReport(LIVE_VIEW_CAMERA_WINDOW_ID);

    if (this.debugMode) {
      this.debugStartLiveViewUI();
    }
  }

  protected static getLoggerParamsBuilder() : LoggerParamsBuilder {
    return new LoggerParamsBuilder().setClassName(LiveViewCameraWindowElement.CLASS_NAME);
  }

  public setWindowConfig(config : IWindowConfig) : void {
    super.setWindowConfig(config);
    // Ensure window only supports the LiveViewCamera Interface
    this.supportedInterfaces = [AVSVisualInterfaces.LIVE_VIEW_CAMERA];
  }

  private async debugStartLiveViewUI() {
    this.options = SampleLiveViewCameraOptions;
    await this.onStartLiveView(SampleStartLiveViewPayload);
    await this.onCameraStateChanged(LiveViewCameraState.CONNECTED);
  }

  public async onStartLiveView(startLiveViewPayload : IStartLiveViewPayload) {
    const functionName = 'onStartLiveView';

    const mediaClientInitialized : boolean = await this.liveViewRtcMediaPlayer.initializeClient(startLiveViewPayload);

    if (!this.debugMode && !mediaClientInitialized) {
      this.logger.error(LiveViewCameraWindowElement.getLoggerParamsBuilder()
              .setFunctionName(functionName)
              .setMessage('LiveView RTC MediaPlayer Adapter failed to initialize!')
              .build());
      return;        
    }

    // Insert RTC MediaPlayer element
    this.insertRTCMediaPlayerElement();
    
    // Initialize rendering of the APL-based UI for LiveViewCamera control
    const liveViewAPLDatasource : ILiveViewControllerAPLDatasource = {
      liveView : startLiveViewPayload,
      options : this.options || {}
    };
    const liveViewAPLPayload : IAPLRenderDocumentRequestPayload = resolveLiveViewControllerAPLPayload(liveViewAPLDatasource, this.primaryLocale, this.localeLayoutDirection);
    this.aplEvent.renderDocumentRequest(liveViewAPLPayload);
    this.liveViewRtcMediaPlayer.setCameraUIState(LiveViewCameraUIState.LOADING);
  }

  public onStopLiveView() {
    this.handleStopLiveView();
  }

  public async onCameraStateChanged(state : LiveViewCameraState) {
    await this.liveViewRtcMediaPlayer.setCameraConnectionState(state);
  }

  private insertRTCMediaPlayerElement() {
    if (this.transformTransitionElement.childElementCount === 1) {
      this.transformTransitionElement.insertBefore(this.liveViewRtcMediaPlayer, this.rendererElement);
    }
  }

  private handleStopLiveView() {
    this.liveViewRtcMediaPlayer.setCameraUIState(LiveViewCameraUIState.CLEARED);
    const localClearDocumentPayload : IAPLClearDocumentRequestPayload = createAPLClearDocumentRequestPayload(
      LIVE_VIEW_CAMERA_DOCUMENT_TOKEN,
      LIVE_VIEW_CAMERA_WINDOW_ID
    );
    this.aplEvent.clearDocumentRequest(localClearDocumentPayload);
    this.liveViewRtcMediaPlayer.shutdownClient();
  }

  protected async renderInternal() : Promise<void> {
    await super.renderInternal();
    this.liveViewRtcMediaPlayer.setCameraUIState(LiveViewCameraUIState.RENDERED);
  }

  protected async hideInternal() : Promise<void> {
    await super.hideInternal();
    this.handleStopLiveView();
  }
}

window.customElements.define('live-view-camera-window-element', LiveViewCameraWindowElement);
