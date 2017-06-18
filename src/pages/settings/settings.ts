import { Component, OnInit                    } from '@angular/core'           ;
import { IonicPage, NavController, Platform, ModalController, ViewController   } from 'ionic-angular'           ;
import { DBSrvcs                              } from '../../providers/db-srvcs'     ;
import { Login                                } from '../login/login'               ;
import { Log                                  } from '../../config/config.functions';
import { AuthSrvcs                            } from '../../providers/auth-srvcs'   ;
import { AlertService                         } from '../../providers/alerts'       ;
import { TabsComponent                        } from '../../components/tabs/tabs'   ;
import { TranslateService                     } from '@ngx-translate/core'          ;
import { AppVersion                           } from '@ionic-native/app-version'    ;


@IonicPage({ name: 'Settings' })
@Component({
  selector: 'page-settings'   ,
  templateUrl: 'settings.html',
})

export class Settings implements OnInit {
  title: string = "App Settings" ;
  // confirmTitle = 'Confirm Logout';
  // logOutMsg = 'Logout is only necessary if another user wants to log into your device.  If you want to close the app and terminate all processes, click the "x" in the top right corner of the screen.' ;
  confirmTitle:string = "";
  logOutMsg:string = "";
  appName:string = "SESA OnSiteX";
  appVersion:string = "?.?.?";

  constructor( public navCtrl: NavController, public platform: Platform,  public auth: AuthSrvcs, public alert: AlertService, public tabs: TabsComponent, public translate: TranslateService, public version: AppVersion) {
    window["onsitesettings"] = this;
  }

  ngOnInit() {
    Log.l("Settings: ngOnInit() called");
    this.version.getAppName().then(res => {
      this.appName = res;
      return this.version.getVersionNumber();
    }).then(res => {
      this.appVersion = res;
      Log.l(`Settings: got app name '${this.appName}' and version '${this.appVersion}'.`);
    }).catch(err => {
      Log.l(`Settings: unable to get app name and version, cordova probably not available.`);
      Log.e(err);
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
}
