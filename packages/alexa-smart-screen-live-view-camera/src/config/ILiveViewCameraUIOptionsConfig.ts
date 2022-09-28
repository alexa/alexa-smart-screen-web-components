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
 * Enumeration of the mic button UI hint types
 */
export enum MicButtonHintType {
    // hint is a text display of a string
    TEXT = 'Text',
    // hint is a bitmap image
    IMAGE = 'Image',
    // hint is a Alexa Vector Graphic
    AVG = 'AVG'
}

/**
 * Interface for optionally configuring the physical button hint of the live view camera UI
 * @member micButtonHintType the type of mic button hint element for the UI
 * @member micButtonHintSource the source for the hint element
 */
export interface IPhysicalMicButtonHint {
    micButtonHintType : MicButtonHintType;
    micButtonHintSource : string;
}

/**
 * Interface for optional configuration of the live view camera UI
 * @member debugMode indicates if the UI should be presented in debugMode
 * @member cameraImage URL for camera image to be presented in the UI while loading camera stream
 * @member physicalMicButtonHint hint for the UI indicating the button to press to interact with the camera mic
 * @member viewingDeviceMicUnsupported boolean indicating to the UI if the viewing device supports mic access for 2-way talk over the camera
 */
export interface ILiveViewCameraUIOptionsConfig {
    debugMode ?: boolean;
    cameraImage ?: string;
    physicalMicButtonHint ?: IPhysicalMicButtonHint,
    viewingDeviceMicUnsupported ?: boolean
}