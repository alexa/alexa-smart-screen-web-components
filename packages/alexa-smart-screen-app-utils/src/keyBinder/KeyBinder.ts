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

import { AudioInputInitiator, IDoNotDisturbManager } from '@alexa-smart-screen/common';
import { IDeviceKeys } from './IDeviceKeys';
import { NavigationEvent } from '../interactionManager/constants/NavigationEvent';
import { ICaptionsEvent } from '../captions/ipcComponents/ICaptionsEvent';
import { ICaptionsObserver } from '../captions/ICaptionsObserver';
import { ICaptionsLine } from '../captions/ipcComponents/CaptionsMessageInterfaces';
import { CaptionsHandler } from 'captions/ipcComponents/CaptionsHandler';
import { RecognizeSpeechCaptureState } from '../interactionManager/constants/RecognizeSpeechCaptureState';
import { IInteractionManagerEvent } from '../interactionManager/ipcComponents/IInteractionManagerEvent';
import { IDoNotDisturbEvent } from '../doNotDisturb/ipcComponents/IDoNotDisturbEvent';

export interface IKeyBinderProps {
  audioInputInitiator : AudioInputInitiator;
  deviceKeys : IDeviceKeys;
  captionsHandler : CaptionsHandler;
  captionsEvent : ICaptionsEvent;
  interactionManagerEvent : IInteractionManagerEvent;
  doNotDisturbEvent : IDoNotDisturbEvent;
  doNotDisturbManager : IDoNotDisturbManager;
  /**
   * Transforms a captured keyboard event before the event is handled
   */
  transformKeyboardEvent ?: (event : KeyboardEvent) => KeyboardEvent;
}

export class KeyBinder implements ICaptionsObserver {
  private static instance : KeyBinder;
  private lastKeyDownCode : string;
  private audioInputInitiator : AudioInputInitiator;
  private transformKeyboardEvent ?: (event : KeyboardEvent) => KeyboardEvent;

  /**
   * Boolean tracking locked state of user interruption event handling.
   */
  private interruptionLock = false;

  /**
   * Boolean tracking captions state.
   */
  private captionsEnabled  = false;

  protected deviceKeys : IDeviceKeys;
  protected captionsHandler : CaptionsHandler;
  protected captionsEvent : ICaptionsEvent;
  protected interactionManagerEvent : IInteractionManagerEvent;
  protected doNotDisturbEvent : IDoNotDisturbEvent;
  protected doNotDisturbManager : IDoNotDisturbManager;

  private constructor() {
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    document.addEventListener('keyup', this.handleKeyUp.bind(this));

    document.addEventListener('touchstart', this.handleUserInterruption.bind(this));
    document.addEventListener('mousedown', this.handleUserInterruption.bind(this));
    document.addEventListener('wheel', this.handleUserInterruption.bind(this), {capture : true, passive : true});
  }

  public static getInstance() : KeyBinder {
    if (!KeyBinder.instance) {
      KeyBinder.instance = new KeyBinder();
    }
    return KeyBinder.instance;
  }

  public onSetCaptionsState(enabled : boolean) : void {
    this.captionsEnabled = enabled;
  }

  public onRenderCaptions(captionLines : ICaptionsLine[], duration : number, delay : number) : void {
    // no-op
  }

  public bindKeys(props : IKeyBinderProps) : void {
    this.audioInputInitiator = props.audioInputInitiator;
    this.deviceKeys = props.deviceKeys;
    this.captionsHandler = props.captionsHandler;
    this.captionsEvent = props.captionsEvent;
    this.interactionManagerEvent = props.interactionManagerEvent;
    this.doNotDisturbEvent = props.doNotDisturbEvent;
    this.doNotDisturbManager = props.doNotDisturbManager;
    this.transformKeyboardEvent = props.transformKeyboardEvent;

    this.captionsHandler.getObserverManager().addObserver(this);
    this.captionsEvent.captionsStateRequest();

    this.doNotDisturbEvent.doNotDisturbStateRequest();
  }

  private handleKeyDown(event : KeyboardEvent) : void {
    const transformedEvent = this.transformKeyboardEvent ? this.transformKeyboardEvent(event) : event;

    // Only handle key down events once
    if (transformedEvent.code === this.lastKeyDownCode) {
        return;
    }
    switch (transformedEvent.code) {
      // Press talk key to start speech recognition
      case this.deviceKeys.talkKey.code : {
        this.interactionManagerEvent.recognizeSpeechRequestEvent(this.audioInputInitiator, RecognizeSpeechCaptureState.START);
        break;
      }
      // Similar to EXIT button pressed on a remote
      case this.deviceKeys.exitKey.code:
        this.interactionManagerEvent.navigationEvent(NavigationEvent.EXIT);
        break;
      // Similar to BACK button pressed on a remote
      case this.deviceKeys.backKey.code:
        this.interactionManagerEvent.navigationEvent(NavigationEvent.BACK);
        break;
      // Similar to toggle Captions setting from a UI menu
      case this.deviceKeys.toggleCaptionsKey.code:
        this.captionsEvent.captionsStateChanged({enabled : !this.captionsEnabled});
        this.captionsEnabled = !this.captionsEnabled;
        break;
      // Similar to toggle Do Not Disturb setting from a UI menu
      case this.deviceKeys.toggleDoNotDisturbKey.code:
        this.doNotDisturbEvent.doNotDisturbStateChanged(!this.doNotDisturbManager.getDoNotDisturbState());
        break;
      // All other KeyDown events trigger user interruption
      default : {
        this.handleUserInterruption();
        break;
      }
    }

    this.lastKeyDownCode = transformedEvent.code;
  }

  private handleKeyUp(event : KeyboardEvent) : void {
    const transformedEvent = this.transformKeyboardEvent ? this.transformKeyboardEvent(event) : event;

    this.lastKeyDownCode = undefined;

    switch (transformedEvent.code) {
      // Release talk key to stop speech recognition on PRESS_AND_HOLD integrations
      case this.deviceKeys.talkKey.code: {
        if (AudioInputInitiator.PRESS_AND_HOLD === this.audioInputInitiator) {
          this.interactionManagerEvent.recognizeSpeechRequestEvent(this.audioInputInitiator, RecognizeSpeechCaptureState.STOP);
        }
        break;
      }
      default : {
        break;
      }
    }
  }

  /** 
   *  The interrupted event is reported when an user interaction interrupts an activity.
   *  Examples include keyDown events, clicks, touches, and scrolls.
   *  Some of these user interactions results in multiple events per user interaction, such
   *  as scrolling. Even when multiple events are fired, the interrupted event only needs to be
   *  reported once in a set time period. This implementation will report a maximum of one
   *  interrupted activity every 500 ms.
   */
   private handleUserInterruption() {
    if (!this.interruptionLock) {
      this.interruptionLock = true;
      this.interactionManagerEvent.guiActivityTracker.reportInterrupted();
      window.setTimeout(() => {
        this.interruptionLock = false;
      }, 500);
    }
  }
}
