set maxWait to 70
set hasClicked to false
set x to 0
set device_name to "Canyon"

on delay duration
	set endTime to (current date) + duration
	repeat while (current date) is less than endTime
		tell AppleScript to delay duration
	end repeat
end delay

(*tell application "iTerm"
	activate
	set myterm to (make new terminal)
	tell myterm
		set mysession to (make new session at the end of sessions)
		set number of columns to 120
		set number of rows to 50
		tell mysession
			write text "cd /Users/dave/code/OnSite"
			write text "ionic build ios --debug --device"
		end tell
	end tell
end tell*)

set errorLevel to do shell script "/Users/dave/code/OnSite/xcodeNano.sh; echo $?"


delay 5

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
