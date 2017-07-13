import { Component, OnInit                                                   } from '@angular/core'                   ;
import { IonicPage, NavController, Platform, ModalController, ViewController } from 'ionic-angular'                   ;
import { DBSrvcs                                                             } from '../../providers/db-srvcs'        ;
import { Login                                                               } from '../login/login'                  ;
import { Log, moment, Moment                                                 } from '../../config/config.functions'   ;
import { AuthSrvcs                                                           } from '../../providers/auth-srvcs'      ;
import { AlertService                                                        } from '../../providers/alerts'          ;
import { TabsComponent                                                       } from '../../components/tabs/tabs'      ;
import { TranslateService                                                    } from '@ngx-translate/core'             ;
import { AppVersion                                                          } from '@ionic-native/app-version'       ;
import { StorageService                                                      } from '../../providers/storage-service' ;
import { Preferences                                                         } from '../../providers/preferences'     ;
import { UserData                                                            } from '../../providers/user-data'       ;


@IonicPage({ name: 'Settings' })
@Component({
  selector: 'page-settings'   ,
  templateUrl: 'settings.html',
})

export class Settings implements OnInit {
  public title           : string     = "App Settings"    ;
  public lang            : any                            ;
  public confirmTitle    : string     = ""                ;
  public logOutMsg       : string     = ""                ;
  public languages       : Array<any> = []                ;
  public selectedLanguage: any        ;
  public language        : any        = null              ;
  public appName         : string     = "SESA OnSiteX"    ;
  public appVersion      : string     = "?.?.?"           ;
  public sounds          : boolean    = false             ;
  public stayInReports   : boolean    = true              ;
  public dataReady       : boolean    = false             ;
  public static PREFS    : any        = new Preferences() ;
  public prefs           : any        = Settings.PREFS    ;

  constructor( public navCtrl: NavController, public platform: Platform,  public auth: AuthSrvcs, public alert: AlertService, public tabs: TabsComponent, public translate: TranslateService, public version: AppVersion, public storage:StorageService, public modalCtrl:ModalController, public ud:UserData) {
    window["onsitesettings"] = this;
  }

  ngOnInit() {
    Log.l("Settings: ngOnInit() called");
    let translations = [
      'confirm_logout_title',
      'confirm_logout_message',
      'confirm_app_restart_title',
      'confirm_app_restart_text',
      'show_clock',
      'show_clock_help'
    ]
    this.lang = this.translate.instant(translations);
    let en = { value: 'en', display: 'English' };
    let es = { value: 'es', display: 'Español' };
    this.languages = [ en, es ];
    let currentLang = this.translate.currentLang;
    for(let language of this.languages) {
      if(currentLang === language.value) {
        this.selectedLanguage = language;
        this.language = language;
        break;
      }
    }
    if(this.language === null) {
      this.translate.use('en');
      this.language = this.languages[0];
    }

    this.sounds = this.prefs.USER.audio;

    if(this.platform.is('cordova')) {
      this.version.getAppName().then(res => {
        this.appName = res;
        return this.version.getVersionNumber();
      }).then(res => {
        this.appVersion = res;
        Log.l(`Settings: got app name '${this.appName}' and version '${this.appVersion}'.`);
        this.dataReady = true;
      }).catch(err => {
        Log.l(`Settings: unable to get app name and version, cordova probably not available.`);
        Log.e(err);
        this.dataReady = true;
      });
    } else {
      this.appVersion = this.ud.appdata.version;
      this.dataReady = true;
    }
  }

  ionViewDidEnter() {
    Log.l("Settings: ionViewDidEnter() called");
  }

  terminateApp() { this.platform.exitApp(); }

  logoutOfApp() {
    Log.l("User clicked logout button.");
    this.auth.logout().then((res) => {
      Log.l("Done logging out. Reloading app.");
      this.ud.reloadApp();
      // this.tabs.goToPage('Login', {mode: 'page'});
    });
  }

  confirmLogout() {
    let lang = this.lang;
    let title = lang['confirm_logout_title'];
    let text  = lang['confirm_logout_message'];
    this.alert.showConfirm(title, text).then((leave) => {
      if(leave) {
        this.logoutOfApp();
      }
    }).catch(err => {
      Log.l("confirmLogout(): Error confirming logout!");
      Log.e(err);
    });
  }

  updateLanguage(language:any) {
    this.selectedLanguage = language;
    if(language.value === 'es') {
      this.translate.use('es');
    } else {
      this.translate.use('en');
    }
    this.prefs.setUserPref('language', language.value);
    this.savePreferences().then(res => {
      Log.l("updateLanguage(): Saved language setting.");
    }).catch(err => {
      Log.l("updateLanguage(): Error saving language setting.");
      Log.e(err);
    })
  }

  sendComment() {
    // let lang = this.translate.instant(['send_comment_title', 'send_comment_message'])
    // this.alert.showAlert(lang['send_comment_title'], lang['send_comment_message']);
    let commentModal = this.modalCtrl.create('Comment', {}, {enableBackdropDismiss: true, cssClass: 'comment-modal'});
    commentModal.onDidDismiss(data => {
      Log.l("sendComment(): Comment modal dismissed.");
      if(data) {
        Log.l(data);
      }
    });
    commentModal.present();
  }

  toggleSounds() {
    this.prefs.USER.audio = this.sounds;
    this.savePreferences().then(res => {
      Log.l("toggleSounds(): Sounds turned to '%s' and preferences saved:\n", this.prefs.USER.audio);
      Log.l(this.prefs);
    }).catch(err => {
      Log.l("toggleSounds(): Error saving preferences.");
      Log.e(err);
    });
  }

  toggleStayInReports() {
    Log.l("toggleStayInReports(): set to '%s'", this.stayInReports);
    this.prefs.USER.stayInReports = this.stayInReports;
    this.savePreferences().then(res => {
      Log.l("toggleSounds(): Sounds turned to '%s' and preferences saved:\n", this.prefs.USER.audio);
      Log.l(this.prefs);
    }).catch(err => {
      Log.l("toggleSounds(): Error saving preferences.");
      Log.e(err);
    });
  }

  public savePreferences() {
    let prefsObj = { DB: this.prefs.DB, SERVER: this.prefs.SERVER, USER: this.prefs.USER };
    return new Promise((resolve, reject) => {
      this.storage.persistentSet('PREFS', prefsObj).then(res => {
        Log.l("savePreferences(): Saved preferences successfully.\n", res);
        resolve(res);
      }).catch(err => {
        Log.l("savePreferences(): Error saving preferences!");
        Log.e(err);
        reject(err);
      });
    });
  }

  public toggleClock() {
    this.dataReady = !this.dataReady;
  }

  public clockHelp() {
    let lang = this.lang;
    this.alert.showAlert(lang['show_clock'], lang['show_clock_help']);
  }

  public confirmAppReload() {
    let lang = this.lang;
    let title = lang['confirm_app_restart_title'];
    let text = lang['confirm_app_restart_text'];
    // let msg   = sprintf("%s<br>\n<br>\n%s", text, window.location.href)
    this.alert.showConfirm(title, text).then((restart) => {
      if (restart) {
        Log.l("RELOADING ONSITEX....");
        this.ud.reloadApp();
      }
    }).catch(err => {
      Log.l("confirmLogout(): Error confirming logout!");
      Log.e(err);
    });
  }

}
