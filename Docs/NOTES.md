# Notes:
## Commandline (Windows)
create document:

```cmd
<nul (set/p z=) > [filename]

<nul (set/p z=) > pouch.functions.ts
<nul (set/p z=) > user.config.user.ts
<nul (set/p z=) > user.config.testuser.ts
```

## NPM Ref Commands

```npm
npm cache ls
npm cache clean
```

## CouchDB / PouchDB
 - PouchDB will run offline
 - User Authentication is to Device
 - Sync function is to RemoteDB(CouchDB on Node Server)

```npm
npm install --save pouchdb
npm install --save @types/pouchdb
npm install --save node-couchdb
npm install --save @types/node-couchdb // none found
```

```js
let _aDate = new Date; _aDate; // Mon Oct 31 2016 01:07:27 GMT-0500 (CDT)
let _bDate = JSON.parse(JSON.stringify(_aDate)); _bDate; // "2016-10-31T06:07:27.994Z"
let _cDate = JSON.stringify(_aDate); _cDate; // ""2016-10-31T06:07:27.994Z""
let _id = new Date().toISOString(); _id; // "2016-10-31T06:17:01.754Z"
let _dDate = new Date().toString(); _dDate;
```
