import { Component, OnInit                                                   } from '@angular/core'                   ;
import { IonicPage, NavController, Platform, ModalController, ViewController } from 'ionic-angular'                   ;
import { DBSrvcs                                                             } from '../../providers/db-srvcs'        ;
import { Login                                                               } from '../login/login'                  ;
import { Log                                                                 } from '../../config/config.functions'   ;
import { AuthSrvcs                                                           } from '../../providers/auth-srvcs'      ;
import { AlertService                                                        } from '../../providers/alerts'          ;
import { TabsComponent                                                       } from '../../components/tabs/tabs'      ;
import { TranslateService                                                    } from '@ngx-translate/core'             ;
import { AppVersion                                                          } from '@ionic-native/app-version'       ;
import { StorageService                                                      } from '../../providers/storage-service' ;
import { Preferences                                                         } from '../../providers/preferences'     ;


@IonicPage({ name: 'Settings' })
@Component({
  selector: 'page-settings'   ,
  templateUrl: 'settings.html',
})

export class Settings implements OnInit {
  title: string = "App Settings" ;
  confirmTitle:string = "";
  logOutMsg:string = "";
  languages:Array<any> = [];
  selectedLanguage:any;
  language:any = null;
  appName:string = "SESA OnSiteX";
  appVersion:string = "?.?.?";
  dataReady:boolean = false;
  // public static PREFS:any = new Preferences();
  // public prefs:any = Settings.PREFS;

  constructor( public navCtrl: NavController, public platform: Platform,  public auth: AuthSrvcs, public alert: AlertService, public tabs: TabsComponent, public translate: TranslateService, public version: AppVersion, public prefs:Preferences, public storage:StorageService, public modalCtrl:ModalController) {
    window["onsitesettings"] = this;
  }

  ngOnInit() {
    Log.l("Settings: ngOnInit() called");
    let eng = { value: 'en', display: 'English' };
    let esp = { value: 'es', display: 'Español' };
    // this.languages = [eng, esp];
    this.languages = [
      { value: 'en', display: 'English' },
      { value: 'es', display: 'Español' }
    ];
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
  }

  ionViewDidEnter() {
    Log.l("Settings: ionViewDidEnter() called");
  }

  terminateApp() { this.platform.exitApp(); }

  logoutOfApp() {
    Log.l("User clicked logout button.");
    this.auth.logout().then((res) => {
      Log.l("Done logging out.");
      this.tabs.goToPage('Login', {mode: 'page'});
    });
  }

  confirmLogout() {
    let confirmStrings = this.translate.instant(['confirm_logout_title', 'confirm_logout_message']);
    let title = confirmStrings['confirm_logout_title'];
    let text  = confirmStrings['confirm_logout_message'];
    this.alert.showConfirm(title, text).then((leave) => {
      if(leave) {
        this.logoutOfApp();
      }
    })
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

}
