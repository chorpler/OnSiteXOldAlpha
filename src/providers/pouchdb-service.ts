import 'rxjs/add/operator/map';
import * as PouchDB from 'pouchdb'                ;
import * as PDBAuth from 'pouchdb-authentication' ;
// import * as PouchDBAuth from 'pouchdb-auth'    ;
import * as pdbFind from 'pouchdb-find'           ;
import * as pdbUpsert from 'pouchdb-upsert'       ;
import * as pdbAllDBs from 'pouchdb-all-dbs'      ;
import { Injectable  } from '@angular/core'              ;
import { Log         } from '../config/config.functions' ;
import { Preferences } from './preferences'              ;

@Injectable()
export class PouchDBService {
  public static StaticPouchDB : any;
  public static working       : boolean       = false                                        ;
  public static initialized   : boolean       = false                                        ;
  public static pdb           : any           = new Map()                                    ;
  public static rdb           : any           = new Map()                                    ;
  public static PREFERENCES   : any           = new Preferences()                            ;
  public prefs                : any           = PouchDBService.PREFERENCES                   ;

  constructor() {
    console.log('Hello PouchDBService Provider');
  }

  public static PouchInit() {
    if (!PouchDBService.initialized) {
      let pouchdb = PouchDB;
      pouchdb.plugin(pdbUpsert);
      pouchdb.plugin(PDBAuth);
      pouchdb.plugin(pdbFind);
      pouchdb.plugin(pdbAllDBs);
      window["pouchdbserv"] = this;
      window["StaticPouchDB"] = pouchdb;
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
      window["StaticPouchDB"] = pouchdb;
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
    if(dbmap.has(dbname)) {
      // Log.l(`addDB(): Not adding local database ${dbname} because it already exists.`);
      return dbmap.get(dbname);
    } else {
      dbmap.set(dbname, PouchDBService.StaticPouchDB(dbname, PouchDBService.PREFERENCES.SERVER.opts));
      // Log.l(`addDB(): Added local database ${dbname} to the list.`);
      return dbmap.get(dbname);
    }
  }

  public addRDB(dbname: string) {
    return PouchDBService.addRDB(dbname);
  }

  public static addRDB(dbname: string) {
    let rdbmap = PouchDBService.rdb;
    let url = PouchDBService.PREFERENCES.SERVER.rdbServer.protocol + "://" + PouchDBService.PREFERENCES.SERVER.rdbServer.server + "/" + dbname;
    // Log.l(`addRDB(): Now fetching remote DB ${dbname} at ${url} ...`);
    if(rdbmap.has(dbname)) {
      return rdbmap.get(dbname);
    } else {
      let rdb1 = PouchDBService.StaticPouchDB(url, PouchDBService.PREFERENCES.SERVER.ropts);
      rdbmap.set(dbname, rdb1);
      // Log.l(`addRDB(): Added remote database ${url} to the list as ${dbname}.`);
      return rdbmap.get(dbname);
    }
  }
}
