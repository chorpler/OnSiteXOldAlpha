import { Injectable, NgZone                         } from '@angular/core'                ;
import { Log, CONSOLE, moment, Moment, isMoment     } from 'onsitex-domain'      ;
import { Storage                                    } from '@ionic/storage'               ;
import { NativeStorage                              } from '@ionic-native/native-storage' ;
import { PouchDBService                             } from './pouchdb-service'            ;
import { AuthSrvcs                                  } from './auth-srvcs'                 ;
import { AlertService                               } from './alerts'                     ;
import { ServerService                                  } from './server-service'                 ;
import { UserData                                   } from './user-data'                  ;
import { Preferences                                } from './preferences'                ;
import { Employee, Jobsite, Report, ReportOther, } from 'onsitex-domain'        ;
import { Message, Comment, Shift, PayrollPeriod     } from 'onsitex-domain'        ;


export const noDD = "_\uffff";
export const noDesign = { include_docs: true, startkey: noDD };
export const liveNoDesign = { live: true, since: 'now', include_docs: true, startkey: noDD };
@Injectable()
export class DBService {

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
  public prefs                : any = DBService.PREFS                                ;
  // public static PREFS         : any = new Preferences()                            ;
  // public prefs                : any = DBService.PREFS                                ;

  constructor(public zone: NgZone, private storage: Storage, private auth: AuthSrvcs, private server: ServerService, public ud:UserData) {
    DBService.StaticPouchDB = PouchDBService.PouchInit();
    this.PouchDB = DBService.StaticPouchDB;

    window["dbserv"] = this;
    window["sdb"] = DBService;

    // this.pdbOpts = {adapter: 'websql', auto_compaction: true};

    DBService.addDB(this.prefs.DB.reports);

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
  public getAdapter() {
    return this.PouchDB;
  }

  public getThisDB() {
    return DBService.db;
  }

  public getDBs() {
    return DBService.pdb;
  }

  public getRDBs() {
    return DBService.rdb;
  }

  public getServerInfo() {
    return this.prefs.SERVER.protocol + "://" + this.prefs.SERVER.server;
  }

  public addDB(dbname:string) {
    return PouchDBService.addDB(dbname);
  }

  public static addDB(dbname:string) {
    return PouchDBService.addDB(dbname);
  }

  public addRDB(dbname:string) {
    return PouchDBService.addRDB(dbname);
  }

  public static addRDB(dbname:string) {
    return PouchDBService.addRDB(dbname);
  }

  public static getRDB(dbname:string) {
    return PouchDBService.addRDB(dbname);
  }

  public syncToServer(dbname:string) {
    Log.l(`syncToServer(): About to attempt replication of '${dbname}'->remote`);
    let ev1 = (a) => { Log.l(a.status); Log.l(a);};
    let db1 = DBService.addDB(dbname);
    let db2 = DBService.addRDB(dbname);
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

  public syncFromServer(dbname:string) {
    Log.l(`syncFromServer(): About to attempt replication of remote->'${dbname}'`);
    let ev2 = (b) => { Log.l(b.status); Log.l(b);};
    let db1 = DBService.addRDB(dbname);
    let db2 = DBService.addDB(dbname);
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

  public syncSquaredToServer(dbname:string) {
    Log.l(`syncSquaredToServer(): About to attempt replication of '${dbname}'->remote`);
    // let ev2 = (b) => { Log.l(b.status); Log.l(b);};
    let db1 = this.addDB(dbname);
    let db2 = this.addRDB(dbname);
    // var done = DBService.StaticPouchDB.replicate(db1, db2, DBService.repopts);
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

  public syncSquaredFromServer(dbname:string) {
    Log.l(`syncSquaredFromServer(): About to attempt replication of remote->'${dbname}'`);
    let ev2 = (b) => { Log.l(b.status); Log.l(b);};
    let db1 = DBService.addRDB(dbname);
    let db2 = DBService.addDB(dbname);
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

  public syncReportsFromServer(dbname:string) {
    Log.l(`syncReportsFromServer(): Starting up...`);
    return new Promise((resolve,reject) => {
      let db1 = this.addDB(dbname);
      let db2 = this.addRDB(dbname);
      let user = this.data.getUsername();
      db2.replicate.to(db1, {
        filter: 'ref/forTech',
        query_params: {username: user}
      }).then(res => {
        Log.l("syncReportsFromServer(): Successfully replicated filtered reports from server.\n", res);
        resolve(res);
      }).catch(err => {
        Log.l("syncReportsFromServer(): Error during replication!");
        Log.e(err);
        reject(err);
      });
    });
  }

  public addDoc(dbname:string, newDoc:any) {
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
        Log.l(`addDoc(): Failed while trying to add document '${newDoc._id}'`);
        Log.e(err);
        reject(err);
      });
    });
  }

  public getDoc(dbname:string, docID) {
    return new Promise((resolve, reject) => {
      let db1 = this.addDB(dbname);
      db1.get(docID).then((result) => {
        Log.l(`Got document ${docID}`);
        resolve(result);
      }).catch((error) => {
        Log.l("Error in DBService.getDoc()!");
        console.error(error);
        reject(error);
      });
    });
  }

  public updateDoc(dbname:string, newDoc) {
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

  public deleteDoc(dbname, newDoc) {
    return new Promise((resolve,reject) => {
      Log.l(`deleteDoc(): Attempting to delete doc ${newDoc._id}...`);
      let db1 = this.addDB(dbname);
      let i = 0;
      db1.putIfNotExists(newDoc).then(res => {
        return db1.upsert(newDoc._id, (doc) => {
          if(i++ > 5) { return false;}
          if(doc && doc._id) {
          //   let rev = doc._rev;
          //   doc = newDoc;
          // doc._rev = rev;
            Log.l("deleteDoc(): Doc exists.\n", doc);
            doc['_deleted'] = true;
            return doc;
          } else {
            Log.l("deleteDoc(): Doc does not exist:\n", doc);
            // doc = newDoc;
            // doc['_id'] = newDoc._id;
            // doc['_rev'] = newDoc._rev;
            newDoc['_deleted'] = true;
            delete newDoc._rev;
            // delete doc._rev;
            Log.l(`deleteDoc(): upsert will return doc:\n`, newDoc);
            return newDoc;
          }
          // return false;
          // doc._deleted = true;
        });
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

  public checkLocalDoc(dbname:string, docID:any) {
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

  public addLocalDoc(dbname:string, newDoc:any) {
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

  public deleteLocalDoc(dbname:string, doc) {
    Log.l("Attempting to delete local document...");
    let db1 = this.addDB(dbname);
    return db1.remove(doc).then((res) => {
      Log.l(`Successfully deleted local doc ${doc._id}`);
    }).catch((err) => {
      Log.l(`Error while deleting local doc ${doc._id}`);
      Log.e(err);
    });
  }

  public async saveReport(report:Report) {
    // return new Promise((resolve,reject) => {
    try {
      let reportDoc = report.serialize();
      let db1 = this.addDB(this.prefs.DB.reports);
      let res = await db1.upsert(report._id, (doc) => {
        if(doc && doc._rev) {
          let rev = doc._rev;
          doc = reportDoc;
          doc._rev = rev;
        } else {
          doc = reportDoc;
          delete doc._rev;
        }
        return doc;
      });
      if(!res.ok && !res.updated) {
        throw new Error(`saveReport(): Upsert error for report '${report._id}'`);
      } else {
        return res;
      }
    } catch(err) {
      Log.l(`saveReport(): Error saving report '${report._id}'`);
      Log.e(err);
      throw new Error(err);
    }
  }

  public saveTechProfile(doc) {
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
        rdb1 = this.server.addRDB(this.prefs.DB.employees);
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
        this.ud.setTechProfile(doc);
        resolve(res);
      }).catch((err) => {
        Log.l("saveTechProfile(): Error saving to sesa-employees database!");
        Log.l("saveTechProfile(): Error merging or saving profile!");
        Log.e(err);
        reject(err);
      });
    });
  }

  public getTechProfile() {
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

  public getConfigData() {
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

  public savePreferences(prefs:any) {
    return this.storage.set("PREFS", prefs).then((res) => {
      Log.l("savePreferences(): Successfully saved preferences:\n", prefs);
    }).catch((err) => {
      Log.l("savePreferences(): Error saving preferences!");
      Log.e(err);
    });
  }

  public getPreferences() {
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

  public async saveReportOther(report:ReportOther) {
    try {
      let reportDoc = report.serialize();
      let db1 = this.addDB(this.prefs.DB.reports_other);
      let res = await db1.upsert(report._id, (doc) => {
        if(doc && doc._rev) {
          let rev = doc._rev;
          doc = reportDoc;
          doc._rev = rev;
        } else {
          doc = reportDoc;
          delete doc._rev;
        }
        return doc;
      });
      Log.l("saveReportOther(): Save ReportOther via upsert, result:\n", res);
      if(!res.ok && !res.updated) {
        // throw new Error(`saveReportOther(): Upsert error for document '${report._id}'`)
        throw new Error(res);
      } else {
        res = await this.syncSquaredToServer(this.prefs.DB.reports_other);
        Log.l("saveReportOther(): Done synchronizing ReportOther to server.");
        return res;
      }
    } catch(err) {
      Log.l(`saveReportOther(): Error saving ReportOther '${report._id}'`);
      Log.e(err);
      throw new Error(err);
    }
  }

  public async saveReadMessage(message:Message) {
    try {
      let dbname = this.prefs.DB.messages;
      let db1 = this.addDB(dbname);
      let out = message.serialize();
      Log.l("saveReadMessage(): Now attempting to save serialized message:\n", out);
      // db1.putIfNotExists()
      let res = await db1.upsert(message._id, (doc) => {
        if(doc && doc._rev) {
          doc.read = true;
          return doc;
        } else {
          return message;
        }
      });
      if(!res.ok && !res.updated) {
        Log.l("saveReadMessage(): Upsert error, return did not contain 'ok' or 'updated' for message:\n", message);
        Log.e(res);
        throw new Error(res);
      } else {
        Log.l("saveReadMessage(): Successfully saved message, result:\n", res);
        return res;
      }
    } catch(err) {
      Log.l(`saveReadMessage(): Error while upserting message.read=true.`);
      Log.e(err);
      throw new Error(err);
    }
  }

}
