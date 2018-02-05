import { Injectable, NgZone    } from '@angular/core'     ;
import { AlertService          } from './alerts'          ;
import { ServerService         } from './server-service'  ;
import { UserData              } from './user-data'       ;
import { StorageService        } from './storage-service' ;
import { Log                   } from 'domain/onsitexdomain'    ;

@Injectable()
export class AuthService {

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

  constructor(  private storage: StorageService, public server: ServerService,
                public ud: UserData, public alert: AlertService) {
    window["authserv"     ] = this;
  }

  public setUser(user1: string) {
    this.username = user1;
    console.log(`setUser set user to ${this.username}`);
    this.ajaxOpts = { ajax: { headers: { Authorization: 'Basic ' + window.btoa(this.username + ':' + this.password) } } };
  }

  public setPassword(pass1: string) {
    this.password = pass1;
    console.log(`setPassword set password to ${this.password}`);
    this.ajaxOpts = { ajax: { headers: { Authorization: 'Basic ' + window.btoa(this.username + ':' + this.password) } } };
  }

  public getUser() {
    return this.username;
  }

  public getPass() {
    return this.password;
  }

  public getLoginInfo() {

  }

  public remoteLogin() {

  }


  public login() {
    console.log("AuthSrvcs.login() now starting");
    return new Promise((resolve, reject) => {
      this.server.loginToServer(this.username, this.password).then((session) => {
        if(session) {
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

  public saveCredentials() {
    let userInfo = {username: this.username, password: this.password};
    // return this.storage.persistentSave('userInfo', userInfo);
    return this.storage.secureSave('userInfo', userInfo);
  }

  public getCredentials() {
    Log.l("Retrieving credentials...");
    return new Promise((resolve,reject) => {
      this.storage.secureGet('userInfo').then((res:any) => {
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

  public clearCredentials() {
    Log.l("Clearing credentials...");
    return this.storage.secureDelete('userInfo');
  }

  public areCredentialsSaved() {
    console.log("Checking status of saved credentials...");
    return new Promise((resolve,reject) => {
      this.storage.secureGet('userInfo').then((res:any) => {
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

  public isFirstLogin() {
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

  public setLoginFlag() {
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

  public clearLoginFlag() {
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

  public logout() {
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
