import { Injectable, NgZone                                                                } from '@angular/core'              ;
import { Http                                                                              } from '@angular/http'              ;
import { Log, CONSOLE                                                                      } from '../config/config.functions' ;
import { Storage                                                                           } from '@ionic/storage'             ;
import { NativeStorage                                                                     } from 'ionic-native'               ;
import { PouchDBService                                                                    } from './pouchdb-service'          ;
import { AuthSrvcs                                                                         } from './auth-srvcs'               ;
import { AlertService                                                                      } from './alerts'                   ;
import { SrvrSrvcs                                                                         } from './srvr-srvcs'               ;
import { UserData                                                                          } from './user-data'                ;
import { Preferences                                                                       } from './preferences'              ;
import { Employee, Jobsite, WorkOrder, ReportOther, Message, Comment, Shift, PayrollPeriod } from '../domain/domain-classes'   ;

import 'rxjs/add/operator/map'                                  ;

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
  public static PREFS         : any = new Preferences()                            ;
  public prefs                : any = DBSrvcs.PREFS                                ;
  // public static PREFS         : any = new Preferences()                            ;
  // public prefs                : any = DBSrvcs.PREFS                                ;

  constructor(public http: Http, public zone: NgZone, private storage: Storage, private auth: AuthSrvcs, private server: SrvrSrvcs, public ud:UserData) {
    DBSrvcs.StaticPouchDB = PouchDBService.PouchInit();
    this.PouchDB = DBSrvcs.StaticPouchDB;

    window["dbserv"] = this;
    window["sdb"] = DBSrvcs;

    this.pdbOpts = {adapter: 'websql', auto_compaction: true};

    DBSrvcs.addDB(this.prefs.DB.reports);

    // let options = {
    //   live: true,
    //   retry: true,
    //   continuous: false
    // };
  }

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
    let ev1 = (a) => { Log.l(a.status); Log.l(a);};
    let db1 = DBSrvcs.addDB(dbname);
    let db2 = DBSrvcs.addRDB(dbname);
    let done = db1.replicate.to(db2, this.prefs.SERVER.repopts)
    .on('change'   , info => { Log.l("syncToServer(): change event fired. Status: ", info.status); Log.l(info);})
    .on('active'   , info => { Log.l("syncToServer(): active event fired. Status: ", info.status); Log.l(info);})
    .on('paused'   , info => { Log.l("syncToServer(): paused event fired. Status: ", info.status); Log.l(info);})
    .on('denied'   , info => { Log.l("syncToServer(): denied event fired. Status: ", info.status); Log.l(info);})
    .on('complete' , info => { Log.l("syncToServer(): complete event fired. Status: ", info.status); Log.l(info);})
    .on('error'    , info => { Log.l("syncToServer(): error event fired. Status: ", info.status); Log.l(info);})
    .on('cancel'   , info => { Log.l("syncToServer(): cancel event fired. Status: ", info.status); Log.l(info);});
    Log.l(`syncToServer(): Ran replicate, now returning cancel object.`);
    window["stat1"] = done;
    return done;
  }

  syncFromServer(dbname: string) {
    Log.l(`syncFromServer(): About to attempt replication of remote->'${dbname}'`);
    let ev2 = (b) => { Log.l(b.status); Log.l(b);};
    let db1 = DBSrvcs.addRDB(dbname);
    let db2 = DBSrvcs.addDB(dbname);
    let done = db1.replicate.to(db2, this.prefs.SERVER.repopts)
      .on('change',   info => { Log.l("syncFromServer(): change event fired. Status: ", info.status); Log.l(info); })
      .on('active',   info => { Log.l("syncFromServer(): active event fired. Status: ", info.status); Log.l(info); })
      .on('paused',   info => { Log.l("syncFromServer(): paused event fired. Status: ", info.status); Log.l(info); })
      .on('denied',   info => { Log.l("syncFromServer(): denied event fired. Status: ", info.status); Log.l(info); })
      .on('complete', info => { Log.l("syncFromServer(): complete event fired. Status: ", info.status); Log.l(info); })
      .on('error',    info => { Log.l("syncFromServer(): error event fired. Status: ", info.status); Log.l(info); })
      .on('cancel',   info => { Log.l("syncFromServer(): cancel event fired. Status: ", info.status); Log.l(info); });
    Log.l(`syncFromServer(): Ran replicate, now returning cancel object.`);
    window["stat2"] = done;
    return done;
  }

  syncSquaredToServer(dbname: string) {
    Log.l(`syncSquaredToServer(): About to attempt replication of '${dbname}'->remote`);
    // let ev2 = (b) => { Log.l(b.status); Log.l(b);};
    let db1 = this.addDB(dbname);
    let db2 = this.addRDB(dbname);
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
    let ev2 = (b) => { Log.l(b.status); Log.l(b);};
    let db1 = DBSrvcs.addRDB(dbname);
    let db2 = DBSrvcs.addDB(dbname);
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

  addDoc(dbname:string, newDoc) {
    return new Promise((resolve, reject) => {
      Log.l(`addDoc(): Adding document to ${dbname}:\n`, newDoc);
      let db1 = this.addDB(dbname);
      // db1.put(doc).then((res) => {
      db1.upsert(newDoc._id, (doc) => {
        if(doc) {
          let rev = doc._rev;
          doc = newDoc;
          doc._rev = rev;
          return doc;
        } else {
          doc = newDoc;
          delete doc._rev;
          return doc;
        }
      }).then(res => {
        if(!res.ok && !res.updated) {
          reject(res);

        } else {
          let rev = res._rev;
          // Log.l("addDoc(): Successfully added document.");
          Log.l(res);
          newDoc['_rev'] = rev;
          resolve(res);
        }
      }).catch((err) => {
        // Log.l("addDocv(): Failed while trying to add document!");
        console.error(err);
        reject(err);
      });
    });
  }

  getDoc(dbname:string, docID) {
    return new Promise((resolve, reject) => {
      let db1 = this.addDB(dbname);
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

  updateDoc(dbname:string, newDoc) {
    return new Promise((resolve,reject) => {
      let db1 = this.addDB(dbname);
      // let newDoc = doc;
      // return db1.put(doc);
      // db1.get(newDoc._id).then(res => {
      db1.upsert(newDoc._id, (doc) => {
        if(doc) {
          let id = doc._id;
          let rev = doc._rev;
          doc = newDoc;
          doc._rev = rev;
          return doc;
        } else {
          doc = newDoc;
          delete doc._rev;
          return doc;
        }
      }).then(res => {
        if(!res.ok && !res.updated) {
          reject(res);
        } else {
          resolve(res);
        }
      }).catch((err) => {
        Log.l(`updateDoc(): Error updating document doc ${newDoc._id}.`);
        Log.e(err)
        reject(err);
      });
    });
  }

  deleteDoc(dbname, newDoc) {
    return new Promise((resolve,reject) => {
      Log.l(`deleteDoc(): Attempting to delete doc ${newDoc._id}...`);
      let db1 = this.addDB(dbname);
      return db1.upsert(newDoc._id, (doc) => {
        if(doc) {
          let rev = doc._rev;
          doc = newDoc;
          doc._rev = rev;
          doc['_deleted'] = true;
          return doc;
        } else {
          doc = newDoc;
          doc['_deleted'] = true;
          delete doc._rev;
          return doc;
        }
      }).then((res) => {
        if(!res.ok && !res.updated) {
          Log.l("deleteDoc(): soft upsert error:\n", res);
          reject(res);
        } else {
          Log.l("deleteDoc(): Success:\n", res);
          resolve(res);
        }
      }).catch((err) => {
        Log.l("deleteDoc(): Error!");
        Log.e(err);
        reject(err);
      });
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

  public saveReport(report:WorkOrder) {
    return new Promise((resolve,reject) => {
      let db1 = this.addDB(this.prefs.DB.reports);
      db1.upsert(report._id, (doc) => {
        if(doc) {
          let rev = doc._rev;
          doc = report;
          doc._rev = rev;
          return doc;
        } else {
          doc = report;
          delete doc._rev;
          return doc;
        }
      }).then(res => {
        if(!res.ok && !res.updated) {
          reject(res);
        } else {
          resolve(res);
        }
      }).catch(err => {
        Log.l("saveReport(): Error saving report.");
        Log.e(err);
        reject(err);
      });
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
        return this.addLocalDoc(this.prefs.DB.reports, newProfileDoc);
      }).then((res) => {
        rdb1 = this.server.addRDB('sesa-employees');
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
      this.checkLocalDoc(this.prefs.DB.reports, documentID).then((res) => {
        Log.l("techProfile exists, reading it in...");
        return this.getDoc(this.prefs.DB.reports, documentID);
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

  public getAllConfigData() {
    Log.l("getAllConfigData(): Retrieving clients, locations, locIDs, loc2nd's, shiftRotations, and shiftTimes...");
    let dbConfig = this.prefs.DB.config;
    let rdb1     = this.addRDB(dbConfig);
    let db1      = this.addDB(dbConfig);
    return new Promise((resolve, reject) => {
      this.syncSquaredFromServer(dbConfig).then(res => {
        return db1.allDocs({ keys: ['client', 'location', 'locid', 'loc2nd', 'rotation', 'shift', 'shiftlength', 'shiftstarttime', 'other_reports'], include_docs: true })
      }).then((records) => {
        Log.l("getAllConfigData(): Retrieved documents:\n", records);
        let results = { client: [], location: [], locid: [], loc2nd: [], rotation: [], shift: [], shiftlength: [], shiftstarttime: [], report_types: [], training_types: [] };
        for (let record of records.rows) {
          let type = record.id;
          let types = record.id + "s";
          if(type === 'other_reports') {
            let doc                = record.doc         ;
            let report_types       = doc.report_types   ;
            let training_types     = doc.training_types ;
            results.report_types   = report_types       ;
            results.training_types = training_types     ;
          } else {
            let doc = record.doc;
            if (doc) {
              if(doc[types]) {
                for(let result of doc[types]) {
                  results[type].push(result);
                }
              } else {
                for(let result of doc.list) {
                  results[type].push(result);
                }
              }
            }
          }
        }
        Log.l("getAllConfigData(): Final config data retrieved is:\n", results);
        resolve(results);
      }).catch((err) => {
        Log.l("getAllConfig(): Error getting all config docs!");
        Log.e(err);
        reject(err);
      });
    });
  }

  getConfigData() {
    let db1 = PouchDBService.addDB(this.prefs.DB.config);
    let clients = null, locations = null, locids = null, loc2nds = null, rotations = null, shiftTimes = null;
    db1.get('client').then(res => {
      clients = res;
      return db1.get('locations');
    }).then(res => {
      locations = res;
    }).then(res => {

    }).then(res => {

    }).then(res => {

    }).catch(err => {
      Log.l("getConfigData(): Error retrieving clients, locations, locids, loc2nds, rotations, or shiftTimes!");
      Log.e(err);

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

  public saveReportOther(report: any) {
    return new Promise((resolve, reject) => {
      let db1 = this.addDB(this.prefs.DB.reports_other);
      db1.upsert(report._id, (doc) => {
        let id = doc['_id'] || null;
        let rev = doc['_rev'] || null;
        doc = report;
        if(id) { doc['_id'] = id; }
        if(rev) { doc['_rev'] = rev; }
        return doc;
      }).then(res => {
        Log.l("saveReportOther(): Save ReportOther via upsert, result:\n", res);
        if(!res.ok && !res.updated) {
          reject(res);
        } else {
          return this.syncSquaredToServer(this.prefs.DB.reports_other);
        }
      }).then(res => {
        Log.l("saveReportOther(): Done synchronizing ReportOther to server.");
        resolve(res);
      }).catch(err => {
        Log.l("saveReportOther(): Error saving report:\n", report);
        Log.e(err);
        reject(err);
      })
    });
  }



}
