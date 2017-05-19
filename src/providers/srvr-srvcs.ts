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

	public PouchDB : any = {};
	public RemoteDB: any = {};
	public protocol: string = "https";
	public server  : string = "martiancouch.hplx.net";

  constructor(public http: Http) {
  	this.PouchDB = PouchDB2;
  }

  querySession(user, pass) {
  	Log.l("querySession(): About to try logging in to server.");
  	return new Promise((resolve,reject) => {
			let url = this.protocol + ':/' + '/' + this.server + "/_session";
			let authToken = 'Basic ' + window.btoa(user + ':' + pass);
			let ajaxOpts = { headers: { Authorization: authToken } };
			let opts = {ajax: {withCredentials: true, headers: {Authorization: authToken}, auth: {username: user, password: pass}}};
  		this.RemoteDB = this.PouchDB(url, {adapter: this.protocol, skipSetup: true, ajax: ajaxOpts});
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



}
