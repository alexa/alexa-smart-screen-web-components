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

import { UIMode } from '@alexa-smart-screen/common';
import { DeviceMode } from 'apl-client';

export class DeviceModeConverter {

    /**
     * Maps a UIMode enumeration to an APL DeviceMode type.
     * 
     * @param uiMode The UIMode to map to APL DeviceMode
     * @returns APL DeviceMode
     */
    public static uiModeToDeviceMode(uiMode : UIMode) : DeviceMode {
        switch (uiMode) {
            case UIMode.AUTO:
                return 'AUTO';
            case UIMode.HUB:
                return 'HUB';
            case UIMode.MOBILE:
                return 'MOBILE';
            case UIMode.PC:
                return 'PC';
            case UIMode.TV:
                return 'TV';
            case UIMode.HEADLESS:
            default:
                // HUB is default DeviceMode for any unrecognized UIMode
                return 'HUB';
        }
    }
}