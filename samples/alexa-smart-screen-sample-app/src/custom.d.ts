/// Indicates which logLevel to be set; if required
declare const LOG_LEVEL : LogLevel;

/// Indicates whether the SDK has built with WebSocket SSL Disabled.
declare const DISABLE_WEBSOCKET_SSL : boolean;

/// Indicates whether to enable the BinderClient instead of WebSocketClient for the Sample App.
declare const ENABLE_BINDER_CLIENT : boolean;

/// Indicates whether to transform keyboard events to have valid KeyCodes.
/// Only required for use of the Sample App in browsers that do not emit KeyCodes.
declare const ENABLE_TRANSFORM_KEY_CODES : boolean;

/// Indicates whether the LiveViewCamera component should be enabled in the Sample App.
declare const ENABLE_LIVE_VIEW_CAMERA : boolean;

/// Indicates whether to auto-initiate the LiveViewCamera UI in debugMode for testing when the Sample App loads.
declare const DEBUG_LIVE_VIEW_CAMERA_UI : boolean;