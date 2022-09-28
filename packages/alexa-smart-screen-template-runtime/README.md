# Alexa Smart Screen Template Runtime

The Alexa Smart Screen Template Runtime package provides Inter-Process Communication (IPC) components to allow your web application to handle the payloads of the [AVS TemplateRuntime API][avs-template-runtime] for rendering of [AVS DisplayCards][avs-display-cards].

When the Alexa client receives TemplateRuntime directives for associated Alexa responses, this package provides handlers for the [IPC directives][template-runtime-ipc] sent from the server for the rendering and clearing of both [RenderTemplate][render-template] and [RenderPlayerInfo][render-player-info] payloads.

## Usage Guide

- This package does not handle the rendering of TemplateRuntime payloads. It just provides handlers for routing the visual metadata to a component in your application that implements GUI bound to this data.

- The [alexa-smart-screen-sample-display-cards][sample-display-cards] package provides a sample implementation of Display Cards GUI for the TemplateRuntime payloads (including a full featured Audio Player UI) which you can use in your application.
- You are also free to build custom GUI from these payloads to align with your device's styling requirements.




[avs-template-runtime]: https://developer.amazon.com/docs/alexa/alexa-voice-service/templateruntime.html
[avs-display-cards]: https://developer.amazon.com/docs/alexa/alexa-voice-service/display-cards-overview.html
[render-template]: https://developer.amazon.com/docs/alexa/alexa-voice-service/templateruntime.html#rendertemplate
[render-player-info]: https://developer.amazon.com/docs/alexa/alexa-voice-service/templateruntime.html#renderplayerinfo
[template-runtime-ipc]: https://developer.amazon.com/docs/alexa/avs-device-sdk/ipc-client-api-template-runtime.html#directives
[sample-display-cards]: ../../samples/alexa-smart-screen-sample-display-cards/README.md