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

export const AVSDisplayCardSupportedViewports = [
  {
    mode : UIMode.HUB,
    shape : ViewportShape.RECTANGLE,
    minWidth : 1024,
    maxWidth : 1024,
    minHeight : 600,
    maxHeight : 600,
  },
  {
    mode : UIMode.HUB,
    shape : ViewportShape.RECTANGLE,
    minWidth : 1280,
    maxWidth : 1280,
    minHeight : 800,
    maxHeight : 800,
  },
  {
    mode : UIMode.HUB,
    shape : ViewportShape.RECTANGLE,
    minWidth : 1920,
    maxWidth : 1920,
    minHeight : 1080,
    maxHeight : 1080,
  },
  {
    mode : UIMode.HUB,
    shape : ViewportShape.RECTANGLE,
    minWidth : 1080,
    maxWidth : 1080,
    minHeight : 1920,
    maxHeight : 1920,
  },
  {
    mode : UIMode.HUB,
    shape : ViewportShape.RECTANGLE,
    minWidth : 960,
    maxWidth : 960,
    minHeight : 480,
    maxHeight : 480,
  },
  {
    mode : UIMode.HUB,
    shape : ViewportShape.ROUND,
    minWidth : 480,
    maxWidth : 480,
    minHeight : 480,
    maxHeight : 480,
  },
  {
    mode : UIMode.TV,
    shape : ViewportShape.RECTANGLE,
    minWidth : 960,
    maxWidth : 960,
    minHeight : 540,
    maxHeight : 540,
  },
  {
    mode : UIMode.TV,
    shape : ViewportShape.RECTANGLE,
    minWidth : 960,
    maxWidth : 960,
    minHeight : 200,
    maxHeight : 200,
  }
];
