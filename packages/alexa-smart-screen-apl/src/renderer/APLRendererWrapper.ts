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

import { 
  APLWSRenderer, 
  IAPLWSOptions, 
  IEnvironment, 
  AudioPlayer, 
  IAudioEventListener, 
  IViewportCharacteristics, 
  LoggerFactory, 
  JSLogLevel, 
  LogTransport, 
  IConfigurationChangeOptions,
  IAudioContextProvider,
  APLClient,
  DeviceMode,
  DisplayState} from 'apl-client';
import { 
  AVSVisualInterfaces,
  ChannelName, 
  ContentType, 
  DefaultActivityTracker, 
  DefaultFocusManager, 
  ViewportShape, 
  ILogger, 
  LoggerParamsBuilder, 
  DEFAULT_AUDIO_SETTINGS, 
  IAudioContextControllerSettings, 
  IFocusManager, 
  IGUIActivityTracker, 
  DisplayCssProperty,
  OverflowCssProperty} from '@alexa-smart-screen/common';
import { IAPLRendererProps, IAPLRendererWrapperProps } from './APLRendererWrapperConfig';
import { APLVideoFactory } from '../media/APLVideo';
import { APLAudioPlayer, IAPLAudioPlayerProps } from '../media/APLAudioPlayer';
import { IPC_CONFIG_APL } from '../ipcComponents/IPCNamespaceConfigAPL';

/**
 * Wrapper class for APL renderer
 */
export class APLRendererWrapper {
  protected static readonly CLASS_NAME = 'APLRendererWrapper';
  private wrapperProps : IAPLRendererWrapperProps;
  private rendererProps : IAPLRendererProps;
  private viewportCharacteristics : IViewportCharacteristics;
  private aplEnvironment : IEnvironment;
  private deviceMode : DeviceMode;
  private renderer : APLWSRenderer;
  private audioPlayer : APLAudioPlayer;
  private logger : ILogger;
  private static isRendererLoggerInitialized = false;
  private client : APLClient;
  private audioSettings : IAudioContextControllerSettings;
  private focusManager : IFocusManager;
  private activityTracker : IGUIActivityTracker;
  private audioContextProvider : IAudioContextProvider;

  constructor(props : IAPLRendererWrapperProps) {
    this.wrapperProps = props;
    this.rendererProps = props;
    this.logger = props.loggerFactory.getLogger(IPC_CONFIG_APL.namespace);
    if (!APLRendererWrapper.isRendererLoggerInitialized) {
      APLRendererWrapper.initRendererLogger(this.logger);
    }

    this.client = props.client;
    this.focusManager = props.focusManager || new DefaultFocusManager();
    this.activityTracker = props.guiActivityTracker || new DefaultActivityTracker();
    this.audioSettings = props.audioSettings || DEFAULT_AUDIO_SETTINGS;
    this.audioContextProvider = props.audioContextProvider;
  }

  protected static getLoggerParamsBuilder() : LoggerParamsBuilder {
    return new LoggerParamsBuilder().setClassName(APLRendererWrapper.CLASS_NAME);
  }

  private createAudioPlayer(eventListener : IAudioEventListener) : AudioPlayer {
    const audioPlayerProps : IAPLAudioPlayerProps = {
      avsInterface : AVSVisualInterfaces.ALEXA_PRESENTATION_APL,
      channelName : ChannelName.DIALOG,
      contentType : ContentType.MIXABLE,
      eventListener : eventListener,
      logger : this.logger,
      focusManager : this.focusManager,
      guiActivityTracker : this.activityTracker,
      audioSettings : this.audioSettings,
      audioContextProvider : this.audioContextProvider
    };
    this.audioPlayer = new APLAudioPlayer(audioPlayerProps);
    return this.audioPlayer;
  }

  private deriveAplEnvironment(props : IAPLRendererProps) : IEnvironment {
    const environment : IEnvironment = {
      agentName : props.agentName,
      agentVersion : props.agentVersion,
      disallowVideo : props.disallowVideo,
      allowOpenUrl : props.allowOpenUrl,
      animationQuality : props.animationQuality
    }
    return environment;
  }

  private deriveDeviceMode(props : IAPLRendererProps) : DeviceMode {
    return props.modeOverride ? props.modeOverride : props.mode;
  }

  private deriveViewportCharacteristics(height : number, width : number, props : IAPLRendererProps) : IViewportCharacteristics {
    const viewportCharacteristics : IViewportCharacteristics = {
      width,
      height,
      isRound : props.shape === ViewportShape.ROUND,
      shape : props.shape,
      dpi : props.dpi
    };
    return viewportCharacteristics;
  }

  private deriveConfigChange(height : number, width : number, props : IAPLRendererProps) {
    const configChangeOptions : IConfigurationChangeOptions = {
      width,
      height,
      docTheme : props.theme,
      mode : props.modeOverride ? props.modeOverride : props.mode,
    }
    return configChangeOptions;
  }

  /**
   * Method to initialize a new APL Renderer instance
   * @param rendererElement The parent HTML div container for the APL renderer
   * @param height The height of the APL renderer window
   * @param width The width of the APL renderer window
   */
  public async createRenderer(rendererElement : HTMLDivElement, height : number, width : number) : Promise<void> {
    this.destroyRenderer();
    this.updateRenderer(height, width, this.rendererProps);

    const options : IAPLWSOptions = {
      view : rendererElement,
      theme : this.rendererProps.theme,
      viewport : this.viewportCharacteristics,
      mode : this.deviceMode,
      environment : this.aplEnvironment,
      audioPlayerFactory : this.createAudioPlayer.bind(this),
      client : this.client,
      videoFactory : new APLVideoFactory(AVSVisualInterfaces.ALEXA_PRESENTATION_APL, ContentType.MIXABLE, this.focusManager, this.activityTracker, this.logger),
      supportedExtensions : this.rendererProps.supportedExtensions,
      onResizingIgnored : this.wrapperProps.onResizingIgnoredCallback
    } as any;

    this.renderer = APLWSRenderer.create(options);

    await this.renderer.init();

    rendererElement.style.display = DisplayCssProperty.FLEX;
    rendererElement.style.overflow = OverflowCssProperty.HIDDEN;

    if (this.rendererProps.backgroundColorOverride) {
      rendererElement.style.backgroundColor = this.rendererProps.backgroundColorOverride;
    }
  }

  /**
   * Used to apply config changes to current APL document renderer based on window changes.
   * https://developer.amazon.com/docs/alexa/alexa-presentation-language/apl-document.html#onconfigchange
   * 
   * @param height updated height
   * @param width updated width
   * @param rendererProps updated APL Renderer Props
   */
  public updateRenderer(height : number, width : number, rendererProps ?: IAPLRendererProps) {
    rendererProps = rendererProps || this.rendererProps;
    const mode = this.deriveDeviceMode(rendererProps);
    const environment = this.deriveAplEnvironment(rendererProps);
    const viewportCharacteristics = this.deriveViewportCharacteristics(height, width, rendererProps);

    if (this.renderer && this.rendererProps && this.viewportCharacteristics && this.aplEnvironment) {
      if(this.deviceMode !== mode ||
        this.aplEnvironment.disallowVideo !== rendererProps.disallowVideo ||
        this.rendererProps.theme !== rendererProps.theme ||
        this.viewportCharacteristics.height !== height ||
        this.viewportCharacteristics.width !== width) {
          const configChangeOptions = this.deriveConfigChange(height, width, rendererProps);
          this.renderer.onConfigurationChange(configChangeOptions);
        }
    }

    this.deviceMode = mode;
    this.aplEnvironment = environment;
    this.viewportCharacteristics = viewportCharacteristics;
    this.rendererProps = rendererProps;
  }

  private destroyRenderer() : void {
    if (this.renderer) {
      this.renderer.destroy();
      this.renderer = undefined;
    }
  }

  /**
   * Method to clean up the current APL Renderer instance
   */
  public destroy() : void {
    this.activityTracker.reset();
    this.focusManager.reset();
    this.destroyRenderer();
    this.client.removeAllListeners();
  }

  /**
   * Method to stop playing audio for the current APL renderer 
   */
  public flushAudioPlayer() : void {
    if (this.audioPlayer) {
      this.audioPlayer.flush();
    }
  }

  private static initRendererLogger(logger : ILogger) : void {
    const logTransport : LogTransport = (level : JSLogLevel, loggerName : string, message : string) => {
      if (typeof (logger as any)[level] === 'function') {
        (logger as any)[level](APLRendererWrapper.getLoggerParamsBuilder()
                                .setMessage(`${loggerName} : ${message}`)
                                .build());
      }
    }

    // APL client log level will be further gated by the Smart Screen logger component
    LoggerFactory.initialize('info', logTransport);

    APLRendererWrapper.isRendererLoggerInitialized = true;
  }

  public setAudioSettings(audioSettings : IAudioContextControllerSettings) : void {
    if (this.audioPlayer) {
      this.audioSettings = audioSettings;
      this.audioPlayer.setAudioSettings(this.audioSettings);
    }
  }

  public setDisplayState(displayState : DisplayState) {
    if (this.renderer) {
      this.renderer.onDisplayStateChange({
        displayState
      })
    }
  }
}
