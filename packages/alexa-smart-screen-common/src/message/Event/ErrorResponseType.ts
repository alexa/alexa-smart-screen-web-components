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

/// The type of error when calling sendErrorResponseEvent().
export enum ErrorResponseType {
  /// An error occurred that can't be described by one of the other error types.
  INTERNAL_ERROR,

  /// The directive is not supported or is malformed.
  INVALID_DIRECTIVE,

  /// The directive contains a value that is not valid for the target endpoint.
  INVALID_VALUE
}
