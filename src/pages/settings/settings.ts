import { Component                            } from '@angular/core'           ;
import { IonicPage, NavController, Platform, ModalController, ViewController   } from 'ionic-angular'           ;
import { DBSrvcs                              } from '../../providers/db-srvcs'     ;
import { Login                                } from '../login/login'               ;
import { Log                                  } from '../../config/config.functions';
import { AuthSrvcs                            } from '../../providers/auth-srvcs'   ;
import { AlertService                         } from '../../providers/alerts'       ;
import { TabsComponent                        } from '../../components/tabs/tabs'   ;
import { TranslateService                     } from '@ngx-translate/core'          ;


@IonicPage({ name: 'Settings' })

@Component({
  selector: 'page-settings'   ,
  templateUrl: 'settings.html',
})

export class Settings {
  title: string = "App Settings" ;
  confirmTitle = 'Confirm Logout';
  logOutMsg = 'Logout is only necessary if another user wants to log into your device.  If you want to close the app and terminate all preocesses, click the "x" in the top right corner of the screen.' ;

  constructor( public navCtrl: NavController, public platform: Platform,  public auth: AuthSrvcs, public alert: AlertService, public tabs: TabsComponent, public translate: TranslateService) {
    window["onsitesettings"] = this;
  }

  terminateApp() { this.platform.exitApp(); }

  logoutOfApp() {
    Log.l("User clicked logout button.");
    this.auth.logout()
    .then((res) => {
      Log.l("Done logging out.");
      // this.tabs.goHome();
      // this.navCtrl.setRoot('OnSiteHome', { userLoggedIn: false });
      this.navCtrl.setRoot('Login', { mode: 'page' });
      // this.navCtrl.push('Login');
    });
  }

  confirmLogout() {
    this.alert.showConfirm( this.confirmTitle, this.logOutMsg)
    .then((leave) => {
      if(leave) { this.logoutOfApp(); }
    })
  }
}
