import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthSrvcs                 } from '../../providers/auth-srvcs'     ;
import { GeolocService                 } from '../../providers/geoloc-service' ;
import { Log, CONSOLE               } from '../../config/config.functions'  ;

/**
 * Generated class for the DeveloperPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage({name: 'DevPage'})
@Component({
  selector: 'page-developer',
  templateUrl: 'developer.html',
})
export class DeveloperPage implements OnInit {

  title        : string  = 'Developers';
  GeolocStatus : boolean = true;
  geolocToggle : boolean = this.GeolocStatus;

  constructor(public navCtrl: NavController, public navParams: NavParams, public geoloc: GeolocService) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DeveloperPage');
  }

  ngOnInit() {
    Log.l("Developer Settings page loaded.");
    this.GeolocStatus = this.geoloc.isEnabled();
  }

  toggleBackgroundGeolocation() {
    if(this.geoloc.isEnabled()) {
      this.geoloc.endBackgroundGeolocation().then((res) => {
        Log.l("Background Geolocation turned off.\n", res);
        this.GeolocStatus = false;
        this.geolocToggle = this.GeolocStatus;
      }).catch((err) => {
        Log.l("Background Geolocation could not be turned off.");
        Log.e(err);
      })
    } else {
      this.geoloc.startBackgroundGeolocation().then((res) => {
        Log.l("Background Geolocation turned on.\n", res);
        this.GeolocStatus = true;
        this.geolocToggle = this.GeolocStatus;
      }).catch((err) => {
        Log.l("Background Geolocation could not be tuned on.");
        Log.e(err);
      })
    }
  }
}
