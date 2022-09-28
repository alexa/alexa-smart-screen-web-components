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

import { IEventHeader } from './IHeader';
import { IErrorPayload, IEvent } from './Event/EventHandler';
import { ErrorResponseType } from './Event/ErrorResponseType';

export class EventBuilder {

  /**
   * Builds a JSON event string which includes the header and the payload.
   * The header includes the version, namespace, name.
   * @param version The version of the Event API.
   * @param namespace The namespace of the event to be include in the header.
   * @param name The name of the event to be include in the header.
   * @param payload Payload value associated with the "payload" key.
   */
  public static constructEvent(version : number, namespace : string, name : string,
                               payload : any) : IEvent {
    const header : IEventHeader =  {
      version,
      namespace,
      name,
    };
    const message : IEvent = {
      header,
      payload
    };
    return message;
  }

  /**
   *
   * Builds a JSON error event string which includes the header and the payload.
   * The header will have the error flat turned on and will also include the version,
   * namespace, name.
   * @param version The version of the Event API.
   * @param namespace The namespace of the event to be include in the header.
   * @param name The name of the event to be include in the header.
   * @param type The type of Error to be included in the payload.
   * @param errorPayload Error payload value included in the payload of the event.
   */
  public static constructErrorEvent(version : number, namespace : string, name : string,
                                    type : ErrorResponseType, errorPayload : any) : IEvent  {
    const header : IEventHeader =  {
      version,
      namespace,
      name,
      isError : true
    };
    const payload : IErrorPayload = {
      type,
      payload : errorPayload
    };
    const message : IEvent = {
      header,
      payload
    };
    return message;
  }

}
