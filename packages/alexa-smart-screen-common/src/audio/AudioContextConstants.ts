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

export const DEFAULT_AUDIO_SETTINGS = {
  volume : 100,
  isMuted : false,
  bass : 0,
  midrange : 0,
  treble : 0,
};

export enum SDKEqualizerRange {
  MINIMUM = -6,
  MAXIMUM = 6
}

export enum AudioEqualizerRange {
  MINIMUM = 0,
  MAXIMUM = 1
}

export enum BandFrequencies {
  LOW = 100,
  MID = 1100,
  HIGH = 11000
}
