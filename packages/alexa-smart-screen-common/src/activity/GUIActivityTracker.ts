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

import { GUIActivityState } from './GUIActivityState';
import { IGUIActivityTracker } from './IGUIActivityTracker';

/**
 * GUI activity tracker. Tracks components that is currently active and sends corresponding events.
 * @export
 * @class
 */
export class GUIActivityTracker implements IGUIActivityTracker {
    /// Interface to send out interaction state changed events.
    private guiActivityEventCallback : (event : GUIActivityState) => void;

    /// Set of currently active components.
    private activeComponents : Map<number, string> = new Map();

    /// Activity token generator.
    private currentActivityToken = 0;

    constructor(guiActivityEventCallback : (event : GUIActivityState) => void) {
        this.guiActivityEventCallback = guiActivityEventCallback;
    }

    /**
     * Record that an activity was interrupted
     */
    public reportInterrupted() : void {
        this.guiActivityEventCallback(GUIActivityState.INTERRUPT);
    }

    /**
     * Record component as currently active.
     *
     * @param name Name of the component.
     * @returns GUIActivityTracker token
     */
    public recordActive(name : string) : number {
        const stateChanged = this.componentsEmpty();
        let prevToken  = 0;
        this.activeComponents.forEach((value : string, key : number) => {
            if (value === name) {
                prevToken = key;
            }
        });
        if (prevToken === 0) {
            this.currentActivityToken++;
            this.activeComponents.set(this.currentActivityToken, name);
            if (stateChanged) {
                this.reportActive();
            }
            return this.currentActivityToken;
        } else {
            return prevToken;
        }
    }

    /**
     * Record component as currently inactive.
     *
     * @param token Tracking token.
     */
    public recordInactive(token : number) : void {
        this.activeComponents.delete(token);

        if (this.componentsEmpty()) {
            this.reportInactive();
        }
    }

    /**
     * Reset GUIActivityTracker state. Clear active components list and report as INACTIVE.
     */
    public reset() : void {
        this.activeComponents.clear();
        this.reportInactive();
    }

    private reportActive() : void {
        this.guiActivityEventCallback(GUIActivityState.ACTIVATED);
    }

    private reportInactive() : void {
        this.guiActivityEventCallback(GUIActivityState.DEACTIVATED);
    }

    private componentsEmpty() : boolean {
        return (this.activeComponents.size === 0);
    }
}
