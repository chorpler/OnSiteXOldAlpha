#!/usr/bin/osascript

set apptitle to "OnSite"
set appname to "OnSite Home"
set device_name to "SixOfNine"
set browser_name to "Safari Technology Preview"
set window_title to "Web Inspector — " & device_name & " — " & apptitle & " — " & appname

set i to 0

tell application "System Events"
repeat until i > 3
  if exists process browser_name then
    if exists menu item appname of menu device_name of menu item device_name of menu "Develop" of menu bar item "Develop" of menu bar 1 of process browser_name then
      tell application browser_name
          activate
          tell application "System Events"
              try
                  click menu item appname of menu device_name of menu item device_name of menu "Develop" of menu bar item "Develop" of menu bar 1 of process browser_name
                  tell application "System Events"
                    tell process browser_name
                      set frontmost to true
                      perform action "AXRaise" of (windows whose title is window_title)
                    end tell
                  end tell
                  exit repeat
              end try
          end tell
      end tell
    end if
  end if
  set i to i + 1
  if i > 3 then exit repeat
  delay 5
end repeat
end tell
