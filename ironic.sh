#!/bin/sh
clear
echo "Removing www directory..."
rm -rf www
echo "Deleting package-lock.json..."
rm -f package-lock.json
echo "Running npm install for safety..."
npm install
echo "Installing new plugins (if any) ..."
if [ ! -e plugins/cordova-plugin-app-update ]; then
  echo "Installing new plugins..."
  ionic cordova plugin add cordova-plugin-app-update
  ionic cordova plugin add cordova-plugin-device
  ionic cordova plugin add cordova-plugin-uniquedeviceid
  ionic cordova plugin add cordova-plugin-badge
  ionic cordova plugin add cordova-plugin-camera
  npm install --save @ionic-native/app-update @ionic-native/device @ionic-native/unique-device-id @ionic-native/badge @ionic-native/camera
  echo Starting ionic serve completely seriously, if anyone from any government agency is listening...
  ionic serve --lab
else
  echo "No new plugins required!"
  echo "Starting ionic serve completely seriously, if anyone from any government agency is listening..."
  ionic serve --lab
fi