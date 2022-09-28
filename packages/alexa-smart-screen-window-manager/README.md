# Alexa Smart Screen Window Manager

The Alexa Smart Screen Window Manager package provides base classes for implementing [Window Elements][window-element-interface], and a core [manager][window-manager-interface] for orchestrating display and interactions between windows in your web application.

## Window Elements
This package provides two abstract window element components, which serve as the basis for all window elements used in the framework:
- [BaseWindowElement][base-window-element]: Base class for any window element which implements default transitions, and can be [configured][window-config] for screen positions and shadow presentation.
- [DisplayWindowElement][display-window-element]: Extension of BaseWindowElement for implementing windows based on [Alexa Display Window][alexa-display-window] reported [visual characteristics][ipc-window-manager-visual-characteristics].

## Window Manager
The Window Manager component provided in the package helps orchestrate window display order, interactions, and state reporting for registered windows.

### Example Usage
```javascript
// Create an instance of the WindowManager for your application
const windowManager : IWindowManager = new WindowManager(loggerFactory : ILoggerFactory);

// Create window element instances as needed
const window1 : IWindowElement;
const window2 : IWindowElement;

// Register windows with the manager
windowManager.setWindows([window1, window2]);

// Create new window element instances as needed
const window3 : IWindowElement;
const window4 : IWindowElement;

// Add new windows to the manager
windowManager.addWindows([window3, window4]);

// Get the z-order sorted windows registered with the manager for insertion in your root HTMLElement
const windowElements : IWindowElement[] = windowManager.getWindowsByZOrder();

// Render an ID based window to view when needed - manager will orchestrate with other windows
windowManager.renderWindowToView(windowId : string);

// Hide an ID based window from view when needed - manager will orchestrate with other windows
windowManager.hideWindowFromView(windowId : string);

// Get window instance array for state reporting purposes
const windowInstances : IWindowInstance[] = windowManager.getWindowInstances();

// Use the update orientation function to indicate display orientation changes to all registered windows
windowManager.updateDisplayOrientationToWindows(DisplayOrientation.PORTRAIT);

// Use the update orientation function to indicate display size changes to all registered windows
windowManager.updateDisplaySizeToWindows(100, 100);
```

[window-element-interface]: ../alexa-smart-screen-common/src/window/IWindowElement.ts
[window-config]: ../alexa-smart-screen-common/src/window/IWindowConfig.ts
[window-manager-interface]: ../alexa-smart-screen-common/src/window/IWindowManager.ts
[base-window-element]: ./src/BaseWindowElement.ts
[display-window-element]: ./src/DisplayWindowElement.ts
[alexa-display-window]: https://developer.amazon.com/docs/alexa/alexa-voice-service/display-window.html
[ipc-window-manager-visual-characteristics]: https://developer.amazon.com/docs/alexa/avs-device-sdk/ipc-client-api-window-manager.html#setvisualcharacteristics