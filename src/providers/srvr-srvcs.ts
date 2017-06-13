import { Injectable   }     from '@angular/core'              ;
import { Http         }     from '@angular/http'              ;
import 'rxjs/add/operator/map'                                ;
import { PouchDBService } from '../providers/pouchdb-service' ;
import { Log          }     from '../config/config.functions' ;
import { WorkOrder } from '../domain/workorder'               ;
import { UserData } from '../providers/user-data'             ;

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
  public static server        : string = "securedb.sesaonsite.com"                              ;
  public static port          : string = '443'                                                  ;
	public static protocol      : string = "https"                                                ;
	public static userInfo      : any    = {u       : '', p                         : ''    }     ;
  public static opts          : any    = { adapter: 'websql', auto_compaction: true       }     ;
	public static ropts         : any    = {adapter : SrvrSrvcs.protocol, skipSetup : true  }     ;
	public static cropts        : any    = {adapter : SrvrSrvcs.protocol                    }     ;
	public static repopts       : any    = {live    : false, retry : false                  }     ;
	public static ajaxOpts      : any    = {headers : { Authorization               : ''    }   } ;
	public static remoteDBInfo  : any    = {                                                }     ;
	public static rdbServer     : any    = {protocol: SrvrSrvcs.protocol,
		server: SrvrSrvcs.server,
		opts: {
			adapter: SrvrSrvcs.protocol,
			skipSetup : true}
		};

  constructor(public http: Http, public ud:UserData) {
    window["serverServices"] = this;
    window["SrvrSrvcs"] = SrvrSrvcs;
    SrvrSrvcs.StaticPouchDB = PouchDBService.PouchInit();
    this.PouchDB = SrvrSrvcs.StaticPouchDB;
    this.RemoteDB = SrvrSrvcs.StaticPouchDB;
    Log.l("SrvrSrvcs: StaticPouchDB is:\n",SrvrSrvcs.StaticPouchDB);
  }


  static getAuthHeaders(user: string, pass: string) {
    let authToken = 'Basic ' + window.btoa(user + ':' + pass);
    let ajaxOpts = { headers: { Authorization: authToken } };
    return ajaxOpts;
  }

  static getBaseURL() {
    if(SrvrSrvcs.port != '') {
      return `${SrvrSrvcs.protocol}://${SrvrSrvcs.server}:${SrvrSrvcs.port}`; 
    } else {
      return `${SrvrSrvcs.protocol}://${SrvrSrvcs.server}`; 
    }
  }

  static getInsecureLoginBaseURL(user:string, pass:string) {
    if(SrvrSrvcs.port != '') {
      return `${SrvrSrvcs.protocol}://${user}:${pass}@${SrvrSrvcs.server}:${SrvrSrvcs.port}`; 
    } else {
      return `${SrvrSrvcs.protocol}://${user}:${pass}@${SrvrSrvcs.server}`; 
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

  querySession(user, pass) {
  	Log.l("querySession(): About to try logging in to server.");
  	return new Promise((resolve,reject) => {
			let url = SrvrSrvcs.protocol + ':/' + '/' + SrvrSrvcs.server + "/_session";
			let authToken = 'Basic ' + window.btoa(user + ':' + pass);
			let ajaxOpts = { headers: { Authorization: authToken } };
			let opts = {ajax: {withCredentials: true, headers: {Authorization: authToken}, auth: {username: user, password: pass}}};
  		this.RemoteDB = this.PouchDB(url, {adapter: SrvrSrvcs.protocol, skipSetup: true, ajax: ajaxOpts});
  		this.RemoteDB.login(user, pass, {ajax: ajaxOpts}).then((res) => {
  			return this.RemoteDB.getSession();
  		}).then((session) => {
				if(typeof session.info == 'undefined' || typeof session.info.authenticated != 'string') {
					Log.l("querySession(): Authentication failed");
					SrvrSrvcs.userInfo = {u: '', p: ''};
					resolve(false);
				} else {
					Log.l("querySession(): Authentication successful.");
					SrvrSrvcs.userInfo = {u: user, p: pass};

					resolve(session);
				}
  		}).catch((err) => {
  			Log.l("querySession(): Error during validation of login credentials.");
  			/* User-Friendly Dialog goes here */
  			Log.e(err);
				SrvrSrvcs.userInfo = {u: '', p: ''};
  			resolve(false);
  		});
  	});
  }

  loginToServer(user:string, pass:string, dbname?:string) {
  	return new Promise((resolve,reject) => {
      let dbURL = '_session';
  		if(dbname) {
  			dbURL = dbname;
  		}
      let url = SrvrSrvcs.getBaseURL() + '/' + dbURL;
			let authToken = 'Basic ' + window.btoa(user + ':' + pass);
			let ajaxOpts = { headers: { Authorization: authToken } };
			let opts = {adapter: SrvrSrvcs.protocol, skipSetup: true, ajax: {withCredentials: true, ajaxOpts, auth: {username: user, password: pass}}};
			let rdb1 = SrvrSrvcs.addRDB(dbURL);
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
          this.ud.setLoginStatus(true);
          let rdb2 = this.addRDB('sesa-employees');
          let uid = `org.couchdb.user:${user}`;
          rdb2.get(uid).then((res) => {
            Log.l("loginToServer(): got user object from server!\n", res);
            let tprofile = res;
            // tprofile.docID = tprofile._id;
            // tprofile._id = "_local/techProfile";
            return this.saveTechProfile(tprofile);
          }).then((res) => {
            Log.l("loginToServer(): Successfully saved user profile!\n", res);
					  resolve(session);
          }).catch((err) => {
            Log.l("loginToServer(): Error getting user object from server!");
            Log.e(err);
            SrvrSrvcs.userInfo = {u: '', p: ''};
            resolve(false);
          });
				}
			}).catch((err) => {
				Log.l("loginToServer(): Authentication successful.");
  			Log.e(err);
				SrvrSrvcs.userInfo = {u: '', p: ''};
  			resolve(false);
			})
		});
  }

  getUserData(user) {
    let rdb1 = SrvrSrvcs.addRDB('reports');
		return rdb1.getUser(user);
  }

  public addRDB(dbname:string) {
    return SrvrSrvcs.addRDB(dbname);
  }

  public static addRDB(dbname: string) {
    let db1 = SrvrSrvcs.rdb;
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
      rdb1 = PouchDBService.StaticPouchDB(url, SrvrSrvcs.ropts);
      db1.set(dbname, rdb1);
      return rdb1;
    }
  }

  public addDB(dbname:string) {
    return SrvrSrvcs.addDB(dbname);
  }

  public static addDB(dbname: string) {
    let db1 = SrvrSrvcs.ldb;
    // Log.l(`Server.addDB(): Now checking local db '${dbname}' ...`);
    let ldb1 = null;
    if (db1.has(dbname)) {
      // Log.l(`Found DB '${dbname}' already exists, returning...`);
      ldb1 = db1.get(dbname);
      return ldb1;
    } else {
      // Log.l(`DB '${dbname}' does not already exist, storing and returning...`);
      ldb1 = PouchDBService.StaticPouchDB(dbname, SrvrSrvcs.opts);
      db1.set(dbname, ldb1);
      return ldb1;
    }
  }

  saveTechProfile(doc) {
    Log.l("Server.saveTechProfile(): Attempting to save local techProfile...");
    // let updateFunction = (original) => {}
    let localID = '_local/techProfile';
    let newProfileDoc = null, uid = null, rdb1 = null, db1 = null, localProfileDoc = null;
    return new Promise((resolve, reject) => {
      db1 = this.addDB('reports');
      db1.get(localID).then((res) => {
        Log.l("Server.saveTechProfile(): Found techProfile locally.");
        localProfileDoc = res;
        var strID = res['_id'];
        var strRev = res['_rev'];
        newProfileDoc = { ...res, ...doc, "_id": strID, "_rev": strRev };
        Log.l("Server.saveTechProfile(): Merged profile is:");
        Log.l(newProfileDoc);
        Log.l("Server.saveTechProfile(): now attempting save...");
      }).catch((err) => {
        Log.l("Server.saveTechProfile(): Local tech profile not found. Creating.");
        doc.docID = doc._id;
        doc._id = localID;
        delete doc._rev;
        Log.l("Server.saveTechProfile(): Attempting to save local tech profile:\n", doc);
        return db1.put(doc);
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
        resolve(res);
      }).catch((err) => {
        Log.l("Server.saveTechProfile(): Error saving to local tech profile!");
        Log.e(err);
        reject(err);
      });
    });
  }

  getReportsForTech(tech:string):Promise<Array<WorkOrder>> {
    return new Promise((resolve, reject) => {
      let u = SrvrSrvcs.userInfo;
      let woArray = new Array<WorkOrder>();
      this.loginToServer(u.u, u.p, 'reports').then((res) => {
        if (res) {
          let rpdb = SrvrSrvcs.rdb.get('reports');
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
    	let u = SrvrSrvcs.userInfo;
      this.loginToServer(u.u, u.p, 'reports').then((res) => {
      	if(res) {
      		let rpdb = SrvrSrvcs.rdb.get('reports');
      		rpdb.allDocs(noDesign).then((result) => {
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
    Log.l(`syncSquaredToServer(): About to attempt replication of '${dbname}'->remote`);
    var ev2 = function(b) { Log.l(b.status); Log.l(b);};
    var db1 = pdb;
    var db2 = SrvrSrvcs.rdb.get(dbname);
    // var done = DBSrvcs.StaticPouchDB.replicate(db1, db2, DBSrvcs.repopts);
    return new Promise((resolve, reject) => {
      db1.replicate.to(db2, SrvrSrvcs.repopts).then((res) => {
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

  syncFromServer(dbname: string, pdb: any) {
    Log.l(`syncSquaredFromServer(): About to attempt replication of remote->'${dbname}'`);
    var ev2 = function(b) { Log.l(b.status); Log.l(b);};
    var db1 = SrvrSrvcs.rdb.get(dbname);
    var db2 = pdb;
    // var done = DBSrvcs.StaticPouchDB.replicate(db1, db2, DBSrvcs.repopts);
    return new Promise((resolve, reject) => {
      db2.replicate.to(db1, SrvrSrvcs.repopts).then((res) => {
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





}
