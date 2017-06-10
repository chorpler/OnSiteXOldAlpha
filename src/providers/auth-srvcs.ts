import { Injectable, NgZone                 } from '@angular/core'                ;
import { Http                               } from '@angular/http'                ;
import { AlertController                    } from 'ionic-angular'                ;
import 'rxjs/add/operator/map'                                                    ;
import * as PouchDB2                          from 'pouchdb'                      ;
import * as PouchDBAuth                       from 'pouchdb-authentication'       ;
import { Storage                            } from '@ionic/storage'               ;
import { NativeStorage                      } from 'ionic-native'                 ;
import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage' ;
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
  profileDoc  : any      ;
  settingsDoc : any      ;
  couchUser   : any      ;
  userProfile : any = {} ;
  remoteDB    : any = {} ;
  localDB     : any = {} ;
  ajaxOpts    : any = {} ;

  constructor(  public http: Http, public zone: NgZone,
                private storage: Storage, public srvr: SrvrSrvcs,
                public secureStorage: SecureStorage,
                public ud: UserData, public alrt: AlertController) {

    this.remote       = 'https://securedb.sesaonsite.com/reports' ;

    window['securestorage'] = this.secureStorage;
    window['storage'      ] = this.storage;
    window['lstor'        ] = this.storage;
    window["authserv"     ] = this;
  }
// 'https://martiancouch.hplx.net/reports'

  // -------------- AuthSrvcs METHODS------------------------

  showConfirm(title: string, text: string) {
    return new Promise((resolve,reject) => {
      let confirm = this.alrt.create({
        title: title,
        message: text,
        buttons: [
                  {text: 'Cancel', role: 'cancel', handler: () => {resolve(false);}},
                  {text: 'OK', handler: () => {resolve(true);}}
                 ]
      }); confirm.present();
    });
  }

  showAlert(title: string, subtitle?:string) {
    let alert = this.alrt.create({
      title: title,
      subTitle: subtitle || '',
      buttons: ['OK']
    }); alert.present();
  }

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


  login() {
    console.log("AuthSrvcs.login() now starting");
    return new Promise((resolve, reject) => {
      this.srvr.loginToServer(this.username, this.password).then((session) => {
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
        Log.l("SecureStorageAvailable returned: ", ssAvailable);
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
        let ss = {};
        Log.l("SecureStorage is probably not available (Android) but we will check");
        var _init = (param) => {
          return new Promise((iresolve,ireject) => {
              window['ss'] = new window['cordova']['plugins']['SecureStorage'](
                () => { iresolve(true);},
                () => {
                  if(param==0) {
                    this.showConfirm('NOT SECURE', 'Your device must be locked to save your user data. Go to security settings?').then((res) => {
                      Log.l("ShowConfirm gave:\n",res);
                      if(res) {
                        window['ss'].secureDevice(() => {iresolve(true)}, () => {Log.l("secureDevice called fail callback and is triggering init again."); iresolve(_init(1));});
                      } else {
                        this.showConfirm('ARE YOU SURE?', 'You will have to log in every time. Go to security settings?').then((res) => {
                          if(res) {
                            window['ss'].secureDevice(() => {iresolve(true)}, () => {iresolve(false)});
                          } else {
                            iresolve(false);
                          }
                        }).catch((err) => {
                          iresolve(false);
                        });
                      }
                    });
                  } else {
                    this.showConfirm('ARE YOU SURE?', 'You will have to log in every time. Go to security settings?').then((res) => {
                      if(res) {
                        window['ss'].secureDevice(() => {iresolve(true)}, () => {iresolve(false)});
                      } else {
                        iresolve(false);
                      }
                    }).catch((err) => {
                      iresolve(false);
                    });
                  }
                }, 'OnSiteX');
          })
        };
        Log.l("About to check SecureStorage!");
        _init(0).then((res) => {
          Log.l("isSecureStorageAvailable(): \n", res);
          Log.l("SecureStorage is in window.ss. See what it is!");
          resolve(res);
        }).catch((err) => {
          Log.l("isSecureStorageAvailable(): Error!");
          Log.e(err);
          resolve(false);
        });
      } else {
        Log.l("SecureStorage is not available (not cordova)");
        resolve(false);
      }
    });
  }

  passportAuthenticate() { }

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
