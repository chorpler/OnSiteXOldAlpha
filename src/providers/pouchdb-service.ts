import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import * as PouchDB from 'pouchdb';
import * as PDBAuth from 'pouchdb-authentication';
import * as PouchDBAuth from 'pouchdb-auth';
import * as pdbFind from 'pouchdb-find';
import * as pdbUpsert from 'pouchdb-upsert';
import * as pdbAllDBs from 'pouchdb-all-dbs';
import { Log } from '../config/config.functions';
import { PREFS } from '../config/config.strings';

@Injectable()
export class PouchDBService {
  public static StaticPouchDB : any;
  public static working       : boolean       = false                                        ;
  public static initialized   : boolean       = false                                        ;
  public static pdb           : any           = new Map()                                    ;
  public static rdb           : any           = new Map()                                    ;

  constructor() {
    console.log('Hello PouchDBService Provider');
  }

  public static PouchInit() {
    if (!PouchDBService.initialized) {
      let tmp = PouchDB;
      tmp.plugin(pdbUpsert);
      tmp.plugin(PDBAuth);
      tmp.plugin(pdbFind);
      tmp.plugin(pdbAllDBs);
      window["pouchdbserv"] = this;
      window["StaticPouchDB"] = tmp;
      PouchDBService.StaticPouchDB = tmp;
      PouchDBService.initialized = true;
      return PouchDBService.StaticPouchDB;
    } else {
      return PouchDBService.StaticPouchDB;
    }
  }

  public static getAuthPouchDB() {
    return new Promise((resolve, reject) => {
      let tmp = PouchDB;
      tmp.plugin(pdbUpsert);
      tmp.plugin(pdbFind);
      tmp.plugin(PDBAuth);
      tmp.plugin(PouchDBAuth);
      window["pouchdbserv"] = this;
      window["StaticPouchDB"] = tmp;
      PouchDBService.StaticPouchDB = tmp;
      resolve(PouchDBService.StaticPouchDB);
    });
  }

  public static getPouchDB() {
    return PouchDBService.StaticPouchDB;
  }

  public getPouchDB() {
    return PouchDBService.getPouchDB();
  }


  addDB(dbname: string) {
    return PouchDBService.addDB(dbname);
  }

  static addDB(dbname: string) {
    let dbmap = PouchDBService.pdb;
    if(dbmap.has(dbname)) {
      Log.l(`addDB(): Not adding local database ${dbname} because it already exists.`);
      return dbmap.get(dbname);
    } else {
      dbmap.set(dbname, PouchDBService.StaticPouchDB(PREFS.DB.reports, PREFS.SERVER.opts));
      Log.l(`addDB(): Added local database ${dbname} to the list.`);
      return dbmap.get(dbname);
    }
  }

  addRDB(dbname: string) {
    return PouchDBService.addRDB(dbname);
  }

  static addRDB(dbname: string) {
    let rdbmap = PouchDBService.rdb;
    let url = PREFS.SERVER.rdbServer.protocol + "://" + PREFS.SERVER.rdbServer.server + "/" + dbname;
    Log.l(`addRDB(): Now fetching remote DB ${dbname} at ${url} ...`);
    if(rdbmap.has(dbname)) {
      return rdbmap.get(dbname);
    } else {
      let rdb1 = PouchDBService.StaticPouchDB(url, PREFS.SERVER.ropts);
      rdbmap.set(dbname, rdb1);
      Log.l(`addRDB(): Added remote database ${url} to the list as ${dbname}.`);
      return rdbmap.get(dbname);
    }
  }
}
