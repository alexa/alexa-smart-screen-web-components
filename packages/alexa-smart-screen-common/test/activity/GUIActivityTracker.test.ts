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
import { GUIActivityState } from '../../src/activity/GUIActivityState';
import { GUIActivityTracker } from '../../src/activity/GUIActivityTracker';

describe('@alexa-smart-screen/common/activity: GUIActivityTracker', () => {
    let guiActivityTracker : GUIActivityTracker;
    let guiActivityEventCallbackSpy : sinon.SinonSpy;

    beforeEach(() => {
        guiActivityEventCallbackSpy = sinon.spy();
        guiActivityTracker = new GUIActivityTracker(guiActivityEventCallbackSpy);
    });

    afterEach(() => {
        guiActivityEventCallbackSpy.resetHistory();
    });

    it('should verify that same token is generated for duplicate activeComponent entries', () => {
        const token1 = guiActivityTracker.recordActive("GUI");
        const token2 = guiActivityTracker.recordActive("GUI");
        assert.equal(token1, token2);
    });

    it('should verify that new token is generated for same activeComponent after it was deleted', () => {
        const token1 = guiActivityTracker.recordActive("GUI");
        guiActivityTracker.recordInactive(token1);
        assert.equal(guiActivityEventCallbackSpy.callCount, 2);
        sinon.assert.calledWith(
            guiActivityEventCallbackSpy,
            GUIActivityState.DEACTIVATED
        );

        const token2 = guiActivityTracker.recordActive("GUI");
        assert.equal(guiActivityEventCallbackSpy.callCount, 3);
        sinon.assert.calledWith(
            guiActivityEventCallbackSpy,
            GUIActivityState.ACTIVATED
        );
        
        assert.notEqual(token1, token2);
    });

    it(`'should verify that different tokens are generated for different components, GUIActivityState = ACTIVATED 
    when first component is rendered active and GUIActivityState = DEACTIVATED only when both components are rendered inactive'`, () => {
        const token1 = guiActivityTracker.recordActive("GUI");
        // guiActivityEventCallbackSpy called first when first component recorded ACTIVE
        assert.equal(guiActivityEventCallbackSpy.callCount, 1);
        sinon.assert.calledWith(
            guiActivityEventCallbackSpy,
            GUIActivityState.ACTIVATED
        );

        const token2 = guiActivityTracker.recordActive("mediaPlayer");
        // guiActivityEventCallbackSpy is not called again when second component recorded ACTIVE
        assert.equal(guiActivityEventCallbackSpy.callCount, 1);

        assert.notEqual(token1, token2);

        guiActivityTracker.recordInactive(token1);
        // guiActivityEventCallbackSpy not called when first component recorded INACTIVE while second component is still ACTIVE
        assert.equal(guiActivityEventCallbackSpy.callCount, 1);

        guiActivityTracker.recordInactive(token2);
        // guiActivityEventCallbackSpy called second time when both components recorded as INACTIVE
        assert.equal(guiActivityEventCallbackSpy.callCount, 2);
        sinon.assert.calledWith(
            guiActivityEventCallbackSpy,
            GUIActivityState.DEACTIVATED
        );
    });

    it('should verify that guiActivityEventCallback is called with the correct argument when interrupted', () => {
        guiActivityTracker.reportInterrupted();
        assert.equal(guiActivityEventCallbackSpy.callCount, 1);    
        sinon.assert.calledOnceWithExactly(
            guiActivityEventCallbackSpy,
            GUIActivityState.INTERRUPT
        );
    });

    it('should verify that guiActivityEventCallback is called with the correct argument when reset', () => {
        guiActivityTracker.reset();
        assert.equal(guiActivityEventCallbackSpy.callCount, 1);    
        sinon.assert.calledOnceWithExactly(
            guiActivityEventCallbackSpy,
            GUIActivityState.DEACTIVATED
        );
    });
});