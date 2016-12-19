# Notes:
## Commandline (Windows)
##### create document:

```cmd
<nul (set/p z=) > [filename]

<nul (set/p z=) > pouch.functions.ts
<nul (set/p z=) > user.config.user.ts
<nul (set/p z=) > user.config.testuser.ts
<nul (set/p z=) > db.config.constants.ts
```

## NPM
### Ref Commands
```cmd
npm cache ls
npm cache clean
npm -g update
```

### Global Installs:
 - TypeScript
 - Ionic
 - Cordova
 - Npm Check Updates
 - Gulp

###### If Running a clean install of Nodejs: Basic global directories

```cmd
npm install --global windows-build-tools
npm install -g npm-check-updates
npm install -g typescript@next
npm install -g ionic
npm install -g cordova
npm install -g gulp
// combined:
npm install -g npm-check-updates typescript@next ionic cordova gulp
```

### Project Installs

```cmd
npm install --save moment // types are included in package
npm install --save moment-timezone
npm install --save pouchdb
npm install --save-dev @types/pouchdb
npm install --save-dev @types/moment-timezone
npm install @ionic/app-scripts@latest --save-dev
npm install --save-dev node-sass

npm install --save  moment moment-timezone pouchdb
npm install --save-dev @types/pouchdb @types/moment-timezone @ionic/app-scripts@latest

```

## CouchDB / PouchDB
 - PouchDB will run offline
 - User Authentication is to Device
 - Sync function is to RemoteDB(CouchDB on Node Server)

## Script Stuff:

```js
/**
 * Chrome Console `Date()` tests
 * @type {Date()}
 * need to use moment, moment-timezone to standardize across devices I think....
 */
let _aDate = new Date; _aDate;
// Mon Oct 31 2016 01:07:27 GMT-0500 (CDT)
let _bDate = JSON.parse(JSON.stringify(_aDate)); _bDate;
// "2016-10-31T06:07:27.994Z"
let _cDate = JSON.stringify(_aDate); _cDate;
// ""2016-10-31T06:07:27.994Z""
let _id    = new Date().toISOString(); _id;
// "2016-10-31T06:17:01.754Z"
let _dDate = new Date().toString(); _dDate;
// "Mon Oct 31 2016 14:38:17 GMT-0500 (Central Daylight Time)"
let _eDate = new Date(); _eDate
// Mon Oct 31 2016 14:46:24 GMT-0500 (Central Daylight Time)
_eDate.toString();
// "Mon Oct 31 2016 14:47:32 GMT-0500 (Central Daylight Time)"
JSON.parse(JSON.stringify(_eDate));
// "2016-10-31T19:47:32.648Z"
```

```js
DBNAME = [ 'OnSiteXUSR', 'OnSiteXDOC' ];
```


```html
<ion-header>
  <ion-navbar>
    <button ion-button menuToggle><ion-icon name="menu"></ion-icon></button>
    <ion-title>Account Setup</ion-title>
  </ion-navbar>
</ion-header>


<ion-header>
  <ion-navbar>
    <button ion-button menuToggle><ion-icon name="menu"></ion-icon></button>
    <ion-title>OnSiteX Login</ion-title>
  </ion-navbar>
</ion-header>


<ion-header>
  <ion-navbar>
    <button ion-button menuToggle><ion-icon name="menu"></ion-icon></button>
    <ion-title>MGMT Home</ion-title>
  </ion-navbar>
</ion-header>


<ion-header>
  <ion-navbar>
    <button ion-button menuToggle><ion-icon name="menu"></ion-icon></button>
    <ion-title>Technicians Home</ion-title>
  </ion-navbar>
</ion-header>


<ion-header>
  <ion-navbar>
    <button ion-button menuToggle><ion-icon name="menu"></ion-icon></button>
    <ion-title>Tech Stats</ion-title>
  </ion-navbar>
</ion-header>


<ion-header>
  <ion-navbar>
    <button ion-button menuToggle><ion-icon name="menu"></ion-icon></button>
    <ion-title>Technician Report</ion-title>
  </ion-navbar>
</ion-header>


<ion-header>
  <ion-navbar>
    <button ion-button menuToggle><ion-icon name="menu"></ion-icon></button>
    <ion-title>Topper Report</ion-title>
  </ion-navbar>
</ion-header>


<ion-header>
  <ion-navbar>
    <button ion-button menuToggle><ion-icon name="menu"></ion-icon></button>
    <ion-title>Account Settings</ion-title>
  </ion-navbar>
</ion-header>

<!-- Welcome Screen -->
<ion-header>
  <ion-navbar>
    <button ion-button menuToggle><ion-icon name="menu"></ion-icon></button>
    <ion-title>SESA OnSiteX</ion-title>
  </ion-navbar>
</ion-header>
```

#### Platform
```js
constructor(platform: Platform) {
    this.platform = platform;

if (this.platform.is('ios')) {
      // This will only print when on iOS
      console.log("I'm an iOS device!");
    }
}
```

|Platform  |Name Description                |
|---       |---                             |
|android   |on a device running Android.    |
|cordova   |on a device running Cordova.    |
|core      |on a desktop device.            |
|ios       |on a device running iOS.        |
|ipad      |on an iPad device.              |
|iphone    |on an iPhone device.            |
|mobile    |on a mobile device.             |
|mobileweb |in a browser on a mobile device.|
|phablet   |on a phablet device.            |
|tablet    |on a tablet device.             |
|windows   |on a device running Windows.    |


## VS Code Align to cursor
 1. multi cursor: Alt+mouse1
 2. align: ctrl+alt+a
