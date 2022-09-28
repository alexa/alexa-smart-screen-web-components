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

import { DisplayOrientation, ILogger, ILoggerFactory, IWindowConfig, WindowState, } from '@alexa-smart-screen/common';
import * as chai from 'chai';
import { DisplayWindowElementMock } from '../mocks/DisplayWindowElementMock';
import { DisplayWindowElementBuilderMock } from '../mocks/DisplayWindowElementBuilderMock';
import * as sinon from 'sinon';
import { IWindowManagerObserver } from '../../src/observers/IWindowManagerObserver';
import { WindowManager } from '../../src/WindowManager';
import { createMock } from 'ts-auto-mock';

describe("@alexa-smart-screen/window-manager - Window Manager functionality", () => {
    const WINDOW_ID1 = "displayWindow1";
    const WINDOW_ID2 = "displayWindow2";
    const WINDOW_ID3 = "displayWindow3";
    const WINDOW_ID_INVALID = "invalidWindowId";
    const WINDOW_ZORDER1 = 0;
    const WINDOW_ZORDER2 = 3;
    const WINDOW_ZORDER3 = 1;
    const WINDOW_CONFIG1 : IWindowConfig = {
        id : WINDOW_ID1,
        supportedInterfaces : [],
        zOrderIndex : WINDOW_ZORDER1
    };
    const WINDOW_CONFIG2 : IWindowConfig = {
        id : WINDOW_ID2,
        supportedInterfaces : [],
        zOrderIndex : WINDOW_ZORDER2
    };
    const WINDOW_CONFIG3 : IWindowConfig = {
        id : WINDOW_ID3,
        supportedInterfaces : [],
        zOrderIndex : WINDOW_ZORDER3
    };
    let loggerFactory : ILoggerFactory;
    let logger : ILogger;
    let windowManagerObserver1 : IWindowManagerObserver;
    let windowManagerObserver2 : IWindowManagerObserver;
    let observerSet : Set<IWindowManagerObserver>;
    let windowManager : WindowManager;

    let displayWindow1 : DisplayWindowElementMock;
    let displayWindow2 : DisplayWindowElementMock;
    let displayWindow3 : DisplayWindowElementMock;

    beforeEach(() => {
        displayWindow1 = new DisplayWindowElementBuilderMock(WINDOW_ID1)
            .setWindowConfig(WINDOW_CONFIG1)
            .setDisplayOrientation(DisplayOrientation.LANDSCAPE)
            .build();
        displayWindow2 = new DisplayWindowElementBuilderMock(WINDOW_ID2)
            .setWindowConfig(WINDOW_CONFIG2)
            .setDisplayOrientation(DisplayOrientation.LANDSCAPE)
            .build();
        displayWindow3 = new DisplayWindowElementBuilderMock(WINDOW_ID3)
            .setWindowConfig(WINDOW_CONFIG3)
            .setDisplayOrientation(DisplayOrientation.LANDSCAPE)
            .build();

        logger = createMock<ILogger>({
            error : sinon.spy(),
        });
        loggerFactory = createMock<ILoggerFactory>({
            getLogger : () => logger,
        });
        windowManagerObserver1 = createMock<IWindowManagerObserver>({
            onIsWindowDisplayingChanged : sinon.spy(),
        });
        windowManagerObserver2 = createMock<IWindowManagerObserver>({
            onIsWindowDisplayingChanged : sinon.spy(),
        });
        observerSet = new Set([windowManagerObserver1, windowManagerObserver2]);
        windowManager = new WindowManager(loggerFactory);
        windowManager.getObserverManager().addObservers(observerSet);
        windowManager.setWindows([displayWindow1, displayWindow2, displayWindow3]);
    });

    it(`should have sorted windows by windowId in increasing z-order`, () => {
        const windows = windowManager.getWindowsByZOrder()
        windows.forEach((window, windowIndex) => {
            if (windowIndex > 0) {
                chai.assert.isTrue(windows[windowIndex - 1].getZOrder() <= window.getZOrder());
            }
        });
    });

    it(`should be able to render the correct window to view and update corresponding states`, async () => {
        const displayWindow1RenderSpy : sinon.SinonSpy = sinon.spy();
        displayWindow1.render = displayWindow1RenderSpy;

        await windowManager.renderWindowToView(WINDOW_ID1);

        sinon.assert.calledOnce(displayWindow1RenderSpy);
        chai.assert.strictEqual(windowManager.getActiveWindowId(), WINDOW_ID1);
        chai.assert.strictEqual(windowManager.getIsWindowDisplaying(), true);
        observerSet.forEach((observer : IWindowManagerObserver) => {
            sinon.assert.calledOnceWithExactly(observer.onIsWindowDisplayingChanged as sinon.SinonSpy, true);
        });
    });

    it(`should set window1 to background when rendering window2 to view`, async () => {
        await windowManager.renderWindowToView(WINDOW_ID1);
        chai.assert.strictEqual(displayWindow1.getState(), WindowState.FOREGROUND);

        await windowManager.renderWindowToView(WINDOW_ID2);
        chai.assert.strictEqual(displayWindow2.getState(), WindowState.FOREGROUND);
        chai.assert.strictEqual(displayWindow1.getState(), WindowState.BACKGROUND);
    });

    it(`should hide window2 when rendering window1 to view`, async () => {
        await windowManager.renderWindowToView(WINDOW_ID2);
        chai.assert.strictEqual(displayWindow2.getState(), WindowState.FOREGROUND);

        await windowManager.renderWindowToView(WINDOW_ID1);
        chai.assert.strictEqual(displayWindow2.getState(), WindowState.HIDDEN);
        chai.assert.strictEqual(displayWindow1.getState(), WindowState.FOREGROUND);
        chai.assert.strictEqual(WINDOW_ID1, windowManager.getActiveWindowId());
    });

    it(`should not hide window2 when rendering window1 to view in background`, async () => {
        await windowManager.renderWindowToView(WINDOW_ID2);
        chai.assert.strictEqual(displayWindow2.getState(), WindowState.FOREGROUND);

        await windowManager.renderWindowToView(WINDOW_ID1, WindowState.BACKGROUND);
        chai.assert.strictEqual(displayWindow2.getState(), WindowState.FOREGROUND);
        chai.assert.strictEqual(displayWindow1.getState(), WindowState.BACKGROUND);
        chai.assert.strictEqual(WINDOW_ID2, windowManager.getActiveWindowId());
    });

    it(`should set window1 to foreground after hiding window2 from view`, async () => {
        await windowManager.renderWindowToView(WINDOW_ID1);
        chai.assert.strictEqual(displayWindow1.getState(), WindowState.FOREGROUND);

        await windowManager.renderWindowToView(WINDOW_ID2);
        chai.assert.strictEqual(displayWindow2.getState(), WindowState.FOREGROUND);
        chai.assert.strictEqual(displayWindow1.getState(), WindowState.BACKGROUND);
        chai.assert.strictEqual(WINDOW_ID2, windowManager.getActiveWindowId());

        await windowManager.hideWindowFromView(WINDOW_ID2);
        chai.assert.strictEqual(displayWindow2.getState(), WindowState.HIDDEN);
        chai.assert.strictEqual(displayWindow1.getState(), WindowState.FOREGROUND);
        chai.assert.strictEqual(WINDOW_ID1, windowManager.getActiveWindowId());
    });

    it(`should set window3, not window1, to foreground and active after hiding window2 from view`, async () => {
        await windowManager.renderWindowToView(WINDOW_ID1);
        await windowManager.renderWindowToView(WINDOW_ID3);
        await windowManager.renderWindowToView(WINDOW_ID2);

        chai.assert.strictEqual(displayWindow2.getState(), WindowState.FOREGROUND);
        chai.assert.strictEqual(displayWindow3.getState(), WindowState.BACKGROUND);
        chai.assert.strictEqual(displayWindow1.getState(), WindowState.BACKGROUND);
        chai.assert.strictEqual(WINDOW_ID2, windowManager.getActiveWindowId());

        await windowManager.hideWindowFromView(WINDOW_ID2);
        chai.assert.strictEqual(displayWindow2.getState(), WindowState.HIDDEN);
        chai.assert.strictEqual(displayWindow3.getState(), WindowState.FOREGROUND);
        chai.assert.strictEqual(displayWindow1.getState(), WindowState.BACKGROUND);
        chai.assert.strictEqual(WINDOW_ID3, windowManager.getActiveWindowId());
    });

    it(`should have no active window after hiding a window from view with only hidden windows`, async () => {
        await windowManager.renderWindowToView(WINDOW_ID1);
        await windowManager.renderWindowToView(WINDOW_ID2);

        await displayWindow1.hide();
        chai.assert.strictEqual(displayWindow1.getState(), WindowState.HIDDEN);

        await windowManager.hideWindowFromView(WINDOW_ID2);
        chai.assert.strictEqual(displayWindow2.getState(), WindowState.HIDDEN);
        chai.assert.strictEqual(displayWindow1.getState(), WindowState.HIDDEN);
        chai.assert.strictEqual(undefined, windowManager.getActiveWindowId());
    });

    it(`should log an error when attempting to render a non existing window to view`, async () => {
        await windowManager.renderWindowToView(WINDOW_ID_INVALID);
        sinon.assert.calledOnce(
            logger.error as sinon.SinonSpy
        );
    });

    it(`should destroy and update active window id when removing active window from view`, async () => {
        await windowManager.renderWindowToView(WINDOW_ID2);
        chai.assert.strictEqual(displayWindow2.getState(), WindowState.FOREGROUND);

        await windowManager.hideWindowFromView(WINDOW_ID2);
        chai.assert.strictEqual(displayWindow2.getState(), WindowState.HIDDEN);
        chai.assert.strictEqual(undefined, windowManager.getActiveWindowId());
    });

    it(`should have empty active window if when no visible window exists after removing window from view`, async () => {
        await windowManager.hideWindowFromView(WINDOW_ID3);
        chai.assert.strictEqual(undefined, windowManager.getActiveWindowId());
    });

    it(`should log an error when attempting to remove a non existing window from view`, async () => {
        await windowManager.hideWindowFromView(WINDOW_ID_INVALID);
        sinon.assert.calledOnce(
            logger.error as sinon.SinonSpy
        );
    });
});
