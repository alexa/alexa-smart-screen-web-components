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

import { AudioPlayerState } from "../utils/AudioPlayerState";

export interface IAudioPlayerInfo {
  state : AudioPlayerState,
  mediaOffsetInMilliseconds : number
}

export interface IRenderPlayerInfoSource {
  size : string;
  url ?: string;
}

export interface IRenderPlayerInfoArt {
  sources : IRenderPlayerInfoSource[]
}

export interface IRenderPlayerInfoProvider {
  logo : IRenderPlayerInfoSource[];
  name : string;
}

export interface IRenderPlayerInfoContent {
  art : IRenderPlayerInfoArt;
  header : string;
  mediaLengthInMilliseconds : number;
  provider : IRenderPlayerInfoProvider;
  title : string;
  titleSubtext1 : string;
  titleSubtext2 : string;
}

export interface IRenderPlayerInfoControl {
  enabled : boolean;
  name : string;
  selected : boolean;
  type : string;
}

export interface IRenderPlayerInfo {
  audioItemId : string;
  content : IRenderPlayerInfoContent;
  controls : IRenderPlayerInfoControl[];
  type ?: string;
  audioPlayerInfo ?: IAudioPlayerInfo;
}

export interface IRenderPlayerInfoMessagePayload {
  payload : IRenderPlayerInfo;
  audioPlayerState : AudioPlayerState;
  audioOffset : number;
}

export interface IClearPlayerInfoCardPayload {
}