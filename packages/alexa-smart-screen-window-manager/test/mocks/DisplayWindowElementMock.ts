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

import { IWindowDimensions } from '@alexa-smart-screen/common';
import * as sinon from 'sinon';
import { DisplayWindowElement } from '../../src/DisplayWindowElement';

export class DisplayWindowElementMock extends DisplayWindowElement {
    public renderInternalSpy : sinon.SinonSpy = sinon.spy();
    public hideInternalSpy : sinon.SinonSpy = sinon.spy();
    public setStateInternalSpy : sinon.SinonSpy = sinon.spy();
    public updateSpy : sinon.SinonSpy = sinon.spy();
    public setHeightSpy : sinon.SinonSpy = sinon.spy();
    public setWidthSpy : sinon.SinonSpy = sinon.spy();

    constructor(windowId : string) {
        super(windowId);

        // Default elements
        this.transformTransitionElement = document.createElement("div");
        this.resizeElement = document.createElement("div");
        this.shadowElement = document.createElement("div");
    }
    public update = this.updateSpy;

    protected renderInternal = this.renderInternalSpy;

    protected hideInternal = this.hideInternalSpy;

    protected setStateInternal = this.setStateInternalSpy;

    protected setHeight = this.setHeightSpy;

    protected setWidth = this.setWidthSpy;

    public getWindowInactiveTransform() : string {
        return this.windowInactiveTransform;
    }

    public getWindowFlexAlignItems() : string {
        return this.windowFlexAlignItems;
    }

    public getWindowFlexJustifyContent() : string {
        return this.windowFlexJustifyContent;
    }

    public setDimensions(dimensions : IWindowDimensions) {
        this.minHeight = dimensions.minHeight;
        this.maxHeight = dimensions.maxHeight;
        this.minWidth = dimensions.minWidth;
        this.maxWidth = dimensions.maxWidth;
        this.height = dimensions.height;
        this.width = dimensions.width;
      }

    public getDimensions() : IWindowDimensions {
        return {
            width : this.width,
            height : this.height,
            minWidth : this.minWidth,
            maxWidth : this.maxWidth,
            minHeight : this.minHeight,
            maxHeight : this.maxHeight
        };
    }
}

window.customElements.define('display-window-element-mock', DisplayWindowElementMock);
