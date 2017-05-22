import { Component                                          } from '@angular/core'                              ;
import { Platform, NavController, ToastController           } from 'ionic-angular'                              ;
import { StatusBar                                          } from '@ionic-native/status-bar'                   ;
import { SplashScreen                                       } from '@ionic-native/splash-screen'                ;
import { Storage                                            } from '@ionic/storage'                             ;
import { Geofence                                           } from '@ionic-native/geofence'                     ;
import { BackgroundGeolocation, BackgroundGeolocationConfig } from '@ionic-native/background-geolocation'       ;
import { BackgroundGeolocationResponse                      } from '@ionic-native/background-geolocation'       ;
import { Network                                            } from '@ionic-native/network'                      ;
import { Push, PushObject, PushOptions                      } from '@ionic-native/push'                         ;
import { DBSrvcs                                            } from '../providers/db-srvcs'                      ;
import { AuthSrvcs                                          } from '../providers/auth-srvcs'                    ;
import { UserData                                           } from '../providers/user-data'                     ;
import { Log, CONSOLE                                       } from '../config/config.functions'                 ;
import { DOMTimeStamp, Coordinates, Position                } from '../config/geoloc'                           ;
import { LocalNotifications                                 } from '@ionic-native/local-notifications'          ;
import * as PouchDB                                           from 'pouchdb'                                    ;
import * as pdbAuth                                           from 'pouchdb-authentication'                     ;
import * as pdbUpsert                                         from 'pouchdb-upsert'                             ;
import * as pdbSeamlessAuth                                   from 'pouchdb-seamless-auth'                      ;
import * as moment                                            from 'moment'                                     ;


@Component({
  templateUrl: 'app.html'
})

export class OnSiteApp {
  rootPage         : any = 'OnSiteHome' ;
  pouchOptions     : any = {}           ;
  private nav                           ;

  config : BackgroundGeolocationConfig = {
            desiredAccuracy     : 0     ,
            stationaryRadius    : 0     ,
            distanceFilter      : 0     ,
            stopOnStillActivity : false ,
            debug               : true  , // enable this hear sounds for background-geolocation life-cycle.
            stopOnTerminate     : false , // enable this to clear background location settings when the app terminates
    };

  constructor(
    private platform : Platform             ,
    private navCtrl  : NavController        ,
    toast            : ToastController      ,
    statusBar        : StatusBar            ,
    splashScreen     : SplashScreen         ,
    network          : Network              ,
    push             : Push                 ,
    localNotify      : LocalNotifications   ,
    storage          : Storage              ,
    private geofence : Geofence             ,
    db               : DBSrvcs              ,
    auth             : AuthSrvcs            ,
    private bgGeo    : BackgroundGeolocation)
  {
    window['appcomp'] = this;
    this.nav          = navCtrl;
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      // splashScreen.hide();
      this.initializeApp();
    });
  }

  initializeApp() {
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

    // this['navCtrl'] = navCtrl;

    this.bgGeo.configure(this.config).subscribe((location: BackgroundGeolocationResponse) => {
      Log.l("\n\n\nbgGeo: Got a hit:\n",location);

      // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
      // and the background-task may be completed.  You must do this regardless if your HTTP request is successful or not.
      // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.

      this.bgGeo.finish()
      .then((res) => {
        Log.l("Finished calling bgGeo.finish() for iOS!\n",res);
      }).catch((err) => {
        Log.l("bgGeo.finish() threw error!");
        Log.l(err);
      });
    },(err) => {
      Log.l("bgGeo threw an error or some shit.");
      Log.l(err);
    });

    Log.l("\n\nApp: about to run bgGeo.start()...")

    this.bgGeo.start().then((res) => {
      Log.l("bgGeo.start() started successfully!\n",res);
      Log.l("App done starting, now moving to Home...");
      this.nav.setRoot("OnSiteHome");
    }).catch((err) => {
      Log.l("bgGeo.start() did not start successfully!");
      Log.l(err);;
      this.nav.setRoot("OnSiteHome");
    });
  }
}

