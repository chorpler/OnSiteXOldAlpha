#!/bin/sh
# 
# ========================================================================
#
# Shell script to build iOS version of OnSite and convert it to an iPhone
# .ipa file, on nano (David's Mac Mini)
#
# ========================================================================
#
#
#set -vx  # Echo onx

PROJECT_NAME=OnSite
PROPER_NAME="OnSite"
PROJ_DIR="/Users/admin/code"
OUT_DIR="/Users/admin/out"
UDIR="${PROJ_DIR}/${PROJECT_NAME}"
NDIR="${UDIR}/platforms/ios/build/device"
REMHOST="192.168.2.3"
REMDIR="/c/${PROJECT_NAME}"
REMIPA="/c/code/new"
LOCALDIR="${PROJ_DIR}/${PROJECT_NAME}"

ERRORCODE0="0"
ERRORCODE1="0"
ERRORCODE2="0"

#echo "=================================================================================="
#echo " Signing Identity:     'iPhone Developer: David Sargeant NPRLQ98GQV'              "
#echo " Provisioning Profile: 'iOSTeam Provisioning Profile: com.starmobiledevelopers.*' "
#echo "                        ad1eb01e-fca4-4f6d-baa5-fa57b3094829                      "
#echo "=================================================================================="

# echo "=================================================================================="
# echo " Signing Identity:     'iPhone Developer: David Sargeant NPRLQ98GQV'              "
# echo " Provisioning Profile: 'iOSTeam Provisioning Profile: com.starmobiledevelopers.sesa.onsite' "
# echo "                        ad1eb01e-fca4-4f6d-baa5-fa57b3094829                      "
# echo "=================================================================================="

echo "==========================================================================="
echo " Signing Identity:     'iPhone Developer: David Sargeant (4TQ92BCUQ6)    ' "
echo " Provisioning Profile: 'OnSite Development Provisioning Profile with Push' "
echo "                       (f18ee0be-05c5-4a83-b637-fd2edaf519a2)              "
echo "==========================================================================="

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
	rm -f "${OUT_DIR}/*.ipa"
	echo -e "\n\n\nError during ionic build, errorlevel was $ERRORCODE1.\n\n\n"
	osascript -e 'on run argv' -e 'set alertResult to display alert "Build failed during ionic phase, errorlevel " & item 1 of argv & "!" buttons {"OK"} as critical 	default button "OK" giving up after 5' -e 'end run' $ERRORCODE1
	echo -e "\n\n\nBuild of $PROJECT_NAME.ipa: FAILURE!\n\n\n"
	exit 2
else
	exit 0
fi
