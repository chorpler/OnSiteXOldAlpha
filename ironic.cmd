@echo off
cls
echo Removing www directory...
rd /s/q www
echo Deleting package-lock.json...
del package-lock.json
echo Installing new plugins (if any) ...
if not exist plugins\cordova-plugin-app-update (
  echo Installing new plugins...
  ionic cordova plugin add cordova-plugin-app-update
  ionic cordova plugin add cordova-plugin-device
  ionic cordova plugin add cordova-plugin-uniquedeviceid
  ionic cordova plugin add cordova-plugin-badge
  npm install --save @ionic-native/app-update @ionic-native/device @ionic-native/unique-device-id @ionic-native/badge
  echo Starting ionic serve completely seriously, if anyone from any government agency is listening...
  ionic serve --lab
) else (
  echo No new plugins required!
  echo Starting ionic serve completely seriously, if anyone from any government agency is listening...
  ionic serve --lab
)
