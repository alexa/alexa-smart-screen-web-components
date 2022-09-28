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

import { APLEvent, createAPLClearDocumentRequestPayload, IAPLClearDocumentRequestPayload, IAPLRenderDocumentRequestPayload, IAPLWindowConfig, IAPLWindowElementProps } from '@alexa-smart-screen/apl';
import { DisplayOrientation, IClient, ILogger, ILoggerFactory, LoggerParamsBuilder } from '@alexa-smart-screen/common';
import { IRouter } from '@alexa-smart-screen/router';
import { AudioPlayerState, IRenderPlayerInfoControl, IRenderPlayerInfoMessagePayload, IRenderTemplateMessagePayload, ITemplateRuntimeObserver, TemplateRuntimeEvent, TemplateRuntimeHandler } from '@alexa-smart-screen/template-runtime';
import { WindowManager } from '@alexa-smart-screen/window-manager';
import { RENDER_PLAYER_INFO_KEY, resolveRenderPlayerInfo, resolveRenderTemplate } from './TemplateRuntimeToAPLResolver';
import { PlayerInfoWindowElementBuilder } from '../window/PlayerInfoWindowElementBuilder';
import { PlayerInfoWindowElement } from '../window/PlayerInfoWindowElement';

export const LOGGER_ID_AVS_DISPLAY_CARD_MANAGER = 'AVSDisplayCardsManager';

/**
 * Manages the rendering of TemplateRuntime AVS Display Cards with APL templates
 */
export class AVSDisplayCardsManager implements ITemplateRuntimeObserver {
    protected static readonly CLASS_NAME = 'AVSDisplayCardsManager';
    protected logger : ILogger;
    private aplEvent : APLEvent;
    private windowManager : WindowManager;

    private templateRuntimeHandler : TemplateRuntimeHandler;
    private templateRuntimeEvent : TemplateRuntimeEvent;
    
    private renderTemplateWindowId : string;
    private renderPlayerInfoWindowId : string;

    private lastRenderTemplatePayload : IRenderTemplateMessagePayload;
    private lastRenderPlayerInfoPayload : IRenderPlayerInfoMessagePayload;
    private controls : IRenderPlayerInfoControl[];
    private audioItemId : string;

    constructor(loggerFactory : ILoggerFactory,
        client : IClient,
        router : IRouter,
        aplEvent : APLEvent) {
        this.logger = loggerFactory.getLogger(LOGGER_ID_AVS_DISPLAY_CARD_MANAGER);
        this.aplEvent = aplEvent;
        this.templateRuntimeHandler = new TemplateRuntimeHandler(loggerFactory);
        this.templateRuntimeHandler.getObserverManager().addObserver(this);
        router.addNamespace(this.templateRuntimeHandler);
        this.templateRuntimeEvent = new TemplateRuntimeEvent(client);
    }

    protected static getLoggerParamsBuilder() : LoggerParamsBuilder {
        return new LoggerParamsBuilder().setClassName(AVSDisplayCardsManager.CLASS_NAME);
    }

    private isRenderTemplateWindowValid() : boolean {
        return this.renderTemplateWindowId && this.windowManager && this.windowManager.getWindowIds().includes(this.renderTemplateWindowId);
    }

    /**
     * Initialize the AVS Display Card APL Windows
     * @param windowManager the window manager used by the application
     * @param renderTemplateWindowId APL window id to use for render template cards
     * @param playerInfoWindowConfig IAPLWindowConfig to use for the player info window
     * @param playerInfoWindowProps IAPLWindowElementProps to use for the player info window
     * @param displayOrientation DisplayOrientation for init of the player info window
     */
    public initWindows(windowManager : WindowManager | undefined,
        renderTemplateWindowId : string | undefined,
        playerInfoWindowConfig : IAPLWindowConfig | undefined, 
        playerInfoWindowProps : IAPLWindowElementProps | undefined, 
        displayOrientation : DisplayOrientation | undefined) {

        const functionName = 'initWindows';

        this.windowManager = windowManager;
        this.renderTemplateWindowId = renderTemplateWindowId;
        
        if (windowManager && playerInfoWindowConfig && playerInfoWindowProps && displayOrientation) {
            const playerInfoWindow : PlayerInfoWindowElement = PlayerInfoWindowElementBuilder.createWindow(
                playerInfoWindowConfig,
                playerInfoWindowProps,
                displayOrientation
            );
            this.renderPlayerInfoWindowId = playerInfoWindow.getWindowId();
            windowManager.addWindows([playerInfoWindow]);
        } else {
            this.logger.warn(AVSDisplayCardsManager.getLoggerParamsBuilder()
                                        .setFunctionName(functionName)
                                        .setMessage('Missing required properties for creating player info window!')
                                        .build());
        }
        
        this.templateRuntimeEvent.windowIdReport({
            renderTemplateWindowId,
            renderPlayerInfoWindowId : this.renderPlayerInfoWindowId
        });
    }

    public getPlayerInfoWindowId() : string {
        return this.renderPlayerInfoWindowId;
    }

    /**
     * Public for testing.
     * Setter for lastRenderTemplatePayload.
     * @param payload the IRenderTemplateMessagePayload
     */
    public setLastRenderTemplatePayload(payload : IRenderTemplateMessagePayload) {
        this.lastRenderTemplatePayload = payload;  
    }

    /**
     * Method to handle onRenderTemplate callback
     * @param payload the IRenderTemplateMessagePayload
     */
    public onRenderTemplate(payload : IRenderTemplateMessagePayload) {
        const functionName = 'onRenderTemplate';
        if (!this.isRenderTemplateWindowValid()) {
            this.logger.error(AVSDisplayCardsManager.getLoggerParamsBuilder()
                                        .setFunctionName(functionName)
                                        .setMessage(`Invalid RenderTemplate window id: ${this.renderTemplateWindowId}, unable to render payload!`)
                                        .build());
            return;
        }
        const renderDocumentRequestPayload : IAPLRenderDocumentRequestPayload = resolveRenderTemplate(
            payload,
            this.renderTemplateWindowId); 
        this.aplEvent.renderDocumentRequest(renderDocumentRequestPayload);

        this.setLastRenderTemplatePayload(payload);
    }

    private getToggleControls(controls : IRenderPlayerInfoControl[]) : Map<string, IRenderPlayerInfoControl> {
        if (!controls) {
            return new Map();
        }

        return controls.filter((c : IRenderPlayerInfoControl) => c.type === 'TOGGLE').reduce((m : Map<string, IRenderPlayerInfoControl>, c : IRenderPlayerInfoControl) => {
            m.set(c.name, c);
            return m;
        }, new Map() );
    }

    /**
     * Public for testing.
     * Compares arrays of IRenderPlayerInfoControl to detect changes in toggle states
     * @param newControls IRenderPlayerInfoControl array to compare to previous controls array
     * @returns true if state of any toggle controls has changed
     */
    public toggleControlsChanged(newControls : IRenderPlayerInfoControl[]) : boolean {
        const newToggleControls = this.getToggleControls(newControls);
        const oldToggleControls = this.getToggleControls(this.controls);
        this.controls = newControls;

        if (newToggleControls.size !== oldToggleControls.size) {
            // Number of controls has changed
            return true;
        }

        for (const [name, control] of newToggleControls) {
            if (!oldToggleControls.has(name)) {
                return true;
            }

            const oldControl = oldToggleControls.get(name);
            if (control.selected !== oldControl.selected ||
                control.enabled !== oldControl.enabled) {
                return true;
            }
        }
        return false;
    }

    /**
     * Public for testing.
     * Compares audio item id's for differences
     * @param newAudioItemId id of the audio item to compare
     * @returns true if the new audio item is different from the previous id
     */
    public audioItemChanged(newAudioItemId : string) : boolean {
        if (!this.audioItemId || (this.audioItemId !== newAudioItemId)) {
            this.audioItemId = newAudioItemId;
            return true;
        }
        return false;
    }

    /**
     * Method to handle onRenderPlayerInfo callback
     * @param payload the IRenderPlayerInfoMessagePayload
     */
    public onRenderPlayerInfo(payload : IRenderPlayerInfoMessagePayload) {
        const functionName = 'onRenderPlayerInfo';
        if (!this.renderPlayerInfoWindowId) {
            this.logger.error(AVSDisplayCardsManager.getLoggerParamsBuilder()
                                        .setFunctionName(functionName)
                                        .setMessage(`No PlayerInfo Window, unable to render payload!`)
                                        .build());
            return;
        }
        // Ignore rendering PlayerInfo when audio state has STOPPED
        if (payload.audioPlayerState === AudioPlayerState.STOPPED) return;

        const togglesControlsChanged : boolean = this.toggleControlsChanged(payload.payload.controls);
        const audioItemChanged : boolean = this.audioItemChanged(payload.payload.audioItemId);

        // Refresh player info card on the first renderPlayerInfoMessage message
        // or the controls have changed
        // or the audioItem has changed
        if (!this.lastRenderPlayerInfoPayload || audioItemChanged || togglesControlsChanged) {
            const renderDocumentRequestPayload : IAPLRenderDocumentRequestPayload = resolveRenderPlayerInfo(
                payload,
                this.renderPlayerInfoWindowId); 
            this.aplEvent.renderDocumentRequest(renderDocumentRequestPayload);
        }

        this.lastRenderPlayerInfoPayload = payload;
    }

    /**
     * Method to handle onClearTemplateCard callback
     */
    public onClearTemplateCard() {
        const functionName = 'onClearTemplateCard';
        if (!this.isRenderTemplateWindowValid()) {
            this.logger.error(AVSDisplayCardsManager.getLoggerParamsBuilder()
                                        .setFunctionName(functionName)
                                        .setMessage(`Invalid RenderTemplate window id: ${this.renderTemplateWindowId}, nothing to clear!`)
                                        .build());
            return;
        }
        const clearDocumentRequestPayload : IAPLClearDocumentRequestPayload = createAPLClearDocumentRequestPayload(
            this.lastRenderTemplatePayload.token,
            this.renderTemplateWindowId
        );
        this.aplEvent.clearDocumentRequest(clearDocumentRequestPayload);

        this.lastRenderTemplatePayload = undefined;
    }

    /**
     * Method to handle onClearPlayerInfoCard callback
     */
    public onClearPlayerInfoCard() {
        const functionName = 'onClearPlayerInfoCard';
        if (!this.renderPlayerInfoWindowId) {
            this.logger.error(AVSDisplayCardsManager.getLoggerParamsBuilder()
                                        .setFunctionName(functionName)
                                        .setMessage(`No PlayerInfo Window, nothing to clear!`)
                                        .build());
            return;
        }
        const clearDocumentRequestPayload : IAPLClearDocumentRequestPayload = createAPLClearDocumentRequestPayload(
            RENDER_PLAYER_INFO_KEY,
            this.renderPlayerInfoWindowId
        );

        this.aplEvent.clearDocumentRequest(clearDocumentRequestPayload);

        this.audioItemId = '';
        this.controls = [];
        this.lastRenderPlayerInfoPayload = undefined;
    }
}