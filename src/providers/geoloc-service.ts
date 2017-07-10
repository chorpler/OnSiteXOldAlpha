import { Injectable                                         } from '@angular/core'                        ;
import { Http                                               } from '@angular/http'                        ;
import { Platform                                           } from 'ionic-angular'                        ;
import { Storage                                            } from '@ionic/storage'                       ;
import { Geofence                                           } from '@ionic-native/geofence'               ;
import { BackgroundGeolocation, BackgroundGeolocationConfig } from '@ionic-native/background-geolocation' ;
import { BackgroundGeolocationResponse                      } from '@ionic-native/background-geolocation' ;
import { Geolocation                                        } from '../domain/geolocation'                ;
import { DOMTimeStamp, Coordinates, Position                } from '../config/geoloc'                     ;
import { Log                                                } from '../config/config.functions'           ;
import { SrvrSrvcs                                          } from '../providers/srvr-srvcs'              ;
import { AuthSrvcs                                          } from '../providers/auth-srvcs'              ;
import { UserData                                           } from '../providers/user-data'               ;
import { Preferences                                        } from '../providers/preferences'             ;
import 'rxjs/add/operator/map';

@Injectable()
export class GeolocService {
  public static PREFS:any = new Preferences();
  public prefs       :any = GeolocService.PREFS;
	public config      :BackgroundGeolocationConfig = {
						desiredAccuracy     : 0     ,
						stationaryRadius    : 0     ,
						distanceFilter      : 0     ,
						syncUrl             : ''    ,
						url                 : ''    ,
						httpHeaders         : ''    ,
						maxLocations        : 5000  ,
						syncThreshold       : 1     ,
						stopOnStillActivity : false ,
						debug               : false , // enable this hear sounds for background-geolocation life-cycle.
						stopOnTerminate     : true  , // enable this to clear background location settings when the app terminates
	};

	public geolocateStatus : boolean = false;

	constructor(public http:Http, public platform:Platform, public geolocate:BackgroundGeolocation, public auth:AuthSrvcs, public server:SrvrSrvcs, public ud:UserData) {
    console.log('Hello GeolocServiceProvider Provider');
    window['onsitegeolocation']       = this;
    window['onsitegeolocationobject'] = Geolocation;
	}

  public configureAuthData() {
		let user = this.auth.getUser();
		let pass = this.auth.getPass();
		let URL  = this.server.getGeolocationURL(user, pass);
		let hdr  = this.server.getGeolocationHeaders(user, pass);
		// let hdr  = {"Content-Type": "application/json"};
		this.config['url'] = URL;
		this.config['syncUrl'] = URL;
		this.config['httpHeaders'] = hdr;
	}

	startBackgroundGeolocation() {
		Log.l("Starting BackgroundGeolocation with config:\n", this.config);
		return new Promise((resolve,reject) => {
      if(this.platform.is('cordova')) {
        this.configureAuthData();
        this.geolocate.configure(this.config).subscribe((location: BackgroundGeolocationResponse) => {
          Log.l("\n\n\nGeolocService: Got a hit:\n",location);

          // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
          // and the background-task may be completed.  You must do this regardless if your HTTP request is successful or not.
          // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.

          this.geolocate.finish().then((res) => {
            Log.l("Finished calling geolocate.finish() for iOS!\n",res);
          }).catch((err) => {
            Log.l("geolocate.finish() threw error!");
            Log.l(err);
            this.geolocateStatus = false;
          });
        },(err) => {
          Log.l("GeolocService threw an error or some shit.");
          this.geolocateStatus = false;
          Log.l(err);
        });

        Log.l("\n\nApp: about to run geolocate.start()...")

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
      }
    });
	}

	endBackgroundGeolocation() {
		return this.geolocate.stop().then((res) => {
			this.geolocateStatus = false;
      Log.l("GeolocService.stop(): Stopped successfully.\n", res);
		}).catch((err) => {
      Log.l("GeolocService.stop(): Error while stopping BackgroundGeolocation.");
			Log.e(err);
			throw new Error(err);
		})
	}

	isEnabled() {
		return this.geolocateStatus;
	}

}
