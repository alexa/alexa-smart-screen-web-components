# Alexa Smart Screen App Router

The Alexa Smart Screen App Router package provides a single core component that handles the Inter-Process Communication (IPC) routing of inbound, namespaced `Directive`  messages from the server to registered handlers within your web application.

It is designed to work in conjunction with an IPC client in your web application, like the [WebSocketClient][websocket-client], to route messages from the client to the proper handler.

Please refer to documentation on the AVS SDK IPC Client Framework for a complete list of all supported [Namespaces][icf-namespaces].

## Example Usage
```javascript
// IPC client
const client : IClient = new IClientBasedClientInstance(...);

// Create your Router using an instance of the ILoggerFactory and IVersionManager
const router : IRouter = new Router(loggerFactory : ILoggerFactory, versionManager : IVersionManager);
...
// Create and register different DirectiveHandler instances with the Router
const directiveHandler : DirectiveHandler = new SomeDirectiveHandlerInstance(...);
this.router.addNamespace(this.directiveHandler);
...

// Subscribe to client message callback to route directive messages via the Router
this.client.onMessage = (directive : IDirective) : void => {
    if (this.router.canHandle(directive)) {
      this.router.handleDirective(directive);
    }
}
```


[icf-namespaces]: https://developer.amazon.com/docs/alexa/avs-device-sdk/ipc-client-api-framework-reference.html#ipc-client-framework-api-reference
[websocket-client]: ../alexa-smart-screen-web-socket/README.md