@echo on
if "%1" == "" goto AskForNum
:HaveNum
echo Now building version %1...
rem ionic build android --release
xcopy /y platforms\android\build\outputs\apk\android-armv7-release-unsigned.apk .
pause
echo "Attempting to try password Kansans4Dorothy!!"
REM jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -storepass Kansans4Dorothy!! -keystore SESA-OnSite-Key.keystore android-release-unsigned.apk OnSite
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore SESA-OnSite-Key.keystore android-armv7-release-unsigned.apk OnSite
pause
zipalign -f -v 4 android-armv7-release-unsigned.apk OnSite_%1.apk
pause
goto alldone

:AskForNum
echo Need to supply a number like 2.9.58 or 3.10.44.

:alldone
echo Done.
