keytool -genkey -v -keystore onsitex-release-key.keystore -alias onsitex -keyalg RSA -keysize 2048 -validity 10000
pass: D0r0thy99%

move /y platforms\android\build\outputs\apk\release\android-release-unsigned.apk .\builds\
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore Docs/keys/onsitex-release-key.keystore .\builds\android-release-unsigned.apk onsitex
zipalign -v 4 builds\android-release-unsigned.apk .\builds\OnSiteX.apk

move /y platforms\android\build\outputs\apk\android-debug.apk .\builds\OnSite_Debug.apk
 
move /y platforms\android\build\outputs\apk\release\android-release-unsigned.apk .\builds\
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore Docs/keys/onsitex-release-key.keystore ./builds/android-release-unsigned.apk onsitex
zipalign -v 4 builds/android-release-unsigned.apk ./builds/OnSiteX.apk

move /y platforms\android\build\outputs\apk\android-debug.apk .\builds\OnSite_Debug.apk
 