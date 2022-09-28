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

export const LiveViewCameraAPL = {
  type : "APL",
  version : "2022.1",
  import : [
    {
      name : "liveViewUI",
      source : "https://prod.assets.smarthome-apl.alexa.amazon.dev/packages/alexa-camera-live-view-controller/1.0.0/document.json",
      version : "1.0"
    }
  ],
  mainTemplate : {
    parameters : [
      "payload"
    ],
    item : {
      type : "LiveViewUI"
    }
  }, 
  environment : {
    lang : "en-US",
    layoutDirection : "LTR"
  }
};
