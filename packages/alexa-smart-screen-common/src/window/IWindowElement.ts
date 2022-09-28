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

import { DisplayOrientation } from '../display/DisplayConstants';
import { VisibilityCssProperty } from '../utils/CssProperties';
import { IWindowInstance } from './IWindowInstance';
import { WindowSizeType } from '../visualCharacteristics/windowTemplates/IWindowSize';
import { WindowType } from '../visualCharacteristics/windowTemplates/IWindowTemplate';
import { ILocaleObserver } from '../locale/ILocaleObserver';
import { IWindowConfig } from './IWindowConfig';
import { IWindowDimensions } from './IWindowDimensions';
import { WindowContentType, WindowState } from './WindowState';

/**
 * Interface for custom window elements defined by web components
 */
export interface IWindowElement extends ILocaleObserver {
    /**
     * Getters and Setters for properties
     */
    setDisplayOrientation(orientation : DisplayOrientation) : void;
    setWindowConfig(config : IWindowConfig) : void;
    setContentType(contentType : WindowContentType) : void;
    getContentType() : WindowContentType;
    getWindowInstance() : IWindowInstance;
    getWindowId() : string;
    setState(state : WindowState) : void;
    getState() : WindowState;
    getVisibility() : VisibilityCssProperty;
    getSizeType() : WindowSizeType;
    getDisplayType() : WindowType;
    getZOrder() : number;
    setZOrder(zOrder : number) : void;
    setDimensions(dimensions : IWindowDimensions) : void;
    getDimensions() : IWindowDimensions;

    /**
     * Render visuals in the window element
     * @param windowState Optional flag indicating the initial window state of the window upon render
     */
    render(windowState ?: WindowState) : Promise<void>;

    /**
     * Update visuals in the window element
     */
    update() : void;

    /**
     * Hide window and cleanup internal variables/states
     * @param preserveContent if true visual content is preserved, not cleared when hiding the window
     */
    hide(preserveContent ?: boolean) : Promise<void>;
}
