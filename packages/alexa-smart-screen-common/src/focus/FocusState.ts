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

'use strict';

/**
 * Copy of AVSCommon/AVS/FocusState
 *
 * @enum
 * @exports
 */
export enum FocusState {
    /// Represents the highest focus a Channel can have.
    FOREGROUND = 'FOREGROUND',

    /// Represents the intermediate level focus a Channel can have.
    BACKGROUND = 'BACKGROUND',

    /// This focus is used to represent when a Channel is not being used or when an observer should stop.
    NONE = 'NONE'
}
