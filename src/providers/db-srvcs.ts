import { Injectable, NgZone } from '@angular/core'              ;
import { Http               } from '@angular/http'              ;
import { Log, CONSOLE       } from '../config/config.functions' ;
import { Storage            } from '@ionic/storage'             ;
import { NativeStorage      } from 'ionic-native'               ;
import 'rxjs/add/operator/map'                                  ;
import { PouchDBService    } from './pouchdb-service'           ;
import { AuthSrvcs         } from './auth-srvcs'                ;
import { SrvrSrvcs         } from './srvr-srvcs'                ;
import { UserData          } from './user-data'                 ;
import { PREFS             } from '../config/config.strings'    ;

export const noDD = "_\uffff";
export const noDesign = { include_docs: true, startkey: noDD };
export const liveNoDesign = { live: true, since: 'now', include_docs: true, startkey: noDD };
@Injectable()
export class DBSrvcs {

  data                        : any                                                ;
  public static db            : any                                                ;
  public static serverdb      : any                                                ;
  username                    : any                                                ;
  password                    : any                                                ;
  remote                      : any                                                ;
  PouchDB                     : any                                                ;
  remoteDB                    : any                                                ;
  pdbOpts                     : any                                                ;
  public static StaticPouchDB : any                                                ;
  public static pdb           : any = new Map()                                    ;
  public static rdb           : any = new Map()                                    ;
  public static ldbs          : any                                                ;
  public static rdbs          : any                                                ;
  public static prefs         : any = new PREFS()                                  ;
  public prefs                : any = DBSrvcs.prefs                                ;

  /**
   * @param {Http}
   * @param {NgZone}
   */
  constructor(public http: Http, public zone: NgZone, private storage: Storage, private auth: AuthSrvcs, private srvr: SrvrSrvcs, public ud:UserData) {
    // this.PouchDB = require("pouchdb");
    DBSrvcs.StaticPouchDB = PouchDBService.PouchInit();
    this.PouchDB = DBSrvcs.StaticPouchDB;
    // this.PouchDB.plugin(pdbAuth);
    // this.PouchDB.plugin(pdbUpsert);
    // this.PouchDB.plugin(require('pouchdb-upsert'));
    // this.PouchDB.plugin(require('pouchdb-authentication'));

    window["dbserv"] = this;
    window["sdb"] = DBSrvcs;

    this.pdbOpts = {adapter: 'websql', auto_compaction: true};

    DBSrvcs.addDB(this.prefs.DB.reports);

    let options = {
      live: true,
      retry: true,
      continuous: false
    };

    // this.db.sync(this.remote, options);
  }

  // -------------- DBSrvcs METHODS------------------------


  /**
   * Returns a copy of the PouchDB method, which can be used as normal.
   * @type {PouchDB}
   */
  getAdapter() {
    return this.PouchDB;
  }

  getThisDB() {
    return DBSrvcs.db;
  }

  getDBs() {
    return DBSrvcs.pdb;
  }

  getRDBs() {
    return DBSrvcs.rdb;
  }

  getServerInfo() {
    return this.prefs.SERVER.protocol + "://" + this.prefs.SERVER.server;
  }

  addDB(dbname: string) {
    return PouchDBService.addDB(dbname);
  }

  static addDB(dbname: string) {
    return PouchDBService.addDB(dbname);
  }

  addRDB(dbname: string) {
    return PouchDBService.addRDB(dbname);
  }

  static addRDB(dbname: string) {
    return PouchDBService.addRDB(dbname);
  }

  static getRDB(dbname: string) {
    return PouchDBService.addRDB(dbname);
  }

  syncToServer(dbname: string) {
    Log.l(`syncToServer(): About to attempt replication of '${dbname}'->remote`);
    var ev1 = function(a) { Log.l(a.status); Log.l(a);};
    var db1 = DBSrvcs.addDB(dbname);
    var db2 = DBSrvcs.addRDB(dbname);
    // var done = DBSrvcs.StaticPouchDB.replicate(db1, db2, DBSrvcs.repopts);
    var done = db1.replicate.to(db2, this.prefs.SERVER.repopts)
    .on('change'   , info => ev1)
    .on('active'   , info => ev1)
    .on('paused'   , info => ev1)
    .on('denied'   , info => ev1)
    .on('complete' , info => ev1)
    .on('error'    , info => ev1)
    .on('cancel'   , info => ev1);
    Log.l(`syncToServer(): Ran replicate, now returning cancel object.`);
    window["stat1"] = done;
    return done;
  }

  syncFromServer(dbname: string) {
    Log.l(`syncFromServer(): About to attempt replication of remote->'${dbname}'`);
    var ev2 = function(b) { Log.l(b.status); Log.l(b);};
    var db1 = DBSrvcs.addRDB(dbname);
    var db2 = DBSrvcs.addDB(dbname);
    var done = db1.replicate.to(db2, this.prefs.SERVER.repopts)
    .on('change'   , info => ev2)
    .on('active'   , info => ev2)
    .on('paused'   , info => ev2)
    .on('denied'   , info => ev2)
    .on('complete' , info => ev2)
    .on('error'    , info => ev2)
    .on('cancel'   , info => ev2);
    Log.l(`syncFromServer(): Ran replicate, now returning cancel object.`);
    window["stat2"] = done;
    return done;
  }

  syncSquaredToServer(dbname: string) {
    Log.l(`syncSquaredToServer(): About to attempt replication of '${dbname}'->remote`);
    var ev2 = function(b) { Log.l(b.status); Log.l(b);};
    var db1 = DBSrvcs.addDB(dbname);
    var db2 = DBSrvcs.addRDB(dbname);
    // var done = DBSrvcs.StaticPouchDB.replicate(db1, db2, DBSrvcs.repopts);
    return new Promise((resolve, reject) => {
      db1.replicate.to(db2, this.prefs.SERVER.repopts).then((res) => {
        Log.l(`syncSquaredToServer(): Successfully replicated '${dbname}'->remote!`);
        Log.l(res);
        resolve(res);
      }).catch((err) => {
        Log.l(`syncSquaredToServer(): Failure replicating '${dbname}'->remote!`);
        Log.l(err);
        reject(err);
      });
    });
  }

  syncSquaredFromServer(dbname: string) {
    Log.l(`syncSquaredFromServer(): About to attempt replication of remote->'${dbname}'`);
    var ev2 = function(b) { Log.l(b.status); Log.l(b);};
    var db1 = DBSrvcs.addRDB(dbname);
    var db2 = DBSrvcs.addDB(dbname);
    return new Promise((resolve, reject) => {
      db2.replicate.to(db1, this.prefs.SERVER.repopts).then((res) => {
        Log.l(`syncSquaredFromServer(): Successfully replicated remote->'${dbname}'`);
        Log.l(res);
        resolve(res);
      }).catch((err) => {
        Log.l(`syncSquaredFromServer(): Failure replicating remote->'${dbname}'`);
        Log.l(err);
        reject(err);
      });
    });
  }

  /**
   * Returns an object for accessing the specified PouchDB database
   * @method getDB
   * @param  {string} dbName Name of the desired database
   */
  getLocalDB(dbName: string) {
    return this.PouchDB(dbName);
  }

  getRemoteDB(dbURL: string) {
    return this.PouchDB(dbURL)
  }

  addDoc(dbname:string, doc) {
    return new Promise((resolve, reject) => {
      Log.l(`addDoc(): Adding document to ${dbname}:\n`, doc);
      // let dbname = db ? db : this.prefs.DB.reports;
      // let dbname = db ? db : this.prefs.DB.reports;
      let db1 = this.addDB(dbname);
      // if (typeof doc._id === 'undefined') { doc._id = 'INVALID_DOC' }
      db1.put(doc).then((res) => {
        Log.l("addDoc(): Successfully added document.");
        Log.l(res);
        resolve(res);
      }).catch((err) => {
        Log.l("addDoc(): Failed while trying to add document!");
        console.error(err);
        reject(err);
      });
    });
  }

  updateReport(doc) {
    Log.l(`updateReport(): About to put doc ${doc._id}`);
    let db1 = this.addDB(this.prefs.DB.reports);
    return db1.put(doc).then((res) => {
      Log.l("updateReport(): Successfully added document.");
      Log.l(res);
    }).catch((err) => {
      Log.l("updateReport(): Failed while trying to add document (after 404 error in get)");
      console.error(err);
    });
  }


  getDoc(dbname:string, docID) {
    return new Promise((resolve, reject) => {
      let db1 = this.addDB(this.prefs.DB.reports);
      db1.get(docID).then((result) => {
        Log.l(`Got document ${docID}`);
        resolve(result);
      }).catch((error) => {
        Log.l("Error in DBSrvcs.getDoc()!");
        console.error(error);
        reject(error);
      });
    });
  }

  updateDoc(dbname:string, doc) {
    let db1 = this.addDB(this.prefs.DB.reports);
    return db1.put(doc);
  }

  deleteDoc(dbname, doc) {
    Log.l(`deleteDoc(): Attempting to delete doc ${doc._id}...`);
    let db1 = this.addDB(dbname);
    return db1.remove(doc._id, doc._rev).then((res) => {
      Log.l("deleteDoc(): Success:\n", res);
    }).catch((err) => {
      Log.l("deleteDoc(): Error!");
      Log.e(err);
    });
  }

  checkLocalDoc(dbname:string, docID:any) {
    return new Promise((resolve, reject) => {
      let db1 = this.addDB(dbname);
      db1.get(docID).then((result) => {
        Log.l(`Local doc ${docID} exists`);
        resolve(true);
      }).catch((error) => {
        Log.l(`Local doc ${docID} does not exist`);
        reject(false);
      });
    })
  }

  addLocalDoc(dbname:string, newDoc:any) {
    return new Promise((resolve, reject) => {
      let db1 = this.addDB(dbname);
      Log.l("addLocalDoc(): 01) Now removing and adding local doc:\n", newDoc);
      db1.get(newDoc._id).then(res => {
        Log.l("addLocalDoc(): 02) Now removing result:\n",res);
        return db1.remove(res);
      }).catch((err) => {
        Log.l("addLocalDoc(): 03) Caught error removing res!");
        Log.e(err);
        Log.l("addLocalDoc(): 04) Now removing original doc:\n", newDoc);
        return db1.remove(newDoc);
      }).catch((err) => {
        Log.l("addLocalDoc(): 05) Caught error removing newDoc!");
        Log.e(err);
        Log.l("addLocalDoc(): 06) Now continuing to save doc.");
        return Promise.resolve();
      }).then(() => {
        Log.l("addLocalDoc(): 07) No more copy of local doc, now putting back:\n", newDoc);
        delete newDoc._rev;
        return db1.put(newDoc);
      }).then((res) => {
        Log.l(`addLocalDoc(): 08) Added local document '${newDoc._id}'.`)
        resolve(res);
      }).catch((err) => {
        Log.l(`addLocalDoc(): 09) Error adding local doc ${newDoc._id}.`);
        Log.e(err)
        reject(err);
      });
    });
  }

  deleteLocalDoc(dbname:string, doc) {
    Log.l("Attempting to delete local document...");
    let db1 = this.addDB(dbname);
    return db1.remove(doc).then((res) => {
      Log.l(`Successfully deleted local doc ${doc._id}`);
    }).catch((err) => {
      Log.l(`Error while deleting local doc ${doc._id}`);
      Log.e(err);
    });
  }

  saveTechProfile(doc) {
    Log.l("Attempting to save local techProfile...");
    let rdb1, uid, newProfileDoc, strID, strRev;
    return new Promise((resolve, reject) => {
      this.getTechProfile().then((res) => {
        Log.l("saveTechProfile(): About to process old and new:");
        Log.l(res);
        Log.l(doc);
        strID = res['_id'];
        newProfileDoc = { ...res, ...doc, "_id": strID};
        Log.l("saveTechProfile(): Merged profile is:");
        Log.l(newProfileDoc);
        Log.l("saveTechProfile(): now attempting save...");
        return this.addLocalDoc('reports', newProfileDoc);
      }).then((res) => {
        rdb1 = this.srvr.addRDB('sesa-employees');
        let name = this.ud.getUsername();
        uid = `org.couchdb.user:${name}`;
        Log.l(`saveTechProfile(): Now fetching remote copy with id '${uid}'...`);
        return rdb1.get(uid);
      }).then((res) => {
        Log.l(`saveTechProfile(): Got remote user ${uid}:\n`, res);
        newProfileDoc._id = res._id;
        newProfileDoc._rev = res._rev;
        return rdb1.put(newProfileDoc);
      }).then((res) => {
        Log.l("saveTechProfile(): Saved updated techProfile:\n", res);
        resolve(res);
      }).catch((err) => {
        Log.l("saveTechProfile(): Error saving to sesa-employees database!");
        Log.l("saveTechProfile(): Error merging or saving profile!");
        Log.e(err);
        reject(err);
      });
    });
  }

  getTechProfile() {
    let documentID = "_local/techProfile";
    return new Promise((resolve, reject) => {
      this.checkLocalDoc('reports', documentID).then((res) => {
        Log.l("techProfile exists, reading it in...");
        return this.getDoc('reports', documentID);
      }).then((res) => {
        Log.l("techProfile read successfully:");
        Log.l(res);
        resolve(res);
      }).catch((err) => {
        Log.l("techProfile not found, user not logged in.");
        Log.e(err);
        reject(err);
      });
    });
  }

  savePreferences(prefs:any) {
    return this.storage.set("PREFS", prefs).then((res) => {
      Log.l("savePreferences(): Successfully saved preferences:\n", prefs);
    }).catch((err) => {
      Log.l("savePreferences(): Error saving preferences!");
      Log.e(err);
    });
  }

  getPreferences() {
    return this.storage.get("PREFS").then((prefs) => {
      if(prefs) {
        Log.l("getPreferences(): PREFS found, returning.")
        return prefs;
      } else {
        Log.l("getPreferences(): PREFS not found, returning null.");
        return null;
      }
    }).catch((err) => {
      Log.l("getPreferences(): Error trying to retrieve PREFS.");
      Log.e(err);
    });
  }

}
