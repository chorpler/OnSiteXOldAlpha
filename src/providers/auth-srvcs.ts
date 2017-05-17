import { Injectable, NgZone                 } from '@angular/core'                ;
import { Http                               } from '@angular/http'                ;
import 'rxjs/add/operator/map'                                                    ;
import * as PouchDB2                          from 'pouchdb'                      ;
import * as PouchDBAuth                       from 'pouchdb-authentication'       ;
import { Storage                            } from '@ionic/storage'               ;
import { NativeStorage                      } from 'ionic-native'                 ;
import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage' ;
import { DBSrvcs                            } from '../providers/db-srvcs'        ;
import { Log, CONSOLE                       } from '../config/config.functions'   ;

@Injectable()
export class AuthSrvcs {

  data        : any      ;
  username    : any      ;
  password    : any      ;
  remote      : any      ;
  options     : any      ;
  docId       : string   ;
  PouchDB     : any      ;
  profileDoc  : any      ;
  settingsDoc : any      ;
  couchUser   : any      ;
  userProfile : any = {} ;
  remoteDB    : any = {} ;
  localDB     : any = {} ;

  constructor(public http: Http, public zone: NgZone, private db: DBSrvcs, private storage: Storage, public secureStorage: SecureStorage) {
    // this.PouchDB = require("pouchdb");
    // this.PouchDB.plugin(require('pouchdb-authentication'));
    // window["PouchDB"] = this.PouchDB; // Dev setting to reveal PouchDB to PouchDB Inspector
    // this.userDb       = new PouchDB('notusers')                 ;
    // this.username = 'sesatech';
    // this.password = 'sesatech';

    // this.localDB = DBSrvcs.get

    this.remote       = 'https://martiancouch.hplx.net/reports' ;
    // this.remote = 'https://192.168.0.140:5984/_users';
    // this.remote = 'http://162.243.157.16/reports/';
    this.profileDoc = '_local/techProfile';
    // this.remote       = 'http://192.168.0.140/notusers' ;
    // this.docId        = 'org.couchdb.user:testUser005'          ;

    window['lstor'] = this.storage;
    window["authserv"] = this;


    this.options = {
      live: true,
      retry: true,
      continuous: false
      ,auth: { username: this.username, password: this.password }
    };

    // this.userDb.sync(this.remote, this.options);
  }

  // -------------- AuthSrvcs METHODS------------------------

  ionViewDidLoad() { }

  setUser(user1: string) {
    this.username = user1;
    console.log(`setUser set user to ${this.username}`);
  }

  setPassword(pass1: string) {
    this.password = pass1;
    console.log(`setPassword set password to ${this.password}`);
  }

  /**
   * 
   */
  login() {
    // console.log(this.docId);
    console.log("AuthSrvcs.login() now starting");
    // let pouchOpts = { skipSetup: true };
    let ajaxOpts = { ajax: { headers: { Authorization: 'Basic ' + window.btoa(this.username + ':' + this.password) } } };
    // this.remoteDB = this.PouchDB(this.remote, pouchOpts);
    this.remoteDB = DBSrvcs.addRDB('reports');
    console.log("Now making login attempt, options:");
    console.log(ajaxOpts);
    console.log("Username: " + this.username);
    return new Promise((resolve, reject) => {
      return this.remoteDB.login(this.username, this.password, ajaxOpts).then((res) => {
        console.log("Login complete");
        console.log(res);
        return this.remoteDB.getSession();
      }).then((session) => {
        console.log("Got session.");
        console.log(session);
        if(typeof session.info == 'undefined' || typeof session.info.authenticated != 'string') {
          /* Login failed for some reason */
          Log.l("Error during PouchDB login to CouchDB server: session could not be authenticated!");
          reject("not authenticated");
        } else {
          console.log("Now attempting getUser()...");
          let dbUser = session.userCtx.name;
          this.remoteDB.getUser(this.username).then((user) => {
            this.couchUser = user;
            this.userProfile.firstName      = this.couchUser.firstName      ;
            this.userProfile.lastName       = this.couchUser.lastName       ;
            this.userProfile.avatarName     = this.couchUser.avatarName     ;
            this.userProfile.client         = this.couchUser.client         ;
            this.userProfile.location       = this.couchUser.location       ;
            this.userProfile.locID          = this.couchUser.locID          ;
            this.userProfile.loc2nd         = this.couchUser.loc2nd         ;
            this.userProfile.shift          = this.couchUser.shift          ;
            this.userProfile.shiftLength    = this.couchUser.shiftLength    ;
            this.userProfile.shiftStartTime = this.couchUser.shiftStartTime ;
            this.userProfile.updated        = true                          ;
            this.userProfile._id            = this.profileDoc               ;

            console.log("Got user");
            console.log(user);
            // let tmpProfile = {id: this.userDb, firstName: user.firstName, lastName: user.lastName, client: user.client, location: user.location, locID: user.locID, loc2nd: user.loc2nd, shift: user.shift, shiftLength: user.shiftLength, shiftStartTime: user.shiftStartTime};
            return this.db.addLocalDoc(this.userProfile);
          }).then((res) => {
            console.log("userProfile document added successfully. Now saving credentials...");
            return this.saveCredentials();
          }).then((res2) => {
            console.log("Credentials saved. Finished.");
            return this.setLoginFlag();
          }).then((res3) => {
            resolve(res3);
            // }).then((docs) => {
            //   console.log(docs);
          }).catch((error) => {
            console.log("Error during PouchDB login/getUser");
            console.error(error);
            reject(error);
          });
        }
      }).catch((err) => {
        Log.l("login(): Error trying to get user session. Probably user could not log in.");
        Log.w(err);
        reject(err);
      });
    });
  }

  saveCredentials() {
    console.log("Saving credentials...");
    window["secureStorage"] = this.secureStorage;
    return new Promise((resolve,reject) => {
      if(typeof window['cordova'] != 'undefined') {
        console.log("saveCredentials(): Running in a Cordova environment, using SecureStorage...");
        this.secureStorage.create('OnSiteX').then((secstorage: SecureStorageObject) => {
          let userLogin = {username: this.username, password: this.password};
          return secstorage.set('userLogin', JSON.stringify(userLogin));
        }).then((res) => {
          console.log("Credentials saved in secure storage!");
          console.log(res);
          resolve(res);
        // }).then(res2) {}
        }).catch((err) => {
          console.log("Error saving credentials in secure storage!");
          console.warn(err);
          reject(err);
        });
      } else {
        console.log("saveCredentials(): Running in a browser environment, using LocalStorage...");
        let userLogin = {username: this.username, password: this.password};
        this.storage.set('userLogin', userLogin).then((res) => {
          console.log("Saved credentials to local storage.");
          console.log(res);
          resolve(res);
        }).catch((err) => {
          console.log("Error saving credentials in local storage!");
          console.warn(err);
          reject(err);
        });
      }
    });
  }

  getCredentials() {
    console.log("Retrieving credentials...");
    return new Promise((resolve,reject) => {
      if(typeof window['cordova'] != 'undefined') {
        this.secureStorage.create('OnSiteX').then((secstorage: SecureStorageObject) => {
         // let userLogin = {username: this.username, password: this.password};
         return secstorage.get('userLogin');
        }).then((res) => {
          console.log("Credentials retrieved from secure storage!");
          console.log(res);
          let userInfo = JSON.parse(res);
          this.setUser(userInfo.username);
          this.setPassword(userInfo.password);
          resolve(userInfo);
        // }).then(res2) {}
        }).catch((err) => {
          console.log("Error getting credentials from secure storage!");
          console.warn(err);
          reject(err);
        });
      } else {
        console.log("getCredentials(): Running in a browser environment, using LocalStorage...");
        // let userLogin = {username: this.username, password: this.password};
        return this.storage.get('userInfo').then((res) => {
          console.log("Credentials retrieved from local storage!");
          console.log(res);
          // let userInfo = JSON.parse(res);
          let userInfo = res;
          this.setUser(userInfo.username);
          this.setPassword(userInfo.password);
          resolve(userInfo);
        }).catch((err) => {
          console.log("Error rerieving credentials from local storage!");
          console.warn(err);
          reject(err);
        })
      }
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

  isUserLoggedIn() {
    console.log("Checking to see if user is logged in...");
    return new Promise((resolve,reject) => {
      this.db.getTechProfile().then((res) => {
        console.log("This is not the first login.");
      }).catch((err) => {
        /* Error getting tech profile or user is not logged in */

      });
    });
  }

  setLoginFlag() {
    Log.l("setLoginFlag(): Attempting to set login flag to true...");
    this.storage.set('hasLoggedIn', true).then((res) => {
      console.log("Set hasLoggedIn to true.");
      console.log(res);
      resolve(res);
    }).catch((err) => {
      console.log("Error setting hasLoggedIn to true!");
      console.warn(err);
      reject(err);
    });
  }

  clearLoginFlag() {
    Log.l("clearLoginFlag(): Attempting to clear login flag...");
    this.storage.remove('hasLoggedIn').then((res) => {
      console.log("clearLoginFlag(): Successfully cleared hasLoggedIn flag.");
      console.log(res);
      resolve(res);
    }).catch((err) => {
      console.log("clearLoginFlag(): Error while attempting to clear hasLoggedIn flag.");
      console.warn(err);
      reject(err);
    });
  }

  logout() {
    Log.l("logout(): Attempting to remove logged-in flag...");
    return new Promise((resolve,reject) => {
      return this.clearLoginFlag();
      // this.storage.remove('hasLoggedIn').then((res) => {
      //   Log.l("logout(): 'hasLoggedIn' flag removed.")
      //   Log.l(res);
      //   resolve(res);
      // }).catch((err) => {
      //   Log.l("logout(): ERROR while removing 'hasLoggedIn' flag!");
      //   Log.w(err);
      //   reject(err);
      // });
    });
  }


} // Close exported Class: AuthSrvcs