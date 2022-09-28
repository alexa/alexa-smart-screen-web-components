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
import { createMock } from 'ts-auto-mock';
import * as AudioContextMocker from "standardized-audio-context-mock";

import {
  AVSVisualInterfaces,
  ContentType,
  ILoggerFactory,
  IFocusManager,
  IGUIActivityTracker,
  DefaultAudioContextProvider,
  FocusState,
  RequestResponsePromiseWrapperWithoutTimeout,
  DEFAULT_AUDIO_SETTINGS,
  ChannelName,
  Timer
} from "@alexa-smart-screen/common";
import { AudioPlayer, IAudioEventListener } from "apl-client";
import {
  APLAudioPlayer,
  IAPLAudioPlayerProps,
} from "../../src/media/APLAudioPlayer";

global.AudioContext = AudioContextMocker.AudioContext as any;

describe("@alexa-smart-screen/apl - APL Audio player functionality", () => {
  let loggerFactory : ILoggerFactory;
  let focusManager : IFocusManager;
  let guiActivityTracker : IGUIActivityTracker;
  let mockEventListener : IAudioEventListener;
  let audioContext : AudioContext;
  let audioPlayerProps : IAPLAudioPlayerProps;
  let aplAudioPlayer : APLAudioPlayer;

  const sandbox : sinon.SinonSandbox = sinon.createSandbox();

  // spies
  let requestResponsePromiseWrapperWithoutTimeoutOnRejectSpy : sinon.SinonSpy;
  let aplAudioPlayerAcquireFocusSpy : sinon.SinonSpy;
  let aplAudioPlayerReleaseFocusSpy : sinon.SinonSpy;
  let aplAudioPlayerFlushSpy : sinon.SinonSpy;

  // stubs
  let focusManagerAcquireFocusStub : sinon.SinonStub;
  let focusManagerReleaseFocusStub : sinon.SinonStub;
  let guiActivityTrackerRecordActiveStub : sinon.SinonStub;
  let guiActivityTrackerRecordInactiveStub : sinon.SinonStub;
  let playWithContextStub : sinon.SinonStub;
  let audioContextProviderGetAudioContextStub : sinon.SinonStub;

  const MEDIA1_ID = "mediaId1";
  const MEDIA2_ID = "mediaId2";

  beforeEach(() => {
    loggerFactory = createMock<ILoggerFactory>();
    focusManager = createMock<IFocusManager>();
    guiActivityTracker = createMock<IGUIActivityTracker>();
    mockEventListener = createMock<IAudioEventListener>();
    audioContext = new AudioContext();
    audioPlayerProps = {
      avsInterface : AVSVisualInterfaces.ALEXA_PRESENTATION_APL,
      channelName : ChannelName.DIALOG,
      contentType : ContentType.MIXABLE,
      eventListener : mockEventListener,
      logger : loggerFactory.getLogger(APLAudioPlayer.name),
      focusManager : focusManager,
      audioSettings : DEFAULT_AUDIO_SETTINGS,
      guiActivityTracker : guiActivityTracker,
    };
    aplAudioPlayer = new APLAudioPlayer(audioPlayerProps);

    requestResponsePromiseWrapperWithoutTimeoutOnRejectSpy = sandbox.spy(
      RequestResponsePromiseWrapperWithoutTimeout.prototype,
      "onReject"
    );
    aplAudioPlayerAcquireFocusSpy = sandbox.spy(
      APLAudioPlayer.prototype as any,
      "acquireFocus"
    );
    aplAudioPlayerReleaseFocusSpy = sandbox.spy(
      APLAudioPlayer.prototype as any,
      "releaseFocus"
    );
    aplAudioPlayerFlushSpy = sandbox.spy(APLAudioPlayer.prototype, "flush");
    
    focusManager.acquireFocus = sandbox.stub();
    focusManagerAcquireFocusStub = focusManager.acquireFocus as sinon.SinonStub;
    focusManager.releaseFocus = sandbox.stub();
    focusManagerReleaseFocusStub = focusManager.releaseFocus as sinon.SinonStub;
    
    guiActivityTracker.recordActive = sandbox.stub();
    guiActivityTrackerRecordActiveStub = guiActivityTracker.recordActive as sinon.SinonStub;
    guiActivityTracker.recordInactive = sandbox.stub();
    guiActivityTrackerRecordInactiveStub = guiActivityTracker.recordInactive as sinon.SinonStub;
   
    playWithContextStub = sandbox.stub(
      AudioPlayer.prototype as any,
      "playWithContext"
    );
    audioContextProviderGetAudioContextStub = sandbox.stub(
      DefaultAudioContextProvider.prototype,
      "getAudioContext"
    );
  });

  afterEach(() => {
    focusManager.reset();
    sandbox.reset();
    sandbox.restore();
  });

  it(`it should play audio when foreground focus is acquired successfully`, async () => {
    audioContextProviderGetAudioContextStub.resolves(audioContext);

    const focusToken0 = 0;
    focusManagerAcquireFocusStub.callsFake(() => {
      aplAudioPlayer["focusToken"] = focusToken0;
      aplAudioPlayer["processFocusChanged"](FocusState.FOREGROUND, focusToken0);
      return focusToken0;
    });

    await aplAudioPlayer.play(MEDIA1_ID);

    chai.assert.strictEqual(aplAudioPlayer["playing"], true);
    sinon.assert.calledWithExactly(
      playWithContextStub,
      MEDIA1_ID,
      audioContext
    );
  });

  it(`it should release audio focus if audio focus is not acquired successfully`, async () => {
    audioContextProviderGetAudioContextStub.resolves(audioContext);

    const focusToken0 = 0;
    focusManagerAcquireFocusStub.callsFake(() => {
      aplAudioPlayer["focusToken"] = focusToken0;
      aplAudioPlayer["processFocusChanged"](FocusState.NONE, focusToken0);
      return focusToken0;
    });

    await aplAudioPlayer.play(MEDIA1_ID);

    chai.assert.strictEqual(aplAudioPlayer["playing"], false);
    sinon.assert.called(aplAudioPlayerReleaseFocusSpy);
    sinon.assert.called(aplAudioPlayerFlushSpy);
  });

  it(`it should not allow a media to play when focus manager returns a focus background state`, async () => {
    audioContextProviderGetAudioContextStub.resolves(audioContext);

    const focusToken0 = 0;
    focusManagerAcquireFocusStub.callsFake(() => {
      aplAudioPlayer["focusToken"] = focusToken0;
      aplAudioPlayer["processFocusChanged"](FocusState.BACKGROUND, focusToken0);
      return focusToken0;
    });

    await aplAudioPlayer.play(MEDIA1_ID);

    chai.assert.strictEqual(aplAudioPlayer["playing"], false);
    sinon.assert.called(aplAudioPlayerReleaseFocusSpy);
    // For audio, we don't allow background audio playback. Ensure audio is flushed
    sinon.assert.called(aplAudioPlayerFlushSpy);
  });

  it(`it should ignore tokens that we are not expecting`, async () => {
    audioContextProviderGetAudioContextStub.resolves(audioContext);

    const focusToken0 = 0;
    const focusToken1 = 1;
    focusManagerAcquireFocusStub.callsFake(() => {
      aplAudioPlayer["focusToken"] = focusToken0;
      aplAudioPlayer["processFocusChanged"](FocusState.FOREGROUND, focusToken1);
      aplAudioPlayer["playbackFocusResolverManager"].onReject('');
      return focusToken0;
    });

    await aplAudioPlayer.play(MEDIA1_ID);

    chai.assert.strictEqual(aplAudioPlayer["playing"], false);
    chai.assert.strictEqual(aplAudioPlayer["focusToken"], undefined);
  });

  it(`it should release focus on playback finished`, async () => {
    audioContextProviderGetAudioContextStub.resolves(audioContext);

    const focusToken0 = 0;
    focusManagerAcquireFocusStub.callsFake(() => {
      aplAudioPlayer["focusToken"] = focusToken0;
      aplAudioPlayer["processFocusChanged"](FocusState.FOREGROUND, focusToken0);
      return focusToken0;
    });

    await aplAudioPlayer.play(MEDIA1_ID);

    chai.assert.strictEqual(aplAudioPlayer["playing"], true);

    aplAudioPlayer.onPlaybackFinished(MEDIA1_ID);

    sinon.assert.called(aplAudioPlayerReleaseFocusSpy);
    chai.assert.strictEqual(aplAudioPlayer["focusToken"], undefined);
  });

  it(`it should release focus on an error`, async () => {
    audioContextProviderGetAudioContextStub.resolves(audioContext);

    const focusToken0 = 0;
    focusManagerAcquireFocusStub.callsFake(() => {
      aplAudioPlayer["focusToken"] = focusToken0;
      aplAudioPlayer["processFocusChanged"](FocusState.FOREGROUND, focusToken0);
      return focusToken0;
    });

    const MEDIA1_ID = "id";

    await aplAudioPlayer.play(MEDIA1_ID);
    aplAudioPlayer.onError("id", "reason");

    chai.assert.strictEqual(aplAudioPlayer["playing"], false);
    sinon.assert.called(aplAudioPlayerReleaseFocusSpy);
  });

  it(`it should release first media focus after on playfinished is called and allow second media to play successfully`, async () => {
    audioContextProviderGetAudioContextStub.resolves(audioContext);

    const focusToken0 = 0;
    focusManagerAcquireFocusStub.callsFake(() => {
      aplAudioPlayer["focusToken"] = focusToken0;
      aplAudioPlayer["processFocusChanged"](FocusState.FOREGROUND, focusToken0);
      return focusToken0;
    });

    await aplAudioPlayer.play(MEDIA1_ID);

    chai.assert.strictEqual(aplAudioPlayer["playing"], true);

    aplAudioPlayer.onPlaybackFinished(MEDIA1_ID);

    sinon.assert.called(focusManagerReleaseFocusStub);
    chai.assert.strictEqual(aplAudioPlayer["playing"], false);

    const focusToken1 = 1;
    focusManagerAcquireFocusStub.callsFake(() => {
      aplAudioPlayer["focusToken"] = focusToken1;
      aplAudioPlayer["processFocusChanged"](FocusState.FOREGROUND, focusToken1);
      return focusToken1;
    });

    await aplAudioPlayer.play(MEDIA2_ID);
    chai.assert.strictEqual(aplAudioPlayer["playing"], true);
  });

  it(`it should release first media focus after on error is called and allow second media to play`, async () => {
    audioContextProviderGetAudioContextStub.resolves(audioContext);

    const focusToken0 = 0;
    focusManagerAcquireFocusStub.callsFake(() => {
      aplAudioPlayer["focusToken"] = focusToken0;
      aplAudioPlayer["processFocusChanged"](FocusState.FOREGROUND, focusToken0);
      return focusToken0;
    });

    await aplAudioPlayer.play(MEDIA1_ID);
    aplAudioPlayer.onError(MEDIA1_ID, "reason");

    sinon.assert.called(focusManagerReleaseFocusStub);
    chai.assert.strictEqual(aplAudioPlayer["playing"], false);

    const focusToken1 = 1;
    focusManagerAcquireFocusStub.callsFake(() => {
      aplAudioPlayer["focusToken"] = focusToken1;
      aplAudioPlayer["processFocusChanged"](FocusState.FOREGROUND, focusToken1);
      return focusToken1;
    });

    await aplAudioPlayer.play(MEDIA2_ID);
    chai.assert.strictEqual(aplAudioPlayer["playing"], true);
  });

  it(`it should reject the first audio and play the second audio if the first media returns focus none state`, async () => {
    audioContextProviderGetAudioContextStub.resolves(audioContext);

    const focusToken0 = 0;
    focusManagerAcquireFocusStub.callsFake(() => {
      aplAudioPlayer["focusToken"] = focusToken0;
      aplAudioPlayer["processFocusChanged"](FocusState.NONE, focusToken0);
      return focusToken0;
    });

    await aplAudioPlayer.play(MEDIA1_ID);

    chai.assert.strictEqual(aplAudioPlayer["playing"], false);

    const focusToken1 = 1;
    focusManagerAcquireFocusStub.callsFake(() => {
      aplAudioPlayer["focusToken"] = focusToken1;
      aplAudioPlayer["processFocusChanged"](FocusState.FOREGROUND, focusToken1);
      return focusToken1;
    });

    await aplAudioPlayer.play(MEDIA2_ID);

    chai.assert.strictEqual(aplAudioPlayer["playing"], true);
    chai.assert.strictEqual(aplAudioPlayer["focusToken"], focusToken1);
  });

  it(`it should record the correct activity playback state changes`, async () => {
    audioContextProviderGetAudioContextStub.resolves(audioContext);

    const focusToken0 = 0;
    focusManagerAcquireFocusStub.callsFake(() => {
      aplAudioPlayer["focusToken"] = focusToken0;
      aplAudioPlayer["processFocusChanged"](FocusState.FOREGROUND, focusToken0);
      return focusToken0;
    });

    let currentActivityToken = 0;
    guiActivityTrackerRecordActiveStub.callsFake(() => {
      currentActivityToken += 1;
      return currentActivityToken;
    });

    await aplAudioPlayer.play(MEDIA1_ID);
    sinon.assert.calledOnce(aplAudioPlayerAcquireFocusSpy);
    sinon.assert.calledOnce(guiActivityTrackerRecordActiveStub);
    chai.assert.strictEqual(
      aplAudioPlayer["activityToken"],
      currentActivityToken
    );

    aplAudioPlayerAcquireFocusSpy.resetHistory();
    aplAudioPlayerReleaseFocusSpy.resetHistory();
    guiActivityTrackerRecordActiveStub.resetHistory();
    guiActivityTrackerRecordInactiveStub.resetHistory();

    aplAudioPlayer.onError(MEDIA1_ID, "");
    sinon.assert.calledOnce(aplAudioPlayerReleaseFocusSpy);
    sinon.assert.calledWithExactly(
      guiActivityTrackerRecordInactiveStub,
      currentActivityToken
    );
    chai.assert.strictEqual(aplAudioPlayer["activityToken"], undefined);

    aplAudioPlayerAcquireFocusSpy.resetHistory();
    aplAudioPlayerReleaseFocusSpy.resetHistory();
    guiActivityTrackerRecordActiveStub.resetHistory();
    guiActivityTrackerRecordInactiveStub.resetHistory();

    await aplAudioPlayer.play(MEDIA1_ID);
    sinon.assert.calledOnce(aplAudioPlayerAcquireFocusSpy);
    sinon.assert.calledOnce(guiActivityTrackerRecordActiveStub);
    chai.assert.strictEqual(
      aplAudioPlayer["activityToken"],
      currentActivityToken
    );

    aplAudioPlayerAcquireFocusSpy.resetHistory();
    aplAudioPlayerReleaseFocusSpy.resetHistory();
    guiActivityTrackerRecordActiveStub.resetHistory();
    guiActivityTrackerRecordInactiveStub.resetHistory();

    aplAudioPlayer.onPlaybackFinished(MEDIA1_ID);
    sinon.assert.calledOnce(aplAudioPlayerReleaseFocusSpy);
    sinon.assert.calledWithExactly(
      guiActivityTrackerRecordInactiveStub,
      currentActivityToken
    );
    chai.assert.strictEqual(aplAudioPlayer["activityToken"], undefined);
  });

  it(`it should prevent the first play request from acquiring focus if there are two consecutive requests for the same audio player`, async () => {
    audioContextProviderGetAudioContextStub.resolves(audioContext);

    const focusToken0 = 0;
    focusManagerAcquireFocusStub.callsFake(async () => {
      await Timer.delay(10);
      aplAudioPlayer["focusToken"] = focusToken0;
      aplAudioPlayer["processFocusChanged"](FocusState.FOREGROUND, focusToken0);
      return focusToken0;
    });

    aplAudioPlayer.play(MEDIA1_ID);

    const focusToken1 = 1;
    focusManagerAcquireFocusStub.callsFake(async () => {
      await Timer.delay(10);
      aplAudioPlayer["focusToken"] = focusToken1;
      aplAudioPlayer["processFocusChanged"](FocusState.FOREGROUND, focusToken1);
      return focusToken1;
    });

    // Call play when focus request for first media is not resolved
    await aplAudioPlayer.play(MEDIA2_ID);

    sinon.assert.calledOnce(requestResponsePromiseWrapperWithoutTimeoutOnRejectSpy);
  });

  it(`it should flush the audio when audio focus changes from foreground to none`, async () => {
    audioContextProviderGetAudioContextStub.resolves(audioContext);

    const focusToken0 = 0;
    focusManagerAcquireFocusStub.callsFake(() => {
      aplAudioPlayer["focusToken"] = focusToken0;
      aplAudioPlayer["processFocusChanged"](FocusState.FOREGROUND, focusToken0);
      return focusToken0;
    });

    const MEDIA1_ID = "id1";

    await aplAudioPlayer.play(MEDIA1_ID);

    aplAudioPlayer["processFocusChanged"](FocusState.NONE, focusToken0);

    sinon.assert.called(aplAudioPlayerFlushSpy);
  });
});
