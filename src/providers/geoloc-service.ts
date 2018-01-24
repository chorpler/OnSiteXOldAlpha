// import { Geofence                                           } from '@ionic-native/geofence'                         ;
// import { BackgroundGeolocation as BGGeolocation,            } from 'cordova-plugin-mauron85-background-geolocation' ;
import { Injectable                                         } from '@angular/core'                        ;
import { HttpClient                                         } from '@angular/common/http'                 ;
import { Subscription                                       } from 'rxjs/Subscription'                    ;
import { Platform, ToastController,                         } from 'ionic-angular'                        ;
import { Storage                                            } from '@ionic/storage'                       ;
import { BackgroundGeolocation, BackgroundGeolocationConfig } from '@ionic-native/background-geolocation' ;
import { BackgroundGeolocationResponse                      } from '@ionic-native/background-geolocation' ;
import { Geolocation                                        } from 'onsitex-domain'                       ;
import { DOMTimeStamp, Coordinates, Position                } from 'onsitex-domain'                       ;
import { Log                                                } from 'onsitex-domain'                       ;
import { ServerService                                      } from './server-service'                     ;
import { AuthSrvcs                                          } from './auth-srvcs'                         ;
import { UserData                                           } from './user-data'                          ;
import { Preferences                                        } from './preferences'                        ;

@Injectable()
export class GeolocService {
  public static PREFS:any = new Preferences()  ;
  public prefs       :any = GeolocService.PREFS;
  public geolocSub   :Subscription;
  public config      :BackgroundGeolocationConfig = {
    desiredAccuracy       : 0     ,
    stationaryRadius      : 5     ,
    syncUrl               : ''    ,
    url                   : ''    ,
    httpHeaders           : ''    ,
    maxLocations          : 5000  ,
    syncThreshold         : 10    ,
    stopOnStillActivity   : false ,
    debug                 : true  , // enable this hear sounds for background-geolocation life-cycle.
    stopOnTerminate       : true  , // enable this to clear background location settings when the app terminates
    startForeground       : true  ,
    interval              : 30000 ,
    fastestInterval       : 5000  ,
    activitiesInterval    : 15000 ,
    distanceFilter        : 10    ,
    notificationTitle     : 'OnSiteX Geolocation',
    notificationText      : 'Geolocation currently enabled',
    // notificationIconLarge : 'OnSiteX_64.png',
    // notificationIconSmall : 'OnSiteX_16.png'
  };

  public geolocateStatus : boolean = false;

  constructor(
    public http      : HttpClient            ,
    public platform  : Platform              ,
    public geolocate : BackgroundGeolocation ,
    public auth      : AuthSrvcs             ,
    public server    : ServerService             ,
    public ud        : UserData              ,
    public toast     : ToastController       ,
  ) {
    console.log('Hello GeolocServiceProvider Provider');
    window['onsitegeolocation']       = this;
    window['onsitegeolocationobject'] = Geolocation;
    // window['onsitebggeo'] = BGGeolocation;
  }

  public configureAuthData() {
    let user = this.auth.getUser();
    let pass = this.auth.getPass();
    let URL  = this.server.getGeolocationURL(user, pass);
    let hdr  = this.server.getGeolocationHeaders(user, pass);
    let authToken = 'Basic ' + window.btoa(user + ':' + pass);
    // let hdr  = {"Content-Type": "application/json"};
    // this.config['url'] = URL;
    // this.config['syncUrl'] = URL;
    // this.config['httpHeaders'] = hdr;
    this.config['url'] = 'http://securedb.sesaonsite.com:3000/locations';
    this.config['syncUrl'] = 'http://securedb.sesaonsite.com:3000/sync';
    this.config['httpHeaders'] = hdr;
    return this.config;
  }

  public startBackgroundGeolocation() {
    return new Promise((resolve,reject) => {
      if(this.platform.is('cordova')) {
        if(this.config.url === '') {
          this.configureAuthData();
        }
        Log.l("Starting BackgroundGeolocation with config:\n", this.config);
        this.geolocSub = this.geolocate.configure(this.config).subscribe((location: BackgroundGeolocationResponse) => {
          Log.l("GeolocService: Got a hit:\n",location);

          // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
          // and the background-task may be completed.  You must do this regardless if your HTTP request is successful or not.
          // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
          let loc = JSON.stringify(location);
          this.sendLocation(location).then(res => {
            this.showToast(`GeoLoc: fired for ${location.latitude},${location.longitude}`);
            if(this.platform.is('ios')) {
              this.geolocate.finish();
            }
          });
          // .then((res) => {
          //   Log.l("Finished calling geolocate.finish() for iOS!\n",res);
          // }).catch((err) => {
          //   Log.l("geolocate.finish() threw error!");
          //   Log.e(err);
          //   this.geolocateStatus = false;
          // });
        },(err) => {
          Log.l("GeolocService threw an error or some shit.");
          this.geolocateStatus = false;
          Log.l(err);
        });

        Log.l("App: about to run geolocate.start()...")

        this.geolocate.start().then((res) => {
          Log.l("GeolocService.start() started successfully!\n",res);
          this.geolocateStatus = true;
          resolve(res);
        }).catch((err) => {
          Log.l("GeolocService.start() did not start successfully!");
          Log.l(err);
          this.geolocateStatus = false;
          reject(err);
        });
      } else {
        Log.l("GeolocService: Not trying to start BackgroundGeolocation because platform is not cordova.");
        this.geolocateStatus = false;
        resolve(false);
      }
    });
  }

  public endBackgroundGeolocation() {
    return this.geolocate.stop().then((res) => {
      this.geolocateStatus = false;
      Log.l("GeolocService.stop(): Stopped successfully.\n", res);
    }).catch((err) => {
      Log.l("GeolocService.stop(): Error while stopping BackgroundGeolocation.");
      Log.e(err);
      throw new Error(err);
    });
  }

  public isEnabled() {
    return this.geolocateStatus;
  }

  public showToast(text: string, duration?:number) {
    let ms = duration ? duration : 5000;
    let toastmsg = this.toast.create({
      message: text,
      duration: ms
    });
    toastmsg.present();
  }

  // public initializeRawBGGeo() {
  //   BGGeolocation.on('location', (location) => {
  //     // handle your locations here
  //     // to perform long running operation on iOS
  //     // you need to create background task
  //     BGGeolocation.startTask(taskKey => {
  //       // execute long running task
  //       // eg. ajax post location
  //       Log.l("BGGeo: location is:\n", location);
  //       Log.l("BGGeo: and taskKey is:\n", taskKey);
  //       this.sendLocation(location).then(res => {
  //         // IMPORTANT: task has to be ended by endTask
  //         BGGeolocation.endTask(taskKey);
  //       });
  //     });
  //   });

  //   BGGeolocation.on('stationary', (stationaryLocation) => {
  //     // handle stationary locations here
  //     // Actions.sendLocation(stationaryLocation);
  //     Log.l("BGGeo: stationary event detected!\n", stationaryLocation);
  //     this.showToast(`BGGeo: stationary!`);
  //   });

  //   BGGeolocation.on('error', (error) => {
  //     Log.l("BGGeo: error!\n");
  //     Log.e(error);
  //     this.showToast(`BGGeo ERROR: '${error.message}'`);
  //   });

  //   BGGeolocation.on('start', () => {
  //     // console.log('[INFO] BackgroundGeolocation service has been started');
  //     Log.l("BGGeo: start event detected!\n");
  //     this.showToast(`Background Geolocation started!`);
  //   });

  //   BGGeolocation.on('stop', () => {
  //     // console.log('[INFO] BackgroundGeolocation service has been stopped');
  //     Log.l("BGGeo: stop event detected!\n");
  //     this.showToast(`Background Geolocation stopped!`);
  //     this.removeBGGeoListeners();
  //   });
  // }

  // public removeBGGeoListeners() {
  //   Log.l("removeBGGeoListeners(): Now attempting removal of Background Geoloc Listeners...");
  //   let events = BGGeolocation.events || [];
  //   events.forEach(event => {
  //     Log.l("BGGeolocation attempting to remove event:\n", event);
  //     BGGeolocation.removeAllListeners(event)
  //   });
  // }

  public sendLocation(location:any) {
    return new Promise((resolve,reject) => {
      this.server.saveGeolocation(location).then(res => {
        Log.l("sendLocation(): Successfully sent location to server!");
        this.showToast(`sendLocation succeeded!`);
      }).catch(err => {
        Log.l("sendLocation(): Error sending location to server!");
        Log.e(err);
        this.showToast(`sendLocation error: '${err.message}'`, 6000);
      });
    });
  }
}
