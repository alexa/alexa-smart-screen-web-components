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

import {
  IDoNotDisturbObserver,
  IObserverManager,
  ObserverManager,
  IDoNotDisturbManager,
} from '@alexa-smart-screen/common';

/**
 * Manages do not disturb state.
 */
export class DoNotDisturbManager implements IDoNotDisturbManager {
  private doNotDisturbStateEnabled : boolean;
  private observerManager : ObserverManager<IDoNotDisturbObserver>;

  constructor() {
    this.observerManager = new ObserverManager<IDoNotDisturbObserver>();
  }

  /**
   * Method to set the do not disturb state for this do not disturb manager
   * 
   * @param enabled The do not disturb state.
   */
  public setDoNotDisturbState(enabled : boolean) : void {
    if (this.doNotDisturbStateEnabled === enabled) return;

    this.doNotDisturbStateEnabled = enabled;

    this.observerManager.getObservers().forEach((o : IDoNotDisturbObserver) => {
      o.onDoNotDisturbStateChanged(enabled);
    });
  }

  /**
   * Method to return the current do not disturb state.
   *
   * @return The do not disturb manager's current do not disturb state.
   */
  public getDoNotDisturbState() : boolean {
    return this.doNotDisturbStateEnabled;
  }

  /**
   * Method to return the observer manager for this doNotDisturb manager.
   *
   * @return The doNotDisturb manager's observer manager.
   */
  public getObserverManager() : IObserverManager<IDoNotDisturbObserver> {
    return this.observerManager;
  }
}
