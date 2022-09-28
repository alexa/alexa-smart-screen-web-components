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
import { DO_NOT_DISTURB_TIMEOUT, AttentionSystemRenderer, ATTENTION_SYSTEM_STATE_DIV_ID } from '../src/AttentionSystemRenderer';
import { AudioInputInitiator, IDeviceKey, AlexaState, IAlexaInputs } from '@alexa-smart-screen/common';
import * as Sinon from 'sinon';

describe('@alexa-smart-screen/sample-attention-system', () => {
    let attentionSystemRenderer : AttentionSystemRenderer;
    let attentionSystemStateViewDiv : HTMLDivElement;
    let clock : any;
    const talkKey : IDeviceKey = {
        code : "A0",
        keyCode : 0,
        key : "A"
    };

    const ALEXA_INPUTS : IAlexaInputs = {
        audioInput : AudioInputInitiator.PRESS_AND_HOLD,
        talkDeviceKey : talkKey
    }

    beforeEach(() => {
        attentionSystemRenderer = new AttentionSystemRenderer();
        clock = Sinon.useFakeTimers();
    });

    afterEach(() => {
        clock.restore();
    });

    it('should show attentionSystemState as an empty string initially', () => {
        attentionSystemRenderer.setAlexaInputs(ALEXA_INPUTS);
        attentionSystemStateViewDiv = attentionSystemRenderer.shadowRoot.querySelector(`.${ATTENTION_SYSTEM_STATE_DIV_ID}`);
        assert.strictEqual(attentionSystemStateViewDiv.textContent, '');
    });

    it('should display CONNECTED when AlexaState changes to CONNECTED', () => {
        attentionSystemRenderer.onAlexaStateChanged(AlexaState.CONNECTED);
        attentionSystemStateViewDiv = attentionSystemRenderer.shadowRoot.querySelector(`.${ATTENTION_SYSTEM_STATE_DIV_ID}`);
        assert.strictEqual(attentionSystemStateViewDiv.textContent, 'CONNECTED');
    });

    it('should display CONNECTING when AlexaState changes to CONNECTING', () => {
        attentionSystemRenderer.onAlexaStateChanged(AlexaState.CONNECTING);
        attentionSystemStateViewDiv = attentionSystemRenderer.shadowRoot.querySelector(`.${ATTENTION_SYSTEM_STATE_DIV_ID}`);
        assert.strictEqual(attentionSystemStateViewDiv.textContent, 'CONNECTING');
    });

    it('should display DISCONNECTED when AlexaState changes to DISCONECTED', () => {
        attentionSystemRenderer.onAlexaStateChanged(AlexaState.DISCONNECTED);
        attentionSystemStateViewDiv = attentionSystemRenderer.shadowRoot.querySelector(`.${ATTENTION_SYSTEM_STATE_DIV_ID}`);
        assert.strictEqual(attentionSystemStateViewDiv.textContent, 'DISCONNECTED');
    });

    it('should display empty string when AlexaState changes to EXPECTING', () => {
        attentionSystemRenderer.onAlexaStateChanged(AlexaState.EXPECTING);
        attentionSystemStateViewDiv = attentionSystemRenderer.shadowRoot.querySelector(`.${ATTENTION_SYSTEM_STATE_DIV_ID}`);
        assert.strictEqual(attentionSystemStateViewDiv.textContent, '');
    });

    it('should display IDLE when AlexaState changes to IDLE', () => {
        attentionSystemRenderer.onAlexaStateChanged(AlexaState.IDLE);
        attentionSystemStateViewDiv = attentionSystemRenderer.shadowRoot.querySelector(`.${ATTENTION_SYSTEM_STATE_DIV_ID}`);
        assert.strictEqual(attentionSystemStateViewDiv.textContent, 'IDLE');
    });

    it('should display LISTENING when AlexaState changes to LISTENING', () => {
        attentionSystemRenderer.onAlexaStateChanged(AlexaState.LISTENING);
        attentionSystemStateViewDiv = attentionSystemRenderer.shadowRoot.querySelector(`.${ATTENTION_SYSTEM_STATE_DIV_ID}`);
        assert.strictEqual(attentionSystemStateViewDiv.textContent, 'LISTENING');
    });

    it('should display SPEAKING when AlexaState changes to SPEAKING', () => {
        attentionSystemRenderer.onAlexaStateChanged(AlexaState.SPEAKING);
        attentionSystemStateViewDiv = attentionSystemRenderer.shadowRoot.querySelector(`.${ATTENTION_SYSTEM_STATE_DIV_ID}`);
        assert.strictEqual(attentionSystemStateViewDiv.textContent, 'SPEAKING');
    });

    it('should display when AlexaState changes to THINKING', () => {
        attentionSystemRenderer.onAlexaStateChanged(AlexaState.THINKING);
        attentionSystemStateViewDiv = attentionSystemRenderer.shadowRoot.querySelector(`.${ATTENTION_SYSTEM_STATE_DIV_ID}`);
        assert.strictEqual(attentionSystemStateViewDiv.textContent, 'THINKING');
    });

    it('should display UNKNOWN when AlexaState changes to UNKNOWN', () => {
        attentionSystemRenderer.onAlexaStateChanged(AlexaState.UNKNOWN);
        attentionSystemStateViewDiv = attentionSystemRenderer.shadowRoot.querySelector(`.${ATTENTION_SYSTEM_STATE_DIV_ID}`);
        assert.strictEqual(attentionSystemStateViewDiv.textContent, 'UNKNOWN');
    });

    it('should display DO NOT DISTURB ENABLED when DND is toggled on, Alexa is in IDLE state & AttentionSystem is not suppressed', () => {
        attentionSystemRenderer.onAlexaStateChanged(AlexaState.IDLE);
        attentionSystemRenderer.updateAttentionSystemState(false);
        attentionSystemRenderer.onDoNotDisturbStateChanged(true);
        clock.tick(DO_NOT_DISTURB_TIMEOUT/2);
        attentionSystemStateViewDiv = attentionSystemRenderer.shadowRoot.querySelector(`.${ATTENTION_SYSTEM_STATE_DIV_ID}`);
        assert.strictEqual(attentionSystemStateViewDiv.textContent, 'DO NOT DISTURB ENABLED');
    });

    it('should display IDLE when DND is toggled on, and DO NOT DISTURB TIMEOUT expires', () => {
        attentionSystemRenderer.onAlexaStateChanged(AlexaState.IDLE);
        attentionSystemRenderer.updateAttentionSystemState(false);
        attentionSystemRenderer.onDoNotDisturbStateChanged(true);
        clock.tick(DO_NOT_DISTURB_TIMEOUT);
        attentionSystemStateViewDiv = attentionSystemRenderer.shadowRoot.querySelector(`.${ATTENTION_SYSTEM_STATE_DIV_ID}`);
        assert.strictEqual(attentionSystemStateViewDiv.textContent, 'IDLE');
    });
});