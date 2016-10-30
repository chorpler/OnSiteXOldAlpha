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
