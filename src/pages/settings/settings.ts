import { Component, OnInit                            } from '@angular/core'                     ;
import { IonicPage, NavController                     } from 'ionic-angular'                     ;
import { DBSrvcs                                      } from '../../providers/db-srvcs'          ;
import { ReportBuildSrvc                              } from '../../providers/report-build-srvc' ;
import { Login                                        } from '../login/login'                    ;
import { AuthSrvcs                                    } from '../../providers/auth-srvcs'        ;
import { Log, CONSOLE                                 } from '../../config/config.functions'     ;



@IonicPage({ name: 'Report Settings' })

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})

export class Settings implements OnInit {


  constructor( public auth: AuthSrvcs, public navCtrl: NavController) { }

  ngOnInit() { }

    logoutOfApp() {
      Log.l("User clicked logout button.");
      this.auth.logout().then((res) => {
        Log.l("Done logging out.");
        this.navCtrl.setRoot("OnSiteHome");
      });
    }
  }
