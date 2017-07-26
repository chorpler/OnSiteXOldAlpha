import { Injectable, NgZone    } from '@angular/core'                ;
import { AlertService          } from './alerts'                     ;
import 'rxjs/add/operator/map'                                       ;
import { SrvrSrvcs             } from './srvr-srvcs'                 ;
import { UserData              } from './user-data'                  ;
import { StorageService        } from './storage-service'            ;
import { Log                   } from '../config/config.functions'   ;

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

  constructor(  private storage: StorageService, public server: SrvrSrvcs,
                public ud: UserData, public alert: AlertService) {
    window["authserv"     ] = this;
  }
// 'https://martiancouch.hplx.net/reports'

  // -------------- AuthSrvcs METHODS------------------------

  // showConfirm(title: string, text: string) {
  //   return new Promise((resolve,reject) => {
  //     let confirm = this.alrt.create({
  //       title: title,
  //       message: text,
  //       buttons: [
  //                 {text: 'Cancel', role: 'cancel', handler: () => {resolve(false);}},
  //                 {text: 'OK', handler: () => {resolve(true);}}
  //                ]
  //     }); confirm.present();
  //   });
  // }

  // showAlert(title: string, subtitle?:string) {
  //   let alert = this.alrt.create({
  //     title: title,
  //     subTitle: subtitle || '',
  //     buttons: ['OK']
  //   }); alert.present();
  // }

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
      this.server.loginToServer(this.username, this.password).then((session) => {
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
    let userInfo = {username: this.username, password: this.password};
    return this.storage.persistentSave('userInfo', userInfo);
  }

  getCredentials() {
    Log.l("Retrieving credentials...");
    return new Promise((resolve,reject) => {
      this.storage.persistentGet('userInfo').then((res:any) => {
        if(res !== null) {
          let userInfo = res;
          this.setUser(userInfo.username);
          this.setPassword(userInfo.password);
          this.ud.storeCredentials(userInfo.username, userInfo.password);
          resolve(userInfo);
        } else {
          Log.l("getCredentials(): Credentials not available.");
          reject(false);
        }
      }).catch((err) => {
        Log.e("getCredentials(): Error getting credentials from persistent storage!");
        Log.e(err);
        reject(err);
      });
    });
  }

  clearCredentials() {
    Log.l("Clearing credentials...");
    return this.storage.persistentDelete('userInfo');
  }

  areCredentialsSaved() {
    console.log("Checking status of saved credentials...");
    return new Promise((resolve,reject) => {
      this.storage.persistentGet('userInfo').then((res:any) => {
        if(res !== null) {
        let userInfo = res;
        this.setUser(userInfo.username);
        this.setPassword(userInfo.password);
        this.ud.storeCredentials(userInfo.username, userInfo.password);
          resolve(res);
        } else {
          resolve(false);
        }
      }).catch((err) => {
        Log.l("areCredentialsSaved(): Error checking if credentials are saved!");
        Log.e(err);
        reject(err);
      });
    });
  }

  isFirstLogin() {
    Log.l("Checking to see if this is first login...");
    return new Promise((resolve,reject) => {
      return this.storage.persistentGet('hasLoggedIn').then((userHasLoggedInBefore) => {
        if(userHasLoggedInBefore) {
          resolve(false);
        } else {
          resolve(true);
        }
      }).catch((err) => {
        Log.l("isFirstLogin(): Error checking for login flag!");
        Log.e(err);
        resolve(true);
      });
    });
  }

  setLoginFlag() {
    Log.l("setLoginFlag(): Attempting to set login flag to true...");
    return new Promise((resolve,reject) => {
      this.storage.persistentSave('hasLoggedIn', true).then((res) => {
        resolve(res);
      }).catch((err) => {
        Log.l("setLoginFlag(): Error setting hasLoggedIn to true!");
        Log.e(err);
        reject(err);
      });
    });
  }

  clearLoginFlag() {
    Log.l("clearLoginFlag(): Attempting to clear login flag...");
    return new Promise((resolve,reject) => {
      this.storage.persistentDelete('hasLoggedIn').then((res) => {
        resolve(res);
      }).catch((err) => {
        Log.l("clearLoginFlag(): Error while attempting to clear hasLoggedIn flag.");
        Log.e(err);
        reject(err);
      });
    });
  }

  logout() {
    Log.l("logout(): Attempting to remove logged-in flag...");
    return new Promise((resolve,reject) => {
      this.clearLoginFlag().then((res) => {
        return this.clearCredentials();
      }).then((res) =>{
        this.ud.logout();
        Log.l("Auth.logout(): Cleared user credentials. User is now well and truly logged out.");
        resolve(res);
      }).catch((err) => {
        Log.l("AuthSrvcs.logout(): Error while logging out.");
        Log.e(err);
        resolve(false);
      });
    });
  }
}
