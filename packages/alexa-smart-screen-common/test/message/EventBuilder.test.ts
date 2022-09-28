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

import { expect } from 'chai';
import { ErrorResponseType } from '../../src/message/Event/ErrorResponseType';
import { IErrorPayload, IEvent } from '../../src/message/Event/EventHandler';
import { EventBuilder } from '../../src/message/EventBuilder';
import { IEventHeader } from '../../src/message/IHeader';
import { IIPCNamespaceConfig } from '../../src/message/IIPCNamespaceConfigProvider';

describe('@alexa-smart-screen/common/message: EventBuilder', () => {
    const sampleIPCNamespaceConfig : IIPCNamespaceConfig = {
        namespace : "SampleNamespace",
        version : 1
    };

    const EVENT_HEADER : IEventHeader = {
        version : sampleIPCNamespaceConfig.version,
        namespace : sampleIPCNamespaceConfig.namespace,
        name : "eventName"
    };
    const EVENT : IEvent = {
        header : EVENT_HEADER,
        payload : "samplePayload"
    };
    const ERROR_EVENT_HEADER : IEventHeader = {
        version : sampleIPCNamespaceConfig.version,
        namespace : sampleIPCNamespaceConfig.namespace,
        name : "errorEventName",
        isError : true
    };
    const ERROR_PAYLOAD : IErrorPayload = {
        type : ErrorResponseType.INTERNAL_ERROR,
        payload : "errorSamplePayload"
    };
    const ERROR_EVENT : IEvent = {
        header : ERROR_EVENT_HEADER,
        payload : ERROR_PAYLOAD
    };

    it('should check if event is constructed correctly ', () => {
        const constructedMessage = EventBuilder.constructEvent(EVENT_HEADER.version, EVENT_HEADER.namespace, EVENT_HEADER.name, EVENT.payload);
        expect(EVENT).deep.equal(constructedMessage);
    });

    it('should check if error event is constructed correctly ', () => {
        const constructedErrorMessage = EventBuilder.constructErrorEvent(ERROR_EVENT_HEADER.version, ERROR_EVENT_HEADER.namespace, ERROR_EVENT_HEADER.name, ERROR_PAYLOAD.type, ERROR_PAYLOAD.payload);
        expect(ERROR_EVENT).deep.equal(constructedErrorMessage);
    });
});