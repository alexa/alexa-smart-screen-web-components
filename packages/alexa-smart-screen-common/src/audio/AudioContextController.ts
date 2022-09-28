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

import { ILogger } from '../logger/ILogger';
import { LoggerParamsBuilder } from '../logger/LoggerParamsBuilder';
import { IAudioContextProvider } from './IAudioContextProvider';
import { AudioEqualizerRange, BandFrequencies, DEFAULT_AUDIO_SETTINGS, SDKEqualizerRange } from './AudioContextConstants';

export interface IAudio extends IAudioContextProvider {
  /**
   * Gets the GainNode to play audio through
   * 
   * @returns the input GainNode when equalizer enabled and the volume GainNode when equalizer disabled
   */
  getInput() : GainNode;

  /**
   * Gets the volume values
   * 
   * @returns the volume GainNode
   */
  getVolume() : GainNode;

  /**
  * Gets the equalizer (bass, midrange, treble) values
  * 
  * @returns an array consisting of lowGain, midGain, highGain GainNodes
  */
  getEqualizer() : Array<GainNode>;

  /**
   * Connects an html audio element to the audio routing graph of the current AudioContext
   *
   * @param htmlAudio an HTMLAudioElement object
   */
  connectHtmlNodeToSpeaker(htmlAudio : HTMLAudioElement) : void;

  /**
   * Sets volume and mute
   *
   * @param volume The playback volume
   * @param isMuted A boolean that signifies whether audio is muted or not
   *
   */
  setVolume(volume : number, isMuted : boolean) : void;

  /**
   * Sets equalizer values
   *
   * @param bass The playback bass
   * @param midrange The playback midrange
   * @param treble A boolean The playback treble
   */
  setEqualizer(bass : number, midrange : number, treble : number) : void;

  /**
   * Sets the state of the equalizer
   *
   * @param enabled boolean denoting whether the equalizer is enabled or not
   */
  setEqualizerState(enabled : boolean) : void;
}

export class AudioContextController implements IAudio {
  protected static readonly CLASS_NAME = 'AudioContextController';
  private audioContext : AudioContext;
  private equalizerState : boolean;
  private mediaElementSource : MediaElementAudioSourceNode;
  private logger : ILogger;

  /// The volume Gain node to set the master volume
  /// Audio Players can connect to this node to bypass
  /// equalizer.
  private volume : GainNode;

  /// The audio destination node
  private speaker : AudioDestinationNode;

  /// Input GainNode. Audio Players will connect to
  /// this node in order to go through the equalizer
  private input : GainNode;

  private output : GainNode;
  private lowGain : GainNode;
  private midGain : GainNode;
  private highGain : GainNode;

  /// Filters for each of the bands (bass, midrange, treble)
  private lowFilter : BiquadFilterNode;
  private midFilter : BiquadFilterNode;
  private highFilter : BiquadFilterNode;

  /// Dynamics compressor to smooth audio
  private compressor : DynamicsCompressorNode;

  public constructor(
    context : AudioContext,
    supportsEqualizer : boolean,
    logger : ILogger
  ) {
    this.logger = logger;
    this.audioContext = context;
    this.volume = this.audioContext.createGain();
    this.speaker = this.audioContext.destination;
    this.volume.connect(this.speaker);
    this.equalizerState = supportsEqualizer;
    this.initailizeEqualizer();
    this.setVolume(DEFAULT_AUDIO_SETTINGS.volume, DEFAULT_AUDIO_SETTINGS.isMuted);
    this.setEqualizer(DEFAULT_AUDIO_SETTINGS.bass, DEFAULT_AUDIO_SETTINGS.midrange, DEFAULT_AUDIO_SETTINGS.treble);
  }

  public setEqualizerState(enabled : boolean) : void {
    this.equalizerState = enabled;
  }

  public getInput() : GainNode {
    if (this.equalizerState) {
      return this.input;
    } else {
      return this.volume;
    }
  }

  public connectHtmlNodeToSpeaker(htmlAudioNode : HTMLAudioElement) : void {
    this.mediaElementSource = this.audioContext.createMediaElementSource(htmlAudioNode);
    this.mediaElementSource.connect(this.getInput());
  }

  public getAudioContext() : Promise<AudioContext> {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
    }
    return Promise.resolve(this.audioContext);
  }

  public releaseAudioContext(audioContext : AudioContext) : Promise<void> {
    audioContext.close();
    return Promise.resolve();
  }

  /// Initialize the equalizer
  private initailizeEqualizer() : void {

    /// Initialize the dynamics compressor
    this.compressor = this.audioContext.createDynamicsCompressor();
    this.compressor.threshold.value = -50;
    this.compressor.knee.value = 40;
    this.compressor.ratio.value = 12;
    this.compressor.attack.value = 0.3;
    this.compressor.release.value = 0.3;

    this.input = this.audioContext.createGain();
    this.output = this.audioContext.createGain();

    this.lowGain = this.audioContext.createGain();
    this.midGain = this.audioContext.createGain();
    this.highGain = this.audioContext.createGain();

    this.lowFilter = this.audioContext.createBiquadFilter();
    this.midFilter = this.audioContext.createBiquadFilter();
    this.highFilter = this.audioContext.createBiquadFilter();

    this.setEqualizerVolume(this.volume.gain.value);
    this.create3BandFilter(BandFrequencies.LOW, BandFrequencies.MID, BandFrequencies.HIGH);
    this.connectVolumeNodes();
  }

  /// Scale a number to a certain range
  private scale = (num : number, inMin : number, inMax : number, outMin : number, outMax : number) => {
    return (num - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
  }

  protected static getLoggerParamsBuilder() : LoggerParamsBuilder {
    return new LoggerParamsBuilder().setClassName(AudioContextController.CLASS_NAME);
  }

  private validateBounds(value : number, min : number, max : number, arg : string) : boolean {
    const functionName = 'validateBounds';
    const withinBounds = (value <= max && value >= min);
    if (!withinBounds) {
      this.logger.error(AudioContextController.getLoggerParamsBuilder()
        .setFunctionName(functionName)
        .setArg('error', 'Values not in range')
        .setArg(arg, value)
        .build());
    }
    return withinBounds;
  }

  /// Sets the master volume
  private setVolumeInternal(volume : number) : void {
    this.volume.gain.value = volume / 100;
    this.input.gain.value = volume / 100;
    this.output.gain.value = volume / 100;
  }

  public setVolume(volume : number, isMuted : boolean) : void {
    if (isMuted)
      this.setVolumeInternal(0);
    else {
      if (!this.validateBounds(volume, 0, 100, "volume"))
        return;
      this.setVolumeInternal(volume);
    }
  }

  public getVolume() : GainNode {
    return this.volume;
  }

  /// Initializes the equalizer gains to the master volume
  private setEqualizerVolume(volume : number) : void {
    this.input.gain.value = volume;
    this.output.gain.value = volume;
    this.lowGain.gain.value = volume;
    this.midGain.gain.value = volume;
    this.highGain.gain.value = volume;
  }

  /// Creates the 3 band filter with the provided band frequencies
  private create3BandFilter(band0Frequency : number, band1Frequency : number, band2Frequency : number) : void {
    this.lowFilter.type = 'peaking';
    this.lowFilter.frequency.value = band0Frequency;

    this.midFilter.type = 'peaking';
    this.midFilter.frequency.value = band1Frequency;

    this.highFilter.type = 'peaking';
    this.highFilter.frequency.value = band2Frequency;
  }

  /// Connects the filter nodes in parallel and wire the compressor
  private connectVolumeNodes() : void {

    this.compressor.connect(this.volume);

    this.input.connect(this.lowFilter);
    this.input.connect(this.midFilter);
    this.input.connect(this.highFilter);
    this.lowFilter.connect(this.lowGain);
    this.midFilter.connect(this.midGain);
    this.highFilter.connect(this.highGain);
    this.lowGain.connect(this.output);
    this.midGain.connect(this.output);
    this.highGain.connect(this.output);

    this.output.connect(this.compressor);

  }

  /// Sets the bass, midrange and treble values
  public setEqualizer(bass : number, midrange : number, treble : number) : void {
    const bassWithinBounds = this.validateBounds(bass, SDKEqualizerRange.MINIMUM,
      SDKEqualizerRange.MAXIMUM, "bass");
    if (bassWithinBounds) {
      this.lowGain.gain.value = this.scale(
        bass,
        SDKEqualizerRange.MINIMUM,
        SDKEqualizerRange.MAXIMUM,
        AudioEqualizerRange.MINIMUM,
        AudioEqualizerRange.MAXIMUM);
    }

    const midrangeWithinBounds = this.validateBounds(midrange, SDKEqualizerRange.MINIMUM,
      SDKEqualizerRange.MAXIMUM, "midrange");
    if (midrangeWithinBounds) {
      this.midGain.gain.value = this.scale(
        midrange,
        SDKEqualizerRange.MINIMUM,
        SDKEqualizerRange.MAXIMUM,
        AudioEqualizerRange.MINIMUM,
        AudioEqualizerRange.MAXIMUM);
    }

    const trebleWithinBounds = this.validateBounds(treble, SDKEqualizerRange.MINIMUM,
      SDKEqualizerRange.MAXIMUM, "treble");
    if (trebleWithinBounds) {
      this.highGain.gain.value = this.scale(
        treble,
        SDKEqualizerRange.MINIMUM,
        SDKEqualizerRange.MAXIMUM,
        AudioEqualizerRange.MINIMUM,
        AudioEqualizerRange.MAXIMUM);
    }
  }

  public getEqualizer() : Array<GainNode> {
    return [this.lowGain, this.midGain, this.highGain];
  }
}