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
import * as Sinon from 'sinon';
import {
  CaptionsHandler,
  ICaptionsLine,
  IRenderCaptionsPayload
} from '@alexa-smart-screen/app-utils';
import { LoggerFactory } from '@alexa-smart-screen/common';
import { 
  CaptionsRenderer, 
  CAPTIONS_VIEW_DIV_ID, 
  CAPTION_LINE_DIV_CLASSNAME 
} from '../src/CaptionsRenderer';

describe('@alexa-smart-screen/sample-captions', () => {
  let captionsRenderer : CaptionsRenderer;
  let captionsHandler : CaptionsHandler;
  let captionsViewDivElement : HTMLDivElement;
  let clock : any;

  /*
   * Negligible time ~0ms used for tests that have 0ms duration or delay to account for processing time before DOM is updated
   */
  const NEGLIGIBLE_TIME_IN_MS = 1;

  const CAPTIONS_PAYLOAD_0_LINES_0_DELAY_100_DURATION : IRenderCaptionsPayload = {
    duration : 100,
    delay : 0,
    captionLines : []
  }

  const CAPTIONS_PAYLOAD_1_LINE_100_DELAY_300_DURATION : IRenderCaptionsPayload = {
    duration : 300,
    delay : 100,
    captionLines : [
      { 
        text : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
        styles : []
      }
    ]
  }

  const CAPTIONS_PAYLOAD_1_LINE_100_DELAY_0_DURATION : IRenderCaptionsPayload = {
    duration : 0,
    delay : 100,
    captionLines : [
      { 
        text : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
        styles : []
      }
    ]
  }

  const CAPTIONS_PAYLOAD_2_LINES_100_DELAY_200_DURATION : IRenderCaptionsPayload = {
    duration : 200,
    delay : 100,
    captionLines : [
      { 
        text : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
        styles : []
      },
      {
        text : 'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
        styles : []
      }
    ]
  }

  const CAPTIONS_PAYLOAD_2_LINES_500_DELAY_100_DURATION : IRenderCaptionsPayload = {
    duration : 100,
    delay : 500,
    captionLines : [
      { 
        text : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
        styles : []
      },
      {
        text : 'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
        styles : []
      }
    ]
  }

  const CAPTIONS_PAYLOAD_1_LINE_0_DELAY_100_DURATION : IRenderCaptionsPayload = {
    duration : 100,
    delay : 0,
    captionLines : [
      { 
        text : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
        styles : []
      }
    ]
  }

  beforeEach(() => {
    captionsHandler = new CaptionsHandler(new LoggerFactory());
    captionsRenderer = new CaptionsRenderer(captionsHandler);
    captionsViewDivElement = captionsRenderer.shadowRoot.querySelector(`.${CAPTIONS_VIEW_DIV_ID}`);
    clock = Sinon.useFakeTimers();
  });

  afterEach(() => {
    clock.restore();
  })

  it(`should be able to render no lines of captions`, () => {
    const payload = CAPTIONS_PAYLOAD_0_LINES_0_DELAY_100_DURATION;
    captionsHandler.renderCaptions(payload);
    clock.tick(NEGLIGIBLE_TIME_IN_MS);
    assert.strictEqual(captionsViewDivElement.querySelectorAll(`.${CAPTION_LINE_DIV_CLASSNAME}`).length, payload.captionLines.length);
  });

  it(`should be able to render all lines of captions with the correct content`, () => {
    const payload = CAPTIONS_PAYLOAD_2_LINES_100_DELAY_200_DURATION;
    captionsHandler.renderCaptions(payload);
    clock.tick(payload.delay);
    const captionLines = captionsViewDivElement.querySelectorAll(`.${CAPTION_LINE_DIV_CLASSNAME}`);
    assert.strictEqual(captionLines.length, payload.captionLines.length);
    payload.captionLines.forEach((captionLine : ICaptionsLine, index : number) => {
      assert.strictEqual(captionLine.text, captionLines[index].innerHTML)
    })
  });

  it(`should be display captions for a certain specified duration where duration === 0`, () => {
    const payload = CAPTIONS_PAYLOAD_1_LINE_100_DELAY_0_DURATION;
    captionsHandler.renderCaptions(payload);
    clock.tick(payload.delay);
    clock.tick(NEGLIGIBLE_TIME_IN_MS);
    const captionLinesAfterTimeout = captionsViewDivElement.querySelectorAll(`.${CAPTION_LINE_DIV_CLASSNAME}`);
    assert.strictEqual(captionLinesAfterTimeout.length, 0);
  });

  it(`should be able to display captions for a certain specified duration where duration > 0`, () => {
    const payload = CAPTIONS_PAYLOAD_1_LINE_100_DELAY_300_DURATION;
    captionsHandler.renderCaptions(payload);
    clock.tick(payload.delay);
    clock.tick(payload.duration/2);
    const captionLinesBeforeTimeout = captionsViewDivElement.querySelectorAll(`.${CAPTION_LINE_DIV_CLASSNAME}`);
    assert.strictEqual(captionLinesBeforeTimeout.length, payload.captionLines.length);
    clock.tick(payload.duration/2);
    const captionLinesAfterTimeout = captionsViewDivElement.querySelectorAll(`.${CAPTION_LINE_DIV_CLASSNAME}`);
    assert.strictEqual(captionLinesAfterTimeout.length, 0);
  });

  it(`should be able display captions with no delay if delay === 0`, () => {
    const payload = CAPTIONS_PAYLOAD_1_LINE_0_DELAY_100_DURATION;
    captionsHandler.renderCaptions(payload);
    const captionLinesBeforeDelay = captionsViewDivElement.querySelectorAll(`.${CAPTION_LINE_DIV_CLASSNAME}`);
    assert.strictEqual(captionLinesBeforeDelay.length, 0);
    clock.tick(NEGLIGIBLE_TIME_IN_MS);
    const captionLinesAfterDelay = captionsViewDivElement.querySelectorAll(`.${CAPTION_LINE_DIV_CLASSNAME}`);
    assert.strictEqual(captionLinesAfterDelay.length, payload.captionLines.length);
  });

  it(`should be able display captions after specified delay where delay > 0`, () => {
    const payload = CAPTIONS_PAYLOAD_1_LINE_100_DELAY_300_DURATION;
    captionsHandler.renderCaptions(payload);
    const captionLinesBeforeDelay = captionsViewDivElement.querySelectorAll(`.${CAPTION_LINE_DIV_CLASSNAME}`);
    assert.strictEqual(captionLinesBeforeDelay.length, 0);
    clock.tick(payload.delay);
    const captionLinesAfterDelay = captionsViewDivElement.querySelectorAll(`.${CAPTION_LINE_DIV_CLASSNAME}`);
    assert.strictEqual(captionLinesAfterDelay.length, payload.captionLines.length);
  });

  it(`should be able to dismiss first captions and display second captions when there is no delay for second captions`, () => {
    const payload1 = CAPTIONS_PAYLOAD_1_LINE_100_DELAY_300_DURATION;
    const payload2 = CAPTIONS_PAYLOAD_1_LINE_0_DELAY_100_DURATION;

    // first caption message received
    captionsHandler.renderCaptions(payload1);
    clock.tick(payload1.delay);

    // first caption displayed
    const captionsLinesAfterFirstCaptionMessage = captionsViewDivElement.querySelectorAll(`.${CAPTION_LINE_DIV_CLASSNAME}`);
    assert.strictEqual(captionsLinesAfterFirstCaptionMessage.length, payload1.captionLines.length);

    // second caption message received before first caption duration is up
    captionsHandler.renderCaptions(payload2);
    clock.tick(NEGLIGIBLE_TIME_IN_MS);

    // first caption dismissed and second caption displayed
    const captionsLinesAfterSecondCaptionMessage = captionsViewDivElement.querySelectorAll(`.${CAPTION_LINE_DIV_CLASSNAME}`);
    assert.strictEqual(captionsLinesAfterSecondCaptionMessage.length, payload2.captionLines.length);

    // second caption duration elapses
    clock.tick(payload2.duration);

    // second caption dismissed
    const captionsLinesAfterSecondCaptionDuration = captionsViewDivElement.querySelectorAll(`.${CAPTION_LINE_DIV_CLASSNAME}`);
    assert.strictEqual(captionsLinesAfterSecondCaptionDuration.length, 0);
  });

  it(`should be able to display first captions for the full duration when there is a long delay in displaying second captions`, () => {
    const payload1 = CAPTIONS_PAYLOAD_1_LINE_100_DELAY_300_DURATION;
    const payload2 = CAPTIONS_PAYLOAD_2_LINES_500_DELAY_100_DURATION;

    // first caption and second caption received at approximately the same time
    captionsHandler.renderCaptions(payload1);
    captionsHandler.renderCaptions(payload2);

    // first caption delay elapses and content starts displaying
    clock.tick(payload1.delay);
    const captionsLinesAfterFirstDelay = captionsViewDivElement.querySelectorAll(`.${CAPTION_LINE_DIV_CLASSNAME}`);
    assert.strictEqual(captionsLinesAfterFirstDelay.length, payload1.captionLines.length);

    // first caption duration elapses and content is dismissed
    clock.tick(payload1.duration);
    const captionsLinesAfterFirstDuration = captionsViewDivElement.querySelectorAll(`.${CAPTION_LINE_DIV_CLASSNAME}`);
    assert.strictEqual(captionsLinesAfterFirstDuration.length, 0);

    // second caption delay elapses and content is displaying
    clock.tick(payload2.delay - payload1.delay - payload1.duration);
    const captionsLinesAfterSecondDelay = captionsViewDivElement.querySelectorAll(`.${CAPTION_LINE_DIV_CLASSNAME}`);
    assert.strictEqual(captionsLinesAfterSecondDelay.length, payload2.captionLines.length);

    // second caption duration elapses and content is dismissed
    clock.tick(payload2.duration);
    const captionsLinesAfterSecondDuration = captionsViewDivElement.querySelectorAll(`.${CAPTION_LINE_DIV_CLASSNAME}`);
    assert.strictEqual(captionsLinesAfterSecondDuration.length, 0);
  });

});
