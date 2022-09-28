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

import { AudioContextController } from '../../src/audio/AudioContextController';
import * as AudioContextMocker from "standardized-audio-context-mock";
import { assert } from 'chai';
import * as sinon from 'sinon';
import { DEFAULT_AUDIO_SETTINGS } from '../../src/audio/AudioContextConstants';
import { ILogger } from '../../src/logger/ILogger';
import { createMock } from 'ts-auto-mock';
global.AudioContext = AudioContextMocker.AudioContext as any;
global.GainNode = AudioContextMocker.GainNode as any;

describe('@alexa-smart-screen/common/audio: AudioContextController', () => {
    let audioContextController : AudioContextController;
    let context : AudioContext;
    let logger : ILogger;
    const sandbox : sinon.SinonSandbox = sinon.createSandbox();
    
    beforeEach(() => {
        context = new AudioContext();
        logger = createMock<ILogger>({
            error : sandbox.spy(),
        });
        audioContextController = new AudioContextController(context, false, logger);
    });

    afterEach(() => {
        sandbox.reset();
        sandbox.restore();
    });

    it('should verify values for bass, midrange and treble after scaling when all in range', () => {
        audioContextController.setEqualizer(0, -3, 3);
        const expectedValues = audioContextController.getEqualizer();
        // bass
        assert.strictEqual(expectedValues[0].gain.value, 0.5);
        // midrange
        assert.strictEqual(expectedValues[1].gain.value, 0.25);
        // treble
        assert.strictEqual(expectedValues[2].gain.value, 0.75);
    });

    it('should verify volume = 0 when muted ', () => {
        const isMuted = true;
        audioContextController.setVolume(5, isMuted);
        const expectedVolume = audioContextController.getVolume();
        assert.strictEqual(expectedVolume.gain.value, 0);
    });

    it('should verify that value of volume is scaled when unmuted ', () => {
        const isMuted = false;
        audioContextController.setVolume(5, isMuted);
        const expectedVolume = audioContextController.getVolume();
        assert.strictEqual(expectedVolume.gain.value, 0.05);
    });

    it('should log an error and verify volume remains unchanged when volume below bounds and unmuted', () => {
        const isMuted = false;
        audioContextController.setVolume(-1800, isMuted);
        const expectedVolume = audioContextController.getVolume();
        assert.deepEqual(expectedVolume.gain.value, 1);
        sinon.assert.calledOnce(
            logger.error as sinon.SinonSpy
        );
    });

    it('should log an error and verify volume remains unchanged when volume above bounds and unmuted', () => {
        const isMuted = false;
        audioContextController.setVolume(10000000, isMuted);
        const expectedVolume = audioContextController.getVolume();
        assert.deepEqual(expectedVolume.gain.value, 1);
        sinon.assert.calledOnce(
            logger.error as sinon.SinonSpy
        );
    });

    it('should verify that volume is set as 0 when volume below bounds but muted', () => {
        const isMuted = true;
        audioContextController.setVolume(-180000, isMuted);

        const expectedVolume = audioContextController.getVolume();
        assert.strictEqual(expectedVolume.gain.value, 0);
    });

    it('should verify that volume is set as 0 volume above bounds but muted', () => {
        const isMuted = true;
        audioContextController.setVolume(10000000, isMuted);

        const expectedVolume = audioContextController.getVolume();
        assert.strictEqual(expectedVolume.gain.value, 0);
    });

    it('should log errors thrice when equalizer (all 3: bass, midrange and treble) below bounds and verify equalizer values remain unchanged', () => {
        audioContextController.setEqualizer(-90000000, -12000000, -3000000);
        sinon.assert.calledThrice(
            logger.error as sinon.SinonSpy
        );

        const expectedValues = audioContextController.getEqualizer();
        // bass
        assert.strictEqual(expectedValues[0].gain.value, 0.5);
        // midrange 
        assert.strictEqual(expectedValues[1].gain.value, 0.5);
        // treble
        assert.strictEqual(expectedValues[2].gain.value, 0.5);
    });

    it('should log an error once when midrange value below bounds, verify midrange value is unchanged and scale bass and treble', () => {
        audioContextController.setEqualizer(-3, -12, 3);
        sinon.assert.calledOnce(
            logger.error as sinon.SinonSpy
        );

        const expectedValues = audioContextController.getEqualizer();
        // bass
        assert.strictEqual(expectedValues[0].gain.value, 0.25);
        // midrange 
        assert.strictEqual(expectedValues[1].gain.value, 0.5);
        // treble
        assert.strictEqual(expectedValues[2].gain.value, 0.75);
    });

    it('should log errors thrice when equalizer (all 3: bass, midrange and treble) above bounds and verify equalizer values remain unchanged', () => {
        audioContextController.setEqualizer(9000000000, 120000000, 3000000000);
        sinon.assert.calledThrice(
            logger.error as sinon.SinonSpy
        );

        const expectedValues = audioContextController.getEqualizer();
        // bass
        assert.strictEqual(expectedValues[0].gain.value, 0.5);
        // midrange 
        assert.strictEqual(expectedValues[1].gain.value, 0.5);
        // treble
        assert.strictEqual(expectedValues[2].gain.value, 0.5);
    });

    it('should log an error once when treble value below bounds, verify treble value is unchanged and scale bass and midrange', () => {
        audioContextController.setEqualizer(-3, 3, 30);
        sinon.assert.calledOnce(
            logger.error as sinon.SinonSpy
        );

        const expectedValues = audioContextController.getEqualizer();
        // bass
        assert.strictEqual(expectedValues[0].gain.value, 0.25);
        // midrange 
        assert.strictEqual(expectedValues[1].gain.value, 0.75);
        // treble
        assert.strictEqual(expectedValues[2].gain.value, 0.5);
    });

    it('should verify the values set for default volume settings', () => {
        audioContextController.setVolume(DEFAULT_AUDIO_SETTINGS.volume, DEFAULT_AUDIO_SETTINGS.isMuted);
        const expectedVolume = audioContextController.getVolume();
        assert.strictEqual(expectedVolume.gain.value, 1);
    });

    it('should verify the values set for default equalizer settings', () => {
        audioContextController.setEqualizer(DEFAULT_AUDIO_SETTINGS.bass, DEFAULT_AUDIO_SETTINGS.midrange, DEFAULT_AUDIO_SETTINGS.treble);
        const expectedValues = audioContextController.getEqualizer();
        // bass
        assert.strictEqual(expectedValues[0].gain.value, 0.5);
        // midrange 
        assert.strictEqual(expectedValues[1].gain.value, 0.5);
        // treble
        assert.strictEqual(expectedValues[2].gain.value, 0.5);
    });
});