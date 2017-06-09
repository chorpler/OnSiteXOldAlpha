import { Component                            } from '@angular/core'           ;
import { IonicPage, NavController, Platform   } from 'ionic-angular'           ;
import { DBSrvcs                              } from '../../providers/db-srvcs';
import { Login                                } from '../login/login'          ;
import { Log, CONSOLE                         } from '../../config/config.functions';
import { AuthSrvcs                            } from '../../providers/auth-srvcs';


@IonicPage({ name: 'Settings' })

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})

export class Settings {

  title: string = "App Settings";

  constructor( public navCtrl: NavController, public platform: Platform,  public auth: AuthSrvcs ) { }

  terminateApp() { this.platform.exitApp(); }

  navBacktoHome() {
    this.navCtrl.setRoot('OnSiteHome', { userLoggedIn: true });
  }

  logoutOfApp() {
    Log.l("User clicked logout button.");
    this.auth.logout()
    .then((res) => {
      Log.l("Done logging out.");
      this.navCtrl.setRoot('OnSiteHome', { userLoggedIn: false });
    });
  }
}
