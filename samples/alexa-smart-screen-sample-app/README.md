# Alexa Smart Screen Sample Web Application

The Alexa Smart Screen Sample Web Application is a configurable client used to demonstrate rendering of AVS Device SDK visual capabilities like APL and Cameras via [IPC communication][ipc-api] and interaction with the SDK [IPC Server Sample Application][ipc-server-sample-app].

## Running the App

- See the [Getting Started Guide](../../README.md#getting-started) for details on building the `alexa-smart-screen-web-components` library, including [running this sample web application](../../README.md#running-the-sample-application).
- Use the provided, build-time, [environment properties](#sample-app-environment-properties) to control the features and functionality of the Sample Web Application.
- Refer to the runtime [config specification](#sample-app-config-parameters) below for details on configuring the Sample Web Application to emulate different device setups.
- Ensure you are running the AVS SDK [IPC Server Sample Application][ipc-server-sample-app], to initialize the Sample Web Application via the [configureClient][ipc-configure-client] API call of the [SessionSetupHandler](../../packages/alexa-smart-screen-app-utils/src/sessionSetup/ipcComponents/SessionSetupHandler.ts).  This provides the App with the required config payload.


# Sample App Config Parameters
Definition of the parameters exposed for configuring the Sample Web Application.

You can find the Typescript interface for the configuration here: [ISampleAppConfigPayload](./src/config/ISampleAppConfigPayload.ts).

```
{
    "version" : "1.0.0",
    "description":"{{STRING}}",
    "mode":{{DeviceMode}},
    "displayMode": {{DisplayMode}},
    "audioInputInitiator":{{AudioInputInitiator}},
    "windows": [
        {{WindowConfig}},
        {{WindowConfig}},
        ...
    ]
    "defaultWindowId":"{{STRING}}",
    "deviceKeys": {{DeviceKeys}},
    "emulateDisplayDimensions":{{BOOLEAN}},
    "scaleToFill":{{BOOLEAN}},
    "liveViewCameraOptions":{{OBJECT}}
}
```

| Parameter                     | Type                                            | Required  | Default       | Description
| -------------                 |-------                                          |:-----:    | ------------- | ----- |
| version                       | string                                          | Yes       |  None         | Version of the Sample Web Application supported by this config.
| description                   | string                                          | No        |  None         | Description of device presented on the Sample Web Application `HomeScreen`.
| mode                          | string                                          | No        | `HUB`         | The expected [DeviceMode][apl-mode] of the device.<br/>Valid values: `'AUTO', 'HUB', 'MOBILE', 'PC', 'TV'`<br/><br/>**Note**: Currently ONLY `'HUB'` and `'TV'` are fully supported device modes. <br/>`'MOBILE'`, `'PC'`, and `'AUTO'` may produce unexpected results in APL content.
| displayMode                   | string                                          | No        | `FIXED`       | The expected DisplayMode of the device.<br/>`'FIXED'`: Display that does not change size or orientation (TV, or counter-top HUB) .<br/>`'ORIENTABLE'`: Display that can be rotated (Tablet, hand-held device).<br/>`'RESIZABLE'`: Display that can resize (Desktop application).
| audioInputInitiator           | string                                          | No        | `TAP`         | The [AudioInputInitiator][audio-input-initiator] type for the Sample Web Application.<br/>Valid values: `'PRESS_AND_HOLD', 'TAP', 'WAKEWORD'`
| windows                       | [Window Config](#window-config-parameters)  []  | Yes       | None          | An array of [Window Config](#window-config-parameters) configurations created in the Sample Web Application and reported in [Alexa.Display.Window.WindowState][display-window-state] for targeting and presentation of directives such as APL.  These windows can be targeted by ID.
| defaultWindowId               | string                                          | Yes       | None          | The ID of the [Window Config](#window-config-parameters) used as the default for visual responses.<br/>**Note**: the config for this window ID is also used as the config for the PlayerInfo window for audio playback UI presentation.
| deviceKeys                    | [Device Keys](#device-keys-parameters)          | Yes       | None          | The [Device Keys](#device-keys-parameters) config defines core function keys in the Sample Web Application relative to `talk, back, exit, captions, and do-not-disturb` key input.
| emulateDisplayDimensions      | boolean                                         | No        | `false`       | If true, the Sample Web Application's root container is explicitly sized to the device's display dimensions defined in [Alexa.Display][display-characteristics] characteristics.
| scaleToFill                   | boolean                                         | No        | `false`       | If true the Sample Web Applications's root container is uniformly scaled to fit within the supplied browser window.
| liveViewCameraOptions         | [LiveViewCameraOptions](../../packages/alexa-smart-screen-live-view-camera/README.md#liveviewcamera-options-config-parameters)                                      | No        | None          | Optional config for the Live View Camera UI.</br>**Only relevant to device makers integrating Live View Cameras**.

## Window Config Parameters
Parameters for creating windows in the Sample Client Application and configuring any additional runtime features of the clients, like APL, that may be running in the window.
```
{
    "id": "{{STRING}}",
    "displayWindowConfig": {{DisplayWindowConfig}},
    "supportedInterfaces: [
        {{STRING}},
        ...
    ],
    "zOrderIndex": {{NUMBER}},
    "windowPosition": {{STRING}},
    "aplRendererParameters": {{AplRendererParameters}}
}
```

| Parameter             | Type                                                              | Required  | Default   | Description
| -------------         |-------                                                            |:-----:    | -----     |----- |
| id                    | string                                                            | Yes       | None      | A unique identifier for the window instance used to target content to this window.
| displayWindowConfig   | [DisplayWindowConfig](#display-window-configuration-parameters)   | No        | None      | Optional configuration used if the window should be based on an [Alexa.Display.Window][display-window] definition.
| supportedInterfaces   | string[]                                                          | Yes       | None      | An array of strings representing the [AVS Interface][avs-interface] for visual presentations supported by the window.
| zOrderIndex           | number                                                            | Yes       | None      | The relative z-order index for the window.<br/><br/>***Final Z-Order Determined by `WindowManager`.***
| windowPosition        | string                                                            | No        | `center`  | The screen position of the window.<br/>Valid values are `'center', 'right', 'left', 'top', 'bottom'`.<br/><br/>Overridden by any `windowPosition` defined in [Display Window Configuration](#display-window-configuration-parameters).
| aplRendererParameters | [APL Renderer Parameters](#apl-renderer-parameters)               | No        | None      | Parameters for APL renderer supported by the window instance. Used only if window supports [Alexa.Presentation.APL][apl-api].

### Display Window Configuration Parameters
Parameters for Display Window Configurations based on [visualCharacteristics][visual-characteristics].
```
{
    "templateId": "{{STRING}}",
    "configurations":   {
        "landscape": {
            "sizeConfigurationId": "{{STRING}}",
            "interactionMode": "{{STRING}}",
            "position": "{{STRING}}"
        },
        "portrait": {
            "sizeConfigurationId": "{{STRING}}",
            "interactionMode": "{{STRING}}",
            "position": "{{STRING}}"
        }
    }
}
```

| Parameter             | Type                                                                      | Required      | Description
| -------------         |-------                                                                    |:-----:         |----- |
| templateId            | string                                                                    | Yes           | Identifies the window template in the `Alexa.Display.Window` capability which is the basis for this configuration.
| configurations        | [Orientation Configurations](#display-window-orientation-configurations)  | Yes           | Template orientation definitions for this display window configuration.

#### Display Window Orientation Configurations
Parameters for display window orientations.
Only one orientation definition is required.
**Both are only required for `ORIENTABLE` display types.**

| Parameter             | Type                                                                  | Required                              | Description
| -------------         |-------                                                                |-----                                |----- |
| landscape             | [Window Instance Configuration](#display-window-instance-parameters)  | No - unless `portrait` **not** defined **AND** display type is **not** `ORIENTABLE`   | Optional [Window Instance Configuration](#display-window-instance-parameters) for `landscape` orientation.
| portrait              | [Window Instance Configuration](#display-window-instance-parameters)  | No - unless `landscape` **not** defined **AND** display type is **not** `ORIENTABLE`   | Optional [Window Instance Configuration](#display-window-instance-parameters) for `portrait` orientation.


##### Display Window Instance Parameters
Configurations for window template instances.

| Parameter             | Type      | Required      | Default   | Description
| -------------         |-------    |:-----:        | -----     |----- |
| sizeConfigurationId   | string    | Yes           | None      | Indicates the active size configuration of the window as defined in `Alexa.Display.Window`.
| interactionMode       | string    | Yes           | None      | An "id" value representing the current `Alexa.InteractionMode` of the window.
| position              | string    | No            | None      | The optional screen position to use for this window instance configuration.<br/>Valid values are `'center', 'right', 'left', 'top', 'bottom'`.

## APL Renderer Parameters
Parameters for APL Renderer supported by a window instance.
```
{
    "theme": "{{STRING}}",
    "allowOpenUrl": {{BOOLEAN}},
    "animationQuality": "{{STRING}},
    "supportedExtensions": [
        {{STRING}},
        ...
    ]
}
```

| Parameter             | Type      | Required      | Default   | Description
| -------------         |-------    |:-----:        | -----     |----- |
| theme                 | string    | No            | `dark`    | Represents the preferred basic color scheme of the window.  Content developers may optionally use this value for [styling their visual response][apl-theme].<br/>Valid values: `'light'` and `'dark'`.
| allowOpenUrl          | boolean   | No            | `false`   | Indicates if the window supports the APL [OpenUrlCommand][apl-open-url].
| animationQuality      | string    | No            | `normal`  | Indicates the level of [AnimationQuality][apl-animation] support in the window.<br/>Valid Values: `none = 0, slow = 1, normal = 2`.
| supportedExtensions   | string[]  | No            | `null`    | An optional array of [APL extension uri's][apl-extensions] supported in the window instance.  Note that any extensions declared here must have been built with the APLClient extensions framework to be available to the APL runtime for the window.

## Device Keys Parameters
Config for device input keys.

| Parameter             | Type                                  | Required  | Description
| -------------         |-------                                |:-----:    | ----- |
| talkKey               | [Device Key](#device-key-parameters)  | Yes       | Key used in the Sample Web App to send a [recognizeSpeechRequestEvent](../../packages/alexa-smart-screen-app-utils/src/interactionManager/ipcComponents/IInteractionManagerEvent.ts) event to the SDK with the `AudioInputInitiator` type defined in the [Config](#sample-app-config-parameters).
| backKey               | [Device Key](#device-key-parameters)  | Yes       | Key used in the Sample Web App to send a [navigationEvent][navigation-event] to the SDK with event type `BACK`.
| exitKey               | [Device Key](#device-key-parameters)  | Yes       | Key used in the Sample Web App to send a [navigationEvent][navigation-event] to the SDK with event type `EXIT`.
| toggleCaptionsKey     | [Device Key](#device-key-parameters)  | Yes       | Key used in the Sample Web App to send a [captionsStateChanged](../../packages/alexa-smart-screen-app-utils/src/captions/ipcComponents/ICaptionsEvent.ts) Event to the SDK.
| toggleDoNotDisturbKey | [Device Key](#device-key-parameters)  | Yes       | Key used in the Sample Web App to send a [doNotDisturbStateChanged](../../packages/alexa-smart-screen-app-utils/src/doNotDisturb/ipcComponents/IDoNotDisturbEvent.ts) Event to the SDK.

### Device Key Parameters
Config for individual device key.

| Parameter             | Type      | Required  | Description
| -------------         |-------    |:-----:    | ----- |
| code                  | string    | Yes       | Property representing a physical key on the keyboard, following the [KeyboardEvent.code][keyboard-code] web standard.
| keyCode               | number    | Yes       | Property representing a system and implementation dependent numerical code identifying the unmodified value of the pressed key, following the [KeyboardEvent.keyCode][key-code] web standard.
| key                   | string    | Yes       | Property representing the value of the key pressed by the user, following the [KeyboardEvent.key][keyboard-key] web standard.

# Sample App Environment Properties
In addition to [runtime configuration](#sample-app-config-parameters), the Sample Web Application also exposes a number of build-time `ENV` properties which can be used to control functionality and features within the application.

All `ENV` properties can be modified when building the Sample Web Application using the following command:
```
cd <path-to-repo-clone>/alexa-smart-screen-web-components/samples/alexa-smart-screen-sample-app

yarn build --env <ENV_PROP>=<ENV_PROP_VALUE> --env <ENV_PROP>=<ENV_PROP_VALUE> ...
```
```
example for changing log level:

yarn build --env LOG_LEVEL='DEBUG'
```
## Environment Properties
Please refer to the [env configuration file](./src/custom.d.ts) for typescript definitions.

| Property                      | Type      | Default   | Description
| -------------                 |-------    | -----     |----- |
| `LOG_LEVEL`                   | [LogLevel][log-level] | `WARN`    | Sets the log level for logs written to the server app from the Sample Web Application.<br/>Valid values: `'DEBUG'`, `'INFO'`, `'WARN'`, and `'ERROR'`.
| `DISABLE_WEBSOCKET_SSL`       | boolean   | `true`    | Sets the SSL security property for the websocket server - if used.
| `ENABLE_BINDER_CLIENT`        | boolean   | `false`   | When `true` builds the Sample Web Application with the [binder client][binder-client] instead of the [web socket client][web-socket] for message communication.
| `ENABLE_TRANSFORM_KEY_CODES`  | boolean   | `false`   | Sets whether to transform keyboard events to have valid [KeyCodes][key-code].<br/><br/>Only required for use of the Sample Web Application in browsers that do not emit [KeyCodes][key-code].
| `ENABLE_LIVE_VIEW_CAMERA`     | boolean   | `false`   | When `true` the Sample Web Application is built with [Live View Camera][live-view-camera] features enabled.<br/><br/>**Note: The SDK IPC Application must also be built with Live View Camera enabled to use this feature.**
| `DEBUG_LIVE_VIEW_CAMERA_UI`   | boolean   | `false`   | When `true` (and `ENABLE_LIVE_VIEW_CAMERA=true`), the Sample Web Application auto-loads the live view camera [sample payload][live-view-sample] UI on init for debugging purposes.

[apl-animation]: https://developer.amazon.com/docs/alexa-presentation-language/apl-data-binding-evaluation.html#animation
[apl-api]: https://developer.amazon.com/docs/alexa/alexa-voice-service/presentation-apl.html
[apl-extensions]: https://developer.amazon.com/docs/alexa/alexa-presentation-language/apl-extensions.html
[apl-mode]: https://developer.amazon.com/docs/alexa-presentation-language/apl-viewport-property.html#viewport_mode_property
[apl-open-url]: https://developer.amazon.com/docs/alexa-presentation-language/apl-standard-commands.html#open_url_command
[apl-theme]: https://developer.amazon.com/docs/alexa-presentation-language/apl-viewport-property.html#theme
[audio-input-initiator]: https://developer.amazon.com/docs/alexa/alexa-voice-service/speechrecognizer.html#recognize
[avs-interface]: https://developer.amazon.com/docs/alexa/alexa-voice-service/avs-api-ref-overview.html
[binder-client]: ../../packages/alexa-smart-screen-binder-client/README.md
[display-characteristics]: https://developer.amazon.com/docs/alexa/alexa-voice-service/display.html#configuration-parameters
[display-window]: https://developer.amazon.com/docs/alexa/alexa-voice-service/display-window.html
[display-window-state]: https://developer.amazon.com/docs/alexa/alexa-voice-service/display-window.html#windowstate-context-object
[ipc-api]: https://developer.amazon.com/docs/alexa/avs-device-sdk/ipc-client-api-framework-reference.html
[ipc-configure-client]: https://developer.amazon.com/docs/alexa/avs-device-sdk/ipc-client-api-session-setup.html#configureclient
[ipc-server-sample-app]: https://developer.amazon.com/docs/alexa/avs-device-sdk/ipcserver-sample-app.html
[keyboard-code]: https://developer.mozilla.org/docs/Web/API/KeyboardEvent/code
[keyboard-key]: https://developer.mozilla.org/docs/Web/API/KeyboardEvent/key
[key-code]: https://developer.mozilla.org/docs/Web/API/KeyboardEvent/keyCode
[live-view-camera]: ../../packages/alexa-smart-screen-live-view-camera/README.md
[live-view-sample]: ../../packages/alexa-smart-screen-live-view-camera/src/debug/SampleStartLiveViewPayload.ts
[log-level]: ../../packages/alexa-smart-screen-common/src/logger/LogLevel.ts
[navigation-event]: ../../packages/alexa-smart-screen-app-utils/src/interactionManager/constants/NavigationEvent.ts
[visual-characteristics]: https://developer.amazon.com/docs/alexa/alexa-voice-service/avs-apl-overview.html#alexa-apis-for-publishing-device-characteristics
[web-socket]: ../../packages/alexa-smart-screen-web-socket/README.md