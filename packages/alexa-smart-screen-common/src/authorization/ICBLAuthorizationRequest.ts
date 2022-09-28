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
 * Interface for a request to authorize the Alexa client with a CBL auth code.
 * https://developer.amazon.com/docs/alexa/alexa-voice-service/authorize-cbl.html
 * 
 * @member url LWA URL to you present to the user
 * @member code The code displayed to the user. The user enters this code during registration.
 * @member clientId The clientId of the AVS product.
 */
 export interface ICBLAuthorizationRequest {
    url : string;
    code : string;
    clientId : string;
}