// import * as PouchDBAuth from 'pouchdb-auth'           ;
// import * as PDBAuth     from 'pouchdb-authentication' ;
// import * as pdbFind     from 'pouchdb-find'           ;
// import * as pdbUpsert   from 'pouchdb-upsert'         ;
// import * as pdbAllDBs   from 'pouchdb-all-dbs'        ;
import * as pdbSQLite   from 'pouchdb-adapter-cordova-sqlite';
// import { Injectable   } from '@angular/core'          ;
import { Platform     } from 'ionic-angular'          ;
// import { Log                  } from 'domain/onsitexdomain'   ;
// import { Preferences          } from './preferences'          ;
// import   PouchDB                from 'pouchdb'                ;
// import * as workerPouch         from 'worker-pouch'           ;
// import PouchDB from 'pouchdb-authentication';

import { Injectable           } from '@angular/core'          ;
import { Log                  } from 'domain/onsitexdomain'   ;
import { Preferences          } from './preferences'          ;
import   PouchDB                from 'pouchdb-browser'        ;
import * as workerPouch         from 'worker-pouch'           ;
import * as PDBAuth             from 'pouchdb-authentication' ;
import * as pdbFind             from 'pouchdb-find'           ;
import * as pdbUpsert           from 'pouchdb-upsert'         ;
import * as pdbAllDBs           from 'pouchdb-all-dbs'        ;

export const addPouchDBPlugin = (pouchdbObject:any, plugin:any) => {
  if(plugin) {
    if(plugin['default'] !== undefined) {
      pouchdbObject.plugin(plugin.default);
    } else {
      pouchdbObject.plugin(plugin);
    }
  } else {
    Log.w(`addPouchDBPlugin(): This plugin did not exist:\n`, plugin);
    return;
  }
};

export type StaticPouch   = PouchDB.Database;
export type PouchDatabase = PouchDB.Database;

@Injectable()
export class PouchDBService {
  public static StaticPouchDB : any = (PouchDB as any).default;
  public static working       : boolean       = false                                        ;
  public static initialized   : boolean       = false                                        ;
  public static pdb           : any           = new Map()                                    ;
  public static rdb           : any           = new Map()                                    ;
  public static PREFS         : any           = new Preferences()                            ;
  public get prefs() { return PouchDBService.PREFS;};

  constructor() {
    Log.l('Hello PouchDBService Provider');
    window['Pouch'] = PouchDB;
    // window['PouchDB'] = (PouchDB as any).default;
    // window['PouchDBFind'] = pdbFind;
    // window['PDBAuth'] = PDBAuth;
    // window['PDBSqlite'] = pdbSQLite;
  // window['PouchDBStatic'] = PouchDB.Static;
  }

  public static setupGlobals() {
    window['onsitePouchDB'] = PouchDB;
    window['onsitePouchDBService'] = PouchDBService;
    window['onsitepouchdbservice'] = this;
    window['onsitepouchdbworker'] = workerPouch;
    window['onsitepouchdbauthentication'] = PDBAuth;
    window['onsitePouchDBService'] = PouchDBService;
    window['onsitepouchdbservice'] = this;
    window['onsitepouchdbworker'] = workerPouch;
    window['onsitepouchdbauthentication'] = PDBAuth;
    window['onsitepouchdbfind'] = pdbFind;
  }

  public static PouchInit() {
    if(!PouchDBService.initialized) {
      PouchDBService.setupGlobals();
      let pouchdb:any = PouchDB;
      if(PouchDB && PouchDB['default']) {
        pouchdb = PouchDB.default;
      }
      // let pouchdb = (PouchDB as any).default;
      addPouchDBPlugin(pouchdb, PDBAuth);
      addPouchDBPlugin(pouchdb, pdbUpsert);
      addPouchDBPlugin(pouchdb, pdbFind);
      addPouchDBPlugin(pouchdb, pdbAllDBs);
      pouchdb.adapter('worker', workerPouch);
      let pdbauth:any = (PDBAuth as any).default;
      pouchdb.plugin(pdbSQLite);
      pouchdb.plugin(pdbUpsert);
      pouchdb.plugin(pdbauth);
      pouchdb.plugin(pdbFind.default);
      pouchdb.plugin(pdbAllDBs);
      window["pouchdbserv"] = this;
      // window["StaticPouchDB"] = PouchDB;
      PouchDBService.StaticPouchDB = pouchdb;
      PouchDBService.initialized = true;
      return PouchDBService.StaticPouchDB;
    } else {
      return PouchDBService.StaticPouchDB;
    }
  }

  public static getAuthPouchDB() {
    return new Promise((resolve, reject) => {
      let pouchdb = PouchDB;
      pouchdb.plugin(pdbUpsert);
      pouchdb.plugin(pdbFind);
      pouchdb.plugin(PDBAuth);
      // pouchdb.plugin(PouchDBAuth);
      window["pouchdbserv"] = this;
      // window["StaticPouchDB"] = pouchdb;
      PouchDBService.StaticPouchDB = pouchdb;
      resolve(PouchDBService.StaticPouchDB);
    });
  }

  public static getPouchDB() {
    return PouchDBService.StaticPouchDB;
  }

  public getPouchDB() {
    return PouchDBService.getPouchDB();
  }


  public addDB(dbname: string) {
    return PouchDBService.addDB(dbname);
  }

  public static addDB(dbname: string) {
    let dbmap = PouchDBService.pdb;
    // let opts = {adapter: 'websql'};
    // let opts = {adapter: 'idb'};
    // let opts = {adapter: 'cordova-sqlite'};
    let opts = {};
    if(dbmap.has(dbname)) {
      // Log.l(`addDB(): Not adding local database ${dbname} because it already exists.`);
      return dbmap.get(dbname);
    } else {
      let db = new PouchDBService.StaticPouchDB(dbname, opts);
      dbmap.set(dbname, db);
      // Log.l(`addDB(): Added local database ${dbname} to the list.`);
      return dbmap.get(dbname);
    }
  }

  public addRDB(dbname: string) {
    return PouchDBService.addRDB(dbname);
  }

  public static addRDB(dbname: string) {
    let rdbmap = PouchDBService.rdb;
    let PREFS = PouchDBService.PREFS;
    let SERVER = PREFS.getServer();
    let url = SERVER.rdbServer.protocol + "://" + SERVER.rdbServer.server + "/" + dbname;
    // Log.l(`addRDB(): Now fetching remote DB ${dbname} at ${url} ...`);
    if(rdbmap.has(dbname)) {
      return rdbmap.get(dbname);
    } else {
      let rdb1 = new PouchDBService.StaticPouchDB(url, SERVER.ropts);
      rdbmap.set(dbname, rdb1);
      // Log.l(`addRDB(): Added remote database ${url} to the list as ${dbname}.`);
      return rdbmap.get(dbname);
    }
  }
}
