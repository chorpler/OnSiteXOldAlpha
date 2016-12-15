#!/bin/bash
#init
function pause() {
	read -p "$*"
}

SCRIPTNAME="$0"
FILENAME="OnSite"
VERSION="1.00.00"
if [ "$1" == "" ]; then
  echo "Please provide a version triplet for the parameter, i.e. '2.9.41'"
  exit 2
else
  VERSION="$1"
fi

shopt -s nocasematch

OUTPUT_TYPE="debug"

if [[ $SCRIPTNAME =~ ^.*debug.*$ ]]; then
	echo "In debug mode!"
	OUTPUT_TYPE="debug"
else
	echo "In release mode!"
	OUTPUT_TYPE="release"
fi

USER_HOME=~
WORKING_DIR="${USER_HOME}/code/OnSite"


# Output as of cordova 5.1.0
# platforms/android/build/outputs/apk/android-armv7-debug.apk
# Output as of cordova 5.3.1 without Crosswalk
# platforms/android/build/outputs/apk/android-debug.apk
BUILD_DIR="${WORKING_DIR}/platforms/android/build/outputs/apk"
# RELEASE_FILE="android-armv7-release-unsigned.apk"
# DEBUG_FILE="android-armv7-debug.apk"
RELEASE_FILE="android-release-unsigned.apk"
DEBUG_FILE="android-debug.apk"
OUTPUT_NAME="${FILENAME}_${VERSION}.apk"
DEBUG_OUTPUT_NAME="${FILENAME}_debug_${VERSION}.apk"
FIRST_OUTPUT="${DEBUG_FILE}"
SECOND_OUTPUT="${DEBUG_OUTPUT_NAME}"
OUTPUT_DIR="${USER_HOME}/out"
REMOTE_OUTDIR="/c/out"

if [ "$OUTPUT_TYPE" == "debug" ]; then
	FIRST_OUTPUT="${DEBUG_FILE}"
	SECOND_OUTPUT="${DEBUG_OUTPUT_NAME}"

	ionic build android --debug --device

	mv -vf "${BUILD_DIR}/${FIRST_OUTPUT}" "${WORKING_DIR}/${SECOND_OUTPUT}"
	cp  -vf "${WORKING_DIR}/${SECOND_OUTPUT}" "${OUTPUT_DIR}"
	if [ -d "${REMOTE_OUTDIR}" ]; then
		cp -vf "${SECOND_OUTPUT}" "${REMOTE_OUTDIR}"
	fi
	open "${OUTPUT_DIR}"
# elif [ "$OUTPUT_TYPE" == "release" ]; then
else
	FIRST_OUTPUT="${RELEASE_FILE}"
	SECOND_OUTPUT="${OUTPUT_NAME}"

	ionic build android --release --device

	mv -vf "${BUILD_DIR}/${FIRST_OUTPUT}" "${WORKING_DIR}/${SECOND_OUTPUT}"

	echo -e "\nAbout to run:\n jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -storepass (keystore password) -keystore SESA-OnSite-Key.keystore ${FIRST_OUTPUT} OnSite\n"

	pause "Press [Enter] to proceed or CTRL-C to quit..."

	jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -storepass Kansans4Dorothy! -keystore SESA-OnSite-Key.keystore ${FIRST_OUTPUT} OnSite

	echo -e "\nAbout to run:\n zipalign -v 4 \"${FIRST_OUTPUT}\" \"${SECOND_OUTPUT}\""

	pause "Press [Enter] to proceed or CTRL-C to quit..."

	zipalign -v 4 "${FIRST_OUTPUT}" "${SECOND_OUTPUT}"

	cp  -vf "${WORKING_DIR}/${SECOND_OUTPUT}" "${OUTPUT_DIR}/"
	if [ -d "${REMOTE_OUTDIR}" ]; then
		cp -vf "${SECOND_OUTPUT}" "${REMOTE_OUTDIR}/"
	fi
	open "${OUTPUT_DIR}"
	if [ -e "${OUTPUT_DIR}/${SECOND_OUTPUT}" ]; then
	 scp -i "${OUTPUT_DIR}/DigitalOcean_Loki_Root_insecure.key" "${OUTPUT_DIR}/${SECOND_OUTPUT}" root@sesa.us:/var/www/html/onsite.html/
	fi
fi


