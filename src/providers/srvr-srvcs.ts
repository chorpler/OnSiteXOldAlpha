import { Injectable   }     from '@angular/core'              ;
import { Http         }     from '@angular/http'              ;
import 'rxjs/add/operator/map'                                ;
import { PouchDBService } from '../providers/pouchdb-service' ;
import { Log          }     from '../config/config.functions' ;
import { WorkOrder } from '../domain/workorder'               ;
import { UserData } from '../providers/user-data'             ;
import { Message } from '../domain/message'                   ;
import { Preferences } from '../providers/preferences'        ;
// import { StorageService } from '../providers/storage-service'    ;
// import { PREFS     } from '../config/config.strings'          ;


export const noDD     = "_\uffff";
export const noDesign = {include_docs: true, startkey: noDD };

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
  // public static prefs         : any    = new Preferences(new StorageService())                  ;
  public static prefs         : any    = new Preferences()                                      ;
  public prefs                : any    = SrvrSrvcs.prefs                                        ;

  constructor(public http: Http, public ud:UserData) {
    Log.l("Hello SrvrSrvcs provider");
    window["serverServices"] = this;
    window["SrvrSrvcs"] = SrvrSrvcs;
    SrvrSrvcs.StaticPouchDB = PouchDBService.PouchInit();
    this.PouchDB = SrvrSrvcs.StaticPouchDB;
    this.RemoteDB = SrvrSrvcs.StaticPouchDB;
    // Log.l("SrvrSrvcs: StaticPouchDB is:\n",SrvrSrvcs.StaticPouchDB);
  }

  static getAuthHeaders(user: string, pass: string) {
    let authToken = 'Basic ' + window.btoa(user + ':' + pass);
    let ajaxOpts = { headers: { Authorization: authToken } };
    return ajaxOpts;
  }

  static getBaseURL() {
    let port = this.prefs.SERVER.port;
    let server = this.prefs.SERVER.server;
    let protocol = this.prefs.SERVER.protocol;
    if(port !== '' && port !== undefined && port !== null) {
      return `${protocol}://${server}:${port}`;
    } else {
      return `${protocol}://${server}`;
    }
  }

  static getInsecureLoginBaseURL(user:string, pass:string) {
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

  static getGeolocationHeaders(user:string, pass:string) {
    let ajaxOpts = SrvrSrvcs.getAuthHeaders(user, pass);
    ajaxOpts['headers']['Content-Type'] = "application/json";
    ajaxOpts['headers']['Accept'] = "application/json";
    return ajaxOpts['headers'];
  }

  static getGeolocationURL(user:string, pass:string) {
    // let ajaxOpts = SrvrSrvcs.getAuthHeaders(user, pass);
    // ajaxOpts['headers']['Content-Type'] = "application/json";
    // ajaxOpts['headers']['Accept'] = "application/json";
    // let URL = `${SrvrSrvcs.getBaseURL()}/sesa_geolocation`;
    let URL = `${SrvrSrvcs.getInsecureLoginBaseURL(user, pass)}/sesa_geolocation`;
    return URL;
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
			let ajaxOpts = { headers: { Authorization: authToken } };
			let opts = {adapter: adapter, skipSetup: true, ajax: {withCredentials: true, ajaxOpts, auth: {username: user, password: pass}}};
			let rdb1 = this.addRDB(dbURL);
      let tprofile = null;
      Log.l(`loginToServer(): About to login with u '${user}', p '${pass}', dburl '${dbURL}'.`);
			rdb1.login(user, pass, {ajax: ajaxOpts}).then((res) => {
  			return rdb1.getSession();
  		}).then((session) => {
				if(typeof session.info == 'undefined' || typeof session.info.authenticated != 'string') {
					Log.l("loginToServer(): Authentication failed");
					SrvrSrvcs.userInfo = {u: '', p: ''};
					resolve(false);
				} else {
					Log.l("loginToServer(): Authentication successful.");
					SrvrSrvcs.userInfo = {u: user, p: pass};
          this.ud.storeCredentials(user, pass);
          // this.ud.setLoginStatus(true);
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
				}
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
    Log.l(`addRDB(): Now fetching remote DB '${dbname}' at '${url}' ...`);
    let rdb1 = null;
    if (db1.has(dbname)) {
      // return db1.get(dbname);
      Log.l(`Found DB '${dbname}' already exists, returning...`);
      rdb1 = db1.get(dbname);
      // resolve(rdb1);
      return rdb1;
    } else {
      Log.l(`DB '${dbname}' does not already exist, storing and returning...`);
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
      db1 = this.addDB('reports');
      db1.get(localID).then((res) => {
        Log.l("Server.saveTechProfile(): Found techProfile locally. Deleting it.");
        let id = res._id;
        let rev = res._rev;
        return db1.remove(id, rev);
      }).then((res) => {
        Log.l("Server.saveTechProfile(): Deleted techProfile locally. Now updating it.");
        return db1.put(localProfileDoc);
      }).then((res) => {
        Log.l("Server.saveTechProfile(): Saved local profile successfully!\n", res);
        resolve(localProfileDoc);
      }).catch((err) => {
        Log.l("Server.saveTechProfile(): Local tech profile not found. Creating.");
        delete localProfileDoc._rev;
        // doc.docID = doc._id;
        // doc._id = localID;
        // delete doc._rev;
        Log.l("Server.saveTechProfile(): Attempting to save local tech profile:\n", doc);
        return db1.put(localProfileDoc);
      }).then((res) => {
        Log.l("Server.saveTechProfile(): Successfully saved local tech profile:\n", res);
      //   rdb1 = this.srvr.addRDB('sesa-employees');
      //   uid = `org.couchdb.user:${doc.username}`;
      //   Log.l(`saveTechProfile(): Now fetching remote copy with id '${uid}'...`);
      //   return rdb1.get(uid);
      // }).then((res) => {
      //   Log.l(`saveTechProfile(): Got remote user ${uid}:\n`, res);
      //   newProfileDoc._id = res._id;
      //   newProfileDoc._rev = res._rev;
      //   return rdb1.put(newProfileDoc);
      // }).then((res) => {
      //   Log.l("saveTechProfile(): Saved updated techProfile:\n", res);
        resolve(localProfileDoc);
      }).catch((err) => {
        Log.l("Server.saveTechProfile(): Error saving to local tech profile!");
        Log.e(err);
        reject(err);
      });
    });
  }

  getReportsForTech(tech:string):Promise<Array<WorkOrder>> {
    return new Promise((resolve, reject) => {
      let u = this.ud.getUsername();
      let p = this.ud.getPassword();
      // let c = this.ud.getCredentials();
      // Log.l("getReportsForTech(): Got credentials:\n", c);
      let woArray = new Array<WorkOrder>();
      Log.l("getReportsForTech(): Using database: ", this.prefs.DB.reports);
      this.loginToServer(u, p, this.prefs.DB.login).then((res) => {
        if (res) {
          let rpdb = this.addRDB(this.prefs.DB.reports);
          // let username = tech.username;
          let query = {selector: {username: {$eq: tech}}};
          // query.selector.username['$eq'] = username;
          rpdb.createIndex({index: {fields: ['username']}}).then((res) => {
            Log.l(`getReportsForTech(): index created successfully, now running query...`);
            return rpdb.find(query);
          }).then((res) => {
            Log.l(`getReportsForTech(): Got reports for '${tech}':\n`, res);
            let woArray = new Array<WorkOrder>();
            for(let doc of res.docs) {
              let wo = new WorkOrder();
              wo.readFromDoc(doc);
              woArray.push(wo);
            }
            resolve(woArray);
          }).catch((err) => {
            Log.l(`getReportsForTech(): Error getting reports for '${tech}'.`);
            Log.l(err);
            resolve(woArray);
          });
        } else {
          resolve(woArray);
        }
      }).catch((err) => {
        Log.l("getReportsForTech(): Error logging in to server.")
        Log.e(err);
        resolve(woArray);
      });
    });
  }

  getReports(user: string) {
    return new Promise((resolve,reject) => {
      let u = this.ud.getUsername();
      let p = this.ud.getPassword();
      this.loginToServer(u, p, this.prefs.DB.login).then((res) => {
      	if(res) {
      		let rpdb = this.addRDB(this.prefs.DB.reports);
      		rpdb.allDocs({include_docs: true}).then((result) => {
		        let data = [];
						let docs = result.rows.map((row) => {
							if( row.doc.username === user ) { data.push(row.doc); }
							resolve(data);
						});
					}).catch((error) => {
		      	Log.l("getReports(): Error getting reports for user.");
		      	Log.e(error);
		      	resolve([]);
		      });
      	} else {
      		resolve([]);
      	}
      }).catch((err) => {
				Log.l("getReports(): Error logging in to server.")
				Log.e(err);
				resolve([]);
			});
		});
  }

  updateDoc(doc) {
    return SrvrSrvcs.staticRDB.put(doc);
  }

  deleteDoc(dbname, doc) {
    Log.l(`deleteDoc(): Attempting to delete doc ${doc._id}...`);
    let rdb1 = SrvrSrvcs.addRDB(dbname);
    return rdb1.remove(doc._id, doc._rev).then((res) => {
      Log.l("deleteDoc(): Success:\n", res);
    }).catch((err) => {
      Log.l("deleteDoc(): Error!");
      Log.e(err);
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
    Log.l(`syncFromServer(): About to attempt replication of remote->'${dbname}'`);
    var ev2 = function(b) { Log.l(b.status); Log.l(b);};
    var db1 = this.addDB(dbname);
    var db2 = this.addRDB(dbname);
    return new Promise((resolve, reject) => {
      db2.replicate.to(db1, this.prefs.SERVER.repopts).then((res) => {
        Log.l(`syncFromServer(): Successfully replicated remote->'${dbname}'`);
        Log.l(res);
        resolve(res);
      }).catch((err) => {
        Log.l(`syncFromServer(): Failure replicating remote->'${dbname}'`);
        Log.l(err);
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
      rdb1.allDocs({include_docs:true}).then(res => {
      // this.syncFromServer(dbname).then(res => {
        // Log.l("fetchNewMessages(): Successfully synchronized messages from server. Now looking for new messages.");
        // return rdb1.allDocs({include_docs: true});
        Log.l("fetchNewMessages(): Successfully retrieved all messages from the server.");

      // }).then(res => {
        Log.l("fetchNewMessages(): Got results:\n", res);
        remote = new Array<Message>();
        for(let row of res.rows) {
          let doc = row.doc;
          if(doc) {
            let msg = new Message();
            msg.readFromDoc(row.doc);
            remote.push(msg);
          }
        }
        Log.l("fetchNewMessages(): Final remote messages array is:\n", remote);
        Log.l("fetchNewMessages(): Now getting local messages...");
        return db1.allDocs({include_docs:true});
      }).then(res => {
        Log.l("fetchNewMessages(): Done getting local messages:\n", res);
        for(let row of res.rows) {
          let doc = row.doc;
          if(doc) {
            let msg = new Message();
            msg.readFromDoc(row.doc);
            local.push(msg);
          }
        }
        Log.l("fetchNewMessages(): Final output of local messages is:\n", local);
        let j = -1;
        let msg = null, lmsg = null;
        for(msg of remote) {
          let i = 0, match = -1;
          j++;
          for(lmsg of local) {
            Log.l(`fetchNewMessages():Index ${j}.${i} remote '${msg._id}' to local '${lmsg._id}'...`);
            if(msg._id === lmsg._id && lmsg.read == true) {
              Log.l(`fetchNewMessages(): ======> Match at index ${j}.${i}!`);
              match = i;
            }
            i++;
          }
          if(match === -1) {
            out.push(msg);
            continue;
          } else {
            out.push(local[match]);
          }
        }
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

}
