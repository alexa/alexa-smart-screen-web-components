# Alexa Smart Screen App Utils

The Alexa Smart Screen App Utils provides implementations of core components commonly used in Alexa App integrations.

You can find example implementations of the all following components in the [SampleApplication](../../samples/alexa-smart-screen-sample-app/README.md).

## Components

| Component             | Description       | IPC Namespace
| -------------         |-------            | ----- |
**[VersionManager][versionManager]**      | Provides an implementation of the [IVersionManager](../alexa-smart-screen-common/src/versionManager/IVersionManager.ts) interface for handling IPC namespaces versions in your application.  | N/A
**[KeyBinder][keyBinder]**           | Util for binding the [IDeviceKey](src/keyBinder/IDeviceKeys.ts) config to key events in your application.     | N/A
**[SessionSetup][sessionSetup]**           | IPC Components for handling messages that are used to configure your client application.     | [SessionSetup][sessionSetup-ipc]
**[System][system]**           | IPC Components for handling messages that are used to control system configurations of your Alexa client like locale and [CBL authorization][cbl-auth].     | [System][system-ipc]
**[Captions][captions]**           | IPC Components for handling messages used to render Alexa Captions.     | [AlexaCaptions][captions-ipc]
**[DoNotDisturb][doNotDisturb]**           | IPC Components for handling messages that are used to control the [DoNotDisturb][doNotDisturb-api] state of your Alexa client.     | [DoNotDisturb][doNotDisturb-ipc]
**[InteractionManager][interactionManager]**           | IPC Components for handling messages that are used to report GUI interactions in your client and to initiate [Speech Recognition][speech-recognition].     | [InteractionManager][interactionManager-ipc]

[captions]: ./src/captions/ipcComponents/
[captions-ipc]: https://developer.amazon.com/docs/alexa/avs-device-sdk/ipc-client-api-alexa-captions.html
[cbl-auth]: https://developer.amazon.com/docs/alexa/alexa-voice-service/setup-authentication.html#code-based-screens
[doNotDisturb]: ./src/doNotDisturb/ipcComponents/
[doNotDisturb-api]: https://developer.amazon.com/docs/alexa/alexa-voice-service/donotdisturb.html
[doNotDisturb-ipc]: https://developer.amazon.com/docs/alexa/avs-device-sdk/ipc-client-api-do-not-disturb.html
[interactionManager]: ./src/interactionManager/ipcComponents/
[interactionManager-ipc]: https://developer.amazon.com/docs/alexa/avs-device-sdk/ipc-client-api-interaction-manager.html
[keyBinder]: ./src/keyBinder/KeyBinder.ts
[sessionSetup]: ./src/sessionSetup/ipcComponents/
[sessionSetup-ipc]: https://developer.amazon.com/docs/alexa/avs-device-sdk/ipc-client-api-session-setup.html
[speech-recognition]: https://developer.amazon.com/docs/alexa/alexa-voice-service/speechrecognizer.html#recognize
[system]: ./src/system/ipcComponents/
[system-api]: https://developer.amazon.com/docs/alexa/alexa-voice-service/system.html
[system-ipc]: https://developer.amazon.com/docs/alexa/avs-device-sdk/ipc-client-api-system.html
[versionManager]: ./src/versionManager/VersionManager.ts
