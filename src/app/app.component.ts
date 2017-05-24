import { Component, ViewChild                               } from '@angular/core';
import { Platform, Nav, ToastController                     } from 'ionic-angular'                              ;
import { StatusBar                                          } from '@ionic-native/status-bar'                   ;
import { SplashScreen                                       } from '@ionic-native/splash-screen'                ;
import { Storage                                            } from '@ionic/storage'                             ;
import { Push, PushObject, PushOptions                      } from '@ionic-native/push'                         ;
import { DBSrvcs                                            } from '../providers/db-srvcs'                      ;
import { AuthSrvcs                                          } from '../providers/auth-srvcs'                    ;
import { UserData                                           } from '../providers/user-data'                     ;
import { NetworkStatus                                      } from '../providers/network-status'                ;
import { GeolocService                                      } from '../providers/geoloc-service'                ;
import { Log, CONSOLE                                       } from '../config/config.functions'                 ;
import { DOMTimeStamp, Coordinates, Position                } from '../config/geoloc'                           ;
import { LocalNotifications                                 } from '@ionic-native/local-notifications'          ;
// import { HomePage                                           } from '../pages/home/home'                         ;
import * as PouchDB                                           from 'pouchdb'                                    ;
import * as pdbAuth                                           from 'pouchdb-authentication'                     ;
import * as pdbUpsert                                         from 'pouchdb-upsert'                             ;
import * as pdbSeamlessAuth                                   from 'pouchdb-seamless-auth'                      ;
import * as moment                                            from 'moment'                                     ;


@Component({
  templateUrl: 'app.html'
})

export class OnSiteApp {
  @ViewChild(Nav) nav: Nav;

  homePage         : string = 'OnSiteHome';
  rootPage         : any    = 'OnSiteHome';
  pouchOptions     : any = {}             ;
  private network  : any                  ;

  constructor(
    public platform         : Platform             ,
    public toast            : ToastController      ,
    public statusBar        : StatusBar            ,
    public splashScreen     : SplashScreen         ,
    public net              : NetworkStatus        ,
    public push             : Push                 ,
    public localNotify      : LocalNotifications   ,
    public storage          : Storage              ,
    public db               : DBSrvcs              ,
    public auth             : AuthSrvcs            )
  {
    window['appcomp'] = this;

    this.initializeApp();
    // this.nav          = navCtrl;
  }

  initializeApp() {
    Log.l("AppComponent: Initializing app...");
    return new Promise((resolve,reject) => {
      this.platform.ready().then((res) => {
        // Okay, so the platform is ready and our plugins are available.
        // Here you can do any higher level native things you might need.
        Log.l("Platform Ready was fired.\n", res);
        this.statusBar.styleDefault();
        this.splashScreen.hide();
        this.network = this.net;
        NetworkStatus.watchForDisconnect();
        this.pouchOptions   = {adapter: 'websql', auto_compaction: true}      ;
        window["PouchDB"  ] = DBSrvcs.StaticPouchDB                           ;
        window["Platform" ] = this.platform                                   ;
        window["PouchDB"  ] .defaults(this.pouchOptions)                      ;
        DBSrvcs.addDB('reports')                                              ;

        // this.PouchDB.debug.enable('*')                                     ;
        window["PouchDB"  ] .debug.disable('*')                               ;
        window['moment'   ] = moment                                          ;
        window['Log'      ] = Log                                             ;
        window['t1'       ] = CONSOLE.t1                                      ;
        window['c1'       ] = CONSOLE.c1                                      ;

        // this.setRoot(this.homePage);
        resolve(true);

        // this['navCtrl'] = navCtrl;

        // this.geoloc.startBackgroundGeolocation().then((res) => {
        //   Log.l("initializeApp(): Started background geolocation.\n", res);
        //   resolve(res);
        //  }).catch((err) => {
        //   Log.l("initializeApp(): Error starting background geolocation.");
        //   Log.e(err);
        //   reject(err);
        // });
      });
    });
  }

  private setRoot(newRootPage: any){
    this.rootPage = newRootPage;
    this.nav.setRoot(newRootPage);
    // this.navCtrl.push(newRootPage).catch((err) => {
    //   Log.l("Error setting root page to '" + newRootPage + "'.");
    //   Log.e(err);
    // })
  }
}

