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

import { ILiveViewCameraUIOptionsConfig } from '@alexa-smart-screen/live-view-camera';
import { IConfigureClientDirectivePayload, IDeviceKeys } from '@alexa-smart-screen/app-utils';
import { AudioInputInitiator, DisplayMode, IWindowConfig, UIMode } from '@alexa-smart-screen/common';
 
 /**
  * Interface for IPC SampleApp configuration received from server
  */
 export interface ISampleAppConfigPayload extends IConfigureClientDirectivePayload {
     /** Supported Sample App Version */
     version : string;
     /** Device Description */
     description : string;
     /** Explicitly set app root div to display dimensions */
     emulateDisplayDimensions ?: boolean;
     /** HACK param to css zoom app root div based on container dimensions */
     scaleToFill ?: boolean;
     /** UI mode. Used for determining global CX behaviors like voice chrome */
     mode : UIMode;
     /** Initiator used for audio input */
     audioInputInitiator : AudioInputInitiator;
     /** Display Mode for this device mode */
     displayMode : DisplayMode;
     /** Device Keys usde for primary interactions */
     deviceKeys : IDeviceKeys;
     /** The default window id to target if none is provided by content response */
     defaultWindowId : string;
     /** Collection of windows to create by default for Sample Application */
     windows : IWindowConfig[];
     /** Optional config for Live View Camera UI */
     liveViewCameraOptions ?: ILiveViewCameraUIOptionsConfig;
 }
 