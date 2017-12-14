// import { TabsComponent                                 } from 'components/tabs/tabs'       ;
import { Component, OnInit, OnDestroy, AfterViewInit,  } from '@angular/core'              ;
import { NgZone                                        } from '@angular/core'              ;
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular'              ;
import { AuthSrvcs                                     } from 'providers/auth-srvcs'       ;
import { GeolocService                                 } from 'providers/geoloc-service'   ;
import { AlertService                                  } from 'providers/alerts'           ;
import { Log, moment, Moment                           } from 'config/config.functions'    ;
import { DBSrvcs                                       } from 'providers/db-srvcs'         ;
import { SmartAudio                                    } from 'providers/smart-audio'      ;
import { TranslateModule, TranslateLoader              } from '@ngx-translate/core'        ;
import { TranslateHttpLoader                           } from '@ngx-translate/http-loader' ;
import { TranslateService                              } from '@ngx-translate/core'        ;
import { Preferences                                   } from 'providers/preferences'      ;
import { TabsService                                   } from 'providers/tabs-service'     ;

@IonicPage({name: 'DevPage'})
@Component({
  selector: 'page-developer',
  templateUrl: 'developer.html',
})
export class DeveloperPage implements OnInit,OnDestroy,AfterViewInit {

  public title          : string        = 'Developers'              ;
  public static PREFS   : any           = new Preferences()         ;
  public prefs   : any                  = DeveloperPage.PREFS       ;
  public showingAlert   : boolean       = false                     ;
  public GeolocStatus   : boolean       = false                     ;
  public onSiteTimeStamp: number                                    ;
  public databaseNames  : Array<string> = []                        ;
  public spanishDefault : boolean       = false                     ;
  public unicodeChars   : string        = ""                        ;
  public showID         : boolean       = this.prefs.getShowID()    ;
  public showRev        : boolean       = this.prefs.getShowRev()   ;
  public showTimes      : boolean       = this.prefs.getShowTimes() ;
  public payrollPeriodCount:number      = this.prefs.getPayrollPeriodCount();
  public showSite       : boolean       = this.prefs.getShowSite()  ;

  constructor(
    public navCtrl   : NavController    ,
    public navParams : NavParams        ,
    public platform  : Platform         ,
    public zone      : NgZone           ,
    public geoloc    : GeolocService    ,
    public db        : DBSrvcs          ,
    public audio     : SmartAudio       ,
    public alert     : AlertService     ,
    public translate : TranslateService ,
    // public tabs      : TabsComponent    ,
    public tabServ   : TabsService      ,

  ) {
    window['onsitedev'] = this;
  }

  // timeStamp() { this.onSiteTimeStamp = this.timeSrvc.getTimeStamp(); }

  ionViewDidLoad() {
    Log.l('ionViewDidLoad DeveloperPage');
    if(this.platform.is('cordova') && this.geoloc.isEnabled()) {
      this.GeolocStatus = true;
    } else {
      this.GeolocStatus = false;
    }
  }

  ngOnInit() {
    Log.l("DeveloperPage: ngOnInit() fired");
    // this.testDatabases = this.prefs.DB.reports === 'test-reports' ? true : false;
    // this.GeolocStatus  = this.geoloc.isEnabled();
    this.GeolocStatus  = false;
    this.databaseNames = Object.keys(this.prefs.DB);
  }

  ngOnDestroy() {
    Log.l("DeveloperPage: ngOnDestroy() fired");
  }

  ngAfterViewInit() {
    Log.l("DeveloperPage: ngAfterViewInit() fired");
    this.tabServ.setPageLoaded();
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

  public toggleBackgroundGeolocation(evt?:any) {
    if(this.platform.is('cordova')) {
      if(this.GeolocStatus) {
        this.geoloc.startBackgroundGeolocation().then((res) => {
          Log.l("toggleBackgroundGeolocation(): Background Geolocation turned on.\n", res);
          // this.GeolocStatus = true;
          // this.geolocToggle = this.GeolocStatus;
        }).catch((err) => {
          Log.l("toggleBackgroundGeolocation(): Background Geolocation could not be tuned on.");
          Log.e(err);
        })
      } else {
      // if (this.geoloc.isEnabled()) {
        this.geoloc.endBackgroundGeolocation().then((res) => {
          Log.l("toggleBackgroundGeolocation(): Background Geolocation turned off.\n", res);
          // this.GeolocStatus = false;
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
        this.zone.run(() => {
          this.GeolocStatus = false;
          if(!this.showingAlert) {
            this.developerAlert();
          }
        });
      });
      // this.alert.showAlert("SORRY BRO", "");
    }
  }

  public toggleShowID() {
    let val = this.showID;
    Log.l("togleShowID(): ID view set to: %s", val);
    // this.prefs.DEVELOPER.showDocID = val;
    this.prefs.setShowID(val);
  }

  public toggleShowRev() {
    let val = this.showRev;
    Log.l("togleShowRev(): Rev view set to: %s", val);
    this.prefs.setShowRev(val);
  }

  public toggleShowTimes() {
    let val = this.showTimes;
    Log.l("toggleShowTimes(): Report Times view set to: %s", val);
    this.prefs.setShowTimes(val);
  }

  public toggleShowSite() {
    let val = this.showSite;
    Log.l("toggleShowSite(): Report Site view set to: %s", val);
    this.prefs.setShowSite(val);
  }

  public updatePayrollPeriodCount(value:number) {
    let val = Number(value);
    Log.l("updatePayrollPeriodCount(): Count set to %d.", val);
    this.prefs.setPayrollPeriodCount(val);
  }

  public developerAlert() {
    this.showingAlert = true;
    let title1 = window.atob("TE8gU0lFTlRPIEhFUk1BTk8=");
    let text1  = window.atob("QSBwZXNhciBkZSBxdWUgZXJlcyB1biBkZXNhcnJvbGxhZG9yLCBlc3RhIGNvbm11dGFjaSZvYWN1dGU7biBubyBwdWVkZSBoYWNlciBsYSBtaWVyZGEgdG9kbyBjdWFuZG8gbm8gZXN0JmFhY3V0ZTtzIGNvcnJpZW5kbyBlbiBDJm9hY3V0ZTtyZG9iYS4=");
    let title2 = window.atob("UFNZQ0gh");
    let text2  = window.atob("SGEhIFlvdSBzaG91bGQgaGF2ZSBzZWVuIHlvdXIgZmFjZS4gV2UgZG9uJ3QgbmVlZCB0byBkbyBTcGFuaXNoIHRyYW5zbGF0aW9ucyBpbiB0aGUgZGV2ZWxvcGVyIHBhZ2UuIEknbGwgc2hvdyB5b3UgdGhlIHJlYWwgb25lLg==");
    let title3 = window.atob("U09SUlkgQlJP");
    let text3  = window.atob("RXZlbiB0aG91Z2ggeW91J3JlIGEgZGV2ZWxvcGVyLCB0aGlzIHRvZ2dsZSBkb2VzIGZ1Y2stYWxsIHdoZW4geW91J3JlIG5vdCBhY3R1YWxseSBydW5uaW5nIG9uIGNvcmRvdmEu");
    let title4 = window.atob("R09PRCBPTkUsIEVIPw==");
    let text4  = window.atob("RGlkIHlvdSBsaWtlIGhvdyB0aGUgdHJhbnNsYXRpb24gb2YgJ1NPUlJZIEJSTycgd2FzICdMTyBTSUVOVE8gSEVSTUFOTyc/IEFuZCAnZnVjay1hbGwnIHdhcyAnbWllcmRhJz8gQXBwYXJlbnRseSB0aGV5IGtub3cgJ2Z1Y2stYWxsJyBtZWFucyB0aGUgc2FtZSBhcyAnc2hpdCcuIFN3ZWV0Lg==");
    let title5 = window.atob("VEhJUyBJUyBBTk5PWUlORw==");
    let text5  = window.atob("U28gbWFueSBhbGVydHMgaW4gYSByb3chIEkgYmV0IHlvdSdyZSB3b25kZXJpbmcgaG93IG1hbnkgbW9yZSB0aGVyZSB3aWxsIGJlLiBJdCdzIGEgbXlzdGVyeSwgd3JhcHBlZCBpbiBhIHJpZGRsZSwgaW5zaWRlIGFuIGVuaWdtYS4=");
    let title6 = window.atob("SlVTVCBPTkU=");
    let text6  = window.atob("VGhlIGFuc3dlciBpcywgdGhpcyBpcyB0aGUgbGFzdCBvbmUu");
    let title7 = window.atob("RE9VQkxFIFBTWUNIIQ==");
    let text7  = window.atob("T2theSwgb2theSwgdGhpcyBpcyByZWFsbHkgdGhlIGxhc3Qgb25lLiBXaGF0IGEgZnVja2luZyB3YXN0ZSBvZiB0aW1lLjxicj48YnI+CgpGdW5ueSwgdGhvdWdoLjxicj48YnI+CgouLi5xdWl0IGxvb2tpbmcgYXQgbWUgbGlrZSB0aGF0LiBJdCB3YXMgZnVubnkgdGhlbiBhbmQgaXQncyBmdW5ueSBub3ch");

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
      this.showingAlert = false;
    }).catch(err => {
      Log.l("Dammit! Some kind of error showing too many alerts and playing a sound!");
      this.showingAlert = false;
    });


  }

  public updatePreferences() {
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

  public getSomeCharacters() {
    this.audio.play('sorry');
    let temp1 = `&#x2714;&check;&cross;&#x2716;&check;&#x1F5F4;&#x1F5F9;&#x1F5F8;&#x1F5F6;&#x1F5F5;&#x2705;&#x1F5F9;`;
    let temp2 = `✔✓✗✖✓🗴🗹🗸🗶🗵✅🗹`;
    if(this.unicodeChars === '' || this.unicodeChars === temp2) {
      this.unicodeChars = temp1;
    } else {
      this.unicodeChars = temp2;
    }
  }

  public cancel() {
    this.audio.play('dropit');
    this.tabServ.goToPage('OnSiteHome');
  }
}
