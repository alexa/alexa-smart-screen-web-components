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

'use strict';

import { IFocusResource } from './FocusResource';
import { IFocusBridge } from './IFocusBridge';
import { IChannelObserver } from './IChannelObserver';
import { ChannelName } from './ChannelName';
import { FocusState } from './FocusState';
import { ILoggerFactory } from '../logger/ILoggerFactory';
import { ILogger } from '../logger/ILogger';
import { LoggerParamsBuilder } from '../logger/LoggerParamsBuilder';
import { IPC_CONFIG_AUDIO_FOCUS_MANAGER } from './ipcComponents/IPCNamespaceConfigAudioFocusManager';
import { IFocusManager } from './IFocusManager';
import { AVSInterface } from '../AVSInterfaces';
import { ContentType } from './ContentType';

/**
 * Simple data structure to hold information about focus requestor.
 *
 * @interface
 * @export
 */
export interface IRequesterInfo {
    avsInterface : AVSInterface;
    channelName : ChannelName;
    contentType : ContentType;
    channelObserver : IChannelObserver;
    focusResource ?: IFocusResource;
    resourcePromise ?: Promise<void>;
}

/**
 * FocusManager implementation. Handles requests from commands/components to AVS SDK FocusManager in order to acquire
 * or release Visual or Audio channels.
 *
 * @class
 * @exports
 */
export class FocusManager implements IFocusManager{
    protected static readonly CLASS_NAME = 'FocusManager';
    private tokenToInfoMap : Map<number, IRequesterInfo> = new Map();
    private currentToken = 0;
    private focusBridge : IFocusBridge;
    private logger : ILogger

    /**
     * @param focusBridge Focus bridge to be provided from JS shim in C++ SDK. Can be undefined for web renderer test.
     * @param loggerFactory The logger factory to log error messages from this component to.
     */
    constructor(focusBridge : IFocusBridge, loggerFactory : ILoggerFactory) {
        this.focusBridge = focusBridge;
        this.logger = loggerFactory.getLogger(IPC_CONFIG_AUDIO_FOCUS_MANAGER.namespace);
    }

    protected static getLoggerParamsBuilder() : LoggerParamsBuilder {
        return new LoggerParamsBuilder().setClassName(FocusManager.CLASS_NAME);
    }

    /**
     * Acquire channel from AVS SDK.
     *
     * @param avsInterface Name of the avs interface to report as having focus.
     * @param channelName Name of the channel to acquire.
     * @param contentType Type of content acquiring focus. 
     * @param observer Channel state observer.
     * @returns Assigned requestor token.
     */
    public acquireFocus(avsInterface : AVSInterface, 
                        channelName : ChannelName, 
                        contentType : ContentType, 
                        observer : IChannelObserver) : number {
        const token = this.currentToken++;
        this.tokenToInfoMap.set(token, {avsInterface, channelName, contentType, channelObserver : observer});
        this.focusBridge.acquireFocus(token, avsInterface, channelName, contentType);
        return token;
    }

    /**
     * Release channel to AVS SDK. It will use same observer that was provided to acquireFocus to report result.
     *
     * @param token Requestor token received while acquiring channel.
     */
    public releaseFocus(token : number) : void {
        const functionName = 'releaseFocus';
        const requesterInfo : IRequesterInfo = this.tokenToInfoMap.get(token);
        if (requesterInfo) {
            this.focusBridge.releaseFocus(token, requesterInfo.avsInterface, requesterInfo.channelName);
        } else {
            this.logger.warn(FocusManager.getLoggerParamsBuilder()
                                .setFunctionName(functionName)
                                .setMessage('received change for non-existing requestor')
                                .setArg('token', token)
                                .build());
        }
    }

    /**
     * Process AVS SDK FocusManager response on acquire/release request.
     *
     * @param token Requestor token.
     * @param result Request processing result.
     */
    public processFocusResponse(token : number, result : boolean) : void {
        // No actual need to process it at the moment, could be used for retries.
    }

    /**
     * Process AVS SDK Channel state change.
     *
     * @param token Requestor token.
     * @param focusState Acquired or released channel state.
     */
    public processFocusChanged(
      token : number,
      focusState : FocusState) : void {
        const functionName = 'processFocusChanged';
        const requesterInfo = this.tokenToInfoMap.get(token);
        if (requesterInfo) {
            requesterInfo.channelObserver.focusChanged(focusState, token);

            // If NONE, then it was released. Clean up info here.
            if (FocusState.NONE === focusState) {
                this.tokenToInfoMap.delete(token);
            }
        } else {
            this.logger.warn(FocusManager.getLoggerParamsBuilder()
                                .setFunctionName(functionName)
                                .setMessage('received change for non-existing requestor')
                                .setArg('token', token)
                                .build());
        }
    }

    /**
     * Reset FocusManager state. Release all channels held and clear the list.
     */
    public reset() : void {
        this.tokenToInfoMap.forEach((value : IRequesterInfo, key : number) => this.releaseFocus(key));
        this.tokenToInfoMap.clear();
    }
}
