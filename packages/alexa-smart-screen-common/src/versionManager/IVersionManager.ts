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

import { INamespaceVersionEntry } from "./VersionManagerMessageInterfaces";

/**
 * Interface to handle versioning of IPC Messages
 */
export interface IVersionManager {

  /**
   * Adds a namespace-version entry to the VersionManager
   *
   * @param version The version of the namespace added to the VersionManager 
   * @param namespace The namespace being added to the VersionManager
   */
  addNamespaceVersionEntry(version : number, namespace : string) : void;

  /**
   * Removes a namespace-version entry from the VersionManager
   *
   * @param namespace The namespace being removed from the VersionManager
   */
  removeNamespaceVersionEntry(namespace : string) : void;

  /**
   * Validates whether a namespace-version entry exists in the VersionManager
   *
   * @param namespace The namespace received from the server to be validated
   * @param version The version received from the server to be validated
   */  
  validateNamespaceVersion(namespace : string, version : number) : boolean;

  /**
   * Returns the namespace-version entries registered by the VersionManager
   *
   * @returns Array containing the namespace-version entries registered by the VersionManager
   */   
  getNamespaceVersionEntries() : INamespaceVersionEntry[];
}