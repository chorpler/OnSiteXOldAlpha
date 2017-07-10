import { Injectable     } from '@angular/core'                ;
import { Http           } from '@angular/http'                ;
import { PouchDBService } from '../providers/pouchdb-service' ;
import { Log            } from '../config/config.functions'   ;
import { UserData       } from '../providers/user-data'       ;
import { Message        } from '../domain/message'            ;
import { Preferences    } from '../providers/preferences'     ;
import { Comment        } from '../domain/comment'            ;
import { Jobsite        } from '../domain/jobsite'            ;
import { WorkOrder      } from '../domain/workorder'          ;
import { ReportOther    } from '../domain/reportother'        ;
import { Employee       } from '../domain/employee'           ;
import { Shift          } from '../domain/shift'              ;
import { PayrollPeriod  } from '../domain/payroll-period'     ;
import 'rxjs/add/operator/map'                                ;

export const noDD     = "_\uffff";
export const noDesign = {include_docs: true, startkey: noDD };
export const PouchDB  = PouchDBService.PouchInit();

/*
  Generated class for the SrvrSrvcs provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class SrvrSrvcs {
	public PouchDB              : any    = {                                                }     ;
	public RemoteDB             : any    = {                                                }     ;
	public static staticRDB     : any    = {                                                }     ;
	public static rdb           : any    = new Map()                                              ;
  public static ldb           : any    = new Map()                                              ;
	public static StaticPouchDB : any                                                             ;
  public static userInfo      : any    = {u: '', p: '' }                                        ;
  public static prefs         : any    = new Preferences()                                      ;
  public prefs                : any    = SrvrSrvcs.prefs                                        ;

  constructor(public http: Http, public ud:UserData) {
    Log.l("Hello SrvrSrvcs provider");
    window["ServerServices"] = this;
    window["SrvrSrvcs"] = SrvrSrvcs;
    SrvrSrvcs.StaticPouchDB = PouchDBService.PouchInit();
    this.PouchDB = SrvrSrvcs.StaticPouchDB;
    this.RemoteDB = SrvrSrvcs.StaticPouchDB;
    // Log.l("SrvrSrvcs: StaticPouchDB is:\n",SrvrSrvcs.StaticPouchDB);
  }

  public static getAuthHeaders(user: string, pass: string) {
    let authToken = 'Basic ' + window.btoa(user + ':' + pass);
    let ajaxOpts = { headers: { Authorization: authToken } };
    return ajaxOpts;
  }

  public static getBaseURL() {
    let port = Number(this.prefs.SERVER.port);
    let server = this.prefs.SERVER.server;
    let protocol = this.prefs.SERVER.protocol;
    return port && port !== 443 ? `${protocol}://${server}:${port}` : `${protocol}://${server}`;
  }

  public static getInsecureLoginBaseURL(user:string, pass:string) {
    let port = this.prefs.SERVER.port;
    let server = this.prefs.SERVER.server;
    let protocol = this.prefs.SERVER.protocol;
    if (port !== '' && port !== undefined && port !== null) {
      return `${protocol}://${user}:${pass}@${server}:${port}`;
    } else {
      return `${protocol}://${user}:${pass}@${server}`;
    }
  }

  public static getRemoteDatabaseURL(dbname?: string) {
    let url1 = SrvrSrvcs.getBaseURL();
    let name = dbname || "_session";
    url1 = `${url1}/${name}`;
    return url1;
  }

  public static getGeolocationHeaders(user:string, pass:string) {
    let ajaxOpts = SrvrSrvcs.getAuthHeaders(user, pass);
    ajaxOpts['headers']['Content-Type'] = "application/json";
    ajaxOpts['headers']['Accept'] = "application/json";
    return ajaxOpts['headers'];
  }

  public static getGeolocationURL(user:string, pass:string) {
    // let ajaxOpts = SrvrSrvcs.getAuthHeaders(user, pass);
    // ajaxOpts['headers']['Content-Type'] = "application/json";
    // ajaxOpts['headers']['Accept'] = "application/json";
    // let URL = `${SrvrSrvcs.getBaseURL()}/sesa_geolocation`;
    let URL = `${SrvrSrvcs.getInsecureLoginBaseURL(user, pass)}/sesa_geolocation`;
    return URL;
  }

  public getAuthHeaders(user:string, pass:string) {
    return SrvrSrvcs.getAuthHeaders(user, pass);
  }

  public getBaseURL() {
    return SrvrSrvcs.getBaseURL();
  }

  public getInsecureLoginBaseURL(user:string, pass:string) {
    return SrvrSrvcs.getInsecureLoginBaseURL(user, pass);
  }

  public getRemoteDatabaseURL(dbname?:string) {
    return SrvrSrvcs.getRemoteDatabaseURL(dbname);
  }

  public getGeolocationHeaders(user:string, pass:string) {
    return SrvrSrvcs.getGeolocationHeaders(user, pass);
  }

  public getGeolocationURL(user:string, pass:string) {
    return SrvrSrvcs.getGeolocationURL(user, pass);
  }

  public loginToDatabase(user:string, pass:string, dbname:string) {
    let adapter = this.prefs.SERVER.protocol;
    let authToken = 'Basic ' + window.btoa(user + ':' + pass);
    let authOpts = { headers: { Authorization: authToken } };
    let ajaxOpts = { ajax: authOpts };
    let opts = { adapter: adapter, skip_setup: true, ajax: { withCredentials: true, headers: authOpts.headers, auth: { username: user, password: pass } } };

    return new Promise((resolve, reject) => {
      Log.l(`loginToDatabase(): About to login to database ${dbname} with options:\n`, opts);
      let rdb1 = this.addRDB(dbname);
      rdb1.login(user, pass, opts).then(res => {
        return rdb1.getSession();
      }).then((session) => {
        if (typeof session.info === 'undefined' || typeof session.info.authenticated !== 'string') {
          Log.l("loginToDatabase(): Authentication failed");
          SrvrSrvcs.userInfo = { u: '', p: '' };
          resolve(false);
        } else {
          Log.l("loginToDatabase(): Authentication successful.");
          SrvrSrvcs.userInfo = { u: user, p: pass };
          resolve(true);
        }
      }).catch(err => {
        Log.l("loginToDatabase(): Error logging in.");
        Log.e(err);
        reject(err);
      });
    });
  }

  loginToServer(user:string, pass:string, dbname?:string, auto?:boolean) {
  	let adapter = this.prefs.SERVER.protocol;
    return new Promise((resolve,reject) => {
      let dbURL = '_session';
  		if(dbname) {
  			dbURL = dbname;
  		}
      let url = SrvrSrvcs.getBaseURL() + '/' + dbURL;
			let authToken = 'Basic ' + window.btoa(user + ':' + pass);
      let authOpts = { headers: { Authorization: authToken } };
      let ajaxOpts = { ajax: authOpts };
      let opts = { adapter: adapter, skip_setup: true, ajax: { withCredentials: true, headers: authOpts.headers, auth: { username: user, password: pass } } };
			let rdb1 = this.addRDB(dbURL);
      let tprofile = null;
      Log.l(`loginToServer(): About to login with u '${user}', p '${pass}', dburl '${dbURL}'.`);
      this.loginToDatabase(user, pass, dbURL).then(res => {
      // rdb1.login(user, pass, opts).then((res) => {
  		// 	return rdb1.getSession();
  		// }).then((session) => {
				// if(typeof session.info === 'undefined' || typeof session.info.authenticated !== 'string') {
				// 	Log.l("loginToServer(): Authentication failed");
				// 	SrvrSrvcs.userInfo = {u: '', p: ''};
				// 	resolve(false);
				// } else {
					Log.l("loginToServer(): Authentication successful.");
					// SrvrSrvcs.userInfo = {u: user, p: pass};
          // this.ud.storeCredentials(user, pass);
          // this.ud.setLoginStatus(true);
          this.ud.storeCredentials(user, pass);
          let rdb2 = this.addRDB(this.prefs.DB.employees);
          if(auto === undefined || auto === false) {
            let uid = `org.couchdb.user:${user}`;
            rdb2.get(uid).then((res) => {
              Log.l("loginToServer(): got user object from server!\n", res);
              tprofile = res;
              // tprofile.docID = tprofile._id;
              // tprofile._id = "_local/techProfile";
              return this.saveTechProfile(tprofile);
            }).then((res) => {
              Log.l("loginToServer(): Successfully saved user profile!\n", res);
              this.ud.setTechProfile(tprofile);
              this.ud.setLoginStatus(true);
              resolve(true);
            }).catch((err) => {
              Log.l("loginToServer(): Error getting user object from server!");
              Log.e(err);
              SrvrSrvcs.userInfo = {u: '', p: ''};
              resolve(false);
            });
          } else {
            this.getTechProfile().then((res) => {
              this.ud.setTechProfile(res);
              this.ud.setLoginStatus(true);
              resolve(true);
            });
          }
				// }
			}).catch((err) => {
				Log.l("loginToServer(): Authentication successful.");
  			Log.e(err);
				SrvrSrvcs.userInfo = {u: '', p: ''};
  			resolve(false);
			})
		});
  }

  getTechProfile() {
    let db1 = SrvrSrvcs.addDB(this.prefs.DB.reports);
    return new Promise((resolve,reject) => {
      db1.get('_local/techProfile').then((res) => {
        Log.l(`getTechProfile(): Success! Result:\n`, res);
        resolve(res);;
      }).catch((err) => {
        Log.l(`getTechProfile(): Error!`);
        Log.e(err);
        reject(err);
      });
    });
  }

  getUserData(user) {
    let rdb1 = SrvrSrvcs.addRDB(this.prefs.DB.reports);
		return rdb1.getUser(user);
  }

  public addRDB(dbname:string) {
    return SrvrSrvcs.addRDB(dbname);
  }

  public static addRDB(dbname: string) {
    let db1 = PouchDBService.rdb;
    let url = SrvrSrvcs.getRemoteDatabaseURL(dbname);
    // Log.l(`addRDB(): Now fetching remote DB '${dbname}' at '${url}' ...`);
    let rdb1 = null;
    if (db1.has(dbname)) {
      // return db1.get(dbname);
      // Log.l(`Found DB '${dbname}' already exists, returning...`);
      rdb1 = db1.get(dbname);
      // resolve(rdb1);
      return rdb1;
    } else {
      // Log.l(`DB '${dbname}' does not already exist, storing and returning...`);
      rdb1 = PouchDBService.StaticPouchDB(url, this.prefs.SERVER.ropts);
      db1.set(dbname, rdb1);
      return rdb1;
    }
  }

  public addDB(dbname:string) {
    return PouchDBService.addDB(dbname);
  }

  public static addDB(dbname: string) {
    let db1 = PouchDBService.pdb;
    // Log.l(`Server.addDB(): Now checking local db '${dbname}' ...`);
    let ldb1 = null;
    if (db1.has(dbname)) {
      // Log.l(`Found DB '${dbname}' already exists, returning...`);
      ldb1 = db1.get(dbname);
      return ldb1;
    } else {
      // Log.l(`DB '${dbname}' does not already exist, storing and returning...`);
      ldb1 = PouchDBService.StaticPouchDB(dbname, this.prefs.SERVER.opts);
      db1.set(dbname, ldb1);
      return ldb1;
    }
  }

  saveTechProfile(doc) {
    Log.l("Server.saveTechProfile(): Attempting to save local techProfile...");
    // let updateFunction = (original) => {}
    let localID = '_local/techProfile';
    let newProfileDoc = null, uid = null, rdb1 = null, db1 = null, localProfileDoc = null;
    localProfileDoc = Object.assign({}, doc);
    localProfileDoc.docID = doc._id;
    localProfileDoc._id   = localID;
    return new Promise((resolve, reject) => {
      db1 = this.addDB(this.prefs.DB.reports);
      db1.upsert(localProfileDoc._id, (doc) => {
        if(doc) {
          let rev = doc._rev;
          doc = localProfileDoc;
          doc._rev = rev;
          return doc;
        } else {
          doc = localProfileDoc;
          delete doc._rev;
          return doc;
        }
      }).then(res => {
        if(!res.ok && !res.updated) {
          Log.l("saveTechProfile(): soft upsert error:\n", res);
          reject(res);
        } else {
          resolve(res);
        }
      // db1.get(localID).then((res) => {
      //   Log.l("Server.saveTechProfile(): Found techProfile locally. Deleting it.");
      //   let id = res._id;
      //   let rev = res._rev;
      //   return db1.remove(id, rev);
      // }).then((res) => {
      //   Log.l("Server.saveTechProfile(): Deleted techProfile locally. Now updating it.");
      //   return db1.put(localProfileDoc);
      // }).then((res) => {
      //   Log.l("Server.saveTechProfile(): Saved local profile successfully!\n", res);
      //   resolve(localProfileDoc);
      // }).catch((err) => {
      //   Log.l("Server.saveTechProfile(): Local tech profile not found. Creating.");
      //   delete localProfileDoc._rev;
      //   // doc.docID = doc._id;
      //   // doc._id = localID;
      //   // delete doc._rev;
      //   Log.l("Server.saveTechProfile(): Attempting to save local tech profile:\n", doc);
      //   return db1.put(localProfileDoc);
      // }).then((res) => {
      //   Log.l("Server.saveTechProfile(): Successfully saved local tech profile:\n", res);
      // //   rdb1 = this.srvr.addRDB('sesa-employees');
      // //   uid = `org.couchdb.user:${doc.username}`;
      // //   Log.l(`saveTechProfile(): Now fetching remote copy with id '${uid}'...`);
      // //   return rdb1.get(uid);
      // // }).then((res) => {
      // //   Log.l(`saveTechProfile(): Got remote user ${uid}:\n`, res);
      // //   newProfileDoc._id = res._id;
      // //   newProfileDoc._rev = res._rev;
      // //   return rdb1.put(newProfileDoc);
      // // }).then((res) => {
      // //   Log.l("saveTechProfile(): Saved updated techProfile:\n", res);
      //   resolve(localProfileDoc);
      }).catch((err) => {
        Log.l("Server.saveTechProfile(): Error saving to local tech profile!");
        Log.e(err);
        reject(err);
      });
    });
  }

  getReportsForTech(tech:string, dates?:any):Promise<Array<WorkOrder>> {
    return new Promise((resolve, reject) => {
      let u = this.ud.getUsername();
      let p = this.ud.getPassword();
      let woArray = new Array<WorkOrder>();
      let query:any = {selector: {username: {$eq: tech}}, limit:10000};
      Log.l("getReportsForTech(): Using database: ", this.prefs.DB.reports);
      if(dates) {
        if(dates['start'] !== undefined && dates['end'] === undefined) {
          query.selector = {$and: [{username: {$eq: tech}}, {rprtDate: {$eq: dates['start']}}]};
        } else if(dates['start'] !== undefined && dates['end'] !== undefined) {
          query.selector = { $and: [{ username: { $eq: tech } }, {rprtDate: { $geq: dates['start'] }}, {rprtDate: {$leq: dates['end']}}]};
        }
      }
      // this.loginToDatabase(u, p, this.prefs.DB.reports).then((res) => {
        // if (res) {
          let rdb1 = this.addRDB(this.prefs.DB.reports);
          // rdb1.createIndex({index: {fields: ['username']}}).then((res) => {
          //   Log.l(`getReportsForTech(): index created successfully, now running query...`);
          //   return
            rdb1.find(query)
            // ;
          // })
          .then((res) => {
            Log.l(`getReportsForTech(): Got reports for '${tech}':\n`, res);
            // let woArray = new Array<WorkOrder>();
            for(let doc of res.docs) {
              let wo = new WorkOrder();
              wo.readFromDoc(doc);
              woArray.push(wo);
            }
            Log.l("getReportsForTech(): Returning final reports array:\n", woArray);
            resolve(woArray);
          }).catch((err) => {
            Log.l(`getReportsForTech(): Error getting reports for '${tech}'.`);
            Log.l(err);
            resolve(woArray);
          });
        // } else {
          // resolve(woArray);
        // }
      // }).catch((err) => {
      //   Log.l("getReportsForTech(): Error logging in to server.");
      //   if(err.status === 401) {

      //   }
      //   Log.e(err);
      //   resolve(woArray);
      });
    // });
  }

  getReportsOtherForTech(tech: string, dates?: any):Promise<Array<ReportOther>> {
    return new Promise((resolve, reject) => {
      let u = this.ud.getUsername();
      let p = this.ud.getPassword();
      // let c = this.ud.getCredentials();
      // Log.l("getReportsForTech(): Got credentials:\n", c);
      let query: any = { selector: { username: { $eq: tech } }, limit: 10000 };
      Log.l("getReportsForTech(): Using database: ", this.prefs.DB.reports);
      if (dates) {
        if (dates['start'] !== undefined && dates['end'] === undefined) {
          query.selector = { $and: [{ username: { $eq: tech } }, { rprtDate: { $eq: dates['start'] } }] };
        } else if (dates['start'] !== undefined && dates['end'] !== undefined) {
          query.selector = { $and: [{ username: { $eq: tech } }, { rprtDate: { $geq: dates['start'] } }, { rprtDate: { $leq: dates['end'] } }] };
        }
      }
      let woArray = new Array<ReportOther>();
      Log.l("getReportsOtherForTech(): Using database: ", this.prefs.DB.reports_other);
      // this.loginToDatabase(u, p, this.prefs.DB.reports_other).then((res) => {
        // if (res) {
          let rdb1 = this.addRDB(this.prefs.DB.reports_other);
          // let query = {selector: {username: {$eq: tech}}};
          // rdb1.createIndex({index: {fields: ['username']}}).then((res) => {
          //   Log.l(`getReportsOtherForTech(): index created successfully, now running query...`);
          //   return
            rdb1.find(query)
            // ;
          // })
          .then((res) => {
            Log.l(`getReportsOtherForTech(): Got reports for '${tech}':\n`, res);
            let woArray = new Array<ReportOther>();
            for(let doc of res.docs) {
              let report = new ReportOther();
              report.readFromDoc(doc);
              woArray.push(report);
            }
            resolve(woArray);
          }).catch((err) => {
            Log.l(`getReportsOtherForTech(): Error getting reports for '${tech}'.`);
            Log.l(err);
            resolve(woArray);
          });
        // } else {
          // resolve(woArray);
        // }
      // }).catch((err) => {
      //   Log.l("getReportsOtherForTech(): Error logging in to server.")
      //   Log.e(err);
      //   resolve(woArray);
      // });
    });
  }

  getReports(user: string) {
    return new Promise((resolve,reject) => {
      let u = this.ud.getUsername();
      let p = this.ud.getPassword();
      // this.loginToServer(u, p, this.prefs.DB.login).then((res) => {
      // 	if(res) {
      		let rdb1 = this.addRDB(this.prefs.DB.reports);
          rdb1.allDocs({include_docs: true}).then((result) => {
		        let data = [];
						let docs = result.rows.map((row) => {
							if( row && row.id[0] !== '_' && row.doc && row.doc.username === user ) { data.push(row.doc); }
							resolve(data);
						});
					}).catch((error) => {
		      	Log.l("getReports(): Error getting reports for user.");
		      	Log.e(error);
		      	resolve([]);
		      });
      // 	} else {
      // 		resolve([]);
      // 	}
      // }).catch((err) => {
			// 	Log.l("getReports(): Error logging in to server.")
			// 	Log.e(err);
			// 	resolve([]);
			// });
		});
  }

  updateDoc(doc) {
    // return SrvrSrvcs.staticRDB.put(doc);
    Log.l("Server.updateDoc(): Nope.");
  }

  deleteDoc(dbname, docToDelete) {
    Log.l(`deleteDoc(): Attempting to delete doc:...`, docToDelete);
    return new Promise((resolve,reject) => {
      let rdb1 = this.addRDB(dbname);
      rdb1.upsert(docToDelete._id, (doc) => {
        if(doc) {
          let rev = doc._rev;
          doc = docToDelete;
          doc['_deleted'] = true;
          doc._rev = rev;
          return doc;
        } else {
          doc = docToDelete;
          doc['_deleted'] = true;
          delete doc._rev;
          return doc;
        }
      }).then((res) => {
        if(!res.ok && !res.updated) {
          Log.l("deleteDoc(): Error:\n", res);
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
      // rdb1.remove(doc._id, doc._rev).then((res) => {
      //   Log.l("deleteDoc(): Success:\n", res);
      // }).catch((err) => {
      //   Log.l("deleteDoc(): Error!");
      //   Log.e(err);
      // });
    });
  }

  syncToServer(dbname: string, pdb: any) {
    Log.l(`syncToServer(): About to attempt replication of '${dbname}'->remote`);
    var ev2 = function(b) { Log.l(b.status); Log.l(b);};
    var db1 = this.addDB(dbname);
    var db2 = this.addRDB(dbname);
    return new Promise((resolve, reject) => {
      db1.replicate.to(db2, this.prefs.SERVER.repopts).then((res) => {
        Log.l(`syncToServer(): Successfully replicated '${dbname}'->remote!`);
        Log.l(res);
        resolve(res);
      }).catch((err) => {
        Log.l(`syncToServer(): Failure replicating '${dbname}'->remote!`);
        Log.l(err);
        reject(err);
      });
    });
  }

  syncFromServer(dbname: string) {
    Log.l(`syncFromServer(): About to attempt replication of remote->'${dbname}' with options:\n`, this.prefs.SERVER.repopts);
    // let ev2 = function(b) { Log.l(b.status); Log.l(b);};
    let db1 = this.addDB(dbname);
    let db2 = this.addRDB(dbname);
    Log.l(db1);
    Log.l(db2);
    let rdbURL = this.getBaseURL() + "/" + dbname;
    let opts = { live: false, retry: false };
    let u = this.ud.getUsername(), p = this.ud.getPassword();
    return new Promise((resolve, reject) => {
      this.loginToDatabase(u, p, dbname).then(res => {
        Log.l(`syncFromServer(): Successfully logged in to remote->'${dbname}'`);
        return db1.replicate.from(db2, opts);
        // return db1.replicate.from(db2, {live: false, retry: true});
        // return db1.replicate.from(db2, this.prefs.SERVER.repopts);
        // return db1.replicate.from(db2, this.prefs.SERVER.repopts);
        // return PouchDB.replicate(rdbURL, dbname, opts);

      }).then((res) => {
        Log.l(`syncFromServer(): Successfully replicated remote->'${dbname}'`);
        Log.l(res);
        resolve(res);
      }).catch((err) => {
        Log.l(`syncFromServer(): Failure replicating remote->'${dbname}'`);
        Log.e(err);
        reject(err);
      });
    });
  }

  fetchNewMessages():Promise<Array<Message>> {
    Log.l('fetchNewMessages(): Getting messages...');
    let out = new Array<Message>();
    let remote = new Array<Message>();
    let local = new Array<Message>();
    return new Promise((resolve, reject) => {
      let dbname = this.prefs.DB.messages;
      let db1 = this.addDB(dbname);
      let rdb1 = this.addRDB(dbname);
      // rdb1.allDocs({include_docs:true}).then(res => {
      this.syncFromServer(dbname).then((res:any) => {
        // Log.l("fetchNewMessages(): Successfully synchronized messages from server. Now looking for new messages.");
        return db1.allDocs({include_docs: true});
      }).then(res => {
        // Log.l("fetchNewMessages(): Successfully retrieved all messages from the server.");

      // }).then(res => {
        // Log.l("fetchNewMessages(): Got results:\n", res);
        // remote = new Array<Message>();
        for(let row of res.rows) {
          let doc = row.doc;
          if(doc && row.id[0] !== '_') {
            let msg = new Message();
            msg.readFromDoc(row.doc);
            out.push(msg);
          }
        }
        // Log.l("fetchNewMessages(): Final remote messages array is:\n", remote);
        // Log.l("fetchNewMessages(): Now getting local messages...");
        // return db1.allDocs({include_docs:true});
      // }).then(res => {
        // Log.l("fetchNewMessages(): Done getting local messages:\n", res);
        // for(let row of res.rows) {
        //   let doc = row.doc;
        //   if(doc) {
        //     let msg = new Message();
        //     msg.readFromDoc(row.doc);
        //     local.push(msg);
        //   }
        // }
        // Log.l("fetchNewMessages(): Final output of local messages is:\n", local);
        // let j = -1;
        // let msg = null, lmsg = null;
        // for(msg of remote) {
        //   let i = 0, match = -1;
        //   j++;
        //   for(lmsg of local) {
        //     // Log.l(`fetchNewMessages():Index ${j}.${i} remote '${msg._id}' to local '${lmsg._id}'...`);
        //     if(msg._id === lmsg._id && lmsg.read == true) {
        //       // Log.l(`fetchNewMessages(): ======> Match at index ${j}.${i}!`);
        //       match = i;
        //     }
        //     i++;
        //   }
        //   if(match === -1) {
        //     out.push(msg);
        //     continue;
        //   } else {
        //     out.push(local[match]);
        //   }
        // }
        Log.l("fetchNewMessages(): Final output of new messages is:\n", out);
        resolve(out);
      }).catch(err => {
        Log.l("fetchNewMessages(): Error retrieving messages from server.");
        Log.e(err);
        reject(err);
      });
    });
  }

  saveReadMessage(message:Message) {
    return new Promise((resolve, reject) => {
      let dbname = this.prefs.DB.messages;
      let db1 = this.addDB(dbname);
      let out = message.serialize();
      Log.l("saveReadMessage(): Now attempting to save serialized message:\n", out);
      // db1.putIfNotExists()
      db1.upsert(message._id, (doc) => {
        if(typeof doc === 'object' && Object.keys(doc).length > 0 && typeof doc['read'] !== undefined && (doc.read === false || doc.read === null)) {
          doc.read = true;
          return doc;
        } else {
          return message;
        }
      }).then(res => {
        Log.l("saveReadMessage(): Successfully saved message, result:\n", res);
        resolve(res);
      }).catch(err => {
        Log.l("saveReadMessage(): Error saving message:\n", message);
        Log.e(err);
        reject(err);
      });
    });
  }

  public saveComment(comment:Comment) {
    return new Promise((resolve,reject) => {
      let rdb1 = this.addRDB(this.prefs.DB.comments);
      let newDoc = comment.serialize();
      Log.l("saveComment(): Attempting to save comment to server:\n", comment);
      Log.l(newDoc);
      rdb1.upsert(newDoc['_id'], (doc) => {
        if(doc) {
          let id = doc._id;
          let rev = doc._rev;
          doc = newDoc;
          doc._rev = rev;
        } else {
          doc = newDoc;
          delete doc['_rev'];
        }
        return doc;
      }).then(res => {
        Log.l("saveComment(): Succeeded in submitting comment!\n", res);
        resolve(res);
      }).catch(err => {
        Log.l("saveComment(): Error submitting comment!");
        Log.e(err);
        reject(err);
      });
    });
  }

  public getMessages() {
    return this.fetchNewMessages();
  }

  public getUserInfo() {
    let rdb1 = this.addRDB(this.prefs.DB.employees);
    let name = this.ud.getUsername();
    return new Promise((resolve, reject) => {
      rdb1.get(name).then(res => {
        let tech = new Employee();
        tech.readFromDoc(res);
        resolve(res);
      }).catch(err => {
        Log.l("getUserInfo(): Error getting user info from server for user '%s'!", name);
        Log.e(err);
        reject(err);
      });
    });
  }

  public getJobsites():Promise<Array<Jobsite>> {
    return new Promise((resolve,reject) => {
      let rdb1 = this.addRDB(this.prefs.DB.jobsites);
      rdb1.allDocs({include_docs:true}).then(res => {
        let sites = new Array<Jobsite>();
        for(let row of res.rows) {
          let doc = row.doc;
          if (doc && row.id[0] !== '_') {
            let site = new Jobsite();
            site.readFromDoc(doc);
            sites.push(site);
          }
        }
        Log.l("getJobsites(): Success, final output array is:\n", sites);
        resolve(sites);
      }).catch(err => {
        Log.l("getJobsites(): Error getting all jobsites.");
        Log.e(err);
        reject(err);
      })
    });
  }

  public getAllConfigData() {
    Log.l("getAllConfigData(): Retrieving clients, locations, locIDs, loc2nd's, shiftRotations, and shiftTimes...");
    let dbConfig = this.prefs.DB.config;
    let rdb1 = this.addRDB(dbConfig);
    let db1 = this.addDB(dbConfig);
    return new Promise((resolve, reject) => {
      // this.syncFromServer(dbConfig).then(res => {
        // return
        rdb1.allDocs({ keys: ['client', 'location', 'locid', 'loc2nd', 'rotation', 'shift', 'shiftlength', 'shiftstarttime', 'other_reports'], include_docs: true })
      // })
      .then((records) => {
        Log.l("getAllConfigData(): Retrieved documents:\n", records);
        let results = { client: [], location: [], locid: [], loc2nd: [], rotation: [], shift: [], shiftlength: [], shiftstarttime: [], report_types: [], training_types: [] };
        for (let record of records.rows) {
          let type = record.id;
          let types = record.id + "s";
          if (type === 'other_reports') {
            let doc = record.doc;
            let report_types = doc.report_types;
            let training_types = doc.training_types;
            results.report_types = report_types;
            results.training_types = training_types;
          } else {
            let doc = record.doc;
            if (doc) {
              if (doc[types]) {
                for (let result of doc[types]) {
                  results[type].push(result);
                }
              } else {
                for (let result of doc.list) {
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

  public getAllData(tech:Employee):Promise<any> {
    return new Promise((resolve, reject) => {
      let data = { employee: [], sites: [], reports: [], otherReports: [], payrollPeriods: [], shifts: [], messages: [], config: {} };
      let username = tech.getUsername();
      data.employee.push(tech);
      this.getReportsForTech(username).then(res => {
        for (let doc of res) {
          let report = new WorkOrder();
          report.readFromDoc(doc);
          data.reports.push(report);
        }
        return this.getReportsOtherForTech(username);
      }).then(res => {
        for(let doc of res) {
          let other = new ReportOther();
          other.readFromDoc(doc);
          data.otherReports.push(other);
        }
        return this.getJobsites();
      }).then(res => {
        for (let doc of res) {
          let site = new Jobsite();
          site.readFromDoc(doc);
          data.sites.push(site);
        }
        return this.getMessages();
      }).then(res => {
        for(let doc of res) {
          let msg = new Message();
          msg.readFromDoc(doc);
          data.messages.push(msg);
        }
        return this.getAllConfigData();
      }).then(res => {
        let keys = Object.keys(res);
        for(let key of keys) {
          data.config[key] = res[key];
        }
        Log.l("getAllData(): Success, final data to be returned is:\n", data);
        resolve(data);
      }).catch(err => {
        Log.l("getAllData(): Error retrieving all data!");
        Log.e(err);
        reject(err);
      })
    });
  }

}
