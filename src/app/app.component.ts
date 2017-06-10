import { Component, ViewChild                } from '@angular/core'                     ;
import { Platform, Nav, ToastController      } from 'ionic-angular'                     ;
import { StatusBar                           } from '@ionic-native/status-bar'          ;
import { SplashScreen                        } from '@ionic-native/splash-screen'       ;
import { Storage                             } from '@ionic/storage'                    ;
import { Push, PushObject, PushOptions       } from '@ionic-native/push'                ;
import { DBSrvcs                             } from '../providers/db-srvcs'             ;
import { AuthSrvcs                           } from '../providers/auth-srvcs'           ;
import { UserData                            } from '../providers/user-data'            ;
import { NetworkStatus                       } from '../providers/network-status'       ;
import { GeolocService                       } from '../providers/geoloc-service'       ;
import { Log, CONSOLE                        } from '../config/config.functions'        ;
import { DOMTimeStamp, Coordinates, Position } from '../config/geoloc'                  ;
import { LocalNotifications                  } from '@ionic-native/local-notifications' ;
import * as PouchDB                            from 'pouchdb'                           ;
import * as pdbAuth                            from 'pouchdb-authentication'            ;
import * as pdbUpsert                          from 'pouchdb-upsert'                    ;
import * as pdbSeamlessAuth                    from 'pouchdb-seamless-auth'             ;
import * as moment                             from 'moment'                            ;


@Component({ templateUrl: 'app.html' })

export class OnSiteApp {
  @ViewChild(Nav) nav: Nav;

  title       : string = 'OnSiteHome';
  rootPage    : any                  ;
  pouchOptions: any    = {          };

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
                public auth        : AuthSrvcs          ) {

    window['appcomp'] = this;
    window['moment'] = moment;

    this.initializeApp();
  }

  initializeApp() {
    Log.l("AppComponent: Initializing app...");

      this.platform.ready().then((res) => {
        Log.l("Platform Ready was fired.\n", res);
        this.statusBar.styleDefault();
        this.splashScreen.hide();
        NetworkStatus.watchForDisconnect();
        this.pouchOptions = { adapter: 'websql', auto_compaction: true };

        window["PouchDB" ] = DBSrvcs.StaticPouchDB;
        window["Platform"] = this.platform;
        window["PouchDB" ].defaults(this.pouchOptions);

        DBSrvcs.addDB('reports');

        window[ "PouchDB"].debug.disable('*');
        window[ 'moment' ] = moment;
        window[ 'Log'    ] = Log;
        window[ 't1'     ] = CONSOLE.t1;
        window[ 'c1'     ] = CONSOLE.c1;

        this.nav.setRoot('Tech Settings');

      });
  }

  terminateApp() { this.platform.exitApp(); }

}

