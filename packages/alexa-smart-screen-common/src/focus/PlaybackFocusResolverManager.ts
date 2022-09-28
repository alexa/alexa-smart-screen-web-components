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

import { ILogger } from "../logger/ILogger";
import { RequestResponsePromiseWrapperWithoutTimeout } from "../utils/RequestResponsePromiseWrapperWithoutTimeout";

/* 
 * Playback focus manager is used for managing focus requests for video and audio playback.
 * A focus request submitted using onRequest() will wait until onResponse() or onReject() is called to successfully conclude
 * that focus has been acquired or failure to acquire focus. There can only be maximum one ongoing request at a time.
 */

export class PlaybackFocusResolverManager {

    private playbackFocusResolver : RequestResponsePromiseWrapperWithoutTimeout<void> | undefined;
    private logger : ILogger;

    constructor(logger : ILogger) {
        this.logger = logger;
    }

    /**
     * onRequest should be called to send a new playback focus request.
     */
    public onRequest() : Promise<void> {
        this.playbackFocusResolver = new RequestResponsePromiseWrapperWithoutTimeout<void>(this.logger);
        return this.playbackFocusResolver.onRequest();
    }

    /**
     * onResponse should be called to resolve the playback focus request.
     */
    public onResponse() : void {
        if (this.playbackFocusResolver) {
            this.playbackFocusResolver.onResponse();
            this.playbackFocusResolver = undefined;
        }
    }

    /**
     * onReject should be called to reject the playback focus request.
     * @param reason Reason to be passed while rejecting the playback focus promise.
     */
    public onReject(reason : string) : void {
        if (this.playbackFocusResolver) {
            this.playbackFocusResolver.onReject(reason);
            this.playbackFocusResolver = undefined;
        }
    }

    /**
     * Get the current playback focus request.
     * @returns The playback focus request response wrapper.
     */
    public getPlaybackFocusResolver() : RequestResponsePromiseWrapperWithoutTimeout<void> | undefined {
        return this.playbackFocusResolver;
    }
}