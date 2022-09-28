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

import * as sinon from 'sinon';
import { createMock } from 'ts-auto-mock';
import { IDoNotDisturbObserver } from '@alexa-smart-screen/common';
import { DoNotDisturbManager } from '../../src/doNotDisturb/DoNotDisturbManager';

describe('@alexa-smart-screen/app-utils - DoNotDisturbManager', () => {
    let doNotDisturbManager : DoNotDisturbManager;
    let observer : IDoNotDisturbObserver;
    const sandbox : sinon.SinonSandbox = sinon.createSandbox();

    beforeEach(() => {
        observer = createMock<IDoNotDisturbObserver>({
            onDoNotDisturbStateChanged : sandbox.spy()
        });
        doNotDisturbManager = new DoNotDisturbManager();
    });

    afterEach(() => {
        sandbox.reset();
        sandbox.restore();
    });

    it('should verify that the observer manager notifies the observers when the doNotDisturb state is changed', () => {
        let doNotDisturbState = true;
        doNotDisturbManager.getObserverManager().addObserver(observer);
        doNotDisturbManager.setDoNotDisturbState(doNotDisturbState);

        let expectedDoNotDisturbState = doNotDisturbManager.getDoNotDisturbState();

        sinon.assert.calledWith(
            observer.onDoNotDisturbStateChanged as sinon.SinonSpy,
            expectedDoNotDisturbState
        );

        doNotDisturbState = false;
        doNotDisturbManager.setDoNotDisturbState(doNotDisturbState);

        expectedDoNotDisturbState = doNotDisturbManager.getDoNotDisturbState();

        sinon.assert.calledTwice(
            observer.onDoNotDisturbStateChanged as sinon.SinonSpy,
        );

        sinon.assert.calledWith(
            observer.onDoNotDisturbStateChanged as sinon.SinonSpy,
            expectedDoNotDisturbState
        );
    });

    it('should verify that the observer manager does not notify the observers when the doNotDisturb state is unchanged', () => {
        const doNotDisturbState1 = true;
        doNotDisturbManager.getObserverManager().addObserver(observer);
        doNotDisturbManager.setDoNotDisturbState(doNotDisturbState1);

        doNotDisturbManager.setDoNotDisturbState(doNotDisturbState1);

        sinon.assert.calledOnce(
            observer.onDoNotDisturbStateChanged as sinon.SinonSpy,
        );
    });
});