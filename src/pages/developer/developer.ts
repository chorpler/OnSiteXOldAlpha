import { Component, OnInit, NgZone                     } from '@angular/core'                   ;
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular'                   ;
import { AuthSrvcs                                     } from '../../providers/auth-srvcs'      ;
import { GeolocService                                 } from '../../providers/geoloc-service'  ;
import { AlertService                                  } from '../../providers/alerts'          ;
import { Log, moment, Moment                           } from '../../config/config.functions'   ;
import { TimeSrvc                                      } from '../../providers/time-parse-srvc' ;
import { DBSrvcs                                       } from '../../providers/db-srvcs'        ;
import { SmartAudio                                    } from '../../providers/smart-audio'     ;
import { TranslateModule, TranslateLoader              } from '@ngx-translate/core'             ;
import { TranslateHttpLoader                           } from '@ngx-translate/http-loader'      ;
import { TranslateService                              } from '@ngx-translate/core'             ;
import { TabsComponent                                 } from '../../components/tabs/tabs'      ;
import { Preferences                                   } from '../../providers/preferences'     ;

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

  title          : string        = 'Developers'      ;
  GeolocStatus   : boolean       = false             ;
  // geolocToggle   : boolean       = this.GeolocStatus ;
  onSiteTimeStamp: number                            ;
  // testDatabases  : boolean       = false             ;
  databaseNames  : Array<string> = []                ;
  // prefs       : any           = PREFS             ;
  // useSpanish     : boolean       = false             ;
  spanishDefault : boolean       = false             ;
  unicodeChars   : string        = ""                ;

  constructor(public navCtrl   : NavController    ,
              public navParams : NavParams        ,
              public platform  : Platform         ,
              public zone      : NgZone           ,
              public geoloc    : GeolocService    ,
              public db        : DBSrvcs          ,
              public audio     : SmartAudio       ,
              public alert     : AlertService     ,
              public timeSrvc  : TimeSrvc         ,
              public translate : TranslateService ,
              public tabs      : TabsComponent    ,
              public prefs     : Preferences      ,
  ) {
    // this.spanishDefault = this.translate.currentLang === 'es' ? true : false;
    // this.useSpanish = this.spanishDefault;
    window['onsitedev'] = this;
    if(this.platform.is('cordova') && this.geoloc.isEnabled()) {
      this.GeolocStatus = true;
    } else {
      this.GeolocStatus = false;
    }
  }

  timeStamp() { this.onSiteTimeStamp = this.timeSrvc.getTimeStamp(); }

  ionViewDidLoad() {
    Log.l('ionViewDidLoad DeveloperPage');
  }

  ngOnInit() {
    Log.l("Developer Settings page loaded.");
    // this.testDatabases = this.prefs.DB.reports === 'test-reports' ? true : false;
    // this.GeolocStatus  = this.geoloc.isEnabled();
    this.GeolocStatus  = false;
    this.databaseNames = Object.keys(this.prefs.DB);
  }

  // checkTestDatabase() {
  //   if(this.testDatabases) {
  //     Log.l("checkTestDatabases(): Now setting databases to test mode.")
  //     this.prefs.setDB('reports', 'test-reports');
  //   } else {
  //     Log.l("checkTestDatabases(): Now setting databases to normal mode.");
  //     this.prefs.setDB('reports', 'reports');
  //   }
  //   Log.l("checkTestDatabases(): PREFS are now:\n", this.prefs.getPrefs());
  // }

  toggleBackgroundGeolocation() {
    if(this.platform.is('cordova')) {
      if(this.GeolocStatus) {
        this.geoloc.startBackgroundGeolocation().then((res) => {
          Log.l("toggleBackgroundGeolocation(): Background Geolocation turned on.\n", res);
          this.GeolocStatus = true;
          // this.geolocToggle = this.GeolocStatus;
        }).catch((err) => {
          Log.l("toggleBackgroundGeolocation(): Background Geolocation could not be tuned on.");
          Log.e(err);
        })
      } else {
      // if (this.geoloc.isEnabled()) {
        this.geoloc.endBackgroundGeolocation().then((res) => {
          Log.l("toggleBackgroundGeolocation(): Background Geolocation turned off.\n", res);
          this.GeolocStatus = false;
          // this.geolocToggle = this.GeolocStatus;
        }).catch((err) => {
          Log.l("toggleBackgroundGeolocation(): Background Geolocation could not be turned off.");
          Log.e(err);
        })
      // }
      }
    } else {
      Log.l("toggleBackgroundGeolocation(): This isn't going to do jack shit, because this platform is not cordova.");
      setTimeout(() => {
        this.zone.run(() => {this.GeolocStatus = false;});
      });
      let title1 = "LO SIENTO HERMANO";
      let text1  = "A pesar de que eres un desarrollador, esta conmutación no puede hacer la mierda todo cuando no estás corriendo en Córdoba.";
      let title2 = "PSYCH!";
      let text2  = "Ha! You should have seen your face. We don't need to do Spanish translations in the developer page. I'll show you the real one.";
      let title3 = "SORRY BRO";
      let text3  = "Even though you're a developer, this toggle does fuck-all when you're not actually running on cordova.";
      let title4 = "GOOD ONE, EH?";
      let text4  = "Did you like how the translation of 'SORRY BRO' was 'LO SIENTO HERMANO'? And 'fuck-all' was 'mierda'? Apparently they know 'fuck-all' means the same as 'shit'. Sweet.";
      let title5 = "THIS IS ANNOYING";
      let text5  = "So many alerts in a row! I bet you're wondering how many more there will be.";
      let title6 = "JUST ONE";
      let text6  = "This is the last one.";
      let title7 = "DOUBLE PSYCH!";
      let text7  = "Okay, okay, this is really the last one. What a fucking waste of time.\n\nFunny, though.\n\n...quit looking at me like that. It was funny then and it's funny now!";

      this.alert.showAlert(title1, text1).then(() => {
        return this.alert.showAlert(title2, text2);
      }).then(() => {
        return this.alert.showAlert(title3, text3);
      }).then(() => {
        return this.alert.showAlert(title4, text4);
      }).then(() => {
        return this.alert.showAlert(title5, text5);
      }).then(() => {
        return this.alert.showAlert(title6, text6);
      }).then(() => {
        return this.alert.showAlert(title7, text7);
      }).then(() => {
        this.audio.playForcibly('laugh');
      }).catch(err => {
        Log.l("Dammit! Some kind of error showing too many alerts and playing a sound!");
      })
      this.alert.showAlert("SORRY BRO", "");
    }
  }

  updatePreferences() {
    this.db.savePreferences(this.prefs.getPrefs()).then((res) => {
      Log.l("updatePreferences(): Saved preferences successfully.");
      this.alert.showAlert("SUCCESS", "Preferences saved!");
    }).catch((err) => {
      Log.l("updatePreferences(): Error saving preferences.");
      Log.e(err);
      this.alert.showAlert("ERROR", "Error saving preferences!");
    });
  }

  // toggleLanguage() {
  //   if(this.useSpanish) {
  //     Log.l("toggleLanguage(): Switching to Español...");
  //     this.translate.use('es');
  //   } else {
  //     Log.l("toggleLanguage(): Switching to English...");
  //     this.translate.use('en');
  //   }
  // }

  getSomeCharacters() {
    this.audio.play('sorry');
    let temp1 = `&#x2714;&check;&cross;&#x2716;&check;&#x1F5F4;&#x1F5F9;&#x1F5F8;&#x1F5F6;&#x1F5F5;&#x2705;&#x1F5F9;`;
    let temp2 = `✔✓✗✖✓🗴🗹🗸🗶🗵✅🗹`;
    if(this.unicodeChars === '' || this.unicodeChars === temp2) {
      this.unicodeChars = temp1;
    } else {
      this.unicodeChars = temp2;
    }
  }

  cancel() {
    this.audio.play('dropit');
    this.tabs.goToPage('OnSiteHome');
  }
}
