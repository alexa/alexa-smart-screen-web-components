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

import { IGUIActivityTracker, IFocusManager, ILoggerFactory, IAudioContextControllerSettings } from '@alexa-smart-screen/common';
import { AnimationQuality, APLClient, DeviceMode, ViewportShape, IAudioContextProvider } from 'apl-client';

export interface IAPLRendererOptionalProps {
    /** `true` if OpenURL command is supported. Defaults to `false` */
    allowOpenUrl ?: boolean;
    /** Level of animation quality. Defaults to `AnimationQuality.kAnimationQualityNormal` */
    animationQuality ?: AnimationQuality;
    /** APL theme. Usually 'light' or 'dark' */
    theme ?: string;
    /** The list of APL extension uri's that this window will support */
    supportedExtensions ?: string[];
    /** Optional BG color override for the APL renderer */
    backgroundColorOverride ?: string;
    /** Optional override to set mode to something different than the Interaction Mode value */
    modeOverride ?: DeviceMode;
}

export interface IAPLRendererProps extends IAPLRendererOptionalProps {
    /** Agent Name */
    agentName : string;
    /** Agent Version */
    agentVersion : string;
    /** Viewport shape. If undefined than decided by "isRound" */
    shape : ViewportShape;
    /** Dots per inch */
    dpi : number;
    /** `true` if video is not supported. Defaults to `false` */
    disallowVideo : boolean;
    /** Device Interaction Mode. If none provided "HUB" is used. */
    mode : DeviceMode;
}

export interface IAPLRendererWrapperProps extends IAPLRendererProps {
    client : APLClient;
    loggerFactory : ILoggerFactory;
    guiActivityTracker ?: IGUIActivityTracker;
    focusManager ?: IFocusManager;
    audioSettings ?: IAudioContextControllerSettings;
    audioContextProvider ?: IAudioContextProvider;
    /** Calback for APL document instances that do no support resizing config change */
    onResizingIgnoredCallback ?: (ignoredWidth : number, ignoredHeight : number) => void;
}
