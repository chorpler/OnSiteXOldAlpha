# Plugin adding list
- ~~**cordova-plugin-uniquedeviceid**~~
- ~~**cordova-plugin-app-update**~~
- ~~cordova-android-support-gradle-release~~
- ~~cordova-plugin-console~~
- cordova-plugin-mauron85-background-geolocation
- de.appplant.cordova.plugin.local-notification
- cordova-plugin-fingerprint-aio
- cordova-plugin-sqlite-2
- cordova-sqlite-storage
- cordova-sqlite-ext



| Status  | Plugin                                         |
|---|------------------------------------------------------|
|  cordova-plugin-whitelist            |   ✔️   | 
|  cordova-plugin-splashscreen         |   ✔️   | 
|  cordova-plugin-device               |   ✔️   | 
|  ionic-plugin-keyboard               |   ✔️   | 
|  cordova-plugin-secure-storage       |   ✔️   | 
|  cordova-plugin-statusbar            |   ✔️   | 
|  cordova-plugin-dialogs              |   ✔️   | 
|  cordova-plugin-app-version          |   ✔️   | 
|  cordova-plugin-network-information  |   ✔️   | 
|  cordova-plugin-spinner-dialog       |   ✔️   | 
|  cordova-plugin-nativeaudio          |   ✔️   | 
|  cordova-plugin-nativestorage        |   ✔️   | 
|  cordova-open-native-settings        |   ✔️   | 
|  cordova-plugin-vibration            |   ✔️   | 
|  cordova-plugin-badge                |   ✔️   | 
|  pouchdb-adapter-cordova-sqlite      |   ✔️   |
|  cordova-sqlite-evcore-extbuild-free |   ✔️   |





# Plugins from config.xml for OnSiteX
```
<plugin name="cordova-plugin-sqlite-2" spec="^1.0.4" />
<plugin name="cordova-plugin-secure-storage" spec="^2.6.8" />
<plugin name="cordova-plugin-console" spec="^1.0.7" />
<plugin name="cordova-plugin-device" spec="^1.1.6" />
<plugin name="cordova-plugin-splashscreen" spec="^4.0.3" />
<plugin name="cordova-plugin-statusbar" spec="^2.2.3" />
<plugin name="cordova-plugin-whitelist" spec="^1.3.2" />
<plugin name="ionic-plugin-keyboard" spec="^2.2.1" />
<plugin name="cordova-plugin-dialogs" spec="^1.3.3" />
<plugin name="cordova-plugin-spinner-dialog" spec="^1.3.1" />
<plugin name="cordova-plugin-network-information" spec="^1.3.3" />
<plugin name="de.appplant.cordova.plugin.local-notification" spec="^0.8.5" />
<plugin name="cordova-plugin-uniquedeviceid" spec="^1.3.2" />
<plugin name="cordova-android-support-gradle-release" spec="0.0.2" />
<plugin name="cordova-plugin-app-version" spec="^0.1.9" />
<plugin name="cordova-plugin-nativeaudio" spec="^3.0.9" />
<plugin name="cordova-plugin-app-update" spec="^1.3.9" />
<plugin name="cordova-plugin-badge" spec="^0.8.1" />
<plugin name="cordova-plugin-nativestorage" spec="^2.2.2" />
<plugin name="cordova-plugin-mauron85-background-geolocation" spec="^2.3.3">
    <variable name="GOOGLE_PLAY_SERVICES_VERSION" value="+" />
    <variable name="ICON" value="@mipmap/icon" />
    <variable name="SMALL_ICON" value="@mipmap/icon" />
    <variable name="ACCOUNT_NAME" value="@string/app_name" />
    <variable name="ACCOUNT_LABEL" value="@string/app_name" />
    <variable name="ACCOUNT_TYPE" value="$PACKAGE_NAME.account" />
    <variable name="CONTENT_AUTHORITY" value="$PACKAGE_NAME" />
</plugin>
<plugin name="cordova-open-native-settings" spec="^1.4.1" />
<plugin name="cordova-plugin-vibration" spec="^3.0.1" />
```



# Master Plugins List from config.xml for OnSiteX
```
<plugin name="cordova-plugin-sqlite-2" spec="^1.0.4" />
<plugin name="cordova-plugin-secure-storage" spec="^2.6.8" />
<plugin name="cordova-plugin-console" spec="^1.0.7" />
<plugin name="cordova-plugin-device" spec="^1.1.6" />
<plugin name="cordova-plugin-splashscreen" spec="^4.0.3" />
<plugin name="cordova-plugin-statusbar" spec="^2.2.3" />
<plugin name="cordova-plugin-whitelist" spec="^1.3.2" />
<plugin name="ionic-plugin-keyboard" spec="^2.2.1" />
<plugin name="cordova-plugin-dialogs" spec="^1.3.3" />
<plugin name="cordova-plugin-spinner-dialog" spec="^1.3.1" />
<plugin name="cordova-plugin-network-information" spec="^1.3.3" />
<plugin name="de.appplant.cordova.plugin.local-notification" spec="^0.8.5" />
<plugin name="cordova-plugin-uniquedeviceid" spec="^1.3.2" />
<plugin name="cordova-android-support-gradle-release" spec="0.0.2" />
<plugin name="cordova-plugin-app-version" spec="^0.1.9" />
<plugin name="cordova-plugin-nativeaudio" spec="^3.0.9" />
<plugin name="cordova-plugin-app-update" spec="^1.3.9" />
<plugin name="cordova-plugin-badge" spec="^0.8.1" />
<plugin name="cordova-plugin-nativestorage" spec="^2.2.2" />
<plugin name="cordova-plugin-mauron85-background-geolocation" spec="^2.3.3">
    <variable name="GOOGLE_PLAY_SERVICES_VERSION" value="+" />
    <variable name="ICON" value="@mipmap/icon" />
    <variable name="SMALL_ICON" value="@mipmap/icon" />
    <variable name="ACCOUNT_NAME" value="@string/app_name" />
    <variable name="ACCOUNT_LABEL" value="@string/app_name" />
    <variable name="ACCOUNT_TYPE" value="$PACKAGE_NAME.account" />
    <variable name="CONTENT_AUTHORITY" value="$PACKAGE_NAME" />
</plugin>
<plugin name="cordova-open-native-settings" spec="^1.4.1" />
<plugin name="cordova-plugin-vibration" spec="^3.0.1" />
```


# Other config values
```
    <preference name="KeychainAccessibility" value="AfterFirstUnlock" />
    <preference name="SplashMaintainAspectRatio" value="true" />
    <preference name="SplashScreen" value="screen" />
    <preference name="SplashScreenDelay" value="30000" />
    <preference name="AutoHideSplashScreen" value="false" />
    <preference name="SplashShowOnlyFirstTime" value="false" />
    <preference name="FadeSplashScreen" value="false" />
    <preference name="FadeSplashScreenDuration" value="0" />
    <preference name="SplashScreenBackgroundColor" value="0xFFFFFFFF" />
    <preference name="webviewbounce" value="false" />
    <preference name="UIWebViewBounce" value="false" />
    <preference name="DisallowOverscroll" value="true" />
    <preference name="android-minSdkVersion" value="18" />
    <preference name="BackupWebStorage" value="none" />
    <preference name="KeyboardDisplayRequiresUserAction" value="false" />
    <uses-sdk android:maxSdkVersion="27" android:minSdkVersion="19" android:targetSdkVersion="26" />

```
