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

import { ILiveViewCameraUIOptionsConfig, MicButtonHintType } from "../config/ILiveViewCameraUIOptionsConfig";

/**
 * Sample implementation of ILiveViewCameraUIOptionsConfig for debugging purposes
 */
export const SampleLiveViewCameraOptions : ILiveViewCameraUIOptionsConfig = {
    debugMode : true,
    physicalMicButtonHint : {
        micButtonHintType : MicButtonHintType.IMAGE,
        micButtonHintSource : "https://prod.assets.smarthome-apl.alexa.amazon.dev/packages/alexa-camera-live-view-controller/1.0.0/assets/ic_hint_lg_mic_default._CB462776318_.png"
    },
    viewingDeviceMicUnsupported : false
};