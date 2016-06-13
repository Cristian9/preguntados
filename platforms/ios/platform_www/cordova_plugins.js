cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/com.telerik.plugins.nativepagetransitions/www/NativePageTransitions.js",
        "id": "com.telerik.plugins.nativepagetransitions.NativePageTransitions",
        "pluginId": "com.telerik.plugins.nativepagetransitions",
        "clobbers": [
            "window.plugins.nativepagetransitions"
        ]
    },
    {
        "file": "plugins/cordova-plugin-native-transitions/www/nativetransitions.js",
        "id": "cordova-plugin-native-transitions.NativeTransitions",
        "pluginId": "cordova-plugin-native-transitions",
        "clobbers": [
            "nativetransitions"
        ]
    },
    {
        "file": "plugins/it.mobimentum.phonegapspinnerplugin/www/spinnerplugin.js",
        "id": "it.mobimentum.phonegapspinnerplugin.SpinnerPlugin",
        "pluginId": "it.mobimentum.phonegapspinnerplugin",
        "clobbers": [
            "window.spinnerplugin"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.2.2",
    "com.telerik.plugins.nativepagetransitions": "0.6.3",
    "cordova-plugin-native-transitions": "0.2.3",
    "it.mobimentum.phonegapspinnerplugin": "1.2.1"
}
// BOTTOM OF METADATA
});