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

/**
 * Used to set the volume of the media player
 */
export interface IVolumePayload {
  volume : number;
  isMuted : boolean;
  player : string;
}

/**
 * Used to set the equalizer levels of the media player
 */
export interface IEqualizerPayload {
  bass : number;
  midrange : number;
  treble : number;
  player : string;
}

/**
 * Contains all AudioContextController audio settings 
 */
export interface IAudioContextControllerSettings {
  volume : number,
  isMuted : boolean,
  bass : number,
  midrange : number,
  treble : number,
}