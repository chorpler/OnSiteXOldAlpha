import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import * as PouchDB from 'pouchdb';
import * as PDBAuth from 'pouchdb-authentication';
import * as PouchDBAuth from 'pouchdb-auth';
import * as pdbFind from 'pouchdb-find';
import * as pdbUpsert from 'pouchdb-upsert';


@Injectable()
export class PouchDBService {
  public static StaticPouchDB: any;
  public static working: boolean = false;
  public static initialized: boolean = false;

  constructor() {
    console.log('Hello PouchDBService Provider');
    PouchDBService.PouchInit();
  }

  public static PouchInit() {
    if (!PouchDBService.initialized) {
      let tmp = PouchDB;
      tmp.plugin(pdbUpsert);
      // tmp.plugin(PouchDBAuth);
      tmp.plugin(PDBAuth);
      tmp.plugin(pdbFind);
      // tmp.plugin(pdbFind);
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

  public static getPouchDB() { return PouchDBService.StaticPouchDB; }
}
