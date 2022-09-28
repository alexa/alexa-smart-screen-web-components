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
 * Events
 */
export const TEMPLATE_RUNTIME_WINDOW_ID_REPORT_MESSAGE_NAME  = 'windowIdReport';

/**
 * Interface for outbound windowIdReport message payload
 * @param renderTemplateWindowId (Optional) render template window id
 * @param renderPlayerInfoWindowId (Optional) render player info window id
 */
export interface ITemplateRuntimeWindowIdReport {
    renderTemplateWindowId ?: string;
    renderPlayerInfoWindowId ?: string;
}
