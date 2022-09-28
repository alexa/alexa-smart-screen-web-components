# Alexa Smart Screen Common

The Alexa Smart Screen Common package provides a collection of core interfaces and components commonly used across other packages in the framework.

All other `@alexa-smart-screen` modules require `@alexa-smart-screen/common` as the base dependency.

See the [index.ts](./src/index.ts) for a complete list of all interfaces exposed through the common package.

## IPC Components

The `@alexa-smart-screen/common` library also provides 2 Inter-Process Communication (IPC) components.

| Component             | Description       | IPC Namespace
| -------------         |-------            | ----- |
**[FocusManager][focusManager]**           | IPC Components for handling messages that are used to acquire and release Alexa audio focus.     | [AudioFocusManager][focusManager-ipc]
**[Logger][logger]**           | IPC Components for handling messages that are used to wite logs to the native console.     | [Logger][logger-ipc]

[focusManager]: ./src/focus/ipcComponents/
[focusManager-ipc]: https://developer.amazon.com/docs/alexa/avs-device-sdk/ipc-client-api-audio-focus-manager.html
[logger]: ./src/logger/ipcComponents/
[logger-ipc]: https://developer.amazon.com/docs/alexa/avs-device-sdk/ipc-client-api-logger.html