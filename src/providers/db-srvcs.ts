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
export const noDD = "_\uffff";
export const noDesign = { include_docs: true, startkey: noDD };
export const liveNoDesign = { live: true, since: 'now', include_docs: true, startkey: noDD };
@Injectable()
/**
 * @class DBSrvcs
 *        methods [ addDoc, getDoc, allDoc, hndlChange ]
 */
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
  public static server        : string = "securedb.sesaonsite.com"                 ;
  public static protocol      : string = "https"                                   ;
  public static port          : string = "443"                                     ;
  // public static server        : string = "martiancouch.hplx.net"                   ;
  // public static server        : string = "162.243.157.16"                          ;
  // public static server        : string = "192.168.0.140:5984"                      ;
  // public static protocol      : string = "http"                                    ;
  public static opts          : any = {adapter: 'websql', auto_compaction: true}   ;
  public static ropts         : any = {adapter: DBSrvcs.protocol, skipSetup: true} ;
  public static cropts        : any = {adapter: DBSrvcs.protocol}                  ;
  public static rdbServer     : any = {protocol: DBSrvcs.protocol, server: DBSrvcs.server, opts: {adapter: DBSrvcs.protocol, skipSetup: true}};
  public static repopts       : any = {live: false, retry: false}                  ;
  // public static noDesign      : any = { include_docs: true, startkey: noDD };
  // public static liveNoDesign  : any = { live: true, since: 'now', include_docs: true, startkey: noDD };

  /**
   * @param {Http}
   * @param {NgZone}
   */
  // constructor(public http: Http, public zone: NgZone, private storage: Storage, private auth: AuthSrvcs) {
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

    DBSrvcs.addDB('reports');

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

  static getThisDB() {
    return DBSrvcs.db;
  }

  static getDBs() {
    return DBSrvcs.pdb;
  }

  static getRDBs() {
    return DBSrvcs.rdb;
  }

  static getServerInfo() {
    return DBSrvcs.protocol + "://" + DBSrvcs.server;
  }

  addDB(dbname: string) {
    return DBSrvcs.addDB(dbname);
  }

  static addDB(dbname: string) {
    let db1 = DBSrvcs.pdb;
    if(db1.has(dbname)) {
      Log.l(`addDB(): Not adding local database ${dbname} because it already exists.`);
      DBSrvcs.db = db1.get(dbname);
      return DBSrvcs.db;
    } else {
      db1.set(dbname, PouchDBService.StaticPouchDB('reports', DBSrvcs.opts));
      Log.l(`addDB(): Added local database ${dbname} to the list.`);
      DBSrvcs.db = db1.get(dbname);
      return DBSrvcs.db;
    }
  }

  addRDB(dbname: string) {
    return SrvrSrvcs.addRDB(dbname);
  }

  static addRDB(dbname: string) {
    let db1 = DBSrvcs.rdb;
    let url = DBSrvcs.rdbServer.protocol + "://" + DBSrvcs.rdbServer.server + "/" + dbname;
    Log.l(`addRDB(): Now fetching remote DB ${dbname} at ${url} ...`);
    if(db1.has(dbname)) {
      return db1.get(dbname);
    } else {
      let rdb1 = DBSrvcs.StaticPouchDB(url, DBSrvcs.ropts);
      db1.set(dbname, rdb1);
      Log.l(`addRDB(): Added remote database ${url} to the list as ${dbname}.`);
      return db1.get(dbname);
    }
  }

  static getDB(dbname: string) {
    let db1 = DBSrvcs.pdb;
    if(db1.has(dbname)) {
      Log.l(`getDB(): Found database ${dbname}.`);
      return db1.get(dbname);
    } else {
      Log.l(`getDB(): Could not find database ${dbname}.`);
      return false;
    }
  }

  static getRDB(dbname: string) {
    let db1 = DBSrvcs.rdb;
    let url = "", oneRDB = null;
    if(db1.has(dbname)) {
      oneRDB = db1.get(dbname);
      url = oneRDB.name;
      Log.l(`getRDB(): Found database ${dbname} at ${url}.`);
      return oneRDB;
    } else {
      Log.l(`getRDB(): Could not find database ${dbname}.`);
      return null;
    }
  }

  syncToServer(dbname: string) {
    Log.l(`syncToServer(): About to attempt replication of '${dbname}'->remote`);
    var ev1 = function(a) { Log.l(a.status); Log.l(a);};
    var db1 = DBSrvcs.addDB(dbname);
    var db2 = DBSrvcs.addRDB(dbname);
    // var done = DBSrvcs.StaticPouchDB.replicate(db1, db2, DBSrvcs.repopts);
    var done = db1.replicate.to(db2, DBSrvcs.repopts)
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
    // var done = DBSrvcs.StaticPouchDB.replicate(db1, db2, DBSrvcs.repopts);
    var done = db1.replicate.to(db2, DBSrvcs.repopts)
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
      db1.replicate.to(db2, DBSrvcs.repopts).then((res) => {
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
      db2.replicate.to(db1, DBSrvcs.repopts).then((res) => {
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

  addDoc(doc) {
    return new Promise((resolve, reject) => {
      Log.l("Adding document...");
      Log.l(doc);
      if (typeof doc._id === 'undefined') { doc._id = 'INVALID_DOC' }
      this.getDoc(doc._id).then((result) => {
        Log.l(`Cannot add document ${doc._id}, document already exists.`);
        Log.l(result);
        reject('Doc exists');
      }).catch((error) => {
        Log.l(`addDoc(): Could not get document ${doc._id}, hopefully it does not exist...`);
        if (error.status == '404') {
          DBSrvcs.db.put(doc).then((res) => {
            Log.l("addDoc(): Successfully added document.");
            Log.l(res);
            resolve(res);
          }).catch((err) => {
            Log.l("addDoc(): Failed while trying to add document (after 404 error in get)");
            console.error(err);
            reject(err);
          });
        } else {
          Log.l("addDoc(): Some other error occurred.");
          console.error(error);
          reject(error);
        }
      })
    });
  }

  updateReport(doc) {
    Log.l(`updateReport(): About to put doc ${doc._id}`);
    return DBSrvcs.db.put(doc).then((res) => {
      Log.l("updateReport(): Successfully added document.");
      Log.l(res);
    }).catch((err) => {
      Log.l("updateReport(): Failed while trying to add document (after 404 error in get)");
      console.error(err);
    });
  }


  getDoc(docID) {
    return new Promise((resolve, reject) => {
      // this.db.get(docID).then((result) => {
      DBSrvcs.db.get(docID).then((result) => {
        Log.l(`Got document ${docID}`);
        resolve(result);
      }).catch((error) => {
        Log.l("Error in DBSrvcs.getDoc()!");
        console.error(error);
        reject(error);
      });
    });
  }

  updateDoc(doc) {
    return DBSrvcs.db.put(doc);
  }

  deleteDoc(dbname, doc) {
    Log.l(`deleteDoc(): Attempting to delete doc ${doc._id}...`);
    let rdb1 = DBSrvcs.addDB(dbname);
    rdb1.remove(doc._id, doc._rev).then((res) => {
      Log.l("deleteDoc(): Success:\n", res);
    }).catch((err) => {
      Log.l("deleteDoc(): Error!");
      Log.e(err);
    });
  }

  checkLocalDoc(docID) {
    return new Promise((resolve, reject) => {
      DBSrvcs.db.get(docID).then((result) => {
        Log.l(`Local doc ${docID} exists`);
        resolve(true);
      }).catch((error) => {
        Log.l(`Local doc ${docID} does not exist`);
        resolve(false);
      });
    })
  }

  addLocalDoc(newDoc) {
    Log.l("Attempting to add local document...");
    Log.l("Local document to add:");
    Log.l(newDoc);
    return new Promise((resolve, reject) => {
      DBSrvcs.db.get(newDoc._id).then((res1) => {
        Log.l(`Now removing existing local document ${newDoc._id}`);
        return new Promise((resolveRemove, rejectRemove) => {
          let strID = res1._id;
          let strRev = res1._rev;
          DBSrvcs.db.remove(strID, strRev).then((res2) => {
            Log.l(`Successfully deleted local doc ${newDoc._id}, need to add new copy`);
            resolveRemove(res2);
          }).catch((errRemove) => {
            Log.l(`Error while removing local doc ${newDoc._id}.`);
            Log.l(newDoc);
            rejectRemove(errRemove);
          });
        });
      }).then(() => {
        if (typeof newDoc._rev == 'string') { delete newDoc._rev; }
        Log.l(`Now adding fresh copy of local document ${newDoc._id}`);
        return DBSrvcs.db.put(newDoc);
      }).then((success) => {
        Log.l(`Successfully deleted and re-saved local document ${newDoc._id}`);
        resolve(success);
      }).catch((err) => {
        Log.l(`Local document ${newDoc._id} does not exist, saving...`);
        if (typeof newDoc._rev == 'string') { delete newDoc._rev; }
        DBSrvcs.db.put(newDoc).then((final) => {
          Log.l(`Local document ${newDoc._id} was newly saved successfully`);
          resolve(final);
        }).catch((err) => {
          Log.l(`Error while saving new copy of local doc ${newDoc._id}!`);
          console.warn(err);
          resolve(null);
        })
      })
    })
  }

  deleteLocalDoc(doc) {
    Log.l("Attempting to delete local document...");
    return new Promise((resolve, reject) => {
      DBSrvcs.db.remove(doc).then((res) => {
        Log.l(`Successfully deleted local doc ${doc._id}`);
        resolve(true);
      }).catch((err) => {
        Log.l(`Error while deleting local doc ${doc._id}`);
        Log.l(doc);
        console.error(err);
        resolve(false);
      });
    });
  }

  saveTechProfile(doc) {
    Log.l("Attempting to save local techProfile...");
    // let updateFunction = (original) => {}
    doc._id = '_local/techProfile';
    let newProfileDoc = null, uid = null, rdb1 = null;
    return new Promise((resolve, reject) => {
      this.getTechProfile().then((res) => {
        Log.l("saveTechProfile(): About to process old and new:");
        Log.l(res);
        Log.l(doc);
        var strID = res['_id'];
        var strRev = res['_rev'];
        newProfileDoc = { ...res, ...doc, "_id": strID, "_rev": strRev };
        Log.l("saveTechProfile(): Merged profile is:");
        Log.l(newProfileDoc);
        Log.l("saveTechProfile(): now attempting save...");
        return this.addLocalDoc(newProfileDoc);
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
      return this.checkLocalDoc(documentID).then((res) => {
        Log.l("techProfile exists, reading it in...");
        return this.getDoc(documentID);
      }).then((res) => {
        Log.l("techProfile read successfully:");
        Log.l(res);
        resolve(res);
      }).catch((err) => {
        Log.l("techProfile not found, user not logged in.");
        console.error(err);
        reject(err);
      });
    });
  }

  allDocsOf(dbname: string) {
    return new Promise((resolve,reject) => {
      let db1 = DBSrvcs.addDB(dbname);
      db1.allDocs(noDesign).then((result) => {
        this.data = [];
        let docs = result.rows.map((row) => {
          if( row.doc.username === this.auth.getUser() ) { this.data.push(row.doc); }
          resolve(this.data);
        });
      }).catch((err) => {
        Log.l(`allDocsOf(): Error retrieving all documents from '${dbname}'`);
        Log.e(err);
        reject(err);
      })
    });
  }

  // get

  allDoc() {
    return new Promise(resolve => {
      DBSrvcs.rdb.allDocs(noDesign)

        .then((result) => {

          this.data = [];
          let docs = result.rows.map((row) => {
            if( row.doc.username === this.auth.getUser() ) { this.data.push(row.doc); }
            resolve(this.data);
          });

          // this.db.changes(DBSrvcs.liveNoDesign)
          DBSrvcs.db.changes(liveNoDesign)
            .on('change', (change) => { this.hndlChange(change); });

        })

        .catch((error) => { Log.l(error); });

    });
  }

  hndlChange(change) {

    this.zone.run(() => {
      let changedDoc = null;
      let changedIndex = null;

      this.data.forEach((doc, index) => {
        if (doc._id === change.id) {
          changedDoc = doc;
          changedIndex = index;
        }
      });

      if (change.deleted) { this.data.splice(changedIndex, 1); }
      else {
        if (changedDoc) { this.data[changedIndex] = change.doc; }
        else { this.data.push(change.doc); }
      }
    });

  }

} // Close exported Class: DBSrvcs
