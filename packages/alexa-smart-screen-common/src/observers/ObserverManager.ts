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

import { IObserverManager } from './IObserverManager';

export class ObserverManager<T> implements IObserverManager<T> {
  private observers : Set<T>;

  public constructor() {
    this.observers = new Set<T>();
  }

  public addObserver(observer : T) : void {
    this.observers.add(observer);
  }

  public addObservers(observers : Set<T>) : void {
    observers.forEach((observer) => this.addObserver(observer));
  }

  public removeObserver(observer : T) : void {
    this.observers.delete(observer);
  }

  public getObservers() : Set<T> {
    return this.observers;
  }

  public contains(observer : T) : boolean {
    return this.observers.has(observer);
  }

  public clear() : void {
    this.observers.clear();
  }
}
