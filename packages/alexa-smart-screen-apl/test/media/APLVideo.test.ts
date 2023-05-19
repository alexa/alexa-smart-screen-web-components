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
  AVSVisualInterfaces,
  ContentType,
  ILoggerFactory,
  IGUIActivityTracker,
  IFocusManager,
  FocusState,
  ChannelName,
  RequestResponsePromiseWrapperWithoutTimeout,
  Timer
} from "@alexa-smart-screen/common";
import { AudioTrack, MediaPlayerHandle, PlaybackState } from "apl-client";
import { APLVideo, DEFAULT_VOLUME, LOW_VOLUME } from "../../src/media/APLVideo";

global.AudioContext = AudioContextMocker.AudioContext as any;

describe("@alexa-smart-screen/apl - APL Video functionality", () => {
  let loggerFactory : ILoggerFactory;
  let focusManager : IFocusManager;
  let guiActivityTracker : IGUIActivityTracker;
  let aplVideo : APLVideo;
  let volume : number;

  const sandbox : sinon.SinonSandbox = sinon.createSandbox();

  // spies
  let requestResponsePromiseWrapperWithoutTimeoutOnRejectSpy : sinon.SinonSpy;
  let aplVideoAcquireFocusSpy : sinon.SinonSpy;
  let aplVideoReleaseFocusSpy : sinon.SinonSpy;

  // stubs
  let focusManagerAcquireFocusStub : sinon.SinonStub;
  let guiActivityTrackerRecordActiveStub : sinon.SinonStub;
  let guiActivityTrackerRecordInactiveStub : sinon.SinonStub;
  let mediaPlayerHandleConstructorStub : sinon.SinonStub;
  let videoPlayStub : sinon.SinonStub;
  let videoPauseStub : sinon.SinonStub;
  let videoOnEventStub : sinon.SinonStub;

  beforeEach(() => {
    loggerFactory = createMock<ILoggerFactory>();
    focusManager = createMock<IFocusManager>();
    guiActivityTracker = createMock<IGUIActivityTracker>();

    focusManager.acquireFocus = sandbox.stub();
    focusManagerAcquireFocusStub = focusManager.acquireFocus as sinon.SinonStub;

    requestResponsePromiseWrapperWithoutTimeoutOnRejectSpy = sandbox.spy(
      RequestResponsePromiseWrapperWithoutTimeout.prototype,
      "onReject"
    );

    aplVideoAcquireFocusSpy = sandbox.spy(
      APLVideo.prototype as any,
      "acquireFocus"
    );
    aplVideoReleaseFocusSpy = sandbox.spy(
      APLVideo.prototype as any,
      "releaseFocus"
    );

    guiActivityTracker.recordActive = sandbox.stub();
    guiActivityTrackerRecordActiveStub = guiActivityTracker.recordActive as sinon.SinonStub;
    guiActivityTracker.recordInactive = sandbox.stub();
    guiActivityTrackerRecordInactiveStub = guiActivityTracker.recordInactive as sinon.SinonStub;

    videoPlayStub = sandbox.stub(MediaPlayerHandle.prototype, "play");
    videoPauseStub = sandbox.stub(MediaPlayerHandle.prototype, "pause");
    videoOnEventStub = sandbox.stub(MediaPlayerHandle.prototype, "onEvent");

    sandbox.stub(HTMLMediaElement.prototype, 'volume').set((v : any) => {
      volume = v;
    })

    mediaPlayerHandleConstructorStub = sandbox.stub();
    // stub media player handle class super call in the constructor: https://stackoverflow.com/questions/40271140/es2016-class-sinon-stub-constructor
    Object.setPrototypeOf(MediaPlayerHandle, mediaPlayerHandleConstructorStub);
    aplVideo = new APLVideo(
      null as any,
      AVSVisualInterfaces.ALEXA_PRESENTATION_APL, 
      ContentType.MIXABLE,
      loggerFactory.getLogger(APLVideo.name),
      focusManager,
      guiActivityTracker)
  });

  afterEach(() => {
    focusManager.reset();
    sandbox.reset();
    sandbox.restore();
  });

  it(`it should be able to successfully play a video with a foregrounded audio track`, async () => {
    const focusToken0 = 0;
    focusManagerAcquireFocusStub.callsFake(() => {
      aplVideo["focusToken"] = focusToken0;
      aplVideo["processFocusChanged"](FocusState.FOREGROUND, focusToken0);
      return focusToken0;
    });

    aplVideo["setAudioTrack"](AudioTrack.kAudioTrackForeground);
    await aplVideo.play();

    // Should send a request for DIALOG channel focus when audio track requests foreground focus
    sinon.assert.calledWithExactly(aplVideoAcquireFocusSpy, ChannelName.DIALOG);
    sinon.assert.called(videoPlayStub);
  });

  it(`it should be able to play a video with no audio track`, async () => {
    aplVideo["setAudioTrack"](AudioTrack.kAudioTrackNone);
    await aplVideo.play();

    // Video with no audio track does not need to acquire focus
    sinon.assert.notCalled(aplVideoAcquireFocusSpy);
    sinon.assert.called(videoPlayStub);
  });

  it(`it should set volume to low if playing video with background focus`, async () => {
    const focusToken0 = 0;
    focusManagerAcquireFocusStub.callsFake(() => {
      aplVideo["focusToken"] = focusToken0;
      aplVideo["processFocusChanged"](FocusState.BACKGROUND, focusToken0);
      return focusToken0;
    });

    aplVideo["setAudioTrack"](AudioTrack.kAudioTrackBackground);
    await aplVideo.play();

    // Should send a request for CONTENT channel focus when audio track requests background focus
    sinon.assert.calledWithExactly(
      aplVideoAcquireFocusSpy,
      ChannelName.CONTENT
    );

    chai.assert.strictEqual(volume, LOW_VOLUME);
  });

  it(`it should set volume to default, then low, and back to default when focus changes from foreground to background and back`, async () => {
    const focusToken0 = 0;
    focusManagerAcquireFocusStub.callsFake(() => {
      aplVideo["focusToken"] = focusToken0;
      aplVideo["processFocusChanged"](FocusState.FOREGROUND, focusToken0);
      return focusToken0;
    });

    aplVideo["setAudioTrack"](AudioTrack.kAudioTrackBackground);
    await aplVideo.play();

    // Should send a request for CONTENT channel focus when audio track requests background focus
    sinon.assert.calledWithExactly(
      aplVideoAcquireFocusSpy,
      ChannelName.CONTENT
    );

    chai.assert.strictEqual(volume, DEFAULT_VOLUME);

    await Timer.delay(10);

    await aplVideo["processFocusChanged"](FocusState.BACKGROUND, focusToken0);

    chai.assert.strictEqual(volume, LOW_VOLUME);

    await Timer.delay(10);

    await aplVideo["processFocusChanged"](FocusState.FOREGROUND, focusToken0);

    chai.assert.strictEqual(volume, DEFAULT_VOLUME);
  });

  it(`it should not play video when video does not have focus`, async () => {
    const focusToken0 = 0;
    focusManagerAcquireFocusStub.callsFake(() => {
      aplVideo["focusToken"] = focusToken0;
      aplVideo["processFocusChanged"](FocusState.NONE, focusToken0);
      return focusToken0;
    });

    aplVideo["setAudioTrack"](AudioTrack.kAudioTrackForeground);
    await aplVideo.play();

    sinon.assert.calledWithExactly(aplVideoAcquireFocusSpy, ChannelName.DIALOG);

    sinon.assert.notCalled(videoPlayStub);
  });

  it(`it should be able to ignore tokens that we are not expecting`, async () => {
    const focusToken0 = 0;
    const focusToken1 = 1;
    focusManagerAcquireFocusStub.callsFake(() => {
      aplVideo["focusToken"] = focusToken0;
      aplVideo["processFocusChanged"](FocusState.FOREGROUND, focusToken1);
      aplVideo["playbackFocusResolverManager"].onReject('');
      return focusToken0;
    });

    aplVideo["setAudioTrack"](AudioTrack.kAudioTrackForeground);
    await aplVideo.play();

    sinon.assert.notCalled(videoPlayStub);
  });

  it(`it should be able to release focus when a video playback event that is playing changes to pause`, async () => {
    const focusToken0 = 0;
    focusManagerAcquireFocusStub.callsFake(() => {
      aplVideo["focusToken"] = focusToken0;
      aplVideo["processFocusChanged"](FocusState.FOREGROUND, focusToken0);
      return focusToken0;
    });

    aplVideo["setAudioTrack"](AudioTrack.kAudioTrackForeground);
    await aplVideo.play();

    sinon.assert.calledOnce(aplVideoAcquireFocusSpy);

    await aplVideo.onEvent(PlaybackState.PAUSED);

    sinon.assert.calledOnce(videoOnEventStub);
    sinon.assert.calledOnce(aplVideoReleaseFocusSpy);
  });

  it(`it should record the correct activity playback state on event changes`, async () => {
    const focusToken0 = 0;
    focusManagerAcquireFocusStub.callsFake(() => {
      aplVideo["focusToken"] = focusToken0;
      aplVideo["processFocusChanged"](FocusState.FOREGROUND, focusToken0);
      return focusToken0;
    });

    let currentActivityToken = 0;

    guiActivityTrackerRecordActiveStub.callsFake(() => {
      currentActivityToken += 1;
      return currentActivityToken;
    });

    aplVideo["setAudioTrack"](AudioTrack.kAudioTrackForeground);
    await aplVideo.play();
    sinon.assert.calledOnce(aplVideoAcquireFocusSpy);

    aplVideoAcquireFocusSpy.resetHistory();
    aplVideoReleaseFocusSpy.resetHistory();
    guiActivityTrackerRecordActiveStub.resetHistory();
    guiActivityTrackerRecordInactiveStub.resetHistory();

    await aplVideo.onEvent(PlaybackState.PLAYING);
    sinon.assert.calledWithExactly(videoOnEventStub, PlaybackState.PLAYING);
    sinon.assert.calledOnce(guiActivityTrackerRecordActiveStub);
    chai.assert.strictEqual(aplVideo["activityToken"], currentActivityToken);

    await aplVideo.onEvent(PlaybackState.PAUSED);
    sinon.assert.calledWithExactly(videoOnEventStub, PlaybackState.PAUSED);
    sinon.assert.calledOnce(aplVideoReleaseFocusSpy);
    sinon.assert.calledWithExactly(
      guiActivityTrackerRecordInactiveStub,
      currentActivityToken
    );
    chai.assert.strictEqual(aplVideo["activityToken"], undefined);

    aplVideoAcquireFocusSpy.resetHistory();
    aplVideoReleaseFocusSpy.resetHistory();
    guiActivityTrackerRecordActiveStub.resetHistory();
    guiActivityTrackerRecordInactiveStub.resetHistory();

    await aplVideo.onEvent(PlaybackState.PLAYING);
    sinon.assert.calledWithExactly(videoOnEventStub, PlaybackState.PLAYING);
    sinon.assert.calledOnce(guiActivityTrackerRecordActiveStub);
    chai.assert.strictEqual(aplVideo["activityToken"], currentActivityToken);

    await aplVideo.onEvent(PlaybackState.IDLE);
    sinon.assert.calledWithExactly(videoOnEventStub, PlaybackState.IDLE);
    sinon.assert.calledOnce(aplVideoReleaseFocusSpy);
    sinon.assert.calledWithExactly(
      guiActivityTrackerRecordInactiveStub,
      currentActivityToken
    );
    chai.assert.strictEqual(aplVideo["activityToken"], undefined);

    aplVideoAcquireFocusSpy.resetHistory();
    aplVideoReleaseFocusSpy.resetHistory();
    guiActivityTrackerRecordActiveStub.resetHistory();
    guiActivityTrackerRecordInactiveStub.resetHistory();

    await aplVideo.onEvent(PlaybackState.PLAYING);
    sinon.assert.calledWithExactly(videoOnEventStub, PlaybackState.PLAYING);
    sinon.assert.calledOnce(guiActivityTrackerRecordActiveStub);
    chai.assert.strictEqual(aplVideo["activityToken"], currentActivityToken);

    await aplVideo.onEvent(PlaybackState.ERROR);
    sinon.assert.calledWithExactly(videoOnEventStub, PlaybackState.ERROR);
    sinon.assert.calledOnce(aplVideoReleaseFocusSpy);
    sinon.assert.calledWithExactly(
      guiActivityTrackerRecordInactiveStub,
      currentActivityToken
    );
    chai.assert.strictEqual(aplVideo["activityToken"], undefined);

    aplVideoAcquireFocusSpy.resetHistory();
    aplVideoReleaseFocusSpy.resetHistory();
    guiActivityTrackerRecordActiveStub.resetHistory();
    guiActivityTrackerRecordInactiveStub.resetHistory();

    await aplVideo.onEvent(PlaybackState.PLAYING);
    sinon.assert.calledWithExactly(videoOnEventStub, PlaybackState.PLAYING);
    sinon.assert.calledOnce(guiActivityTrackerRecordActiveStub);
    chai.assert.strictEqual(aplVideo["activityToken"], currentActivityToken);

    await aplVideo.onEvent(PlaybackState.ENDED);
    sinon.assert.calledWithExactly(videoOnEventStub, PlaybackState.ENDED);
    sinon.assert.calledOnce(aplVideoReleaseFocusSpy);
    sinon.assert.calledWithExactly(
      guiActivityTrackerRecordInactiveStub,
      currentActivityToken
    );
    chai.assert.strictEqual(aplVideo["activityToken"], undefined);
  });

  it(`it should prevent the first play request from acquiring focus if there are two consecutive requests for the same video player`, async () => {
    const focusToken0 = 0;
    focusManagerAcquireFocusStub.callsFake(async () => {
      await Timer.delay(10);
      aplVideo["focusToken"] = focusToken0;
      aplVideo["processFocusChanged"](FocusState.FOREGROUND, focusToken0);
      return focusToken0;
    });

    aplVideo["setAudioTrack"](AudioTrack.kAudioTrackForeground);
    aplVideo.play();

    const focusToken1 = 1;
    focusManagerAcquireFocusStub.callsFake(async () => {
      await Timer.delay(10);
      aplVideo["focusToken"] = focusToken1;
      aplVideo["processFocusChanged"](FocusState.FOREGROUND, focusToken1);
      return focusToken1;
    });

    // Call play when focus request for first media is not resolved
    aplVideo["setAudioTrack"](AudioTrack.kAudioTrackForeground);
    await aplVideo.play();

    sinon.assert.calledOnce(requestResponsePromiseWrapperWithoutTimeoutOnRejectSpy);
  });

  it(`it should pause the video when video focus changes from foreground to none`, async () => {
    const focusToken0 = 0;
    focusManagerAcquireFocusStub.callsFake(() => {
      aplVideo["focusToken"] = focusToken0;
      aplVideo["processFocusChanged"](FocusState.FOREGROUND, focusToken0);
      return focusToken0;
    });

    aplVideo["setAudioTrack"](AudioTrack.kAudioTrackForeground);
    await aplVideo.play();

    aplVideo["processFocusChanged"](FocusState.NONE, focusToken0);

    sinon.assert.called(videoPauseStub);
  });
});
