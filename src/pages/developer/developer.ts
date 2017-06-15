import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthSrvcs                 } from '../../providers/auth-srvcs'     ;
import { GeolocService                 } from '../../providers/geoloc-service' ;
import { AlertService           } from '../../providers/alerts'         ;
import { Log                    } from '../../config/config.functions'  ;
import { TimeSrvc               } from '../../providers/time-parse-srvc';
import { DBSrvcs                } from '../../providers/db-srvcs'       ;
import { PREFS               } from '../../config/config.strings'   ;
import { TranslateService } from '@ngx-translate/core';
import { TabsComponent } from '../../components/tabs/tabs';

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
  onSiteTimeStamp: number;
  testDatabases: boolean = false;
  prefs        : any     = PREFS;
  useSpanish   : boolean = false;
  spanishDefault : boolean = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public geoloc: GeolocService,
              public db: DBSrvcs,
              public alert: AlertService,
              public timeSrvc: TimeSrvc,
              public translate: TranslateService )
  {
    this.spanishDefault = this.translate.currentLang === 'es' ? true : false;
    this.useSpanish = this.spanishDefault;
    window['onsitedev'] = this;
  }

  timeStamp() { this.onSiteTimeStamp = this.timeSrvc.getTimeStamp(); }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DeveloperPage');
  }

  ngOnInit() {
    Log.l("Developer Settings page loaded.");
    this.testDatabases = PREFS.DB.reports === 'test-reports' ? true : false;
    this.GeolocStatus  = this.geoloc.isEnabled();
  }

  checkTestDatabase() {
    if(this.testDatabases) {
      Log.l("checkTestDatabases(): Now setting databases to test mode.")
      PREFS.setDB('reports', 'test-reports');
    } else {
      Log.l("checkTestDatabases(): Now setting databases to normal mode.");
      PREFS.setDB('reports', 'reports');
    }
    Log.l("checkTestDatabases(): PREFS are now:\n", PREFS.getPrefs());
  }

  toggleBackgroundGeolocation() {
    if(this.geoloc.isEnabled()) {
      this.geoloc.endBackgroundGeolocation().then((res) => {
        Log.l("Background Geolocation turned off.\n", res);
        this.GeolocStatus = false;
        // this.geolocToggle = this.GeolocStatus;
      }).catch((err) => {
        Log.l("Background Geolocation could not be turned off.");
        Log.e(err);
      })
    } else {
      this.geoloc.startBackgroundGeolocation().then((res) => {
        Log.l("Background Geolocation turned on.\n", res);
        this.GeolocStatus = true;
        // this.geolocToggle = this.GeolocStatus;
      }).catch((err) => {
        Log.l("Background Geolocation could not be tuned on.");
        Log.e(err);
      })
    }
  }

  updatePreferences() {
    this.db.savePreferences(PREFS.getPrefs()).then((res) => {
      Log.l("checkTestDatabases(): Saved preferences successfully.");
      this.alert.showAlert("SUCCESS", "Preferences saved!");
    }).catch((err) => {
      Log.l("checkTestDatabases(): Error saving preferences.");
      Log.e(err);
      this.alert.showAlert("ERROR", "Error saving preferences!");
    });
  }

  toggleLanguage() {
    if(this.useSpanish) {
      this.translate.use('es');
    } else {
      this.translate.use('en');
    }
  }
}
