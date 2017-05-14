import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import * as PouchDB from 'pouchdb';


@Injectable()
export class ProfileSettings {

  private _db;
  private _localDocsDB;

  initLocalDocs() {
    this._db = new PouchDB ('_localDocsDB');
  }

}
