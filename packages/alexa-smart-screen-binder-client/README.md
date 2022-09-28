# Alexa Smart Screen Binder Client

The Alexa Smart Screen Binder Client provides an alternative implementation of [IClient][i-client] from the more commonly used [WebSocketClient][web-socket-client] for application developers who require a client implementation that binds connections to a function call of the browser window.

## Basic Usage
See example usage in [SampleApplication][sample-app] via the [ENABLE_BINDER_CLIENT][binder-client-env] env property:
```javascript
const binderClientConfig : IBinderClientConfig = {
    loggerFactory : this.loggerFactory,
    messageHandlerFunctionName : 'f',
    messageSenderFunctionName : 'stringFromJavaScript',
    messageSenderClassName : 'class1'
};
const client : IClient = new BinderClient(binderClientConfig);
```

[i-client]: ../alexa-smart-screen-common/src/client/IClient.ts
[binder-client-env]: ../../samples/alexa-smart-screen-sample-app/README.md#environment-properties
[sample-app]: ../../samples/alexa-smart-screen-sample-app/README.md
[web-socket-client]: ../alexa-smart-screen-web-socket/README.md
