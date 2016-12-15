<!-- 22 AUG, MB -->
<!-- need to seperate Lat/Lon from {{vars.strUnitPosition}} into two vars:
	{{vars.strUnitPositionLat}} and {{vars.strUnitPositionLon}}
 DS 2015-08-22-->

<!-- 24 AUG, MB -->
<!-- WO Time Alloc Screen:
	code.clearTimeToReallocate()
	code.clearAllTimesAndReallocateAllTimes() -->

<!-- 25 AUG, DS -->
<!-- ng-click="code.PopupImageViewer()"
ng-click="code.PopupOneNote()"
ng-click="code.PopupNotes()"
ng-click="code.PopupUndoButton()"
ng-click="code.PopupDeleteLastTimeAdded()"
ng-click="code.PopupCompleteDiagnostics()"
ng-click="code.PopupCompleteRepair()"
ng-click="code.PopupMessages()"
ng-click="code.PopupRepairNotes()"
ng-click="code.PopupDiagnosticNotes()"
ng-click="code.PopupLogin()"
ng-click="code.PopupOptionsButton()"
ng-click="code.PopupResetApp()"
ng-click="code.PopupConfirm()"
ng-click="code.PopupDeveloperMode()" -->

________________

End of shift GeoLogging:
<!-- Time-allocation: is end of shift only: Done  -->
<!-- get geolocation,  if vars.geofenceradius == true, continue logging: Done --> <!-- (this allows corroboration of overtime exceptions) -->

<!-- if vars.geofenceradius == false: end geoloc background process: Done -->

<!-- next log shift not available until last logendshift == logendshift + 8 hours  DS 2015-08-20 -->


<!-- unallocated time requires allocation before other app features are available.
time allocation covers -preference jobsite shift time- minutes always.
	if logshift.time > shift.start.time,
			AND geofenceradius == true
				create exception block from shift.start.time to logshift.time (must be allocated at the end of the shift) DS 2015-08-21 -->
<!-- 	OR
	if logshift.time > shift.start.time,
			AND geofenceradius == false
				create exception block from shift.start.time to time.geofenceradius == true
(any hours in this period is forced to exceptions)In progress DS 2015-08-21, DS, Completed (25th)-->

________________

Add variable /link to insert work order images into the WO detail view in Console DAVID!@!!!!!!!!
	Check connectivity status:
	1. if no connecton: popup "please re-submit when you have a better connection"
	2. if only cell signal: popup {{vars.cellularConnection}} detected, would you like to continue? please note that the submission will use about {{vars.WOuploadDataSize}} of your cell data usage.

	<BUTTON> Continue</BUTTON> <BUTTON>Submit Later</BUTTON>

________________

<!-- Check: Work orders -- completed, but showing up in open again (may be fixed: needs testing) DS 2015-08-24 -->

<!-- 17 AUG, MB -->
Create tutorial for the app -Mike

<!-- 19 AUG, MB -->
Add Test Button functions



<!-- 19 AUG, MB -->
Time Allocation Additons:

______________

<!-- 1. Create Lunch Card at start of shift: changed to Exception, no logging in time-alloc -->
<!-- 2. If Shift is ended (log End Shift button) before end of normal shift: Time allocation only requires amount of shift worked allocated DS 2015-08-21-->
<!-- 3. Work Order Card is loaded for "offSite" Exception time blocks (Template is done) -->

<!-- 09 SEP MB -->
change 3. to:
	Case1:
	IF GeoFence = false && period >30min and < 75min Set flag Offsite Lunch == True (no Exception Flag is triggered, but will flag Date/Shift with offsite lunch and flag is marked on Exception entry if the user creates a Lunch exception for that Date/Shift -this way when the exception shows on console, the "offsite lunch" flag shows up so that the Console user can see it is a conflicted exception)  {{vars.Lunch.ConflictedException}} or some sich
		IF Offsite Lunch == True && GeoFence == false for a period > 15 min, then set Exception flag on the server for the offsite time period (Date/Shift).
			&& log both the Offsite Lunch and second time period in the console exception view

	Case2:
	IF GeoFence = false && period >> 75min Set exception flag on the server for the time period offsite.

Exceptions should have flags for:
	User initiated exception (travel, lunch, sicktime...)
	GeoLoc Exceptions (generated from the app)
		Console message: {{employee.firstname}} {{employee.lastname}} was OffSite from {{vars.exceptionStarTime}} to {{vars.exceptionEndTime}} on {{vars.ShiftDay.Date}}.

		for GeoFence exceptions which include OffSite Lunch == True add to console message:
It appears the employee took lunch between {{vars.OffSiteLunchStartTime}} and {{vars.OffSiteLunchEndTime}}.  Review this exception and contact the employee if necessary.

User initiated Exception for lunch:
For OffSite Lunch == True && Lunch Exception created for employee add console msg:
	It appears the employee took lunch offsite or had some other reason to be offsite for what appears to be a lunch hour.

	Shift Array
		needs variable for offsite lunch
		exception
			exception [date/time.start, date/time.end]
Logging in late for a shift generates an exception block from Start of shift to login time

<!-- 4. Set time allocation end time slider to default to the time that the work order was "clicked" completed. DS: tinmeStamps added to WO-->
<!-- 5. After WO time is allocated, set min slider to earliest unallocated shift time  -->
<!-- 6. Link Jobsite Prefs for shift times to allocation slider min-max DS 2015-08-21 -->
<!-- 7. Jobsite Prefs in console needs to have the shift types/times displayed and editable -->
<!-- DS 2015-08-21:  -->
<!-- Jobsite has following variable:
%JOBSITE%.shifts = {'day': {'start': '0700', 'end': '1900'}, 'night': {'start': '1900', 'end': '0700'}}
So in the Jobsite Preferences HTML they could be used something like this:
Day start: <input class="JobsiteDayStartTime" ng-model="%JOBSITE%.shifts.day.start" />
Day end: <input class="JobsiteDayEndTime" ng-model="%JOBSITE%.shifts.day.end" />
Night start: <input class="JobsiteNightStartTime" ng-model="%JOBSITE%.shifts.night.start" />
Night end: <input class="JobsiteNightEndTime" ng-model="%JOBSITE%.shifts.night.end" /> -->
<!-- Added to Console: 25 AUG, MB -->

<!-- 8. Match work order border color and sich to the corresponding flexbox color. Coloring algorithm:


	for(var i = 0; i < $scope.vars.OpenMWOList.length; i++) {
		$('#WorkOrderFlexbox-' + i).css('background-color', workOrderColors[i]);
	}
	And in code for moving to next/previous work orders:
	$('.woTACdivider').css('border-right', '10px solid ' + workOrderColors[$scope.vars.CardIndex]);
	$('.woActiveCard').css('border-right', '10px solid ' + workOrderColors[$scope.vars.CardIndex]);


Additional condition: if they start a new allocation and there is a hole in the time block, there needs to be a transparent flexbox created, which covers
the hole in the time. Mike will color the background differently and add opacity to the rgb classes. End result, a transparent hole that shows up very
brightly as non-allocated time. --> This workflow has changed somewhat and is now functioning in a better way <!-- 09 SEP MB -->

<!-- 20 AUG, MB -->
<!-- re-index woViews in Open/Pending/Completed so that clone and delete action is performed on the visibly selected WO -->

<!--  20 AUG, MB -->
<!-- Open work order list contains all work orders created on a given day including any work orders which do not yet have work order numbers (as long as that work order was created on the current shift.)  At the end of the shift, all of the work orders in the Open work order list must be allocated to time blocks (even if it is zero minutes -but in that case, they should delete them, but we won't force that).  Work orders w/o wo numbers from that shift must be allocated or deleted.   -->

<!-- 20 AUG, MB -->
<!-- Pending WO list has the following criteria:
Work Order was allocated at the end of a shift without a work order number assigned.
Work Orders can only show up in Pending after time allocation has been completed and the above is true.  Therefore, one would not see any work orders in the pending list unless it was created and allocated from a previous shift.  This list has the sole function of reminding the Tech that the work order  must get a number before SESA can invoice.  The pending list is updated on the console so that it can be tracked from the office.  It is cleared once the Tech or someone from the office adds a WO num to the WO.  Office edits follow the same format as normal WO edits from the console.  Therefore we should append that field value at the time of allocation: "No WO Num Assigned_00001" this will be the value which gets red-lined through once the WO has a number assigned.
-Tech's edit ability is also limited to adding the number; they cannot add additional time etc. to the WO; they can only clone it and create a new work order for their current shift if that is needed... just like a regular closed WO.
 -->

<!-- 20 AUG, MB -->
<!-- On WO Card, switch work order button will often reload the card you were trying to swap out.  it is very unreliable -->

<!-- 21 AUG, MB -->
<!-- Add Jobsites to travel Exception Hours DS 2015-08-21-->

<!-- 21 AUG, MB -->
 	<!-- Is it possible to add a "refresh" or some sich to WO card when a field is edited, or when the "clone" or "switch docs" buttons are clicked to ensure the integrity && identity of the json doc being edited?  Could this be one of the issues with indexing?  The doc that's being edited is not the doc you think?  certainly that is the case with the indexed lists...  -->
 	<!-- This has been addressed with new indexing based on OSID; but I'm not convinced that all bugs are gone -->
 	Follow up with more testing on WO edit/switching/cloning and deleting <!-- 23 AUG MB -->

<!-- 25 AUG, MB -->
<!-- ng-click="code.woSaveTimesCloseWO(): This is the new "submit" function.
	When it is clicked the following happens:

		1. check that all shift time is allocated
		  allTimeAllocated == false
		    popup with first block and list of WO's (as links) to apply the time
		    repeat popups until all blocks are applied
		    popup option: return to Time Allocation screen
		2. allTimeAllocated == true
		  All work orders are saved with allocated shift time and repair hours (no soft save -this is a permenant save to the record)
		  All work orders are saved to the database
		  IF WO != LunchWO || repairHours != 0 (0 would be the case for "deleted work orders which should be assigned repairHours == 0 and then disabled")
		  	flag set to "Invoice WO == true" "deleted WO record == false"
		  Else WO != LunchWO && repairHours = 0
		  	flag set to "deleted WO record == true" "Invoice WO == false"
		  Else WO == LunchWO
		  	flag set to "Invoice WO == false" "LunchWO == true" -->

<!-- 25 AUG, MB -->
<!-- ng-click"code.refreshOpenWorkOrderPage()"  -->

<!-- 20 AUG, MB -->
<!-- added: ng-click="code.woSaveTimesCloseWO() to Time Allocation screen
this saves all of the allocated times to the WO documents and closes the WO's and uploades to DB
added: ng-class="{'disabled': vars.allTimeAllocated}" -feel free to rename these n sich -->

<!-- 09 SEP, MB -->
<!-- Change Login Screen: -->
	<!-- no time selection,  -->
		<!-- Select shift -->
		<!-- Select Current Date/next day, FORMAT: Weekday, MMM DD   -->
		<!-- Select Jobsite (once) -->
		<!-- DS: Mike and I fixed that stuff up right nice, 2015-09-10  -->
			add Change Jobsite button to Options screen


