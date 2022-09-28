# Alexa Smart Screen Sample Display Cards

The Alexa Smart Screen Sample Display Cards package provides a complete implementation of [AVS Display Cards][avs-display-cards] for use in your web application.  It handles all rendering of the [TemplateRuntime][template-runtime] card payloads via an [Alexa-styled][alexa-design], [APL-based][tr-to-apl], Graphical User Interface (GUI) implementation that scale to a variety of display configurations.

The package handles rendering of all [TemplateRuntime][template-runtime-avs] payloads including:
- [RenderTemplate][render-template] card templates (for common Alexa visual responses like [Weather][weather] and [Lists][lists])
- [RenderPlayerInfo][render-player-info] card payloads (for audio playback UI control)
  - Additionally provides implementation of all associated [PlaybackController][playback-controller] events for reporting UI-based control of audio playback to the Alexa service.

This Sample Display Cards components are integrated by default in the [SampleApplication](../../samples/alexa-smart-screen-sample-app/README.md).

## Example Usage
```javascript
// Create instances of all required dependencies
const client : IClient; // instance of IClient
const router : IRouter; // instance of IRouter;
const loggerFactory : ILoggerFactory = new LoggerFactory();
const aplEvent : APLEvent = new APLEvent(client);
const windowManager : IWindowManager = new WindowManager(loggerFactory);
const windowManagerEvent : IWindowManagerEvent = new WindowManagerEvent(client, loggerFactory);

// Create an instance of the AVS DisplayCard Manager which handles TemplateRuntime IPC communication and invocation of APL-based card rendering.
const avsDisplayCardsManager : AVSDisplayCardsManager = new AVSDisplayCardsManager(
    loggerFactory,
    client,
    router
    aplEvent,
    windowManager
);

// Create and register an APL Window that can be used for RenderTemplate cards too.
// This is usually the same APL window defined for common APL content.
const aplWindowConfig : IAPLWindowConfig = {...};
const aplWindowProps : IAPLWindowElementProps = {
    // Event handler registered with window
    aplEvent : aplEvent,
    ...
};
const aplWindow = APLWindowElementBuilder.createWindow(
      aplWindowConfig,
      aplWindowProps,
      displayOrientation : DisplayOrientation
);
windowManager.addWindows([aplWindow]);

// Create an APL Window Config and Props for the PlayerInfo window.
const playerInfoWindowConfig : IAPLWindowConfig = {...};
const playerInfoProps : IAPLWindowElementProps = {
    // Event handler registered with window
    aplEvent : aplEvent,
    ...
};

// Init the Display Card APL Windows.
// Player Info Window will automatically be created and added to window manager.
avsDisplayCardsManager.initWindows(
    windowManager,
    aplWindow.getWindowId(),
    playerInfoWindowConfig,
    playerInfoProps,
    displayOrientation : DisplayOrientation
);

// Add windows to your root element by sorted z-order
this.windowManager.getWindowsByZOrder().forEach((window : IWindowElement) => {
    this.appendChild(window);
});

// Report windows to the Alexa client.
this.windowManagerEvent.windowInstancesReport(
    avsDisplayCardsManager.getPlayerInfoWindowId(),
    aplWindow.getWindowId(),
    windowManager.getWindowInstances()
);
```

[avs-display-cards]: https://developer.amazon.com/docs/alexa/alexa-voice-service/display-cards-overview.html
[alexa-design]: https://developer.amazon.com/docs/alexa/alexa-presentation-language/apl-alexa-packages-overview.html
[tr-to-apl]: ./src/displayCards/TemplateRuntimeToAPLResolver.ts
[template-runtime]: ../../packages/alexa-smart-screen-template-runtime/README.md
[template-runtime-avs]: https://developer.amazon.com/docs/alexa/alexa-voice-service/templateruntime.html
[render-template]: https://developer.amazon.com/docs/alexa/alexa-voice-service/templateruntime.html#rendertemplate
[render-player-info]: https://developer.amazon.com/docs/alexa/alexa-voice-service/templateruntime.html#renderplayerinfo
[playback-controller]: https://developer.amazon.com/docs/alexa/alexa-voice-service/playbackcontroller.html
[weather]: https://developer.amazon.com/docs/alexa/alexa-voice-service/templateruntime.html#weathertemplate
[lists]: https://developer.amazon.com/docs/alexa/alexa-voice-service/templateruntime.html#listtemplate1