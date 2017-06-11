import { Injectable   }     from '@angular/core'              ;
import { Http         }     from '@angular/http'              ;
import 'rxjs/add/operator/map'                                ;
import * as PouchDB         from 'pouchdb'                    ;
import * as PouchDBAuth     from 'pouchdb-authentication'     ;
import * as pdbSeamlessAuth from 'pouchdb-seammless-auth'     ;
import { Log, CONSOLE }     from '../config/config.functions' ;

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
	public static StaticPouchDB : any    = PouchDB                                                ;
  // public static server        : string = "nano.hplx.net"                                ;
  // public static server        : string = "martiancouch.hplx.net"                                ;
  public static server        : string = "securedb.sesaonsite.com"                                ;
  public static port          : string = '443'                                                     ;
	// public static port          : string = '5984'                                                     ;
	// public static server     : string = "162.243.157.16"                                       ;
  // public static protocol      : string = "https"                                                ;
	public static protocol      : string = "https"                                                ;
	public static userInfo      : any    = {u       : '', p                         : ''    }     ;
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

  constructor(public http: Http) {
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

  static getAuthHeaders(user:string, pass:string) {
    let authToken = 'Basic ' + window.btoa(user + ':' + pass);
    let ajaxOpts = { headers: { Authorization: authToken } };
    return ajaxOpts;
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
			if(dbname) {
				if(SrvrSrvcs.rdb.has(dbname)) {
					SrvrSrvcs.staticRDB = SrvrSrvcs.rdb.get(dbname);
				} else {
					SrvrSrvcs.staticRDB = SrvrSrvcs.StaticPouchDB(url, opts);
					SrvrSrvcs.rdb.set(dbname, SrvrSrvcs.staticRDB);
				}
			} else {
				SrvrSrvcs.staticRDB = SrvrSrvcs.StaticPouchDB(url, opts);
			}
			this.RemoteDB = SrvrSrvcs.staticRDB;
			this.RemoteDB.login(user, pass, {ajax: ajaxOpts}).then((res) => {
  			return this.RemoteDB.getSession();
  		}).then((session) => {
				if(typeof session.info == 'undefined' || typeof session.info.authenticated != 'string') {
					Log.l("loginToServer(): Authentication failed");
					SrvrSrvcs.userInfo = {u: '', p: ''};
					resolve(false);
				} else {
					Log.l("loginToServer(): Authentication successful.");
					SrvrSrvcs.userInfo = {u: user, p: pass};
					resolve(session);
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
		return this.RemoteDB.getUser(user);
  }

  static addRDB(dbname: string) {
    let db1 = SrvrSrvcs.rdb;
    let url = SrvrSrvcs.rdbServer.protocol + "://" + SrvrSrvcs.rdbServer.server + "/" + dbname;
      Log.l(`addRDB(): Now fetching remote DB ${dbname} at ${url} ...`);
      if(db1.has(dbname)) {
        return db1.get(dbname);
      } else {
        let rdb1 = SrvrSrvcs.StaticPouchDB(url, SrvrSrvcs.ropts);
        db1.set(dbname, rdb1);
        let u = SrvrSrvcs.userInfo;
				let authToken = 'Basic ' + window.btoa(u.u + ':' + u.p);
				SrvrSrvcs.ajaxOpts.headers.Authorization = authToken;
      }
  }

  getReportsForTech(tech:any) {
    return new Promise((resolve, reject) => {
      let u = SrvrSrvcs.userInfo;
      this.loginToServer(u.u, u.p, 'reports').then((res) => {
        if (res) {
          let rpdb = SrvrSrvcs.rdb.get('reports');
          rpdb.allDocs({include_docs:true}).then((result) => {
            let data = [];
            let docs = result.rows.map((row) => {
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

  deleteDoc(doc) {
    Log.l(`deleteDoc(): Attempting to delete doc ${doc._id}...`);
    return SrvrSrvcs.staticRDB.remove(doc._id, doc._rev).then((res) => {
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
