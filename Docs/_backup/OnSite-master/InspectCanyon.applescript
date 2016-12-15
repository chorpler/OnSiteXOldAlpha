#!/usr/bin/osascript

# AppleScript to automatically open the Safari debugger

set maxWait to 75
set hasClicked to false
set x to 0
set device_name to "Canyon"

# delay fix for yosemite
on delay duration
	set endTime to (current date) + duration
	repeat while (current date) is less than endTime
		tell AppleScript to delay duration
	end repeat
end delay

# open terminal if it's not open already

delay 5

# open safari and wait for the ios app to become available for debugging
tell application "Safari"
	activate
	repeat until hasClicked or x > (maxWait * 10)
		try
			tell application "System Events"
				click menu item 2 of menu device_name of menu item device_name of menu "Develop" of menu bar item "Develop" of menu bar 1 of application process "Safari"
			end tell
			set hasClicked to true
		on error foo
			delay 0.1
			set x to x + 1
		end try
	end repeat
	if hasClicked = false then
		display dialog "Unable to connect to iPhone 'Canyon' - make sure that it's working" buttons {"OK"} default button 1
	else
		try
			tell application "System Events"
				click button 1 of window "Favorites" of application process "Safari"
			end tell
		end try
		return
	end if
end tell