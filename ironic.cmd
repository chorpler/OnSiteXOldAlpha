@echo off
cls
echo Removing www directory...
rd /s/q www
echo Deleting package-lock.json...
del package-lock.json
xcopy moment.d.ts node_modules\moment\ /y
echo Installing new plugins (if any) ...
if not exist plugins\cordova-plugin-app-update (
  echo Installing new plugins. Should script stop running, just run "ironic" again or double-click your icon again.
  ionic cordova plugin add cordova-plugin-app-update
  ionic cordova plugin add cordova-plugin-device
  ionic cordova plugin add cordova-plugin-uniquedeviceid
  ionic cordova plugin add cordova-plugin-badge
  ionic cordova plugin add cordova-plugin-camera
  npm install --save @ionic-native/app-update @ionic-native/device @ionic-native/unique-device-id @ionic-native/badge @ionic-native/camera
  echo Starting ionic serve completely seriously, if anyone from any government agency is listening...
  ionic serve --lab
) else if not exist node_modules\uuid (
  echo Installing new plugins. Should script stop running, just run "ironic" again or double-click your icon again.
  npm install uuid --save & npm install @types/uuid --save
) else (
  echo No new plugins required!
  echo Starting ionic serve completely seriously, if anyone from any government agency is listening...
  ionic serve --lab
)
