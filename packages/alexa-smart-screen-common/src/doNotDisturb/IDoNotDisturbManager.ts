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

import { IObserverManager } from '../observers/IObserverManager';
import { IDoNotDisturbObserver } from './IDoNotDisturbObserver';

/**
 * Interface for do not disturb manager
 */
export interface IDoNotDisturbManager {
  /**
   * Method to set the do not disturb state for this do not disturb manager
   * 
   * @param enabled The do not disturb setting.
   */
  setDoNotDisturbState(enabled : boolean) : void;

  /**
   * Method to return the current do not disturb setting.
   *
   * @return The do not disturb manager's current do not disturb state.
   */
  getDoNotDisturbState() : boolean;

  /**
   * Method to return the observer manager for this do not disturb manager.
   *
   * @return The do not disturb manager's observer manager.
   */
  getObserverManager() : IObserverManager<IDoNotDisturbObserver>;
}