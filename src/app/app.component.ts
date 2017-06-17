import { Http                                   } from '@angular/http'                     ;
import { Component, ViewChild                   } from '@angular/core'                     ;
import { Platform, Nav, ToastController, Events, App } from 'ionic-angular'                ;
import { StatusBar                              } from '@ionic-native/status-bar'          ;
import { SplashScreen                           } from '@ionic-native/splash-screen'       ;
import { Storage                                } from '@ionic/storage'                    ;
import { Push, PushObject, PushOptions          } from '@ionic-native/push'                ;
import { UserData                               } from '../providers/user-data'            ;
import { PouchDBService                         } from '../providers/pouchdb-service'      ;
import { DBSrvcs                                } from '../providers/db-srvcs'             ;
import { SrvrSrvcs                              } from '../providers/srvr-srvcs'           ;
import { AuthSrvcs                              } from '../providers/auth-srvcs'           ;
import { NetworkStatus                          } from '../providers/network-status'       ;
import { GeolocService                          } from '../providers/geoloc-service'       ;
import { Log, CONSOLE                           } from '../config/config.functions'        ;
import { DOMTimeStamp, Coordinates, Position    } from '../config/geoloc'                  ;
import { LocalNotifications                     } from '@ionic-native/local-notifications' ;
import * as moment                                from 'moment'                            ;
import { TabsComponent                          } from '../components/tabs/tabs'           ;
import { PREFS                                  } from '../config/config.strings'          ;
import { TranslateService } from '@ngx-translate/core';


@Component({ templateUrl: 'app.html' })

export class OnSiteApp {
  @ViewChild(Nav) nav: Nav;

  title       : string  = 'OnSiteHome';
  rootPage    : any                   ;
  pouchOptions: any     = {          };
  bkBtnPrsd2nd: boolean = false       ;
  static PREFS: any     = new PREFS()       ;
  prefs       : any     = OnSiteApp.PREFS;

  private network: any;

  constructor(
                public platform    : Platform          ,
                public toast       : ToastController   ,
                public statusBar   : StatusBar         ,
                public splashScreen: SplashScreen      ,
                public net         : NetworkStatus     ,
                public push        : Push              ,
                public localNotify : LocalNotifications,
                public storage     : Storage           ,
                public db          : DBSrvcs           ,
                public ud          : UserData          ,
                public auth        : AuthSrvcs         ,
                public server      : SrvrSrvcs         ,
                public events      : Events            ,
                public tabs        : TabsComponent     ,
                public app         : App               ,
                public translate   : TranslateService) {

    window['appcomp'] = this;
    window['moment'] = moment;
    this.initializeApp();
  }

  initializeApp() {
    Log.l("AppComponent: Initializing app...");

    this.platform.ready().then((res) => {
      this.platform.registerBackButtonAction(() => {
        if (this.bkBtnPrsd2nd) { this.platform.exitApp(); }
        else {
          this.showToast("Press back again to exit");
          this.bkBtnPrsd2nd = true;
          setTimeout(() => { this.bkBtnPrsd2nd = false; }, 2000)
        }
      });
      Log.l("Platform Ready was fired.\n", res);
      // this.translate.addLangs(['en', 'es']);
      this.translate.setDefaultLang('en');
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      NetworkStatus.watchForDisconnect();
      this.pouchOptions = { adapter: 'websql', auto_compaction: true };
      window["PouchDB"] = PouchDBService.PouchInit();
      window["Platform"] = this.platform;
      window["PouchDB" ].defaults(this.pouchOptions);

      window[ "PouchDB"].debug.disable('*');
      window[ 'moment' ] = moment;
      window[ 'Log'    ] = Log;
      window[ 't1'     ] = CONSOLE.t1;
      window[ 'c1'     ] = CONSOLE.c1;

      this.checkPreferences().then(() => {
        Log.l("OnSite: Done messing with preferences, now checking login...");
        return this.checkLogin();
      }).then((res) => {
        Log.l("initializeApp(): User passed login check. Should be fine!");
        this.events.publish('startup:finished', this.ud.getLoginStatus());
        this.rootPage = 'OnSiteHome';
      }).catch((err) => {
        Log.l("initializeApp(): User failed login check. Sending to login.");
        this.rootPage = 'Login';
      });
    });
  }

  showToast(text: string) {
    let toast = this.toast.create({
      message: text,
      duration: 3000
    });
    toast.present();
  }

  checkPreferences() {
    return new Promise((resolve,reject) => {
      this.storage.get('PREFS').then((storedPrefs) => {
        if(storedPrefs !== null && storedPrefs !== undefined && typeof storedPrefs !== 'undefined' && storedPrefs !== 'undefined') {
          this.prefs.setPrefs(storedPrefs);
          Log.l("OnSite: Preferences found saved and reloaded:\n", this.prefs.getPrefs());
          resolve(storedPrefs);
        } else {
          this.storage.set('PREFS', this.prefs.getPrefs()).then((res) => {
            Log.l("OnSite: Preferences stored:\n", this.prefs.getPrefs());
            resolve(res);
          });
        }
      }).catch((err) => {
        Log.l("OnSite: Error while checking for stored preferences!");
        Log.e(err);
        reject(err);
      });
    });
  }

  checkLogin() {
    return new Promise((resolve,reject) => {
      this.auth.areCredentialsSaved().then((res) => {
        Log.l("checkLogin(): Got saved credentials back:\n", res);
        Log.l("... using them to log in to the server...");
        let loginData = res;
        let u = loginData['username'];
        let p = loginData['password'];
        // let udLoginData = {"user": u, "pass": p};
        // this.ud.storeCredentials(u, p);
        return this.server.loginToServer(u, p, '_session');
      }).then((res) => {
        Log.l("checkLogin(): Successfully logged in!");
        // this.ud.setLoginStatus(true);
        resolve(res);
      }).catch((err) => {
        Log.l("checkLogin(): Error checking for saved credentials. User not authenticated properly!");
        Log.e(err);
        reject(err);
      });
    });
  }

}

