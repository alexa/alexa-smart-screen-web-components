# Alexa Smart Screen Live View Camera

The `alexa-smart-screen-live-view-camera` package provides components for rendering the output of [Alexa.Camera.LiveViewController](https://developer.amazon.com/docs/alexa/alexa-voice-service/alexa-liveviewcontroller.html) payloads, including RTC camera feeds and an [APL](https://developer.amazon.com/docs/alexa/alexa-presentation-language/apl-for-screen-devices.html) based GUI layer for camera control and interaction.

## Module Setup
You must separately install the `@amzn/rtcmedia_browser_adapter` module before using this package.

**Note:** There is stub implementation of this module declared in the [package.json](./package.json) file, but it only exists for node compilation purposes.

- Contact your Amazon associate for access to the actual `@amzn/rtcmedia_browser_adapter` module on the [AVS Dev Portal resources](https://developer.amazon.com/alexa/console/avs/previews/resources).

- From `alexa-smart-screen-live-view-camera` module root directory run the following to override the stub module:
```
yarn add file:<path to @amzn/rtcmedia_browser_adapter> -D
```

## Sample App Usage
You can enable the LiveViewCamera component in the [SampleApplication](../../samples/alexa-smart-screen-sample-app/README.md) build by using the [ENABLE_LIVE_VIEW_CAMERA](../../samples/alexa-smart-screen-sample-app/README.md#environment-properties) env property.



# LiveViewCamera Options Config Parameters
The Alexa LiveViewCamera package also provides a minimal config to allow device makers to control elements of the LiveView Camera GUI relative to their device integration.

The config is exposed via the [ILiveViewCameraUIOptionsConfig](./src/config/ILiveViewCameraUIOptionsConfig.ts) interface, and can also be defined as part of the [SampleApplication Config](../../samples/alexa-smart-screen-sample-app/README.md#sample-app-config-parameters).

```
{
    "physicalMicButtonHint": {
        "micButtonHintType": {{STRING}},
        "micButtonHintSource": {{STRING}}
    },
    "viewingDeviceMicUnsupported": {{BOOLEAN}}
}
```

| Parameter                   | Type                                                              | Required  | Description
| -------------               |-------                                                            |:-----:    | ----- |
| physicalMicButtonHint       | [Physical Mic Button Hint](#physical-mic-button-hint-parameters)  | No        | When included, a localized hint element will be rendered in the live view camera UI indicating to the user what physical button element must be pressed to interact with the camera mic.
| viewingDeviceMicUnsupported | boolean                                                           | No        | Optional flag, that when true, communicates to the live view camera UI that the viewing device does not support mic access for camera.  UI will not display any mic affordance or messaging.

### Physical Mic Button Hint Parameters
Config for live view camera physical mic button hint.

- Used by devices with physical mic ingress to display a hint on the live view camera UI for camera mic interactions.
- Hint string is defined and localized by the UI, and the hint element is incorporated inline.
- Hint element type can be either Text, [APL AVG](https://developer.amazon.com/docs/alexa/alexa-presentation-language/apl-avg-format.html), or bitmap Image.
- Hint format `Press <HINT ELEMENT> to talk to the camera` (localized for device Alexa locale).

| Parameter             | Type                                | Required  | Description
| -------------         |-------                              |:-----:    | ----- |
| micButtonHintType     | string</br>`'Text'`</br>`'Image'`</br>`'AVG'`  | No        | Property defining the 'type' of mic button hint element to render in the hint string.<br/><br/>`'Text'`: Use a string name for the mic button (developer must localize as required).<br/>`'Image'`: Use a 1:1 aspect ratio bitmap image for the mic button.<br/>`'AVG'`: Use a 1:1 aspect ratio [Alexa Vector Graphic](https://developer.amazon.com/docs/alexa/alexa-presentation-language/apl-avg-format.html) for the mic button.
| micButtonHintSource   | string                              | No        | String source value for the mic button element.  Varies by defined type.<br/><br/>`Text`: String name of the mic button (developer must localize as required).<br/>`Image`: URL to a 1:1 aspect ratio [bitmap image](https://developer.amazon.com/docs/alexa/alexa-presentation-language/apl-image.html#source-sources) source file for the mic button.  Must be hosted on a [CORS enabled](https://developer.amazon.com/docs/alexa/alexa-presentation-language/apl-support-for-your-skill.html#support-cors) CDN.<br/>`AVG`: URL to a 1:1 aspect ratio [Alexa Vector Graphic](https://developer.amazon.com/docs/alexa/alexa-presentation-language/apl-avg-format.html) source file for the mic button.  Must be hosted on a [CORS enabled](https://developer.amazon.com/docs/alexa/alexa-presentation-language/apl-support-for-your-skill.html#support-cors) CDN.
