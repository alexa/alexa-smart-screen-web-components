<p align="center">
  <a href="https://developer.amazon.com/alexa">
    <img src="./samples/alexa-smart-screen-sample-app/src/assets/Alexa_Logo_RGB_BLUE.png" alt="Alexa-Smart-Screen-Web-Components" width="120px" height="76px" />
  </a>
</p>
<h1 align="center">Alexa Smart Screen Web Components</h1>
<p align="center">
<i>Alexa Smart Screen Web Components is a node.js library for smart screen device makers building web applications that interact with the <a href="https://github.com/alexa/avs-device-sdk">AVS Device SDK</a>.</i>
<p align="center">
    <a href="https://github.com/alexa/alexa-smart-screen-web-components/tree/v1.0.0" alt="version">
        <img src="https://img.shields.io/badge/stable%20version-1.0.0-brightgreen" /></a>
    <a href="https://github.com/alexa/avs-device-sdk/tree/v3.0.0" alt="DeviceSDK">
        <img src="https://img.shields.io/badge/avs%20device%20sdk-3.0.0-blueviolet" /></a>
    <a href="https://github.com/alexa/apl-client-library/tree/v2022.1.1" alt="APLClientLibrary">
        <img src="https://img.shields.io/badge/apl%20client%20library-2022.1.1-blue" /></a>
    <a href="https://github.com/alexa/alexa-smart-screen-web-components/issues" alt="issues">
        <img src="https://img.shields.io/github/issues/alexa/alexa-smart-screen-web-components" /></a>
</p>
<p align="center" href="">
  <a href="https://developer.amazon.com/docs/alexa/web-components/wc-about-web-components.html">Learn More >></a>
</p>
<h1></h1>

## Overview

`alexa-smart-screen-web-components` is a [lerna based][lerna] monorepo leveraging [yarn workspaces][yarn-workspaces] that provides a component collection which makes it easy and fast for [AVS SDK][avs-sdk] based Alexa Device Makers to create and extend web applications that implement a variety of Alexa features for smart screen devices.

It includes 2 yarn workspaces with the following component collections:
- [packages](./packages/) - common stable features and components with documented surface interfaces used across all other packages in the library.
- [samples](./samples/) - sample implementations of features in the library that serve as a reference for how device makers may leverage them (these are only examples, not intended for production use).

## Features

### Alexa Capabilities
The current component collection supports the following Alexa Smart Screen capabilities:
- [APL (Alexa Presentation Language)][apl] based rendering of Alexa visual responses via the [APL Client Library][apl-client-libray]
- [AVS Display Cards][avs-display-cards] rendering, including Audio Playback UI supported through [TemplateRuntime.RenderPlayerInfo][render-player-info]
- [Smart Home and Security Cameras][live-view-controller] - (To request access for the cameras feature, please get in touch with your Amazon point of contact.)
- Alexa Captions for speech responses, and [Do Not Disturb][do-not-disturb] mode.

### IPC Components
As all web applications that interact with the AVS Device SDK must leverage an IPC (Inter-Process Communication) protocol, the `alexa-smart-screen-web-components` library provides a number of packages that simplify the implementation, including:

- Common interfaces for defining an [IPC Client](./packages/alexa-smart-screen-common/src/client/).
- A generalized [Router](./packages/alexa-smart-screen-router/README.md) for handling all routing of inbound/outbound messages over your chosen IPC protocol .
- A standard implementation of a [Web Socket Client](./packages/alexa-smart-screen-web-socket/README.md) for communication over a [web socket server][web-socket-server].
- An alternative implementation of a [Binder Client](./packages/alexa-smart-screen-binder-client/README.md) that binds connection to a function of browser window.
- A complete collection of event and directive handlers for all [AVS SDK IPC Client Framework API's][avs-icf].

### Sample Application
In addition to core capability and component packages, `alexa-smart-screen-web-components` also provides a robust, configurable [Sample Web Application](./samples/alexa-smart-screen-sample-app/README.md) which demonstrates the full use of all features and components in the library.

The Sample Application is intended for direct use with the AVS SDK [IPC Server Sample Application][avs-ipc-sample-application], as the IPC Client.

## Getting Started
### Prerequisites

- Install [Node.js] which includes [Node Package Manager][npm].
- Install [yarn] via [npm].
- Clone [APL Client Library][apl-client-libray].

### Build Steps
Clone the `alexa-smart-screen-web-components` and `apl-client-library` repos:
```
git clone https://github.com/alexa/alexa-smart-screen-web-components.git
git clone https://github.com/alexa/apl-client-library.git
```
Install local [APL Client JS][apl-client-js] module in the associated `alexa-smart-screen-apl` module:
```
cd <path-to-repo-clone>/alexa-smart-screen-web-components/packages/alexa-smart-screen-apl

yarn add file: <path-to-apl-client-library-repo-clone>/apl-client-js -D
```
Build the monorepo and all packages:

```
cd <path-to-repo-clone>/alexa-smart-screen-web-components

yarn install
yarn build
```

### Running the Sample Application
To use the `alexa-smart-screen-web-components` Sample Application, you must first complete setup of the AVS SDK [IPC Server Sample Application][avs-ipc-sample-application] for your preferred platform.

Once that client is built and running on your device, run the following to open the Sample Web Application in your chromium-compliant browser and initiate a connection to the server app:
```
cd <path-to-repo-clone>/alexa-smart-screen-web-components
open ./samples/alexa-smart-screen-sample-app/dist/index.html
```
### Creating Projects
To make it easier to start new Node.js projects leveraging the `alexa-smart-screen-web-components` modules, the package provides a CLI for generating projects from templates in the repo:

```
cd <path-to-repo-clone>/alexa-smart-screen-web-components
yarn createProject
```
This initiates a command-line interface for selecting a project template and naming your new project:
```
#################################################################################
#       Welcome to the Alexa Smart Screen Web Components Project Creator!       #
#        Use the following command-line prompts to start a new project.         #
#################################################################################

? What project template would you like to use: (Use arrow keys)
  alexa-smart-screen-bare-ts 
❯ alexa-smart-screen-sample-app-copy 
```
```
? What project template would you like to use: alexa-smart-screen-sample-app-copy
? Project name: my-new-project

###################################
#       Configuring Project       #
###################################
...
```
The tool copies the requested project template and its dependencies, installs all required `alexa-smart-screen` modules via local path, and builds the new project parallel to the `alexa-smart-screen-web-components` repo path.

**Project Templates**

The following template projects are provided:

| Template                            | Description   | Recommended use case
| -------------                       |-----          |----- |
| `alexa-smart-screen-sample-app-copy`| Copy of the [alexa-smart-screen-sample-app](./samples/alexa-smart-screen-sample-app/README.md) as a standalone project leveraging all components from both the [packages](./packages/) and [samples](./samples/) workspaces. | Recommended for developers who want to utilize the provided sample application as the starting point for their product.
| `alexa-smart-screen-bare-ts`| Bare typescript project setup including only the modules from the [packages](./packages/) workspace. | Recommended for developers who want to implement their own application design based on `alexa-smart-screen-web-components`.

### Locally Installing Modules
Additionally, any of the **built** `alexa-smart-screen-web-component` modules can be installed in your local Node.js project manually using `yarn`:

**Note: You must first complete [Build Steps](#build-steps) for the repo root.**
```
cd <your-node-project>
yarn add file: <path-to-repo-clone>/alexa-smart-screen-web-components/packages/alexa-smart-screen-apl -D
``` 
Example output in your project's `package.json` file:
```
 "devDependencies": {
  "@alexa-smart-screen/apl": "<path-to-repo-clone>/alexa-smart-screen-web-components/packages/alexa-smart-screen-apl",
  ...
 }
```

### Cleaning
To clean up dependencies before a rebuild, run the following commands:

```shell
cd <path-to-repo-clone>/alexa-smart-screen-web-components
yarn clean:all
```

[apl]: https://developer.amazon.com/docs/alexa/alexa-presentation-language/apl-for-screen-devices.html
[apl-client-libray]: https://github.com/alexa/apl-client-library
[apl-client-js]: https://github.com/alexa/apl-client-library/tree/main/apl-client-js
[avs-display-cards]: https://developer.amazon.com/docs/alexa/alexa-voice-service/display-cards-overview.html
[avs-icf]: https://developer.amazon.com/docs/alexa/avs-device-sdk/ipc-client-api-framework-reference.html
[avs-ipc-sample-application]: https://developer.amazon.com/docs/alexa/avs-device-sdk/ipcserver-sample-app.html
[avs-sdk]: https://github.com/alexa/avs-device-sdk
[do-not-disturb]: https://developer.amazon.com/docs/alexa/alexa-voice-service/donotdisturb.html
[lerna]: https://lerna.js.org/
[live-view-controller]: https://developer.amazon.com/docs/alexa/alexa-voice-service/alexa-liveviewcontroller.html
[node.js]: https://nodejs.org/
[npm]: https://www.npmjs.com/get-npm
[render-player-info]: https://developer.amazon.com/docs/alexa/alexa-voice-service/templateruntime.html#renderplayerinfo
[web-socket-server]: https://developer.mozilla.org/docs/Web/API/WebSockets_API/Writing_WebSocket_servers
[yarn]: https://classic.yarnpkg.com
[yarn-workspaces]: https://classic.yarnpkg.com/lang/en/docs/workspaces/
