import 'rxjs/add/operator/map'                                                    ;
import { Injectable                         } from '@angular/core'                ;
import { Platform                           } from 'ionic-angular'                ;
import { Storage,                           } from '@ionic/storage'               ;
import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage' ;
import { SrvrSrvcs                          } from './srvr-srvcs'                 ;
import { AlertService                       } from '../providers/alerts'          ;
import { UserData                           } from '../providers/user-data'       ;
import { Log                                } from '../config/config.functions'   ;

@Injectable()
export class StorageService {

  data        : any      ;
  remote      : any      ;
  options     : any      ;
  docId       : string   ;
  profileDoc  : any      ;
  settingsDoc : any      ;
  couchUser   : any      ;
  userProfile : any = {} ;
  remoteDB    : any = {} ;
  localDB     : any = {} ;

  constructor(
    public storage      : Storage,
    public secureStorage: SecureStorage,
    public ud           : UserData,
    public alert        : AlertService,
    public platform     : Platform,

  ) {
    window['securestorage'] = this.secureStorage;
    window['onsitestorage'] = this;
  }


  persistentSave(key:string, value:any) {
    return new Promise((resolve,reject) => {
      this.storage.set(key, value).then((res) => {
        resolve(res);
      }).catch((err) => {
        Log.e("Error saving credentials in local storage!");
        Log.e(err);
        reject(err);
      });
    });
  }

  persistentSet(key:string, value:any) {
    return this.persistentSave(key, value);
  }

  persistentGet(key:string) {
    return new Promise((resolve,reject) => {
      this.storage.get(key).then((value) => {
        if(value) {
          Log.l("persistentGet(): Got:\n", value);
          resolve(value);
        } else {
          Log.l(`persistentGet(): key '${key}' not found in local storage!`);
          reject(false);
        }
      }).catch((err) => {
        Log.e(`persistentGet(): Error retrieving '${key}' from local storage!`);
        Log.e(err);
        reject(err);
      });
    });
  }

  persistentDelete(key:string) {
    return new Promise((resolve,reject) => {
      this.storage.remove(key).then((value) => {
        if(value) {
          resolve(value);
        } else {
          Log.w(`persistentDelete(): key '${key}' not found in local storage!`);
          resolve(true);
        }
      }).catch((err) => {
        Log.e(`persistentDelete(): Error trying to delete '${key}' from local storage!`);
        Log.e(err);
        reject(err);
      });
    });
  }

  secureSave(key:string, value:any) {
    return new Promise((resolve,reject) => {
      this.secureAvailable().then((ssAvailable) => {
        if(ssAvailable) {
          this.secureStorage.create('OnSiteX').then((sec: SecureStorageObject) => {
            return sec.set(key, JSON.stringify(value));
          }).then((res) => {
            resolve(res);
          }).catch((err) => {
            Log.e("secureSave(): Error saving credentials in secure storage!");
            Log.e(err);
            Log.l("secureSave(): SecureStorage not available, using Localstorage...");
            this.persistentSave(key, value).then((res) => {
              resolve(res);
            }).catch((err) => {
              Log.e("secureSave(): Error while falling back to LocalStorage!");
              Log.e(err);
              reject(err);
            });
          });
        } else {
          Log.l("secureSave(): SecureStorage not available, using Localstorage...");
          this.persistentSave(key, value).then((res) => {
            resolve(res);
          }).catch((err) => {
            Log.e("secureSave(): Error while falling back to LocalStorage!");
            Log.e(err);
            reject(err);
          });
        }
      }).catch((err) => {
        Log.l("secureSave(): Error while checking for availability of SecureStorage.");
        Log.e(err);
        Log.l("secureSave(): SecureStorage not available, using Localstorage...");
        this.persistentSave(key, value).then((res) => {
          resolve(res);
        }).catch((err) => {
          Log.e("secureSave(): Error while falling back to LocalStorage!");
          Log.e(err);
          reject(err);
        });
      });
    });
  }

  secureSet(key:string, value:any) {
    return this.secureSave(key, value);
  }

  secureGet(key:string) {
    return new Promise((resolve,reject) => {
      this.secureAvailable().then((ssAvailable) => {
        if(ssAvailable) {
          Log.l("secureGet(): Using SecureStorage...");
          this.secureStorage.create('OnSiteX').then((sec: SecureStorageObject) => {
            return sec.get(key);
          }).then((value) => {
            if(value !== null) {
              resolve(JSON.parse(value));
            } else {
              Log.e(`secureGet(): Key '${key}' not found in secure storage.`);
              Log.l("secureGet(): SecureStorage does not have credentials, falling back to LocalStorage.");
              this.persistentGet(key).then(res => {
                if (res) {
                  resolve(res);
                } else {
                  Log.l(`secureGet->persistentGet(): Value was undefined or null for key '${key}'.`);
                  reject("Value undefined");
                }
              }).catch(err => {
                Log.l(`secureGet(): Error falling back to LocalStorage.`);
                Log.e(err);
                reject(err);
              });
            }
          }).catch((err) => {
            Log.e(`secureGet(): Error retrieving '${key}' from secure storage. SecureStorage not available or value not found, falling back to LocalStorage.`);
            this.persistentGet(key).then(res => {
              if (res) {
                resolve(res);
              } else {
                Log.l(`secureGet->persistentGet(): Value was undefined or null for key '${key}'.`);
                reject(err);
              }
            }).catch(err => {
              Log.l(`secureGet(): Error falling back to LocalStorage.`);
              Log.e(err);
              reject(err);
            });
          });
        } else {
          Log.l("secureGet(): SecureStorage not available, falling back to LocalStorage.");
          this.persistentGet(key).then(res => {
            if(res) {
              resolve(res);
            } else {
              Log.l(`secureGet->persistentGet(): Value was undefined or null for key '${key}'.`);
              reject("Value undefined");
            }
          }).catch(err => {
            Log.l(`secureGet(): Error falling back to LocalStorage.`);
            Log.e(err);
            reject(err);
          });
        }
      });
    });
  }

  secureDelete(key:string) {
    return new Promise((resolve,reject) => {
      this.secureAvailable().then((ssAvailable) => {
        if(ssAvailable) {
          Log.l("secureDelete(): Using SecureStorage...");
          this.secureStorage.create('OnSiteX').then((sec: SecureStorageObject) => {
            return sec.remove(key);
          }).then((value) => {
            if(value !== null) {
              resolve(value);
            } else {
              Log.w(`secureDelete(): Key '${key}' not found in secure storage.`);
              resolve(true);
            }
          }).catch((err) => {
            Log.e(`secureDelete(): Error trying to clear '${key}' from secure storage.`);
            Log.e(err);
            reject(err);
          });
        } else {
          this.persistentDelete(key).then(res => {
            Log.l(`secureDelete->persistentDelete(): Successfully deleted key '${key}'.`);
            resolve(res);
          }).catch(err => {
            Log.l(`secureDelete->persistentDelete(): Error deleting key '${key}'.`);
            Log.e(err);
            reject(err);
          })
        }
      });
    });
  }

  secureAvailable() {
    return new Promise((resolve, reject) => {
      if(this.platform.is('cordova') && !this.platform.is('android')) {
        Log.l("SecureStorage is probably available (cordova and not Android)");
        this.secureStorage.create('OnSiteX').then((sec: SecureStorageObject) => {
          Log.l("SecureStorage available");
          resolve(true);
        }).catch((err) => {
          Log.l("SecureStorage not available");
          resolve(false);
        });
      // } else if(this.ud.getPlatform() == 'android') {
      } else if(this.platform.is('cordova') && this.platform.is('android')) {
        // 2017-07-06: Fuck it, nobody wants to see this warning
        resolve(false);
        // let ss = {};
        // Log.l("SecureStorage is probably not available (Android) but we will check");
        // var _init = (param) => {
        //   let {STORAGE: {LOCKSCREEN: { FIRST, SECOND}}} = STRINGS;
        //   return new Promise((iresolve,ireject) => {
        //       window['ss'] = new window['cordova']['plugins']['SecureStorage'](
        //         () => { iresolve(true);},
        //         () => {
        //           if(param==0) {
        //             this.alert.showConfirm(FIRST.TITLE, FIRST.TEXT).then((goToSettings) => {
        //               if(goToSettings) {
        //                 window['ss'].secureDevice(() => {iresolve(true)}, () => {Log.l("secureDevice called fail callback and is triggering init again."); iresolve(_init(1));});
        //               } else {
        //                 // this.alert.showConfirm('ARE YOU SURE?', 'You will have to log in every time. Go to security settings?').then((res) => {
        //                 //   if(res) {
        //                 //     window['ss'].secureDevice(() => {iresolve(true)}, () => {iresolve(false)});
        //                 //   } else {
        //                     iresolve(false);
        //                   // }
        //                 // }).catch((err) => {
        //                 //   iresolve(false);
        //                 // });
        //               }
        //             });
        //           } else {
        //             // this.alert.showConfirm(SECOND.TITLE, SECOND.TEXT).then((res) => {
        //             //   if(res) {
        //             //     window['ss'].secureDevice(() => {iresolve(true)}, () => {iresolve(false)});
        //             //   } else {
        //                 iresolve(false);
        //             //   }
        //             // }).catch((err) => {
        //             //   iresolve(false);
        //             // });
        //           }
        //         }, 'OnSiteX');
        //   });
        // };
        // _init(0).then((res) => {
        //   resolve(res);
        // }).catch((err) => {
        //   Log.l("secureAvailable(): Error!");
        //   Log.e(err);
        //   resolve(false);
        // });
      } else {
        Log.l("SecureStorage is not available (not cordova)");
        resolve(false);
      }
    });
  }
}
