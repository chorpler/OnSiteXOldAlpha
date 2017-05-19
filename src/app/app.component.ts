import { Component               } from '@angular/core'               ;
import { Platform, NavController, ToastController } from 'ionic-angular'               ;
import { StatusBar               } from '@ionic-native/status-bar'    ;
import { SplashScreen            } from '@ionic-native/splash-screen' ;
import { Storage                 } from '@ionic/storage'              ;
import { DBSrvcs                 } from '../providers/db-srvcs'       ;
import { AuthSrvcs               } from '../providers/auth-srvcs'     ;
import { UserData                } from '../providers/user-data'      ;
import { Log, CONSOLE            } from '../config/config.functions'  ;
import * as PouchDB2               from 'pouchdb'                     ;
import * as pdbAuth                from 'pouchdb-authentication'      ;
import * as pdbUpsert              from 'pouchdb-upsert'              ;
import * as moment                 from 'moment'                      ;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = 'OnSiteHome';
  PouchDB: any;
  pouchOptions: any = {};

  constructor(platform: Platform, navCtrl: NavController, toast: ToastController, statusBar: StatusBar, splashScreen: SplashScreen, storage: Storage, db: DBSrvcs, auth: AuthSrvcs) {
    window['appcomponents'] = this;
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      platform.registerBackButtonAction(() => {
        Log.l("Back button pressed (defined in app.components.ts).");
        // if()
        //   this.platform.exitApp();
        // } else if (this.nav.canGoBack()) {
        //   this.nav.pop({});
        // } else {
        //   this.showToast();
        //   this.backButtonPressedOnceToExit = true;
        //   setTimeout(() => {

        //     this.backButtonPressedOnceToExit = false;
        //   },2000)
        // }
        if(typeof this['navCtrl'] != 'undefined') {
          let nav = this['navCtrl'];
          if(nav.canGoBack()) {
            nav.pop();
          } else {
            /* Future functions */
          }
        }
      });

      this.pouchOptions = {adapter: 'websql', auto_compaction: true};
      window["PouchDB"] = DBSrvcs.StaticPouchDB;
      window["Platform"] = platform;
      this.PouchDB = window["PouchDB"];
      this.PouchDB.defaults(this.pouchOptions);
      DBSrvcs.addDB('reports');

      // this.PouchDB.debug.enable('*');
      this.PouchDB.debug.disable('*');
      window['moment'] = moment;
      window['Log'] = Log;
      window['t1'] = CONSOLE.t1;
      window['c1'] = CONSOLE.c1;

      console.log("App done starting, now moving to Home...");
      // navCtrl.push('OnSiteHome');
      navCtrl.setRoot("OnSiteHome");
    });
  }
}

