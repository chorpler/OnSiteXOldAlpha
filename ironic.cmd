@echo off
cls
echo Removing www directory...
rd /s/q www
echo Deleting package-lock.json...
del package-lock.json
REM xcopy moment.d.ts node_modules\moment\ /y
xcopy moment.d.ts node_modules\moment /y
xcopy pouchdb-authentication.utils.js node_modules\pouchdb-authentication\lib\utils.js /y
echo Installing new plugins (if any) ...
REM if not exist plugins\cordova-plugin-app-update
if not exist plugins\cordova-plugin-nativestorage (
  echo Installing new plugins. Should script stop running, just run "ironic" again or double-click your icon again.
  REM ionic cordova plugin add cordova-plugin-app-update
  REM ionic cordova plugin add cordova-plugin-device
  REM ionic cordova plugin add cordova-plugin-uniquedeviceid
  REM ionic cordova plugin add cordova-plugin-badge
  REM ionic cordova plugin add cordova-plugin-camera
  REM npm install --save @ionic-native/app-update @ionic-native/device @ionic-native/unique-device-id @ionic-native/badge @ionic-native/camera
  ionic cordova plugin add cordova-plugin-nativestorage & npm install --save @ionic-native/native-storage
  echo Starting ionic serve completely seriously, if anyone from any government agency is listening...
  ionic serve --lab --address=0.0.0.0 %1 %2 %3 %4 %5 %6 %7 %8 %9
REM ) else if not exist node_modules\uuid (
  REM echo Installing new plugins. Should script stop running, just run "ironic" again or double-click your icon again.
  npm install uuid --save & npm install @types/uuid --save
) else (
  echo No new plugins required!
  echo Starting ionic serve completely seriously, if anyone from any government agency is listening...
  ionic serve --lab --address=0.0.0.0 %1 %2 %3 %4 %5 %6 %7 %8 %9
)
