import { Injectable   } from '@angular/core'              ;
import { Http         } from '@angular/http'              ;
import 'rxjs/add/operator/map'                            ;
import * as PouchDB2     from 'pouchdb'                   ;
import * as PouchDBAuth from 'pouchdb-authentication'     ;
import { Log, CONSOLE } from '../config/config.functions' ;

/*
  Generated class for the SrvrSrvcs provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class SrvrSrvcs {

	public PouchDB    : any    = {}                      ;
	public RemoteDB   : any    = {}                      ;
	// public protocol   : string = "https"                 ;
	// public server     : string = "martiancouch.hplx.net" ;
	public static rdb : any    = new Map()               ;
	public static StaticPouchDB : any = PouchDB2         ;
  public static server        : string = "martiancouch.hplx.net"                   ;
  // public static server        : string = "162.243.157.16"                          ;
  public static protocol      : string = "https"                                   ;
  // public static server        : string = "192.168.0.140:5984"                      ;
  // public static protocol      : string = "http"                                    ;
  // public static opts          : any = {adapter: 'websql', auto_compaction: true}   ;
  public static ropts         : any = {adapter: SrvrSrvcs.protocol, skipSetup: true} ;
  public static cropts        : any = {adapter: SrvrSrvcs.protocol}                  ;
  public static rdbServer     : any = {protocol: SrvrSrvcs.protocol, server: SrvrSrvcs.server, opts: {adapter: SrvrSrvcs.protocol, skipSetup: true}};
  public static repopts       : any = {live: false, retry: false}                  ;

	// public server  : string = "162.243.157.16";

  constructor(public http: Http) {
  	this.PouchDB = PouchDB2;
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
					resolve(false);
				} else {
					Log.l("querySession(): Authentication successful.");
					resolve(session);
				}
  		}).catch((err) => {
  			Log.l("querySession(): Error during validation of login credentials.");
  			/* User-Friendly Dialog goes here */
  			Log.e(err);
  			resolve(false);
  		});
  	});
  }

  getUserData(user) {
		return this.RemoteDB.getUser(user);
		// .then((userdata) => {
		// 	let udata = {};
		// 	udata.firstName      = userdata.firstName      ;
		// 	udata.lastName       = userdata.lastName       ;
		// 	udata.avatarName     = userdata.avatarName     ;
		// 	udata.client         = userdata.client         ;
		// 	udata.location       = userdata.location       ;
		// 	udata.locID          = userdata.locID          ;
		// 	udata.loc2nd         = userdata.loc2nd         ;
		// 	udata.shift          = userdata.shift          ;
		// 	udata.shiftLength    = userdata.shiftLength    ;
		// 	udata.shiftStartTime = userdata.shiftStartTime ;
		// 	udata.updated        = true                          ;
		// 	udata._id            = this.profileDoc               ;
  }

  static addRDB(dbname: string) {
    let db1 = SrvrSrvcs.rdb;
    let url = SrvrSrvcs.rdbServer.protocol + "://" + SrvrSrvcs.rdbServer.server + "/" + dbname;
    // if(url.slice(-1) == '/') {
      // url = url.slice(0,-1);
    // }
    // let i = url.lastIndexOf('/');
    // let dbname = i != -1 ? url.substr(-i) : "";

    // return new Promise((res,err) => {
      Log.l(`addRDB(): Now fetching remote DB ${dbname} at ${url} ...`);
      if(db1.has(dbname)) {
        // Log.l(`addRDB(): Not adding remote database ${url} because it already exists.`);
        // resolve(false);
        return db1.get(dbname);
      } else {
        let rdb1 = SrvrSrvcs.StaticPouchDB(url, SrvrSrvcs.ropts);
        db1.set(dbname, rdb1);
        // db1.login()
        Log.l(`addRDB(): Added remote database ${url} to the list as ${dbname}.`);
        // resolve(db1.get(dbname))
        return db1.get(dbname);
      }
    // });
  }



}
