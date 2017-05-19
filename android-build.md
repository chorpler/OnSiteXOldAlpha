keytool -genkey -v -keystore onsitex-release-key.keystore -alias onsitex -keyalg RSA -keysize 2048 -validity 10000
pass: D0r0thy99%

move platforms\android\build\outputs\apk\android-release-unsigned.apk . /y
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore onsitex-release-key.keystore android-release-unsigned.apk onsitex
zipalign -v 4 android-release-unsigned.apk OnSiteX.apk