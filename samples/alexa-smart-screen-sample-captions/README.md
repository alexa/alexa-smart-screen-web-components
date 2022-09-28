# Alexa Smart Screen Sample Captions

The Alexa Smart Screen Sample Captions package provides a single component for rendering [AlexaCaptions][alexa-captions] payloads within your web application.  Alexa Captions are provided for most [Speak][speak-directives] directives, but are only parsed by the SDK if [explicitly enabled][build-captions] in your build.

The [CaptionsRenderer][captions-renderer] handles:
- Timed rendering of the Alexa Captions payload to an overlay box at the bottom of your display.
- Left-to-Right or Right-to-Left text rendering based on locale.

Though the renderer provides no configuration options, the component can be used in your own applications as needed for rendering Alexa Captions output.  To do so it requires an implementation of the [CaptionsHandler][captions-handler] IPC component from `alexa-smart-screen-app-utils`.

This Sample Captions renderer is integrated by default in the [SampleApplication](../../samples/alexa-smart-screen-sample-app/README.md).

## Example Usage
```javascript
// Create an instance of the IPC CaptionsHandler
// This must be registered with the Router
const captionsHandler : ICaptionsHandler = new CaptionsHandler(loggerFactory : ILoggerFactory);

// Create an instance of the Captions Renderer, providing the captions handler
const captionsRenderer : CaptionsRenderer = new CaptionsRenderer(this.captionsHandler);

// Register with LocaleManager to ensure proper captions text orientation for locale
LocaleManager.getInstance().getObserverManager().addObserver(this.captionsRenderer);

// Add the captions renderer to the top of your DOM to ensure it renders over everything else
node.appendChild(this.captionsRenderer); 
```

[alexa-captions]: https://developer.amazon.com/docs/alexa/avs-device-sdk/ipc-client-api-alexa-captions.html
[build-captions]: https://developer.amazon.com/docs/alexa/avs-device-sdk/captions.html
[captions-handler]: ../../packages/alexa-smart-screen-app-utils/src/captions/ipcComponents/CaptionsHandler.ts
[captions-renderer]: ./src/CaptionsRenderer.ts
[speak-directives]: ../../packages/alexa-smart-screen-common/src/alexaState/IAttentionSystemRenderer.ts