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

import { ILocales } from './ILocales';
import { LocaleType } from './LocaleType';
import { LocaleLayoutDirection } from './LocaleConstants';
import { ILocaleObserver } from './ILocaleObserver';
import { IObserverManager } from '../observers/IObserverManager';

/**
 * Interface for Locale Manager
 */
export interface ILocaleManager {
  /**
   * Method to set the primary and secondary locales for this locale manager
   * 
   * @param locales The primary and secondary locales.
   */
  setLocales(locales : ILocales) : void;

  /**
   * Method to return the current combination of LocaleType.
   *
   * @return The locale manager's current combination of LocaleType.
   */
  getLocales() : ILocales;

  /**
   * Method to return the primary LocalType.
   *
   * @return The locale manager's primary LocalType.
   */
  getPrimaryLocale() : LocaleType;

  /**
   * Method to return the secondary LocalType.
   * 
   * @return The locale manager's secondary LocalType.
   */
  getSecondaryLocale() : LocaleType | undefined;

  /**
   * Method to return the @LocaleLayoutDirection for primary locale.
   *
   * @return The locale manager's @LocaleLayoutDirection for primary locale.
   */
  getLocaleLayoutDirection() : LocaleLayoutDirection;
  
  /**
   * Method to return the observer manager for this locale manager.
   *
   * @return The locale manager's observer manager.
   */
  getObserverManager() : IObserverManager<ILocaleObserver>;
}
