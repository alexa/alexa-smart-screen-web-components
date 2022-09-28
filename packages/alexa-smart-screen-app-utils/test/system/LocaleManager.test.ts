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

import { assert } from 'chai';
import * as sinon from 'sinon';
import { createMock } from 'ts-auto-mock';
import { ILocaleObserver, ILocales, LocaleLayoutDirection, LocaleType } from '@alexa-smart-screen/common';
import { LocaleManager } from '@alexa-smart-screen/app-utils';

describe('@alexa-smart-screen/app-utils - LocaleManager', () => {
    let localeManager : LocaleManager;
    let observer : ILocaleObserver;

    const sandbox : sinon.SinonSandbox = sinon.createSandbox();

    const primaryLocale : ILocales = {
        primaryLocale : LocaleType.AR_SA,
    };

    const primarySecondarylocale : ILocales = {
        primaryLocale : LocaleType.EN_GB,
        secondaryLocale : LocaleType.EN_IN
    };

    beforeEach(() => {
        observer = createMock<ILocaleObserver>({
            onLocaleChanged : sandbox.spy()
        });
        localeManager = LocaleManager.getInstance();
    });

    afterEach(() => {
        sandbox.reset();
        sandbox.restore();
    });

    it('should verify that the default layout direction (LEFT_TO_RIGHT) is set correctly', () => {
        const localeLayoutDirection = localeManager.getLocaleLayoutDirection();
        assert.strictEqual(localeLayoutDirection, LocaleLayoutDirection.LEFT_TO_RIGHT);
    });

    it('should verify the layout direction is set to RIGHT_TO_LEFT when primary locale is set as AR_SA', () => {
        localeManager.setLocales(primaryLocale);
        const localeLayoutDirection = localeManager.getLocaleLayoutDirection();
        assert.strictEqual(localeLayoutDirection, LocaleLayoutDirection.RIGHT_TO_LEFT);
    });

    it('should verify that the value of primary locale obtained is equal to the one that is set', () => {
        localeManager.setLocales(primarySecondarylocale);
        const expectedPrimaryLocale = localeManager.getPrimaryLocale();
        assert.strictEqual(expectedPrimaryLocale, primarySecondarylocale.primaryLocale);
    });

    it('should verify that the value of secondary locale obtained is equal to the one that is set', () => {
        localeManager.setLocales(primarySecondarylocale);
        const expectedSecondaryLocale = localeManager.getSecondaryLocale();
        assert.strictEqual(expectedSecondaryLocale, primarySecondarylocale.secondaryLocale);
    });

    it('should verify the result when getSecondaryLocale is called when it is not set', () => {
        localeManager.setLocales(primaryLocale);
        const expectedSecondaryLocale = localeManager.getSecondaryLocale();
        assert.strictEqual(expectedSecondaryLocale, undefined);
    });

    it('should verify that the observers are set correctly', () => {
        localeManager.getObserverManager().addObserver(observer);
        localeManager.setLocales(primarySecondarylocale);

        const expectedLocales =  localeManager.getLocales();
        
        sinon.assert.calledWith(
            observer.onLocaleChanged as sinon.SinonSpy,
            expectedLocales,
            LocaleLayoutDirection.LEFT_TO_RIGHT
        );
    });
});