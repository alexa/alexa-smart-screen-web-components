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
  * Interface for tracker reporting GUI activity events.
  */
export interface IGUIActivityTracker {
    /**
     * Report that an activity was interrupted
     */
    reportInterrupted() : void;

    /**
     * Record component as currently active.
     *
     * @param name Name of the component.
     * @returns ActivityTracker token
     */
    recordActive(name : string) : number;

    /**
     * Record component as currently inactive.
     *
     * @param token Tracking token.
     */
    recordInactive(token : number) : void;

    /**
     * Reset GUIActivityTracker state. Clear active components and report as INACTIVE.
     */
    reset() : void;
}