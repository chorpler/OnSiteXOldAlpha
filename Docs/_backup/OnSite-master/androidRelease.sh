#!/bin/sh

FILENAME="OnSite"
VERSION="1.00.00"
if [ "$1" == "" ]; then
  echo "Please provide a version triplet for the parameter, i.e. '2.9.41'"
  exit 2
else
  VERSION="$1"
fi

# Output as of cordova 5.1.0
# platforms/android/build/outputs/apk/android-armv7-release-unsigned.apk
# And as of cordova 5.3.1
# platforms/android/build/outputs/apk/android-release-unsigned.apk
#
WORKING_DIR="~/code/OnSite"
BUILD_DIR="${WORKING_DIR}/platforms/android/build/outputs/apk"
#RELEASE_FILE="android-armv7-release-unsigned.apk"
RELEASE_FILE="android-release-unsigned.apk"
#DEBUG_FILE="android-armv7-debug.apk"
DEBUG_FILE="android-debug.apk"
OUTPUT_NAME="${FILENAME}_${VERSION}.apk"
OUTPUT_DIR="~/out"
REMOTE_OUTDIR="/c/out"

ionic build android --release --device
mv -vf "${BUILD_DIR}/${RELEASE_FILE}" "$WORKING_DIR"
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -storepass Kansans4Dorothy! -keystore SESA-OnSite-Key.keystore $RELEASE_FILE OnSite
zipalign -v 4 "$RELEASE_FILE" "$OUTPUT_NAME"
cp -vf "$OUTPUT_NAME" "$OUTPUT_DIR"
if [ -d "$REMOTE_OUTDIR" ]; then
  cp -vf "$OUTPUT_NAME" "$REMOTE_OUTDIR"
fi

open "$OUTPUT_DIR"

if [ -e "${OUTPUT_DIR}/${OUTPUT_NAME}" ]; then
  scp -i ${OUTPUT_DIR}/DigitalOcean_Loki_Root_insecure.key ${OUTPUT_DIR}/${OUTPUT_NAME} root@sesa.us:/var/www/html/onsite.html/
fi

