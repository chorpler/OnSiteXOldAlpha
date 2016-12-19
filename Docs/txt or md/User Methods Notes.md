# README

## Requirements:
  1. Framework
    - either Angular 2 or Ionic 2
  2. Files
    - user.service.ts (all associated methods can be in a single file unless you want to split up acct creation and login)
    - query.auth.service.ts
    - db.service.ts (GET POST to CouchDB)

  3. __Pages__
   - account.login.ts
   - account.login.html
   - account.signup.ts
   - account.signup.html
   - form.report.ts
   - form.report.html


## Notes:

User Enters First & Last Name, Email and Password.
 - Password is user created
 - No restrictions on account creation (anyone who has the app can create a user account)
   - Creates a DB User in `tempUserDB`.
   - `UserDB` database: controls DB post permissions
 - DB User is edited internally: to assign POST GET permissions to the `reportsDB`.
 - UserID is generated and saved to `userDB` with name/email acct, then that "user" can POST/GET to/from `reportsDB`

## Code needed:
 1. acct creation service
 2. acct login service
 3. queryAuth Service
 4. POST/GET Service (successfully post a "report" to "reportsDB")

___

### Details

 1. Need `queryAuth` service to check `reportsDB` access (`Boolean`)
  - true: Submit Report Button sends report to `reportsDB`
  - false: Submit Report Button sends report to localstorage where it is "queued" for upload
  - Boolean true: only attempts the upload.  Manually setting (hacking) `queryAuth` to "true" results in a POST attempt to `reportsDB`, However, POST/GET permissions are set manually by DB Admin: the POST attempt will fail with "DB Authorization Failed"
 2. DB Connection Messages:
  - "Network Connection failed: no internet connection detected"
  - Connected with restricted access (New/NonValidated users): no error message
    - Completed Reports are queued in localstorage
    - UI Button: "Upload Completed Reports" will initiate `queryAuth` service and attempt to upload/sync any reports in localstorage.
      1. If `queryAuth` returns "False" then "Awaiting Authorization" message is returned.
      2. If `queryAuth` returns "True" then the app attempts to POST/Sync reports in localstorage
       - Connectivity status should be returned when the button is pressed.  This has three states:
        1. "DB Authorization Failed" should only display in the _hacked scenerio_
        2. "Network Connection failed: no internet connection detected" in the event that `queryAuth` cannot reach the database.
        3. Connection successful state will return:
          1. `queryAuth` true, list of reports successfully uploaded
          2. `queryAuth` true, (hacked) "DB Authorization Failed"
          3. `queryAuth` false, "Awaiting Authorization: Please try later..."

  - report can be anything as simple as a one-line text to json file... just demonstrating ability to POST and GET all docs by user (email/username) however you want to set that up
  - User needs a minimum of username or email and password


## Helpful starting points:
[starter app:](https://github.com/driftyco/ionic-conference-app)

 - This app already has account create/login pages and can easily be edited; if that is too distracting having all the extra stuff in the project you can generate a blank app and copy/paste or generate the needed pages/services with the CLI.
  - `ionic start --v2 blank`

 - Add
