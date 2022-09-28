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

import { AlignItemsCssProperty, AVSVisualInterfaces, DisplayOrientation, IWindowConfig, IWindowDimensions, IWindowObserver, JustifyContentCssProperty, OpacityCssProperty, VisibilityCssProperty, WindowPositionType, WindowState } from '@alexa-smart-screen/common';
import * as chai from 'chai';
import { DisplayWindowElementMock } from '../mocks/DisplayWindowElementMock';
import { DisplayWindowElementBuilderMock } from '../mocks/DisplayWindowElementBuilderMock';
import * as sinon from 'sinon';
import { WINDOW_TRANSITION_IN_MS } from '../../src/WindowProperties';
import { createMock } from 'ts-auto-mock';

describe("@alexa-smart-screen/window-manager - Display Window Element functionality", () => {
    const WINDOW_ID = "displayWindow";
    const TEMPLATE = "template";
    const SIZE_CONFIGURATION = "sizeConfiguration";
    const INTERACTION_MODE = "interactionMode";
    const WINDOW_INTERFACES : AVSVisualInterfaces[] = [AVSVisualInterfaces.ALEXA_PRESENTATION_APL];
    const WINDOW_ZORDER = 0;
    const WINDOW_POSITION : WindowPositionType = WindowPositionType.CENTER;
    const WINDOW_CONFIG : IWindowConfig = {
        id : WINDOW_ID,
        supportedInterfaces : WINDOW_INTERFACES,
        zOrderIndex : WINDOW_ZORDER,
        windowPosition : WINDOW_POSITION,
        displayWindowConfig : {
            templateId : TEMPLATE,
            configurations : {
                landscape : {
                    sizeConfigurationId : SIZE_CONFIGURATION,
                    interactionMode : INTERACTION_MODE
                }
            }
        }
    };
    const WINDOW_HEIGHT = 1080;
    const WINDOW_WIDTH = 1920;
    const WINDOW_DIMENSIONS : IWindowDimensions = {
        width : WINDOW_WIDTH,
        height : WINDOW_HEIGHT
    };
    const WINDOW_ACTIVE_TRANSITION = `visibility 1s, opacity ${WINDOW_TRANSITION_IN_MS}ms linear`;
    const WINDOW_INACTIVE_TRANSITION = `visibility 1s, opacity ${WINDOW_TRANSITION_IN_MS}ms linear`;

    let displayWindow : DisplayWindowElementMock;
    let windowObserver1 : IWindowObserver;
    let windowObserver2 : IWindowObserver;
    let observerSet : Set<IWindowObserver>;

    beforeEach(() => {
        windowObserver1 = createMock<IWindowObserver>({
            onWindowStateChanged : sinon.spy(),
            onWindowVisibilityChanged : sinon.spy(),
        });
        windowObserver2 = createMock<IWindowObserver>({
            onWindowStateChanged : sinon.spy(),
            onWindowVisibilityChanged : sinon.spy(),
        });
        observerSet = new Set([windowObserver1, windowObserver2]);

        displayWindow = new DisplayWindowElementBuilderMock(WINDOW_ID)
            .setWindowConfig(WINDOW_CONFIG)
            .setDisplayOrientation(DisplayOrientation.LANDSCAPE)
            .build();
        
        displayWindow.setDimensions(WINDOW_DIMENSIONS);

        displayWindow.getObserverManager().addObservers(observerSet);
    });

    it(`should be able to build a window and get correct characteristics`, () => {
        chai.assert.strictEqual(displayWindow.getWindowId(), WINDOW_ID);
        chai.assert.strictEqual(displayWindow.getZOrder(), WINDOW_ZORDER);
        chai.assert.strictEqual(displayWindow.getWindowPosition(), WINDOW_POSITION);
        chai.assert.strictEqual(displayWindow.getState(), WindowState.HIDDEN);
        chai.assert.strictEqual(displayWindow.getWindowInstance().templateId, TEMPLATE);
        chai.assert.strictEqual(displayWindow.getWindowInstance().sizeConfigurationId, SIZE_CONFIGURATION);
        chai.assert.strictEqual(displayWindow.getWindowInstance().interactionMode, INTERACTION_MODE);
        chai.assert.strictEqual(displayWindow.getWindowInstance().supportedInterfaces, WINDOW_INTERFACES);
    });

    it(`should be able to render a window and apply correct styles`, async () => {
        await displayWindow.render();

        sinon.assert.calledOnce(displayWindow.renderInternalSpy);

        chai.assert.strictEqual(displayWindow.getState(), WindowState.FOREGROUND);
        observerSet.forEach((observer : IWindowObserver) => {
            sinon.assert.calledOnceWithExactly(observer.onWindowStateChanged as sinon.SinonSpy, WINDOW_ID, WindowState.FOREGROUND);
        });
        chai.assert.strictEqual(displayWindow.style.transition, WINDOW_ACTIVE_TRANSITION);
        chai.assert.strictEqual(displayWindow.style.opacity, OpacityCssProperty.OPAQUE);
        chai.assert.strictEqual(displayWindow.getVisibility(), VisibilityCssProperty.VISIBLE);
        observerSet.forEach((observer : IWindowObserver) => {
            sinon.assert.calledOnceWithExactly(observer.onWindowVisibilityChanged as sinon.SinonSpy, WINDOW_ID, VisibilityCssProperty.VISIBLE);
        });
    });

    it(`should be able to hide a previous render and applies correct styles`, async () => {
        await displayWindow.render();
        observerSet.forEach((observer : IWindowObserver) => {
            (observer.onWindowStateChanged as sinon.SinonSpy).resetHistory();
            (observer.onWindowVisibilityChanged as sinon.SinonSpy).resetHistory();
        });
        await displayWindow.hide();

        sinon.assert.calledOnce(displayWindow.hideInternalSpy);
        chai.assert.strictEqual(displayWindow.getState(), WindowState.HIDDEN);
        observerSet.forEach((observer : IWindowObserver) => {
            sinon.assert.calledOnceWithExactly(observer.onWindowStateChanged as sinon.SinonSpy, WINDOW_ID, WindowState.HIDDEN);
        });
        chai.assert.strictEqual(displayWindow.style.transition, WINDOW_INACTIVE_TRANSITION);
        chai.assert.strictEqual(displayWindow.style.opacity, OpacityCssProperty.TRANSPARENT);
        chai.assert.strictEqual(displayWindow.getVisibility(), VisibilityCssProperty.HIDDEN);
        observerSet.forEach((observer : IWindowObserver) => {
            sinon.assert.calledOnceWithExactly(observer.onWindowVisibilityChanged as sinon.SinonSpy, WINDOW_ID, VisibilityCssProperty.HIDDEN);
        });
    });

    it(`should not notify observers when hiding a window if state and visibility aren't changed`, async () => {
        await displayWindow.hide();

        sinon.assert.calledOnce(displayWindow.hideInternalSpy);

        chai.assert.strictEqual(displayWindow.getState(), WindowState.HIDDEN);
        observerSet.forEach((observer : IWindowObserver) => {
            sinon.assert.notCalled(observer.onWindowStateChanged as sinon.SinonSpy);
        });
        chai.assert.strictEqual(displayWindow.style.transition, WINDOW_INACTIVE_TRANSITION);
        chai.assert.strictEqual(displayWindow.style.opacity, OpacityCssProperty.TRANSPARENT);
        chai.assert.strictEqual(displayWindow.getVisibility(), VisibilityCssProperty.HIDDEN);
        observerSet.forEach((observer : IWindowObserver) => {
            sinon.assert.notCalled(observer.onWindowVisibilityChanged as sinon.SinonSpy);
        });
    });

    it(`should apply correct styles when setting transitions`, () => {
        displayWindow.setWindowPosition(WindowPositionType.BOTTOM);
        displayWindow.setTransitions();
        chai.assert.strictEqual(displayWindow.getWindowFlexAlignItems(), AlignItemsCssProperty.FLEX_END);
        chai.assert.strictEqual(displayWindow.getWindowInactiveTransform(), `translate(${0}px, ${WINDOW_HEIGHT}px)`);

        displayWindow.setWindowPosition(WindowPositionType.TOP);
        displayWindow.setTransitions();
        chai.assert.strictEqual(displayWindow.getWindowFlexAlignItems(), AlignItemsCssProperty.FLEX_START);
        chai.assert.strictEqual(displayWindow.getWindowInactiveTransform(), `translate(${0}px, ${-WINDOW_HEIGHT}px)`);

        displayWindow.setWindowPosition(WindowPositionType.RIGHT);
        displayWindow.setTransitions();
        chai.assert.strictEqual(displayWindow.getWindowFlexJustifyContent(), JustifyContentCssProperty.FLEX_END);
        chai.assert.strictEqual(displayWindow.getWindowInactiveTransform(), `translate(${WINDOW_WIDTH}px, ${0}px)`);

        displayWindow.setWindowPosition(WindowPositionType.LEFT);
        displayWindow.setTransitions();
        chai.assert.strictEqual(displayWindow.getWindowFlexJustifyContent(), JustifyContentCssProperty.FLEX_START);
        chai.assert.strictEqual(displayWindow.getWindowInactiveTransform(), `translate(${-WINDOW_WIDTH}px, ${0}px)`);
    });
});
