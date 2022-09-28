# Alexa Smart Screen APL Module
<p>
    <a href="https://github.com/alexa/apl-client-library/tree/v2022.1.1" alt="APLClientLibrary">
        <img src="https://img.shields.io/badge/apl%20client%20library-2022.1.1-blue" /></a>
</p>

The Alexa Smart Screen APL module provides Inter-Process Communication (IPC) components, media elements, and wrappers for integrating the [APL Client Library][apl-client-library] Renderer into your project for presentation of [APL-based][apl-dev-site] Alexa visual content.

Use of the APL module requires that you also run a native application, like the AVS SDK [IPC Server Sample Application][ipc-server-app], which implements the [APLClient][apl-client] wrapper of [APLCore][apl-core-library] for communication with the client via the associated [AVS SDK IPC API][ipc-apl-api].

## Module Setup
You must separately install the [apl-client-js][apl-client-js] module before using this package.
- Clone [APL Client Library][apl-client-library] to a separate local directory.

- From `alexa-smart-screen-apl` module root directory run the following:
```
yarn add file:<path to apl-client-js> -D
```

## Basic Usage
```javascript
// Create and register APL IPC Components
const aplEvent : APLEvent = new APLEvent(client : IClient);
const aplHandler : APLHandler = new APLHandler(windowManager : IWindowManager, loggerFactory : ILoggerFactory);
...
// Directive handler registered with instance of Router
this.router.addNamespace(this.aplHandler);
...

// Create and register APL Windows
const windowConfig : IAPLWindowConfig = {...};
const aplWindowProps : IAPLWindowElementProps = {
    // Event handler registered with window
    aplEvent : aplEvent,
    ...
}

const aplWindow = APLWindowElementBuilder.createWindow(
      windowConfig,
      aplWindowProps,
      displayOrientation : DisplayOrientation
);
...
// Register APL windows with window manager to render APL documents
this.windowManager.addWindows([aplWindow]);
...

```



[apl-dev-site]: https://developer.amazon.com/docs/alexa/alexa-presentation-language/add-visuals-and-audio-to-your-skill.html
[apl-client-library]: https://github.com/alexa/apl-client-library
[apl-client]: https://github.com/alexa/apl-client-library/tree/main/APLClient
[apl-client-js]: https://github.com/alexa/apl-client-library/tree/main/apl-client-js
[apl-core-library]: https://github.com/alexa/apl-core-library
[ipc-apl-api]: https://developer.amazon.com/docs/alexa/avs-device-sdk/ipc-client-api-apl-client.html
[ipc-server-app]: https://developer.amazon.com/docs/alexa/avs-device-sdk/ipcserver-sample-app.html
