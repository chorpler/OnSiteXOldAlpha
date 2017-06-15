import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage                                            } from '@ionic/storage'                             ;
import { Geofence                                           } from '@ionic-native/geofence'                     ;
import { BackgroundGeolocation, BackgroundGeolocationConfig } from '@ionic-native/background-geolocation'       ;
import { BackgroundGeolocationResponse                      } from '@ionic-native/background-geolocation'       ;
import { Geolocation                                        } from '../domain/geolocation'                      ;
import { DOMTimeStamp, Coordinates, Position                } from '../config/geoloc'                           ;
import { Log                                                } from '../config/config.functions'                 ;
import { SrvrSrvcs                                          } from '../providers/srvr-srvcs'                    ;
import { AuthSrvcs                                          } from '../providers/auth-srvcs'                    ;

/*
	Generated class for the GeolocServiceProvider provider.

	See https://angular.io/docs/ts/latest/guide/dependency-injection.html
	for more info on providers and Angular 2 DI.
*/
@Injectable()
export class GeolocService {
	
	public config : BackgroundGeolocationConfig = {
						desiredAccuracy     : 0     ,
						stationaryRadius    : 0     ,
						distanceFilter      : 0     ,
						syncUrl             : ''    ,
						url                 : ''    ,
						httpHeaders         : ''    ,
						maxLocations        : 5000  ,
						syncThreshold       : 1     ,
						stopOnStillActivity : false ,
						debug               : false  , // enable this hear sounds for background-geolocation life-cycle.
						stopOnTerminate     : true , // enable this to clear background location settings when the app terminates
	};

	public bgGeoStatus : boolean = false;

	constructor(public http: Http, public bgGeo: BackgroundGeolocation, private auth: AuthSrvcs, private srvr: SrvrSrvcs) {
		console.log('Hello GeolocServiceProvider Provider');
	}

	public getAuthData() {
		let user = this.auth.getUser();
		let pass = this.auth.getPass();
		let URL = SrvrSrvcs.getGeolocationURL(user, pass);
		// let hdr = SrvrSrvcs.getGeolocationHeaders(user, pass);
		let hdr = {"Content-Type": "application/json"};
		this.config['url'] = URL;
		this.config['syncUrl'] = URL;
		this.config['httpHeaders'] = hdr;
	}

	startBackgroundGeolocation() {
		Log.l("Starting BackgroundGeolocation with config:\n", this.config);
		return new Promise((resolve,reject) => {
			this.getAuthData();
			this.bgGeo.configure(this.config).subscribe((location: BackgroundGeolocationResponse) => {
				Log.l("\n\n\nbgGeo: Got a hit:\n",location);

				// IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
				// and the background-task may be completed.  You must do this regardless if your HTTP request is successful or not.
				// IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.

				this.bgGeo.finish().then((res) => {
					Log.l("Finished calling bgGeo.finish() for iOS!\n",res);
				}).catch((err) => {
					Log.l("bgGeo.finish() threw error!");
					Log.l(err);
					this.bgGeoStatus = false;
				});
			},(err) => {
				Log.l("bgGeo threw an error or some shit.");
				this.bgGeoStatus = false;
				Log.l(err);
			});

			Log.l("\n\nApp: about to run bgGeo.start()...")

			this.bgGeo.start().then((res) => {
				Log.l("bgGeo.start() started successfully!\n",res);
				this.bgGeoStatus = true;
				resolve(res);
			}).catch((err) => {
				Log.l("bgGeo.start() did not start successfully!");
				Log.l(err);
				this.bgGeoStatus = false;
				reject(err);
			});
		})
	}

	endBackgroundGeolocation() {
		return this.bgGeo.stop().then((res) => {
			this.bgGeoStatus = false;
			Log.l("bgGeo.stop(): Stopped successfully.\n", res);
		}).catch((err) => {
			Log.l("bgGeo.stop(): Error while stopping BackgroundGeolocation.");
			Log.e(err);
			throw new Error(err);
		})
	}

	isEnabled() {
		return this.bgGeoStatus;
	}

}
