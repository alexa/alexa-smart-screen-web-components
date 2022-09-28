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
 * Interface for Observer Manager
 */
export interface IObserverManager<T> {  
    /**
     * Add specified observer
     * @param observer observer instance to add
     */
    addObserver(observer : T) : void;

    /**
     * Add multiple observers
     * @param observers set of observers to be added
     */
    addObservers(observers : Set<T>) : void;

    /**
     * Remove observer
     * @param observer observer instance to remove
     */
    removeObserver(observer : T) : void;

    /**
     * Returns set of all observers tracked by the observer manager
     */
    getObservers() : Set<T>;

    /**
     * Returns boolean representing whether specified observer is managed
     * @param observer observer instance
     */
    contains(observer : T) : boolean;

    /**
     * Clears all observers being managed
     */
    clear() : void;
}
  