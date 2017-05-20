import { Component, OnInit                                   } from '@angular/core'                      ;
import { Platform, IonicPage, NavController, ToastController } from 'ionic-angular'                      ;
import { AuthSrvcs                                           } from '../../providers/auth-srvcs'         ;
import { SrvrSrvcs                                           } from '../../providers/srvr-srvcs'         ;
import { DbBulkuploadSrvc                                    } from '../../providers/db-bulkupload-srvc' ;
import   * as PouchDB                                          from 'pouchdb'                            ;
import { Log, CONSOLE                                        } from '../../config/config.functions'      ;
import { reportDocs                                          } from '../../test/test.reports'            ;

@IonicPage({name: 'OnSiteHome'})

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
  userLoggedIn                : boolean = false         ;
  showPage                    : boolean = false         ;
  static startOfApp           : boolean = true          ;
  title                       : string  = 'OnSite Home' ;
  PDB                         : any     = PouchDB       ;
  backButtonPressedOnceToExit : boolean = false         ;
  
  constructor(public platform: Platform, public navCtrl: NavController, public toastCtrl: ToastController, public plt: Platform, public auth: AuthSrvcs, public srvr: SrvrSrvcs, public dbBulk: DbBulkuploadSrvc) {
    window['onsitehome'] = this;
    platform.registerBackButtonAction(() => {
      Log.l("Back button pressed (defined in app.components.ts).");
      let nav = {};
      if(typeof this['navCtrl'] != 'undefined') {
        nav = this.navCtrl;
        window['nav1'] = nav;
        if(this['navCtrl'].canGoBack()) {
          Log.l("Now going back via hardware button.");
          this.navCtrl.pop();
        } else {
          this.showToast();
          this.backButtonPressedOnceToExit = true;
          setTimeout(() => {
            this.backButtonPressedOnceToExit = false;
          },2000)
        }
      }
    });
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

  showToast() {
    let toast = this.toastCtrl.create({
      message: "Press again to confirm exit",
      duration: 3000
    });
    toast.present();
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
            this.srvr.loginToServer(u, p).then((res) => {
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

  importBulkReports() {
    Log.l("Beginning import...");
    this.dbBulk.postDbDocs(reportDocs).then((res) => {
      Log.l("Done.");
    });
  }
}
