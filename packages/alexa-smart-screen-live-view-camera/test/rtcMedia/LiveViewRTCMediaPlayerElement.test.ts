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

import * as chai from "chai";
import * as sinon from "sinon";
import { createMock } from "ts-auto-mock";
import * as AudioContextMocker from "standardized-audio-context-mock";

import {
  IGUIActivityTracker,
  IFocusManager,
  FocusState,
  VisibilityCssProperty,
  OpacityCssProperty,
  RequestResponsePromiseWrapperWithoutTimeout,
  ILogger
} from "@alexa-smart-screen/common";
import { ILiveViewRTCMediaPlayerProps, LiveViewRTCMediaPlayerElement } from "../../src/rtcMedia/LiveViewRTCMediaPlayerElement";
import { ILiveViewCameraEvent } from "../../src/ipcComponents/ILiveViewCameraEvent";
import { LiveViewCameraState } from "../../src/constants/LiveViewCameraState";
import { LiveViewCameraUIState } from "../../src/constants/LiveViewCameraUIState";
import { SampleStartLiveViewPayload } from "../../src/debug/SampleStartLiveViewPayload";
import { LiveViewAudioState } from "../../src/ipcComponents/IStartLiveViewPayload";

global.AudioContext = AudioContextMocker.AudioContext as any;

interface IMediaClientStub {
  getRemoteStream() : Promise<any>;
  initialize() : void;
  shutdown() : void;
}

describe("@alexa-smart-screen/live-view-camera - LiveView RTC Media Player Element", () => {
  let logger : ILogger;
  let focusManager : IFocusManager;
  let guiActivityTracker : IGUIActivityTracker;
  let liveViewCameraEvent : ILiveViewCameraEvent;
  let liveViewRtcMediaPlayer : LiveViewRTCMediaPlayerElement;
  let liveViewRtcMediaPlayerProps : ILiveViewRTCMediaPlayerProps;
  let mediaClient : IMediaClientStub;

  const sandbox : sinon.SinonSandbox = sinon.createSandbox();

  // events
  const playingEvent : Event = new Event("playing");
  let pauseEvent : Event;

  // spies
  let requestResponsePromiseWrapperWithoutTimeoutOnRejectSpy : sinon.SinonSpy;
  let setMediaStreamSpy : sinon.SinonSpy;
  let lvcRTCMediaAcquireFocusSpy : sinon.SinonSpy;
  let lvcRTCMediaReleaseFocusSpy : sinon.SinonSpy;
  let videoStartedSpy : sinon.SinonSpy;
  let videoStoppedSpy : sinon.SinonSpy;
  let transitionVideoElementSpy : sinon.SinonSpy;
  let releaseFocusAndRecordInactiveSpy : sinon.SinonSpy;

  // stubs
  let mediaClientGetRemoteStreamStub : sinon.SinonStub;
  let mediaClientInitializeStub : sinon.SinonStub;
  let mediaClientShutdownStub : sinon.SinonStub;
  let focusManagerAcquireFocusStub : sinon.SinonStub;
  let loggerErrorStub : sinon.SinonStub;
  let guiActivityTrackerRecordActiveStub : sinon.SinonStub;
  let guiActivityTrackerRecordInactiveStub : sinon.SinonStub;
  let videoOnLoadStub : sinon.SinonStub;


  beforeEach(async () => {
    logger = createMock<ILogger>();
    focusManager = createMock<IFocusManager>();
    guiActivityTracker = createMock<IGUIActivityTracker>();
    liveViewCameraEvent = createMock<ILiveViewCameraEvent>();
    mediaClient = createMock<IMediaClientStub>();

    logger.error = sandbox.stub();
    loggerErrorStub = logger.error as sinon.SinonStub;
    
    mediaClient.initialize = sandbox.stub();
    mediaClient.getRemoteStream = sandbox.stub();
    mediaClient.shutdown = sandbox.stub();
    
    mediaClientInitializeStub = mediaClient.initialize as sinon.SinonStub;
    mediaClientShutdownStub = mediaClient.shutdown as sinon.SinonStub;
    mediaClientGetRemoteStreamStub = mediaClient.getRemoteStream as sinon.SinonStub;
    mediaClientGetRemoteStreamStub.callsFake(() => {
      return new Promise((resolve) => {
        resolve({});
      });
    });

    focusManager.acquireFocus = sandbox.stub();
    focusManagerAcquireFocusStub = focusManager.acquireFocus as sinon.SinonStub;

    liveViewRtcMediaPlayerProps = {
      liveViewEvent : liveViewCameraEvent,
      isDisplayRound : false,
      videoTransitionTimeInMS : 1000,
      focusManager : focusManager,
      activityTracker : guiActivityTracker,
      logger
    };

    requestResponsePromiseWrapperWithoutTimeoutOnRejectSpy = sandbox.spy(
      RequestResponsePromiseWrapperWithoutTimeout.prototype,
      "onReject"
    );

    setMediaStreamSpy = sandbox.spy(
      LiveViewRTCMediaPlayerElement.prototype as any,
      "setMediaStream"
    );

    lvcRTCMediaAcquireFocusSpy = sandbox.spy(
      LiveViewRTCMediaPlayerElement.prototype as any, 
      "acquireFocus"
    );
    lvcRTCMediaReleaseFocusSpy = sandbox.spy(
      LiveViewRTCMediaPlayerElement.prototype as any,
      "releaseFocus"
    );

    releaseFocusAndRecordInactiveSpy = sandbox.spy(
      LiveViewRTCMediaPlayerElement.prototype as any,
      "releaseFocusAndRecordInactive"
    );

    guiActivityTracker.recordActive = sandbox.stub();
    guiActivityTrackerRecordActiveStub = guiActivityTracker.recordActive as sinon.SinonStub;
    guiActivityTracker.recordInactive = sandbox.stub();
    guiActivityTrackerRecordInactiveStub = guiActivityTracker.recordInactive as sinon.SinonStub;
    
    Object.defineProperty(global.window.HTMLMediaElement.prototype, 'play', {
      configurable : true,
      get () {
        this.onplaying(playingEvent);
        return () => {Promise.resolve()}
      }
    });
    Object.defineProperty(global.window.HTMLMediaElement.prototype, 'pause', {
      configurable : true,
      get () {
        this.onpause(pauseEvent);
        return () => {Promise.resolve()}
      }
    });
    videoOnLoadStub = sandbox.stub(
      HTMLVideoElement.prototype,
      "load"
    );
    videoStartedSpy = sandbox.spy(
      LiveViewRTCMediaPlayerElement.prototype as any,
      "videoStarted"
    );
    videoStoppedSpy = sandbox.spy(
      LiveViewRTCMediaPlayerElement.prototype as any,
      "videoStopped"
    );
    transitionVideoElementSpy = sandbox.spy(
      LiveViewRTCMediaPlayerElement.prototype as any,
      "transitionVideoElement"
    );

    liveViewRtcMediaPlayer = new LiveViewRTCMediaPlayerElement(liveViewRtcMediaPlayerProps);
    liveViewRtcMediaPlayer["mediaClient"] = mediaClient;
    await liveViewRtcMediaPlayer.initializeClient(SampleStartLiveViewPayload);
    sinon.assert.notCalled(mediaClientShutdownStub);
    sinon.assert.calledOnce(mediaClientInitializeStub);
  });

  afterEach(() => {
    focusManager.reset();
    sandbox.reset();
    sandbox.restore();
  });

  it(`it should not initialize client if media client cannot be created`, async () => {
    liveViewRtcMediaPlayer["mediaClient"] = undefined;
    liveViewRtcMediaPlayer["mediaClientInitialized"] = false;
    await liveViewRtcMediaPlayer.initializeClient(SampleStartLiveViewPayload);
    // the beforeEach setup will call it once
    sinon.assert.calledOnce(mediaClientInitializeStub);
    chai.assert.strictEqual(liveViewRtcMediaPlayer["mediaClientInitialized"], false);
  });

  it(`it should shutdown client if initialze called after already initialized`, async () => {
    chai.assert.strictEqual(liveViewRtcMediaPlayer["mediaClientInitialized"], true);
    await liveViewRtcMediaPlayer.initializeClient(SampleStartLiveViewPayload);
    sinon.assert.calledOnce(mediaClientShutdownStub);
    sinon.assert.calledTwice(mediaClientInitializeStub);
    chai.assert.strictEqual(liveViewRtcMediaPlayer["mediaClientInitialized"], true);
  });

  it(`it should be able to successfully acquire focus for a media stream and start the video unmuted when camera state changes to CONNECTED`, async () => {
    const focusToken0 = 0;
    focusManagerAcquireFocusStub.callsFake(() => {
      liveViewRtcMediaPlayer["focusToken"] = focusToken0;
      liveViewRtcMediaPlayer["processFocusChanged"](FocusState.FOREGROUND, focusToken0);
      return focusToken0;
    });

    liveViewRtcMediaPlayer['uiState'] = LiveViewCameraUIState.RENDERED;
    liveViewRtcMediaPlayer['firstFrameRendered'] = true;
    await liveViewRtcMediaPlayer.setCameraConnectionState(LiveViewCameraState.CONNECTED);
    sinon.assert.calledOnce(lvcRTCMediaAcquireFocusSpy);
    chai.assert.strictEqual(liveViewRtcMediaPlayer["videoElement"].muted, false);

    sinon.assert.calledWithExactly(
      videoStartedSpy,
      playingEvent
    );
    sinon.assert.calledOnce(transitionVideoElementSpy);
  });

  it(`it should not unmute camera video if it does not have foreground focus`, async () => {
    const focusToken0 = 0;
    focusManagerAcquireFocusStub.callsFake(() => {
      liveViewRtcMediaPlayer["focusToken"] = focusToken0;
      liveViewRtcMediaPlayer["processFocusChanged"](FocusState.NONE, focusToken0);
      return focusToken0;
    });

    await liveViewRtcMediaPlayer.setCameraConnectionState(LiveViewCameraState.CONNECTED);

    sinon.assert.calledOnce(lvcRTCMediaAcquireFocusSpy);
    sinon.assert.calledOnce(requestResponsePromiseWrapperWithoutTimeoutOnRejectSpy);
    sinon.assert.notCalled(
      videoStartedSpy
    );
    sinon.assert.notCalled(transitionVideoElementSpy);

    chai.assert.strictEqual(liveViewRtcMediaPlayer["videoElement"].muted, true);
  });

  it(`it should mute video when focus changes to background`, async () => {
    liveViewRtcMediaPlayer["videoElement"].muted = false;
    const focusToken0 = 0;
    liveViewRtcMediaPlayer["focusToken"] = focusToken0;
    liveViewRtcMediaPlayer["processFocusChanged"](FocusState.BACKGROUND, focusToken0);

    chai.assert.strictEqual(liveViewRtcMediaPlayer["videoElement"].muted, true);
  });

  it(`it should ignore an unknown focus state`, async () => {
    liveViewRtcMediaPlayer["videoElement"].muted = false;
    const focusToken0 = 0;
    liveViewRtcMediaPlayer["focusToken"] = focusToken0;
    liveViewRtcMediaPlayer["processFocusChanged"]('UNKNOWN' as any, focusToken0);
    sinon.assert.calledOnce(loggerErrorStub);
  });

  it(`it should be able to ignore tokens that we are not expecting`, async () => {
    const focusToken0 = 0;
    const focusToken1 = 1;
    focusManagerAcquireFocusStub.callsFake(() => {
      liveViewRtcMediaPlayer["focusToken"] = focusToken0;
      liveViewRtcMediaPlayer["processFocusChanged"](FocusState.NONE, focusToken1);
      liveViewRtcMediaPlayer["playbackFocusResolverManager"].onReject('');
      return focusToken0;
    });

    await liveViewRtcMediaPlayer.setCameraConnectionState(LiveViewCameraState.CONNECTED);

    sinon.assert.notCalled(setMediaStreamSpy);
  });

  it(`it should release focus and reset video element when video is stopped`, async () => {
    pauseEvent = new Event('stop');
    liveViewRtcMediaPlayer["setMediaStream"]({} as any);
    await liveViewRtcMediaPlayer["videoElement"].pause();

    sinon.assert.calledOnce(releaseFocusAndRecordInactiveSpy);
    chai.assert.strictEqual(liveViewRtcMediaPlayer["videoElement"].srcObject, null);
    sinon.assert.calledTwice(videoOnLoadStub);
  });

  it(`it should set video to visible and opaque when transitioning with UI rendered and first frame rendered, and video should be unmuted when connected and in foreground,`, async () => {
    liveViewRtcMediaPlayer["videoElement"].muted = true;
    liveViewRtcMediaPlayer.setCameraUIState(LiveViewCameraUIState.RENDERED);
    liveViewRtcMediaPlayer.setCameraConnectionState(LiveViewCameraState.CONNECTED);
    liveViewRtcMediaPlayer["focusState"] = FocusState.FOREGROUND;
    liveViewRtcMediaPlayer["setMediaStream"]({} as any);

    sinon.assert.calledWithExactly(
      videoStartedSpy,
      playingEvent
    );
    sinon.assert.calledTwice(transitionVideoElementSpy);

    chai.assert.strictEqual(liveViewRtcMediaPlayer["videoElement"].muted, false);
    chai.assert.strictEqual(liveViewRtcMediaPlayer["videoElement"].style.visibility, VisibilityCssProperty.VISIBLE);
    chai.assert.strictEqual(liveViewRtcMediaPlayer["videoElement"].style.opacity, OpacityCssProperty.OPAQUE);
  });

  it(`it should NOT set video to visible and opaque or unmute camera speaker if transitioning when UI is still loading,`, async () => {
    liveViewRtcMediaPlayer["videoElement"].muted = true;
    liveViewRtcMediaPlayer.setCameraUIState(LiveViewCameraUIState.LOADING);
    liveViewRtcMediaPlayer["setMediaStream"]({} as any);

    sinon.assert.calledWithExactly(
      videoStartedSpy,
      playingEvent
    );
    sinon.assert.calledTwice(transitionVideoElementSpy);

    chai.assert.strictEqual(liveViewRtcMediaPlayer["videoElement"].muted, true);
    chai.assert.strictEqual(liveViewRtcMediaPlayer["videoElement"].style.visibility, VisibilityCssProperty.HIDDEN);
    chai.assert.strictEqual(liveViewRtcMediaPlayer["videoElement"].style.opacity, OpacityCssProperty.TRANSPARENT);
  });

  it(`it should NOT unmute camera speaker if transitioning with initial speaker state of MUTED,`, async () => {
    liveViewRtcMediaPlayer["videoElement"].muted = true;
    liveViewRtcMediaPlayer["initialSpeakerState"] = LiveViewAudioState.MUTED;
    liveViewRtcMediaPlayer.setCameraUIState(LiveViewCameraUIState.RENDERED);
    liveViewRtcMediaPlayer.setCameraConnectionState(LiveViewCameraState.CONNECTED);
    liveViewRtcMediaPlayer["focusState"] = FocusState.FOREGROUND;
    liveViewRtcMediaPlayer["setMediaStream"]({} as any);

    sinon.assert.calledWithExactly(
      videoStartedSpy,
      playingEvent
    );
    sinon.assert.calledTwice(transitionVideoElementSpy);

    chai.assert.strictEqual(liveViewRtcMediaPlayer["videoElement"].muted, true);
  });

  it(`it should pause the video when video focus changes from foreground to none`, async () => {
    pauseEvent = new Event('pause');
    const focusToken0 = 0;
    focusManagerAcquireFocusStub.callsFake(() => {
      liveViewRtcMediaPlayer["focusToken"] = focusToken0;
      liveViewRtcMediaPlayer["processFocusChanged"](FocusState.FOREGROUND, focusToken0);
      return focusToken0;
    });

    await liveViewRtcMediaPlayer.setCameraConnectionState(LiveViewCameraState.CONNECTED);

    liveViewRtcMediaPlayer["processFocusChanged"](FocusState.NONE, focusToken0);

    sinon.assert.calledWithExactly(
      videoStoppedSpy,
      pauseEvent
    );
  });

  it(`it should record the correct activity state on media playback changes`, async () => {
    const focusToken0 = 0;
    focusManagerAcquireFocusStub.callsFake(() => {
      liveViewRtcMediaPlayer["focusToken"] = focusToken0;
      liveViewRtcMediaPlayer["processFocusChanged"](FocusState.FOREGROUND, focusToken0);
      return focusToken0;
    });

    let currentActivityToken = 0;
    guiActivityTrackerRecordActiveStub.callsFake(() => {
      currentActivityToken += 1;
      return currentActivityToken;
    });

    lvcRTCMediaAcquireFocusSpy.resetHistory();
    lvcRTCMediaReleaseFocusSpy.resetHistory();
    guiActivityTrackerRecordActiveStub.resetHistory();
    guiActivityTrackerRecordInactiveStub.resetHistory();

    await liveViewRtcMediaPlayer.setCameraConnectionState(LiveViewCameraState.CONNECTED);
    sinon.assert.calledOnce(lvcRTCMediaAcquireFocusSpy);

    sinon.assert.calledWithExactly(
      videoStartedSpy,
      playingEvent
    );
    sinon.assert.calledOnce(guiActivityTrackerRecordActiveStub);
    chai.assert.strictEqual(liveViewRtcMediaPlayer["activityToken"], currentActivityToken);

    pauseEvent = new Event('stop');
    liveViewRtcMediaPlayer["videoElement"].pause();
    sinon.assert.calledWithExactly(
      videoStoppedSpy,
      pauseEvent
    );
    sinon.assert.calledOnce(lvcRTCMediaReleaseFocusSpy);
    sinon.assert.calledWithExactly(
      guiActivityTrackerRecordInactiveStub,
      currentActivityToken
    );
    chai.assert.strictEqual(liveViewRtcMediaPlayer["activityToken"], undefined);

    lvcRTCMediaAcquireFocusSpy.resetHistory();
    lvcRTCMediaReleaseFocusSpy.resetHistory();
    guiActivityTrackerRecordActiveStub.resetHistory();
    guiActivityTrackerRecordInactiveStub.resetHistory();

    await liveViewRtcMediaPlayer["videoElement"].play();
    sinon.assert.calledWithExactly(
      videoStartedSpy,
      playingEvent
    );
    sinon.assert.calledOnce(guiActivityTrackerRecordActiveStub);
    chai.assert.strictEqual(liveViewRtcMediaPlayer["activityToken"], currentActivityToken);
  });
});
