#!/bin/bash

#set -vx  # Echo onx

PROJECT_NAME=OnSite
PROPER_NAME="OnSite"
PROJ_DIR="/Users/MacServ"
UDIR="${PROJ_DIR}/${PROJECT_NAME}"
NDIR="${UDIR}/platforms/ios/build/device"
REMHOST="192.168.1.3"
REMDIR="/c/${PROJECT_NAME}"
REMIPA="/c/code/new"
LOCALDIR="${PROJ_DIR}/${PROJECT_NAME}"

ERRORCODE0="0"
ERRORCODE1="0"
ERRORCODE2="0"

#echo -ne "\nMaking sure you are linked to Windows machine..."
#if [ ! -d "/c/code" ]; then
#	echo -e " NOPE!"
#	echo -e "You need to mount the C drive of the Windows machine in /c"
#	echo -e "mount_smbfs //(user):(pass)@${REMHOST}/c /c"
#	echo -e "will usually do it.\n\n"
#	echo -e "\n\n\nBuild of $PROJECT_NAME.ipa: FAILURE!\n\n\n"
#	exit 1
#fi
#
#echo -e " YEP!\n"
echo -e "\nSo far so good, now about to change to ${UDIR} to start...\n\n"
cd "${UDIR}"
echo -e "\n\nNow running ionic build...\n\n"
ionic build ios --device --verbose --debug
ERRORCODE1="$?"
if [ "$ERRORCODE1" -gt "0" ]; then
	rm -f "~/Desktop/*.ipa"
	echo -e "\n\n\nError during PhoneGap build, errorlevel was $ERRORCODE1.\n\n\n"
	osascript -e 'on run argv' -e 'set alertResult to display alert "Build failed during PhoneGap phase, errorlevel " & item 1 of argv & "!" buttons {"OK"} as critical 	default button "OK" giving up after 5' -e 'end run' $ERRORCODE1
	echo -e "\n\n\nBuild of $PROJECT_NAME.ipa: FAILURE!\n\n\n"
	exit 2
else
	cd "${LOCALDIR}/platforms/ios/build/device"
	echo -e "\n\n\nSucceeded at building initial $PROJECT_NAME.app file, now converting to iOS package....\n\n\n"
	xcrun -sdk iphoneos PackageApplication "$(pwd)/$PROJECT_NAME.app" -o "$(pwd)/$PROJECT_NAME.ipa"
	ERRORCODE2="$?"
	if [ "$ERRORCODE2" -gt "0" ]; then
		rm -f "~/Desktop/*.ipa"
		echo -e "\n\n\nError after PhoneGap build, during XCode (xcrun) convert, errorlevel $ERRORCODE2!\n\n\n"
		osascript -e 'on run argv' -e 'set alertResult to display alert "Build failed during XCode (xcrun) convert, errorlevel " & item 1 of argv & "!" buttons {"OK"} as critical default button "OK" giving up after 5' -e 'end run' $ERRORCODE2
		echo -e "\n\n\nBuild of $PROJECT_NAME.ipa: FAILURE!\n\n\n"
		exit 3
	else
#		cp -vf "$PROJECT_NAME.ipa" "${REMIPA}/"
		cp -vf "$PROJECT_NAME.ipa" ~/Desktop
		echo -e "\n\n\nBuild of $PROJECT_NAME.ipa: SUCCESS!\n\n\n"
		exit 0
	fi
fi

