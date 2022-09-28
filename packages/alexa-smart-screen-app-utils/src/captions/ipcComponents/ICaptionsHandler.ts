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

import { IRenderCaptionsPayload, ISetCaptionsStatePayload } from "./CaptionsMessageInterfaces";

/**
 * Interface for Captions Handler
 */
 export interface ICaptionsHandler {
   /**
    * Message informing the handler to render captions.
    * 
    * @param payload IRenderCaptionsPayload containing captions payload.
    */
   renderCaptions(payload : IRenderCaptionsPayload) : void

   /**
   * Message informing the handler to set the state of captions.
   * 
   * @param payload ISetCaptionsStatePayload containing captions state.
   */
   setCaptionsState(payload : ISetCaptionsStatePayload) : void;
}