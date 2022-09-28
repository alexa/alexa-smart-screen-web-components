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

import { WebSocketClient } from '../src/WebSocketClient';
import { assert } from 'chai';
import { IDirective, IDirectiveHeader, IEvent, IClient, IClientConfig, ILoggerFactory, AlexaState } from '@alexa-smart-screen/common';
import { IPC_CONFIG_SYSTEM, SYSTEM_SET_ALEXA_STATE_DIRECTIVE_NAME, ISetAlexaStateDirectivePayload, SYSTEM_ALEXA_STATE_REQUEST_EVENT_NAME } from '@alexa-smart-screen/app-utils';
import { createMock } from 'ts-auto-mock';
import WebSocket = require('ws');
global.WebSocket = WebSocket as any;

describe('@alexa-smart-screen/web-socket', () => {
  let clientConfig : IClientConfig;
  let client : IClient;
  const HOST = 'localhost';
  const PORT = 8933;
  const loggerFactory = createMock<ILoggerFactory>();

  beforeEach(() => {
    clientConfig = {
      host : HOST,
      port : PORT,
      insecure : true
    };
    client = new WebSocketClient(clientConfig, loggerFactory);
  });

  afterEach(() => {
    if (client.isConnected) {
      client.disconnect();
    }
  });

  describe('basic connection functionality', () => {
    it('should be able to initiate the connection', (done : Mocha.Done) => {
      const server = new WebSocket.Server({ port : PORT }, () => {
        client.connect();
        client.onConnect = () => {
          assert.equal(client.isConnected, true);
          client.disconnect();
          server.close(done);
        };
      });
    });

    it('should be able to call onConnect once client connect', (done : Mocha.Done) => {
      const server = new WebSocket.Server({ port : PORT }, () => {
        client.connect();
        client.onConnect = () => {
          assert.isOk('Success');
          client.disconnect();
          server.close(done);
        };
      });
    });

    it('should be able to update connection status when disconnected', (done : Mocha.Done) => {
      const server = new WebSocket.Server({ port : PORT }, () => {
        client.connect();
        client.onConnect = () => {
          client.disconnect();
          server.close(done);
        };
      });
      assert.equal(client.isConnected, false);
    });

    it('should be able to call onDisconnect once client disconnect', (done : Mocha.Done) => {
      const server = new WebSocket.Server({ port : PORT }, () => {
        client.connect();
        client.onConnect = () => {
          client.disconnect();
          server.close(done);
        };
        client.onDisconnect = () => {
          assert.isOk('Success');
        };
      });
    });
  });

  describe('messaging functionality', () => {
    it('should be able to send a valid message through the websocket', (done : Mocha.Done) => {
      const sampleAlexaStateRequestEvent : IEvent = {
        header : {
          version : IPC_CONFIG_SYSTEM.version,
          namespace : IPC_CONFIG_SYSTEM.namespace,
          name : SYSTEM_ALEXA_STATE_REQUEST_EVENT_NAME
        },
        payload : { }
      };
      const server = new WebSocket.Server({ port : PORT }, () => {
        client.connect();
        client.onConnect = () => {
          client.sendMessage(sampleAlexaStateRequestEvent);
          client.disconnect();
        };
      });

      // SDK Server receiving the message
      server.on('connection', (ws : WebSocket) => {
        ws.on('message', (data : WebSocket.Data) => {
          assert.strictEqual(data, JSON.stringify(sampleAlexaStateRequestEvent));
          server.close(done);
        });
      });
    });
  });

  describe('messaging functionality', () => {
    it('should be able to receive valid messages from the websocket on connecting and disconnected', (done : Mocha.Done) => {
      const connectingPayload : ISetAlexaStateDirectivePayload = {
        state : AlexaState.CONNECTING
      };
      const disconnectedPayload : ISetAlexaStateDirectivePayload = {
        state : AlexaState.DISCONNECTED
      };
      const header : IDirectiveHeader = {
        version : IPC_CONFIG_SYSTEM.version,
        namespace : IPC_CONFIG_SYSTEM.namespace,
        name : SYSTEM_SET_ALEXA_STATE_DIRECTIVE_NAME
      };
      const connectingDirective : IDirective = {
        header,
        payload : connectingPayload
      };
      const disconnectedDirective : IDirective = {
        header,
        payload : disconnectedPayload
      };
      let messageCallback = 0;
      const server = new WebSocket.Server({ port : PORT }, () => {
        client.connect();
        client.onMessage = (msg : IDirective) => {
          if (messageCallback === 0 ){
            assert.strictEqual(JSON.stringify(msg), JSON.stringify(connectingDirective));
          } else if (messageCallback === 1) {
            assert.strictEqual(JSON.stringify(msg), JSON.stringify(disconnectedDirective));
          }
          messageCallback++;
        };
      });

      // SDK Server sending a message
      server.on('connection', (ws : WebSocket) => {
        server.close(done);
      });
    });
  });

  describe('invalid client functionality', () => {
    it('should throw an error when using an invalid url', (done : Mocha.Done) => {
      const invalidClientConfig = {
        host : 'invalidHost',
        port : PORT,
        insecure : true
      };
      client = new WebSocketClient(invalidClientConfig, loggerFactory);
      client.connect();
      client.onConnect = () => {
        assert.isNotOk('Fail');
        client.disconnect();
      };
      client.onError = () => {
        assert.isOk('Success');
        client.disconnect();
        done();
      };
    });

    it('should disconnected once error is thrown', (done : Mocha.Done) => {
      const invalidClientConfig = {
        host : 'invalidHost',
        port : PORT,
        insecure : true
      };
      client = new WebSocketClient(invalidClientConfig, loggerFactory);
      client.connect();
      client.onConnect = () => {
        assert.isNotOk('Fail');
        client.disconnect();
      };
      client.onDisconnect = () => {
        assert.isOk('Success');
        client.disconnect();
        done();
      };
    });

    it('should throw an error if server is not present', (done : Mocha.Done) => {
      client.connect();
      client.onConnect = () => {
        assert.isNotOk('Fail');
        client.disconnect();
      };
      client.onError = () => {
        assert.isOk('Success');
        client.disconnect();
        done();
      };
    });

    it('should not be able to send a message when disconnected from the server', (done : Mocha.Done) => {
      const simpleAPLEvent : IEvent = {
        header : {
          version : 1,
          namespace : 'APL',
          name : 'aplEvent'
        },
        payload : { }
      };
      const server = new WebSocket.Server({ port : PORT }, () => {
        client.connect();
        client.onConnect = () => {
          client.disconnect();
        };
        client.onDisconnect = () => {
          client.sendMessage(simpleAPLEvent);
        };
      });

      // SDK Server receiving the message
      server.on('connection', (ws : WebSocket) => {
        ws.on('message', (data : WebSocket.Data) => {
          assert.isNotOk('Fail');
          server.close(done);
        });
        ws.on('close', () => {
          assert.isOk('Success');
          server.close(done);
        });
      });
    });
  });
});
