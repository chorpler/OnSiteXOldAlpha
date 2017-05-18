import { Injectable, NgZone                 } from '@angular/core'                ;
import { Http                               } from '@angular/http'                ;
import 'rxjs/add/operator/map'                                                    ;
import * as PouchDB2                          from 'pouchdb'                      ;
import * as PouchDBAuth                       from 'pouchdb-authentication'       ;
import { Storage                            } from '@ionic/storage'               ;
import { NativeStorage                      } from 'ionic-native'                 ;
import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage' ;
// import { DBSrvcs                            } from './db-srvcs'        ;
import { SrvrSrvcs                          } from './srvr-srvcs'                 ;
import { ServerSrvcs                        } from './server-srvcs'               ;
import { UserData                           } from '../providers/user-data'       ;
import { Log, CONSOLE                       } from '../config/config.functions'   ;

@Injectable()
export class AuthSrvcs {

	data        : any      ;
	username    : any      ;
	password    : any      ;
	remote      : any      ;
	options     : any      ;
	docId       : string   ;
	// PouchDB     : any      ;
	profileDoc  : any      ;
	settingsDoc : any      ;
	couchUser   : any      ;
	userProfile : any = {} ;
	remoteDB    : any = {} ;
	localDB     : any = {} ;
	ajaxOpts    : any = {} ;

	// constructor(public http: Http, public zone: NgZone, private db: DBSrvcs, private storage: Storage, public secureStorage: SecureStorage, public ud: UserData) {
	constructor(public http: Http, public zone: NgZone, private storage: Storage, public srvr: SrvrSrvcs, public secureStorage: SecureStorage, public ud: UserData) {
		this.remote       = 'https://martiancouch.hplx.net/reports' ;
		// this.remote = 'https://192.168.0.140:5984/_users';
		// this.remote = 'http://162.243.157.16/reports/';
		// this.profileDoc   = '_local/techProfile';

		window['securestorage'] = this.secureStorage;
		window['storage'] = this.storage;
		window['lstor'] = this.storage;
		window["authserv"] = this;
		// this.PouchDB = DBSrvcs.StaticPouchDB;

		// this.options = {
		//   live: true,
		//   retry: true,
		//   continuous: false
		//   ,auth: { username: this.username, password: this.password }
		// };

		// this.userDb.sync(this.remote, this.options);
	}

	// -------------- AuthSrvcs METHODS------------------------

	ionViewDidLoad() { }

	setUser(user1: string) {
		this.username = user1;
		console.log(`setUser set user to ${this.username}`);
		this.ajaxOpts = { ajax: { headers: { Authorization: 'Basic ' + window.btoa(this.username + ':' + this.password) } } };
	}

	setPassword(pass1: string) {
		this.password = pass1;
		console.log(`setPassword set password to ${this.password}`);
		this.ajaxOpts = { ajax: { headers: { Authorization: 'Basic ' + window.btoa(this.username + ':' + this.password) } } };
	}

	getUser() {
		return this.username;
	}

	getPass() {
		return this.password;
	}

	getLoginInfo() {

	}

	remoteLogin() {

	}

	/**
	 * 
	 */
	login() {
		// console.log(this.docId);
		console.log("AuthSrvcs.login() now starting");
		// let pouchOpts = { skipSetup: true };
		// let ajaxOpts = { ajax: { headers: { Authorization: 'Basic ' + window.btoa(this.username + ':' + this.password) } } };
		// this.remoteDB = this.PouchDB(this.remote, pouchOpts);
		// this.remoteDB = DBSrvcs.addRDB('reports');
		console.log("Now making login attempt, options:");
		// console.log(ajaxOpts);
		console.log("Username: " + this.username);
		return new Promise((resolve, reject) => {
			this.srvr.querySession(this.username, this.password).then((session) => {
				if(session != false) {
					/* Login good */
					Log.l("login(): Got valid session:", session);
					this.saveCredentials().then((res) => {
						Log.l("login(): Credentials saved. Setting user-logged-in flag.");
						return this.setLoginFlag();
					}).then((res) => {
						Log.l("login(): Login flag set. Finished.");
						resolve(res);
					}).catch((err) => {
						Log.l("login(): Error while saving credentials.");
						Log.l(err);
						reject(err);
					});
				} else {
					/* Login bad */
					Log.l("login(): User credentials bad.");
					reject(false);
				}
			}).catch((err) => {
				Log.l("login(): Error during app login.");
				Log.l(err);
				reject(err);
			});
		});
					// console.log("Now attempting getUser()...");
					// let dbUser = session.userCtx.name;
					// this.remoteDB.getUser(this.username).then((user) => {
					// 	this.couchUser = user;
					// 	this.userProfile.firstName      = this.couchUser.firstName      ;
					// 	this.userProfile.lastName       = this.couchUser.lastName       ;
					// 	this.userProfile.avatarName     = this.couchUser.avatarName     ;
					// 	this.userProfile.client         = this.couchUser.client         ;
					// 	this.userProfile.location       = this.couchUser.location       ;
					// 	this.userProfile.locID          = this.couchUser.locID          ;
					// 	this.userProfile.loc2nd         = this.couchUser.loc2nd         ;
					// 	this.userProfile.shift          = this.couchUser.shift          ;
					// 	this.userProfile.shiftLength    = this.couchUser.shiftLength    ;
					// 	this.userProfile.shiftStartTime = this.couchUser.shiftStartTime ;
					// 	this.userProfile.updated        = true                          ;
					// 	this.userProfile._id            = this.profileDoc               ;
					// 	console.log("Got user");
					// 	console.log(user);
					// 	return this.db.addLocalDoc(this.userProfile);
					// }).then((res) => {
		// 				console.log("userProfile document added successfully. Now saving credentials...");
		// 				return this.saveCredentials();
		// 			}).then((res2) => {
		// 				console.log("Credentials saved. Finished.");
		// 				return this.setLoginFlag();
		// 			}).then((res3) => {
		// 				resolve(res3);
		// 				// }).then((docs) => {
		// 				//   console.log(docs);
		// 			}).catch((error) => {
		// 				console.log("Error during PouchDB login/getUser");
		// 				console.error(error);
		// 				reject(error);
		// 			});
		// 		}
		// 	}).catch((err) => {
		// 		Log.l("login(): Error trying to get user session. Probably user could not log in.");
		// 		Log.w(err);
		// 		reject(err);
		// 	});
		// });
	}

	saveCredentials() {
		console.log("Saving credentials...");
		window["secureStorage"] = this.secureStorage;
		return new Promise((resolve,reject) => {
			this.isSecureStorageAvailable().then((ssAvailable) => {
				if(ssAvailable) {
					Log.l("saveCredentials(): Using SecureStorage...");
					this.secureStorage.create('OnSiteX').then((sec: SecureStorageObject) => {
						let userInfo = {username: this.username, password: this.password};
						return sec.set('userInfo', JSON.stringify(userInfo));
					}).then((res) => {
						console.log("saveCredentials(): Credentials saved in secure storage!");
						console.log(res);
						resolve(res);
					}).catch((err) => {
						console.log("saveCredentials(): Error saving credentials in secure storage!");
						console.warn(err);
						reject(err);
					});
				} else {
					Log.l("saveCredentials(): SecureStorage not available, using Localstorage...");
					let userInfo = {username: this.username, password: this.password};
					this.storage.set('userInfo', userInfo).then((res) => {
						console.log("Saved credentials to local storage.");
						console.log(res);
						resolve(res);
					}).catch((err) => {
						console.log("Error saving credentials in local storage!");
						console.warn(err);
						reject(err);
					});
				}
			}).catch((outerError) => {
				Log.l("saveCredentials(): Error while checking for availability of SecureStorage.");
				Log.e(outerError);
				reject(outerError);
			});
		});
	}

	getCredentials() {
		console.log("Retrieving credentials...");
		return new Promise((resolve,reject) => {
			this.isSecureStorageAvailable().then((ssAvailable) => {
				if(ssAvailable) {
					Log.l("getCredentials(): Using SecureStorage...");
					this.secureStorage.create('OnSiteX').then((sec: SecureStorageObject) => {
						let userLogin = {username: this.username, password: this.password};
						return sec.get('userInfo');
					}).then((res) => {
						if(res != null) {
							console.log("getCredentials(): Credentials retrieved from secure storage!");
							console.log(res);
							let userInfo = JSON.parse(res);
							this.setUser(userInfo.username);
							this.setPassword(userInfo.password);
							resolve(userInfo);
						} else {
							Log.l("getCredentials(): Credentials not available.");
							reject(false);
						}
					}).catch((err) => {
						console.log("getCredentials(): Error getting credentials from secure storage!");
						console.error(err);
						reject(err);
					});
				} else {
					Log.l("getCredentials(): SecureStorage not available, using Localstorage...");
					this.storage.get('userInfo').then((res) => {
						if(res != null) {
							console.log("getCredentials(): Credentials retrieved from local storage!");
							console.log(res);
							let userInfo = res;
							this.setUser(userInfo.username);
							this.setPassword(userInfo.password);
							resolve(userInfo);
						} else {
							Log.l("getCredentials(): Credentials not available.");
							reject(false);
						}
					}).catch((err) => {
						console.log("getCredentials(): Error retrieving credentials from local storage!");
						console.error(err);
						reject(err);
					});
				}
			}).catch((outerError) => {
				Log.l("getCredentials(): Error while checking for availability of SecureStorage.");
				Log.e(outerError);
				reject(outerError);
			});
		});
	}

	clearCredentials() {
		console.log("Clearing credentials...");
		window["secureStorage"] = this.secureStorage;
		return new Promise((resolve,reject) => {
			if(typeof window['cordova'] != 'undefined') {
				console.log("clearCredentials(): Running in a Cordova environment, using SecureStorage...");
				this.secureStorage.create('OnSiteX').then((secstorage: SecureStorageObject) => {
					// let userLogin = {username: this.username, password: this.password};
					return secstorage.remove('userLogin');
				}).then((res) => {
					console.log("Credentials successfully cleared from secure storage!");
					console.log(res);
					resolve(res);
				}).catch((err) => {
					console.log("Error clearing credentials in secure storage!");
					console.warn(err);
					reject(err);
				});
			} else {
				console.log("clearCredentials(): Running in a browser environment, using LocalStorage...");
				// let userLogin = {username: this.username, password: this.password};
				this.storage.remove('userLogin').then((res) => {
					console.log("Cleared credentials from local storage.");
					console.log(res);
					resolve(res);
				}).catch((err) => {
					console.log("Error clearing credentials from local storage!");
					console.warn(err);
					reject(err);
				});
			}
		});
	}

	areCredentialsSaved() {
		console.log("Checking status of saved credentials...");
		return new Promise((resolve,reject) => {
			this.isSecureStorageAvailable().then((ssAvailable) => {
				if(ssAvailable) {
					this.secureStorage.create('OnSiteX').then((sec: SecureStorageObject) => {
						// let userLogin = {username: this.username, password: this.password};
						return sec.get('userInfo');
					}).then((res) => {
						console.log("getCredentials(): Credentials retrieved from secure storage!");
						console.log(res);
						let userInfo = JSON.parse(res);
						this.setUser(userInfo.username);
						this.setPassword(userInfo.password);
						resolve(userInfo);
					}).catch((err) => {
						console.log("getCredentials(): Error getting credentials from secure storage!");
						console.error(err);
						reject(err);
					});
				} else {
					Log.l("getCredentials(): SecureStorage not available, using Localstorage...");
					this.storage.get('userInfo').then((res) => {
						console.log("getCredentials(): Credentials retrieved from local storage!");
						console.log(res);
						let userInfo = res;
						this.setUser(userInfo.username);
						this.setPassword(userInfo.password);
						resolve(userInfo);
					}).catch((err) => {
						console.log("getCredentials(): Error retrieving credentials from local storage!");
						console.error(err);
						reject(err);
					});
				}
			}).catch((outerError) => {
				Log.l("saveCredentials(): Error while checking for availability of SecureStorage.");
				Log.e(outerError);
				reject(outerError);
			});
		});
	}

	isSecureStorageAvailable() {
		return new Promise((resolve, reject) => {
			if(typeof window['cordova'] != 'undefined' && this.ud.getPlatform() != 'android') {
				Log.l("SecureStorage is probably available (cordova and not Android)");
				this.secureStorage.create('OnSiteX').then((sec: SecureStorageObject) => {
					Log.l("SecureStorage available");
					resolve(true);
				}).catch((err) => {
					Log.l("SecureStorage not available");
					resolve(false);
				});
			} else if(this.ud.getPlatform() == 'android') {
				/* Message / Localstorage */
				Log.l("SecureStorage is probably not available (Android)");
				// this.secureStorage.create('OnSiteX').then((res) => {
				Log.l("SecureStorage not available");
				resolve(false);
			} else {
				/* Cordova is likely undefined */
				Log.l("SecureStorage is not available (not cordova)");
				resolve(false);
			}
		});
	}

	passportAuthenticate() {
		
	}

	isFirstLogin() {
		console.log("Checking to see if this is first login...");
		return new Promise((resolve,reject) => {
			return this.storage.get('hasLoggedIn').then((userHasLoggedInBefore) => {
				if(userHasLoggedInBefore) {
					console.log("This is not the first login.");
					console.log(userHasLoggedInBefore)
					resolve(false);
				} else {
					console.log("This must be first login, hasLoggedIn flag does not exist.");
					resolve(true);
				}
				// console.log("This is not first login, hasLoggedIn flag exists.");
				// resolve(false);
			}).catch((err) => {
				/* Error getting tech profile or user is not logged in */
				console.log("This may be first login, hasLoggedIn flag does not exist.");
				resolve(true);
			});
		});
	}

	setLoginFlag() {
		Log.l("setLoginFlag(): Attempting to set login flag to true...");
		return new Promise((resolve,reject) => {
			this.storage.set('hasLoggedIn', true).then((res) => {
				console.log("Set hasLoggedIn to true.");
				console.log(res);
				resolve(res);
			}).catch((err) => {
				console.log("Error setting hasLoggedIn to true!");
				console.warn(err);
				reject(err);
			});
		});
	}

	clearLoginFlag() {
		Log.l("clearLoginFlag(): Attempting to clear login flag...");
		return new Promise((resolve,reject) => {
			this.storage.remove('hasLoggedIn').then((res) => {
				console.log("clearLoginFlag(): Successfully cleared hasLoggedIn flag.");
				console.log(res);
				resolve(res);
			}).catch((err) => {
				console.log("clearLoginFlag(): Error while attempting to clear hasLoggedIn flag.");
				console.warn(err);
				reject(err);
			});
		});
	}

	logout() {
		Log.l("logout(): Attempting to remove logged-in flag...");
		return new Promise((resolve,reject) => {
			this.clearLoginFlag().then((res) => {
				Log.l("AuthSrvcs.logout(): Cleared hasLoggedIn flag. User is now logged out.");
				resolve(res);
			}).catch((err) => {
				Log.l("AuthSrvcs.logout(): Error while logging out.");
				resolve(false);
			});
		});
	}


} // Close exported Class: AuthSrvcs