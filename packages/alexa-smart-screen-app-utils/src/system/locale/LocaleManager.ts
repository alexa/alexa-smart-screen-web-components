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

import { IObserverManager, ObserverManager, ILocaleManager, ILocaleObserver, LocaleLayoutDirection, ILocales, LocaleType } from '@alexa-smart-screen/common';

/**
 * Singleton Manager of Locale state.
 */
export class LocaleManager implements ILocaleManager {
  private static instance : LocaleManager;
  private locales : ILocales;
  private localeLayoutDirection : LocaleLayoutDirection;
  private observerManager : ObserverManager<ILocaleObserver>;

  private constructor() {
    this.locales = { primaryLocale : LocaleType.EN_US };
    this.localeLayoutDirection = LocaleLayoutDirection.LEFT_TO_RIGHT;
    this.observerManager = new ObserverManager<ILocaleObserver>();
  }

  public static getInstance() : LocaleManager {
    if (!LocaleManager.instance) {
      LocaleManager.instance = new LocaleManager();
    }
    return LocaleManager.instance;
  }

  /**
   * Method to set the primary and secondary locales for this locale manager
   * 
   * @param locales The primary and secondary locales.
   */
  public setLocales(locales : ILocales) {
    if (this.areLocalesIdentical(this.locales, locales)) return;

    this.locales = locales;

    switch (this.getPrimaryLocale()) {
      case LocaleType.AR_SA:
        this.localeLayoutDirection = LocaleLayoutDirection.RIGHT_TO_LEFT;
        break;
      default:
        this.localeLayoutDirection = LocaleLayoutDirection.LEFT_TO_RIGHT;
        break;
    }

    this.observerManager.getObservers().forEach((o : ILocaleObserver) => {
      o.onLocaleChanged(this.locales, this.localeLayoutDirection);
    });
  }

  /**
   * Returns current combination of LocaleType.
   */
  public getLocales() : ILocales {
    return this.locales;
  }

  /**
   * Returns primary LocalType.
   */
  public getPrimaryLocale() : LocaleType {
    return this.locales.primaryLocale;
  }

  /**
   * Returns secondary LocalType.
   */
  public getSecondaryLocale() : LocaleType | undefined {
    return this.locales.secondaryLocale;
  }

  /**
   * Returns @LocaleLayoutDirection for primary locale.
   */
  public getLocaleLayoutDirection() : LocaleLayoutDirection {
    return this.localeLayoutDirection;
  }

  /**
   * Method to return the observer manager for this locale manager.
   *
   * @return The locale manager's observer manager.
   */
  public getObserverManager() : IObserverManager<ILocaleObserver> {
    return this.observerManager;
  }

  /**
   * Method to compare locales instances to determine whether they are identical.
   *
   * @param locales The base locales instance.
   * @param localesToCompare The locales instance to compare with.
   */
  private areLocalesIdentical(locales : ILocales, localesToCompare : ILocales) : boolean {
    return locales.primaryLocale === localesToCompare.primaryLocale && locales.secondaryLocale === localesToCompare.secondaryLocale;
  }
}
