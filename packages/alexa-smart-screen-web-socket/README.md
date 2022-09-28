# Alexa Smart Screen Web Socket Client

[![ws](https://img.shields.io/badge/ws%20npm-v7.5.5-blue)](https://www.npmjs.com/package/ws/v/7.5.5)


The Alexa Smart Screen Web Socket Client package provides a wrapper component on the [ws Node.js WebSocket Library][node-ws], which implements the [IClient interface][ipc-client-interface] for use as a common Client within your web application.

It uses the [IClientConfig interface][ipc-client-interface] to configure `host`, `port`, and `security` configurations of the `ws` implementation.

## Sample App Usage
The Web Socket Client is the default client implemented in the [SampleApplication](../../samples/alexa-smart-screen-sample-app/README.md) and its security setting can be controlled with the [DISABLE_WEBSOCKET_SSL](../../samples/alexa-smart-screen-sample-app/README.md#environment-properties) env property.

## Example Usage
```javascript
// Create Client Config with your HOST, PORT, and SECURITY properties
const webSocketClientConfig : IClientConfig = {
    host : HOST,
    port : PORT,
    insecure : FALSE
};

// Create your WebSocketClient using the config, and an instance of ILoggerFactory
const client : IClient = new WebSocketClient(webSocketClientConfig, loggerFactory : ILoggerFactory);

// Subscribe to message callbacks from the client to handle inbound Directive messages
this.client.onMessage = (directive : IDirective) : void => {...};

// Init the client's connection when your web application loads
this.client.connect();

// Send messages through the client to your server application
this.client.sendMessage(message);

//
// Note that any implementation of an EventHandler implicitly sends messages via the client
//
```

[node-ws]: https://github.com/websockets/ws/tree/7.5.5
[ipc-client-interface]: ../alexa-smart-screen-common/src/client/IClient.ts