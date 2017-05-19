import { Component, OnInit        } from '@angular/core'                 ;
import { IonicPage, NavController } from 'ionic-angular'                 ;
import { Platform                 } from 'ionic-angular'                 ;
import { AuthSrvcs                } from '../../providers/auth-srvcs'    ;
import { SrvrSrvcs                } from '../../providers/srvr-srvcs'    ;
import { Log, CONSOLE             } from '../../config/config.functions' ;

@IonicPage({name: 'OnSiteHome'})

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
  userLoggedIn: boolean = false;
  showPage: boolean = false;
  static startOfApp: boolean = true;
  title ='OnSite Home';
  
  constructor(public navCtrl: NavController, public plt: Platform, public auth: AuthSrvcs, public srvr: SrvrSrvcs) { 
  }

  ngOnInit() {
    // console.log(this.plt.platforms());
    if(HomePage.startOfApp) {
      this.setupAppData();
    } else {
      this.userLoggedIn = true;
      this.showPage = true;
    }
  }

  ionViewDidLoad() {
    Log.l("Home view loaded.");
  }

  onNewWorkOrder() {this.navCtrl.push('Work Order Form', {mode: 'New'});}

  onLogin() {this.navCtrl.push('Login');}

  // onNewJobForm() {this.navCtrl.push('Work Order', {mode: 'New'});}

  onSettings() {this.navCtrl.push('Report Settings');}

  isFirstItem() {
    if(this.userLoggedIn) {
      return 'logged-in';
    } else {
      return '';
    }
  }

  setupAppData() {
    this.auth.isFirstLogin().then((firstLogin) => {
      if(firstLogin) {
        this.userLoggedIn = false;
        HomePage.startOfApp = false;
        this.showPage = true;
      } else {
         this.auth.getCredentials().then((credentials) => {
          if(typeof credentials != "object" || typeof credentials["username"] != "string" || typeof credentials["password"] != "string") {
            this.userLoggedIn = false;
          } else {
            let u = credentials['username'];
            let p = credentials['password'];
            this.srvr.querySession(u, p).then((res) => {
              Log.l("setupAppData(): Stored user credentials are valid.");
              this.auth.setUser(u);
              this.auth.setPassword(p);
              this.userLoggedIn = true;
              HomePage.startOfApp = false;
              this.showPage = true;
            }).catch((err) => {
              Log.l("setupAppData(): Stored user credentials not valid. User must login again.");
              this.auth.clearCredentials().then((res) => {
                this.userLoggedIn = false;
                HomePage.startOfApp = false;
                this.showPage = true;
              }).catch((err) => {
                this.userLoggedIn = false;
                HomePage.startOfApp = false;
                this.showPage = true;
              });
            });
          }
        }).catch((err) => {
          Log.l("setupAppData(): Error checking saved credentials.");
          this.userLoggedIn = false;
          this.showPage = true;
        });
      }
    });
  }

  logoutOfApp() {
    Log.l("User clicked logout button.");
    this.auth.logout().then((res) => {
      Log.l("Done logging out.");
      this.userLoggedIn = false;
    });
  }
  
  getReportHistory() { this.navCtrl.push('Reports')}
}
// 'Work Order Form'