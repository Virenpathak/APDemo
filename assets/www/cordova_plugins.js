cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/com.sap.mp.cordova.plugins.logon/www/common/modules/MAFLogonCorePlugin.js",
        "id": "com.sap.mp.cordova.plugins.logon.LogonCore",
        "clobbers": [
            "sap.logon.Core"
        ]
    },
    {
        "file": "plugins/com.sap.mp.cordova.plugins.logon/www/common/modules/i18n.js",
        "id": "com.sap.mp.cordova.plugins.logon.LogonI18n",
        "clobbers": [
            "sap.logon.i18n"
        ]
    },
    {
        "file": "plugins/com.sap.mp.cordova.plugins.logon/www/common/modules/Utils.js",
        "id": "com.sap.mp.cordova.plugins.logon.LogonUtils",
        "clobbers": [
            "sap.logon.Utils"
        ]
    },
    {
        "file": "plugins/com.sap.mp.cordova.plugins.logon/www/common/modules/StaticScreens.js",
        "id": "com.sap.mp.cordova.plugins.logon.LogonStaticScreens",
        "clobbers": [
            "sap.logon.StaticScreens"
        ]
    },
    {
        "file": "plugins/com.sap.mp.cordova.plugins.logon/www/common/modules/DynamicScreens.js",
        "id": "com.sap.mp.cordova.plugins.logon.LogonDynamicScreens",
        "clobbers": [
            "sap.logon.DynamicScreens"
        ]
    },
    {
        "file": "plugins/com.sap.mp.cordova.plugins.logon/www/common/modules/LogonController.js",
        "id": "com.sap.mp.cordova.plugins.logon.Logon",
        "clobbers": [
            "sap.Logon"
        ]
    },
    {
        "file": "plugins/com.sap.mp.cordova.plugins.logon/www/common/modules/InAppBrowserUI.js",
        "id": "com.sap.mp.cordova.plugins.logon.LogonIabUi",
        "clobbers": [
            "sap.logon.IabUi"
        ]
    },
    {
        "file": "plugins/cordova-sqlite-storage/www/SQLitePlugin.js",
        "id": "cordova-sqlite-storage.SQLitePlugin",
        "clobbers": [
            "SQLitePlugin"
        ]
    },
    {
        "file": "plugins/com.sap.mp.cordova.plugins.push/www/push.js",
        "id": "com.sap.mp.cordova.plugins.push.Push",
        "clobbers": [
            "sap.Push"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.device/www/device.js",
        "id": "org.apache.cordova.device.device",
        "clobbers": [
            "device"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.inappbrowser/www/inappbrowser.js",
        "id": "org.apache.cordova.inappbrowser.inappbrowser",
        "clobbers": [
            "window.open"
        ]
    },
    {
        "file": "plugins/com.sap.mp.cordova.plugins.authproxy/www/authproxy.js",
        "id": "com.sap.mp.cordova.plugins.authproxy.AuthProxy",
        "clobbers": [
            "sap.AuthProxy"
        ]
    },
    {
        "file": "plugins/com.sap.mp.cordova.plugins.authproxy/android/modifyFormSubmit.js",
        "id": "com.sap.mp.cordova.plugins.authproxy.modifyFormSubmit",
        "runs": true
    },
    {
        "file": "plugins/com.sap.mp.cordova.plugins.logger/www/logger.js",
        "id": "com.sap.mp.cordova.plugins.logger.Logging",
        "clobbers": [
            "sap.Logger"
        ]
    },
    {
        "file": "plugins/com.sap.mp.cordova.plugins.settings/www/settings.js",
        "id": "com.sap.mp.cordova.plugins.settings.Settings",
        "clobbers": [
            "sap.Settings"
        ]
    },
    {
        "file": "plugins/com.sap.mp.cordova.plugins.settings/www/appsettings.js",
        "id": "com.sap.mp.cordova.plugins.settings.AppSettings",
        "merges": [
            "sap.Settings"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "com.sap.mp.cordova.plugins.logon": "3.5.3",
    "org.apache.cordova.console": "0.2.13",
    "cordova-sqlite-storage": "0.7.11-dev",
    "com.sap.mp.cordova.plugins.push": "3.5.3",
    "com.sap.mp.cordova.plugins.corelibs": "3.5.3",
    "org.apache.cordova.device": "0.3.0",
    "org.apache.cordova.inappbrowser": "0.3.4-patched",
    "com.sap.mp.cordova.plugins.authproxy": "3.5.3",
    "com.sap.mp.cordova.plugins.logger": "3.5.3",
    "com.sap.mp.cordova.plugins.settings": "3.5.3"
}
// BOTTOM OF METADATA
});