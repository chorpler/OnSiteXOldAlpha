import 'rxjs/add/operator/map';
import * as PouchDB from 'pouchdb'                ;
import * as PDBAuth from 'pouchdb-authentication' ;
// import * as PouchDBAuth from 'pouchdb-auth'    ;
import * as pdbFind from 'pouchdb-find'           ;
import * as pdbUpsert from 'pouchdb-upsert'       ;
import * as pdbAllDBs from 'pouchdb-all-dbs'      ;
import { Injectable  } from '@angular/core'              ;
import { Platform    } from 'ionic-angular'              ;
import { Log         } from '../config/config.functions' ;
import { Preferences } from './preferences'              ;

@Injectable()
export class PouchDBService {
  public static StaticPouchDB : any;
  public static working       : boolean       = false                                        ;
  public static initialized   : boolean       = false                                        ;
  public static pdb           : any           = new Map()                                    ;
  public static rdb           : any           = new Map()                                    ;
  public static PREFS         : any           = new Preferences()                            ;
  public get prefs() { return PouchDBService.PREFS;};

  constructor(public platform:Platform) {
    Log.l('Hello PouchDBService Provider');
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
    let opts = {adapter: 'websql'};
    // let opts = {adapter: 'cordova-sqlite'};
    if(dbmap.has(dbname)) {
      // Log.l(`addDB(): Not adding local database ${dbname} because it already exists.`);
      return dbmap.get(dbname);
    } else {
      dbmap.set(dbname, PouchDBService.StaticPouchDB(dbname, opts));
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
      let rdb1 = PouchDBService.StaticPouchDB(url, SERVER.ropts);
      rdbmap.set(dbname, rdb1);
      // Log.l(`addRDB(): Added remote database ${url} to the list as ${dbname}.`);
      return rdbmap.get(dbname);
    }
  }
}
