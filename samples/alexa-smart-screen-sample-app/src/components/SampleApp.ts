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

import { IHomeScreenProps, HomeScreen, ClientConnection } from './home/HomeScreen';
import {
  AlexaState,
  AudioFocusManagerEvent,
  AudioFocusManagerHandler,
  AudioInputInitiator,
  AuthorizationState,
  IAlexaStateObserver,
  IAttentionSystemRenderer,
  IAuthorizationObserver,
  ICBLAuthorizationRequest,
  IClientConfig,
  IClient,
  IDirective,
  ILogger,
  IVersionManager,
  ISetVisualCharacteristicsDirectivePayload,
  IVisualCharacteristicsObserver,
  IWindowConfig,
  IWindowElement,
  ConsoleLogHandler,
  IPCLogHandler,
  LoggerFactory,
  LoggerParamsBuilder,
  LogHandlerManager,
  WindowManagerEvent,
  WindowManagerHandler,
  VisualCharacteristicsType,
  WindowType,
  DisplayOrientation,
  DisplayMode,
  AVSVisualInterfaces
} from '@alexa-smart-screen/common';
import {
  APLEvent,
  APLHandler,
  APLWindowElement,
  APLWindowElementBuilder,
  DeviceModeConverter,
  IAPLRendererProps,
  IAPLWindowConfig,
  IAPLWindowElementProps
} from '@alexa-smart-screen/apl';
import {
  AVSDisplayCardsManager
} from '@alexa-smart-screen/sample-display-cards';
import { WebSocketClient } from '@alexa-smart-screen/web-socket';
import { IWindowManagerObserver, WindowManager } from '@alexa-smart-screen/window-manager';
import { 
  CaptionsEvent,
  CaptionsHandler,
  DoNotDisturbEvent,
  DoNotDisturbHandler,
  DoNotDisturbManager,
  InteractionManagerEvent,
  ISessionSetupObserver,
  KeyBinder,
  LocaleManager,
  SessionSetupHandler,
  SystemEvent,
  SystemHandler,
  VersionManager,
} from '@alexa-smart-screen/app-utils';
import { Router } from '@alexa-smart-screen/router';
import { CaptionsRenderer } from '@alexa-smart-screen/sample-captions';
import { AttentionSystemRenderer } from '@alexa-smart-screen/sample-attention-system';
import { BinderClient, IBinderClientConfig } from '@alexa-smart-screen/binder-client';
import { ISampleAppConfigPayload } from 'config/ISampleAppConfigPayload';

const HOST = 'localhost';
const PORT = 8933;
const LOGGER_ID_SAMPLE_APP = 'SampleApp';

const AGENT_NAME = 'Alexa-Smart-Screen-Sample-Web-App';
const AGENT_VERSION = '1.0.0';

export class SampleApp extends HTMLElement implements IAlexaStateObserver, IAuthorizationObserver, ISessionSetupObserver,
IVisualCharacteristicsObserver, IWindowManagerObserver {
  protected static readonly CLASS_NAME = 'SampleApp';

  // Logger
  private loggerFactory : LoggerFactory;
  private logger : ILogger;

  // IPC client
  private client : IClient;

  // Window manager
  private windowManager : WindowManager;

  // Config
  private visualCharacteristics : ISetVisualCharacteristicsDirectivePayload;
  private sampleAppConfig : ISampleAppConfigPayload;

  // Device Config
  private displayOrientation : DisplayOrientation;

  // Renderers
  private captionsRenderer : CaptionsRenderer;
  private attentionSystemRenderer : IAttentionSystemRenderer;

  // Routers
  private router : Router;

  // Version Manager
  private versionManager : IVersionManager;

  // Sample Home Screen
  private homeScreen : HomeScreen = new HomeScreen();

  // Locale
  private localeManager : LocaleManager;

  // Do Not Disturb
  private doNotDisturbManager : DoNotDisturbManager;

  // Events
  private focusEvent : AudioFocusManagerEvent;
  private captionsEvent : CaptionsEvent;
  private interactionManagerEvent : InteractionManagerEvent;
  private doNotDisturbEvent : DoNotDisturbEvent;
  private aplEvent : APLEvent;
  private windowManagerEvent : WindowManagerEvent;
  private systemEvent : SystemEvent;

  // Handlers
  private systemHandler : SystemHandler;
  private sessionSetupHandler : SessionSetupHandler;
  private focusHandler : AudioFocusManagerHandler;
  private doNotDisturbHandler : DoNotDisturbHandler;
  private captionsHandler : CaptionsHandler;
  private windowManagerHandler : WindowManagerHandler;

  // APL
  private aplHandler : APLHandler;

  // Display Cards
  private avsDisplayCardsManager : AVSDisplayCardsManager;

  // Alexa State and Auth
  private ipcVersion : string;
  private clientConnection : ClientConnection;
  private alexaState : AlexaState;
  private authorizationState : AuthorizationState;
  private authorizationRequest : ICBLAuthorizationRequest;

  constructor() {
    super();
    this.attachShadow({ mode : 'open' });
    this.loggerFactory = new LoggerFactory();
    
    // Init client
    if (ENABLE_BINDER_CLIENT) {
      const binderClientConfig : IBinderClientConfig = {
        loggerFactory : this.loggerFactory,
        messageHandlerFunctionName : 'f',
        messageSenderFunctionName : 'stringFromJavaScript',
        messageSenderClassName : 'class1'
      };
      this.client = new BinderClient(binderClientConfig);
    }
    else {
      const webSocketClientConfig : IClientConfig = {
        host : HOST,
        port : PORT,
        insecure : DISABLE_WEBSOCKET_SSL
      };
      this.client = new WebSocketClient(webSocketClientConfig, this.loggerFactory);
    }
    this.client.onMessage = this.handleMessage.bind(this);

    // No logs before this point
    this.versionManager = new VersionManager(this.loggerFactory);
    this.logger = this.loggerFactory.getLogger(LOGGER_ID_SAMPLE_APP);
    this.setConsoleLogHandler(this.loggerFactory);
    this.setIPCLogHandler(this.loggerFactory, this.client, this.versionManager);

    // Init all IPC Components
    this.router = new Router(this.loggerFactory, this.versionManager);
    this.windowManager = new WindowManager(this.loggerFactory);
    this.localeManager = LocaleManager.getInstance();
    this.doNotDisturbManager = new DoNotDisturbManager();

    this.captionsHandler = new CaptionsHandler(this.loggerFactory);
    this.captionsRenderer = new CaptionsRenderer(this.captionsHandler);
    this.attentionSystemRenderer = new AttentionSystemRenderer();

    this.focusEvent = new AudioFocusManagerEvent(this.client, this.loggerFactory);
    this.captionsEvent = new CaptionsEvent(this.client);
    this.interactionManagerEvent = new InteractionManagerEvent(this.client);
    this.doNotDisturbEvent = new DoNotDisturbEvent(this.client);
    this.aplEvent = new APLEvent(this.client);
    this.windowManagerEvent = new WindowManagerEvent(this.client, this.loggerFactory);
    this.systemEvent = new SystemEvent(this.client);

    this.systemHandler = new SystemHandler(this.loggerFactory, this.localeManager);
    this.sessionSetupHandler = new SessionSetupHandler(this.client, this.loggerFactory, this.versionManager);
    this.focusHandler = new AudioFocusManagerHandler(this.focusEvent, this.loggerFactory);
    this.windowManagerHandler = new WindowManagerHandler(
      this.windowManager,
      this.loggerFactory
    );
    this.doNotDisturbHandler = new DoNotDisturbHandler(this.loggerFactory, this.doNotDisturbManager);
    this.aplHandler =  new APLHandler(
      this.windowManager,
      this.loggerFactory
    );
    this.avsDisplayCardsManager = new AVSDisplayCardsManager(
      this.loggerFactory,
      this.client,
      this.router,
      this.aplEvent
    );
    this.registerNamespaces();

    // Register observers
    this.windowManager.getObserverManager().addObserver(this);
    this.localeManager.getObserverManager().addObserver(this.captionsRenderer);
    this.doNotDisturbManager.getObserverManager().addObserver(this.attentionSystemRenderer);
    this.systemHandler.getAlexaStateObserverManager().addObserver(this);
    this.systemHandler.getAlexaStateObserverManager().addObserver(this.attentionSystemRenderer);
    this.systemHandler.getAuthorizationObserverManager().addObserver(this);
    this.sessionSetupHandler.getObserverManager().addObserver(this);
    this.windowManagerHandler.getObserverManager().addObserver(this);
    this.windowManagerHandler.getObserverManager().addObserver(this.attentionSystemRenderer);
  
    // Init Orientation
    this.displayOrientation = this.getDisplayOrientation();
    // Init Client state
    this.resetClient();
    // Init Display state
    this.setDisplayStyle();
    // Initial Render
    this.render();
  }

  protected static getLoggerParamsBuilder() : LoggerParamsBuilder {
    return new LoggerParamsBuilder().setClassName(SampleApp.CLASS_NAME);
  }

  public onAuthorizationStateChanged(authState : AuthorizationState) {
    if (authState === this.authorizationState) return;
    this.authorizationState = authState;
    // If Auth state changes to anything but Authorizing reset the cached request, since it's no longer valid
    switch (this.authorizationState) {
      case AuthorizationState.UNINITIALIZED:
      case AuthorizationState.REFRESHED:
      case AuthorizationState.ERROR:
      case AuthorizationState.EXPIRED:
        this.authorizationRequest = undefined;
        break;
      case AuthorizationState.AUTHORIZING:
        break;
    }

    this.updateHomeScreen();
  }

  public onAuthorizationRequested(authRequest : ICBLAuthorizationRequest) {
    this.authorizationRequest = authRequest;
    this.authorizationState = AuthorizationState.AUTHORIZING;
    this.clientConnection = ClientConnection.CONNECTED;
    this.updateHomeScreen();
  }

  public onInitializeClient(ipcVersion : string, isIPCVersionSupported : boolean) : void {
    this.ipcVersion = ipcVersion;
    this.clientConnection = isIPCVersionSupported ? ClientConnection.CONNECTED : ClientConnection.UNSUPPORTED;
    if (isIPCVersionSupported) {
      this.windowManagerEvent.visualCharacteristicsRequest([
        VisualCharacteristicsType.DEVICE_DISPLAY,
        VisualCharacteristicsType.INTERACTION_MODES,
        VisualCharacteristicsType.WINDOW_TEMPLATES]);
      this.systemEvent.alexaStateRequest();
      this.systemEvent.authorizationStateRequest();
      this.systemEvent.authorizationInfoRequest();
      this.systemEvent.localesRequest();
    }
    this.updateHomeScreen();
  }

  public onAlexaStateChanged(alexaState : AlexaState) : void {
    if ((alexaState === AlexaState.CONNECTED || alexaState === AlexaState.IDLE)) {
      // If Alexa has connected then we must be connected and authorized
      this.clientConnection = ClientConnection.CONNECTED;
      if (this.authorizationState !== AuthorizationState.REFRESHED) {
        this.authorizationState = AuthorizationState.REFRESHED;
      }
    }
    if (alexaState === AlexaState.DISCONNECTED || alexaState === AlexaState.UNKNOWN) {
      this.clientConnection = ClientConnection.DISCONNECTED;
      if (this.alexaState !== AlexaState.DISCONNECTED && this.alexaState !== AlexaState.UNKNOWN) {
        this.resetClient();
      }
    }
    if (alexaState === AlexaState.CONNECTING) {
      this.clientConnection = ClientConnection.CONNECTING;
    }
    this.alexaState = alexaState;
    this.updateHomeScreen();
  }

  public onVisualCharacteristicsInit(visualCharacteristics : ISetVisualCharacteristicsDirectivePayload) : void {
    this.visualCharacteristics = visualCharacteristics;
    this.render();
  }

  public onConfigureClient(sampleAppConfig : ISampleAppConfigPayload) : void {
    this.sampleAppConfig = sampleAppConfig;
    this.render();
  }

  public registerNamespaces() : void {
    this.router.addNamespace(this.systemHandler);
    this.router.addNamespace(this.sessionSetupHandler);
    this.router.addNamespace(this.focusHandler);
    this.router.addNamespace(this.aplHandler);
    this.router.addNamespace(this.captionsHandler);
    this.router.addNamespace(this.doNotDisturbHandler);
    this.router.addNamespace(this.windowManagerHandler);

    // These namespaces do not have handlers and must be separately registered by the VersionManager
    const interactionManagerEventNamespace = this.interactionManagerEvent.getIPCNamespaceConfig();
    this.versionManager.addNamespaceVersionEntry(interactionManagerEventNamespace.version, interactionManagerEventNamespace.namespace);
  }

  public handleMessage(directive : IDirective) : void {
    const functionName = 'handleMessage';

    if (this.router.canHandle(directive)) {
      this.router.handleDirective(directive);
      return;
    }

    this.logger.warn(SampleApp.getLoggerParamsBuilder()
                      .setFunctionName(functionName)
                      .setMessage(`No suitable router found to handle directive: ${JSON.stringify(directive)}`)
                      .build());
  }

  private resetClient() {
    this.ipcVersion = undefined;
    this.visualCharacteristics = undefined;
    this.sampleAppConfig = undefined;
    this.authorizationState = AuthorizationState.UNINITIALIZED;
    this.clientConnection = ClientConnection.CONNECTING;
    this.alexaState = AlexaState.UNKNOWN;
    this.updateHomeScreen();
  }

  private transformKeyboardEvent(event : KeyboardEvent) : KeyboardEvent {
    if (!ENABLE_TRANSFORM_KEY_CODES) return event;
    /**
     * Used if the browser does not emit common key codes
     */
    let code : string | undefined;
    switch (event.key) {
      case this.sampleAppConfig.deviceKeys.talkKey.key:
        code = this.sampleAppConfig.deviceKeys.talkKey.code;
        break;
      case this.sampleAppConfig.deviceKeys.exitKey.key:
        code = this.sampleAppConfig.deviceKeys.exitKey.code;
        break;
      case this.sampleAppConfig.deviceKeys.backKey.key:
        code = this.sampleAppConfig.deviceKeys.backKey.code;
        break;
      case this.sampleAppConfig.deviceKeys.toggleCaptionsKey.key:
        code = this.sampleAppConfig.deviceKeys.toggleCaptionsKey.code;
        break;
      case this.sampleAppConfig.deviceKeys.toggleDoNotDisturbKey.key:
        code = this.sampleAppConfig.deviceKeys.toggleDoNotDisturbKey.code;
        break;
      default:
        break;
    }
    if (code) {
      return new KeyboardEvent(event.type, { key : event.key, code });
    }

    return event;
  }

  private updateHomeScreen() {
    const homeSettings : IHomeScreenProps = {
      ipcVersion : this.ipcVersion,
      clientConnection : this.clientConnection,
      description : this.sampleAppConfig ? this.sampleAppConfig.description : '',
      displayMode : this.sampleAppConfig ? this.sampleAppConfig.displayMode : DisplayMode.FIXED,
      audioInputInitiator : this.sampleAppConfig ? this.sampleAppConfig.audioInputInitiator : AudioInputInitiator.PRESS_AND_HOLD,
      talkKey : this.sampleAppConfig ? this.sampleAppConfig.deviceKeys.talkKey.key : '',
      authorizationState : this.authorizationState,
      authorizationRequest : this.authorizationRequest
    };
    this.homeScreen.updateScreen(homeSettings);
  }

  private async render() {
    // Tear down DOM on any call to render
    while(this.shadowRoot.firstChild) {
      this.shadowRoot.removeChild(this.shadowRoot.firstChild);
    }
    // Reset window resize callback
    window.onresize = undefined;
    // Always add and update Home Screen
    this.shadowRoot.appendChild(this.homeScreen);
    this.updateHomeScreen();
    // Build full Sample App DOM if we have a config and visual characteristics
    if (this.sampleAppConfig && this.visualCharacteristics) {
      // Assign callbacks for when root HTML window resizes
      window.onresize = () => {
        if (!this.sampleAppConfig.displayMode) {
          return;
        }
        if (this.sampleAppConfig.displayMode === DisplayMode.RESIZABLE) {
            this.handleResize();
        } else if (this.sampleAppConfig.displayMode === DisplayMode.ORIENTABLE) {
            const orientation = this.getDisplayOrientation();
            if (orientation !== this.displayOrientation) {
                this.handleOrientationChange(orientation);
            }
        }
        if (this.sampleAppConfig.displayMode !== DisplayMode.FIXED) {
          this.setDisplayStyle();
        }
      };
      // Init orientation
      this.displayOrientation = this.getDisplayOrientation();
  
      // Set input keys based from device config
      KeyBinder.getInstance().bindKeys({
        audioInputInitiator : this.sampleAppConfig.audioInputInitiator,
        captionsHandler : this.captionsHandler,
        captionsEvent : this.captionsEvent,
        interactionManagerEvent : this.interactionManagerEvent,
        doNotDisturbEvent : this.doNotDisturbEvent,
        doNotDisturbManager : this.doNotDisturbManager,
        deviceKeys : this.sampleAppConfig.deviceKeys,
        transformKeyboardEvent : this.transformKeyboardEvent.bind(this)
      });
    
      // Add Windows from config
      await this.createWindowsFromConfig(
        this.sampleAppConfig.defaultWindowId,
        this.sampleAppConfig.windows);

      // Update Display Style
      this.setDisplayStyle();

      // Layer sample attention system and captions
      this.attentionSystemRenderer.setAlexaInputs({
        audioInput : this.sampleAppConfig.audioInputInitiator,
        talkDeviceKey : this.sampleAppConfig.deviceKeys.talkKey
      })
      this.shadowRoot.appendChild(this.attentionSystemRenderer.getRootElement());
      this.shadowRoot.appendChild(this.captionsRenderer);  
    }
  }

  private getDisplayOrientation() : DisplayOrientation {
    return window.innerWidth >= window.innerHeight ? DisplayOrientation.LANDSCAPE : DisplayOrientation.PORTRAIT;
  }

  private handleOrientationChange(orientation : DisplayOrientation) {
    this.displayOrientation = orientation;
    this.windowManager.updateDisplayOrientationToWindows(this.displayOrientation);
    this.windowManagerEvent.windowInstancesUpdated(
      this.windowManager.getWindowInstances()
    );
  }

  private handleResize() {
    this.windowManager.updateDisplaySizeToWindows(window.innerWidth, window.innerHeight);
  }

  private getDefaultWindowConfig() : IWindowConfig {
    for (const windowConfig of this.sampleAppConfig.windows) {
      if (windowConfig.id === this.sampleAppConfig.defaultWindowId) {
        return windowConfig;
      }
    }
    return undefined;
  }

  private async registerLiveViewCamera(windowConfig : IAPLWindowConfig) : Promise<IWindowElement> {
    const liveViewCameraModule = await import(/* webpackMode: "eager" */ '@alexa-smart-screen/live-view-camera');
    const liveViewCameraWindowProps = this.createAPLWindowElementPropsFromSampleConfig(
      windowConfig
    ) as any;
    liveViewCameraWindowProps.client = this.client;
    if (this.sampleAppConfig.liveViewCameraOptions) {
      liveViewCameraWindowProps.options = this.sampleAppConfig.liveViewCameraOptions;
    }
    liveViewCameraWindowProps.debugMode = DEBUG_LIVE_VIEW_CAMERA_UI;

    const liveViewCameraWindow = liveViewCameraModule.LiveViewCameraWindowElementBuilder.createWindow(
      windowConfig,
      liveViewCameraWindowProps,
      this.displayOrientation
    );

    const liveViewCameraHandler = new liveViewCameraModule.LiveViewCameraHandler(liveViewCameraWindow, this.loggerFactory);
    this.router.addNamespace(liveViewCameraHandler);

    return liveViewCameraWindow;
  }

  private async createWindowsFromConfig(defaultWindowId : string, windowConfigs : IWindowConfig[]) {
    const functionName = 'createWindowsFromConfig';
    const defaultWindowConfig : IWindowConfig = this.getDefaultWindowConfig();
    let renderTemplateWindowId = defaultWindowId;

    // Initiate APL Windows from Config
    const aplWindows : IWindowElement[] = [];
    windowConfigs.forEach((windowConfig : IWindowConfig) => {
      // Create APL Windows
      if (APLWindowElementBuilder.isAPLWindowConfig(windowConfig)) {
        const aplWindowConfig : IAPLWindowConfig = windowConfig as IAPLWindowConfig;
        const aplWindowProps : IAPLWindowElementProps = this.createAPLWindowElementPropsFromSampleConfig(
          aplWindowConfig
        );
        const aplWindow : APLWindowElement = this.createAPLWindowFromSampleConfig(aplWindowConfig, aplWindowProps);
        aplWindows.push(aplWindow);

        // Prefer overlay windows for renderTemplate directives
        if (aplWindow.getDisplayType() === WindowType.OVERLAY && aplWindow.getWindowInstance().supportedInterfaces.includes(AVSVisualInterfaces.TEMPLATE_RUNTIME)) {
          renderTemplateWindowId = aplWindow.getWindowId();
        }
      }
    });
    this.windowManager.addWindows(aplWindows);
    
    // Use window config for APL-based media player window
    const mediaPlayerWindowConfig : IAPLWindowConfig = defaultWindowConfig as IAPLWindowConfig;
    const mediaPlayerWindowProps : IAPLWindowElementProps = this.createAPLWindowElementPropsFromSampleConfig(
      mediaPlayerWindowConfig
    );

    this.avsDisplayCardsManager.initWindows(
      this.windowManager,
      renderTemplateWindowId,
      mediaPlayerWindowConfig,
      mediaPlayerWindowProps, 
      this.displayOrientation
    );

    // Add LiveViewCamera Window if enabled
    if (ENABLE_LIVE_VIEW_CAMERA) {
      const liveViewCameraWindow : IWindowElement = await this.registerLiveViewCamera(mediaPlayerWindowConfig);
      this.windowManager.addWindows([liveViewCameraWindow]); 
    }

    // Report window instances created
    this.windowManagerEvent.windowInstancesReport(
        this.avsDisplayCardsManager.getPlayerInfoWindowId(),
        defaultWindowId,
        this.windowManager.getWindowInstances()
    );

    // Add all windows to shadow root by z-order
    this.windowManager.getWindowsByZOrder().forEach((window : IWindowElement) => {
      if (!(window instanceof HTMLElement)) {
        this.logger.warn(SampleApp.getLoggerParamsBuilder()
                      .setFunctionName(functionName)
                      .setMessage('Skipping adding window to shadow row as its not an HTMLElement')
                      .setArg('windowId', window.getWindowId())
                      .build());
        return;
      }
      this.shadowRoot.appendChild(window);
    });
  }

  private createAPLRendererPropsFromSampleConfig(windowConfig : IAPLWindowConfig) : IAPLRendererProps {
    const aplRendererProps : IAPLRendererProps = {
      agentName : AGENT_NAME,
      agentVersion : AGENT_VERSION,
      shape : this.visualCharacteristics.deviceDisplay.shape,
      dpi : this.visualCharacteristics.deviceDisplay.dimensions.pixelDensity.value,
      disallowVideo : false,
      mode : DeviceModeConverter.uiModeToDeviceMode(this.sampleAppConfig.mode),
      ...windowConfig.aplRendererParameters
    };
    return aplRendererProps;
  }

  private createAPLWindowElementPropsFromSampleConfig(
    windowConfig : IAPLWindowConfig) : IAPLWindowElementProps {

    const aplWindowProps : IAPLWindowElementProps = {
      windowId : windowConfig.id,
      rendererProps : this.createAPLRendererPropsFromSampleConfig(windowConfig),
      guiActivityTracker : this.interactionManagerEvent.guiActivityTracker,
      focusManager : this.focusEvent.focusManager,
      loggerFactory : this.loggerFactory,
      aplEvent : this.aplEvent,
    };

    return aplWindowProps;
  }

  private createAPLWindowFromSampleConfig(
    windowConfig : IAPLWindowConfig,
    aplWindowProps : IAPLWindowElementProps) : APLWindowElement {

    return APLWindowElementBuilder.createWindow(
      windowConfig,
      aplWindowProps,
      this.displayOrientation
    );
  }

  public onIsWindowDisplayingChanged(isWindowDisplaying : boolean) : void {
    if (this.attentionSystemRenderer) {
      this.attentionSystemRenderer.updateAttentionSystemState(isWindowDisplaying);
    }
  }

  public connectedCallback() : void {
    this.client.connect();
  }

  private setConsoleLogHandler(loggerFactory : LoggerFactory) : void {
    const logHandlerManager : LogHandlerManager = loggerFactory.getLogHandlerManager();
    const consoleLogHandler = new ConsoleLogHandler();
    if (LOG_LEVEL) {
      consoleLogHandler.setLevel(LOG_LEVEL);
    }
    logHandlerManager.addHandler(consoleLogHandler);
  }

  private setIPCLogHandler(loggerFactory : LoggerFactory, client : IClient, versionManager : IVersionManager) : void {
    const logHandlerManager : LogHandlerManager = loggerFactory.getLogHandlerManager();
    const ipcLogHandler = new IPCLogHandler(client);
    const ipcLogNamespace = ipcLogHandler.getLoggerEvent().getIPCNamespaceConfig();
    if (LOG_LEVEL) {
      ipcLogHandler.setLevel(LOG_LEVEL);
    }
    logHandlerManager.addHandler(ipcLogHandler);
    versionManager.addNamespaceVersionEntry(ipcLogNamespace.version, ipcLogNamespace.namespace);
  }

  private setDisplayStyle() : void {
    let scale = 1;
    let height : any = '100%';
    let width : any = '100%';
    let clipPath  = 'none';

    if (this.visualCharacteristics && this.visualCharacteristics.deviceDisplay && this.sampleAppConfig && this.sampleAppConfig.emulateDisplayDimensions) {
      const deviceDisplay = this.visualCharacteristics.deviceDisplay;
      // Use Display dimensions for fixed displays
      if (!this.sampleAppConfig.displayMode || this.sampleAppConfig.displayMode === DisplayMode.FIXED) {
        height = deviceDisplay.dimensions.resolution.value.height;
        width = deviceDisplay.dimensions.resolution.value.width;
      }

      // We use the default window as the display target for orientable displays.
      if (this.sampleAppConfig.displayMode === DisplayMode.ORIENTABLE) {
        const defaultWindow = this.windowManager.getWindow(this.sampleAppConfig.defaultWindowId);
        if (defaultWindow) {
          height = defaultWindow.getDimensions().height;
          width = defaultWindow.getDimensions().width;
        }
      }

      // We use the root HTML window as size for resizable displays
      if (this.sampleAppConfig.displayMode === DisplayMode.RESIZABLE) {
        height = window.innerHeight;
        width = window.innerWidth;
      } else if (this.sampleAppConfig.scaleToFill) {
        scale = Math.min(window.innerWidth / width, window.innerHeight / height);
      }

      clipPath = deviceDisplay.shape === 'ROUND' ? 'circle(50%)' : clipPath;
      height = `${height}px`;
      width = `${width}px`;
    }

    this.style.height = height;
    this.style.width = width;
    this.style.transform = `scale(${scale})`;
    this.style.clipPath = clipPath;
  }
}

window.customElements.define('sample-app', SampleApp);
