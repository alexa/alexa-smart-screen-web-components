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

import { UIMode, ViewportShape } from "@alexa-smart-screen/common";

export const LiveViewCameraSupportedViewports = [
    {
        mode : UIMode.HUB,
        shape : ViewportShape.ROUND
    },
    {
        mode : UIMode.HUB,
        shape : ViewportShape.RECTANGLE
    },
    {
        mode : UIMode.TV,
        shape : ViewportShape.ROUND
    },
    {
        mode : UIMode.TV,
        shape : ViewportShape.RECTANGLE
    },
    {
        mode : UIMode.MOBILE,
        shape : ViewportShape.ROUND
    },
    {
        mode : UIMode.MOBILE,
        shape : ViewportShape.RECTANGLE
    },
    {
        mode : UIMode.PC,
        shape : ViewportShape.ROUND
    },
    {
        mode : UIMode.PC,
        shape : ViewportShape.RECTANGLE
    }
];
