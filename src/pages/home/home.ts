import { Component, OnInit, NgZone                           } from '@angular/core'                      ;
import { Platform, IonicPage, NavParams                      } from 'ionic-angular'                      ;
import { NavController, ToastController                      } from 'ionic-angular'                      ;
import { AuthSrvcs                                           } from '../../providers/auth-srvcs'         ;
import { SrvrSrvcs                                           } from '../../providers/srvr-srvcs'         ;
import { DbBulkuploadSrvc                                    } from '../../providers/db-bulkupload-srvc' ;
import { GeolocService                                       } from '../../providers/geoloc-service'     ;
import { AlertService                                        } from '../../providers/alerts'             ;
import   * as PouchDB                                          from 'pouchdb'                            ;
import { Log, CONSOLE                                        } from '../../config/config.functions'      ;
import { reportDocs                                          } from '../../test/test.reports'            ;
import { Login                                               } from '../login/login'                     ;
import { Settings                                            } from '../settings/settings'               ;
import { WorkOrder                                           } from '../work-order/work-order'           ;
import { ReportHistory                                       } from '../report-history/report-history'   ;
import { DeveloperPage                                       } from '../developer/developer'             ;

@IonicPage({name: 'OnSiteHome'})

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
  userLoggedIn                : boolean                 ;
  userIsDeveloper             : boolean = false         ;
  showPage                    : boolean = false         ;
  static startOfApp           : boolean = true          ;
  title                       : string  = 'OnSiteHome'  ;
  PDB                         : any     = PouchDB       ;
  backButtonPressedOnceToExit : boolean = false         ;


  constructor(public platform: Platform,         public navCtrl  : NavController,
              public toastCtrl: ToastController, public auth     : AuthSrvcs,
              public srvr     : SrvrSrvcs,       public dbBulk   : DbBulkuploadSrvc,
              public geoloc   : GeolocService,   public zone     : NgZone,
              public alert    : AlertService,    public navParams: NavParams) {
    window['onsitehome'] = this;
  }

  ngOnInit() {
      this.platform.registerBackButtonAction(() => {
        Log.l("Back button pressed (defined in home.ts).");
        if(typeof this['navCtrl'] != 'undefined') {
          window['nav1'] = this.navCtrl;
          if (this.backButtonPressedOnceToExit) {
            Log.l("Leaving app.");
            this.platform.exitApp();
          } else {
            this.showToast("Press back again to exit");
            this.backButtonPressedOnceToExit = true;
            setTimeout(() => {
              this.backButtonPressedOnceToExit = false;
            },2000)
          }
        } else {
          Log.l("Back button undefined, can't navigate at the moment.");
        }
      });
      if(HomePage.startOfApp) {
        this.setupAppData();
      } else {
        this.isDeveloper();
        this.userLoggedIn = true;
      }
  }
  showToast(text: string) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000
    });
    toast.present();
  }

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
              if(this.isDeveloper()) {
                this.userIsDeveloper = true;
              } else {
                this.userIsDeveloper = false;
              }
              this.showPage = true;
              Log.l("After starting up, the app is going to try turning on Background Geolocation...");
              this.tryStartingBackgroundGeolocation().then((res) => {
                Log.l("Successfully started background geolocation.");
              }).catch((err) => {
                Log.l("Error trying to start background geolocation:");
                Log.e(err);
              });
            }).catch((err) => {
              Log.l("setupAppData(): Stored user credentials not valid. User must login again.");
              this.auth.clearCredentials().then((res) => {
                this.userLoggedIn = false;
                this.userIsDeveloper = false;
                HomePage.startOfApp = false;
                this.navCtrl.setRoot('TabsPage');
                this.showPage = true;
              }).catch((err) => {
                this.userLoggedIn = false;
                this.userIsDeveloper = false;
                HomePage.startOfApp = false;
                this.navCtrl.setRoot('TabsPage');
                this.showPage = true;
              });
            });
          }
        }).catch((err) => {
          Log.l("setupAppData(): Error checking saved credentials.");
          this.userLoggedIn = false;
          this.userIsDeveloper = false;
          this.navCtrl.setRoot('TabsPage');
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

  importBulkReports() {
    Log.l("Beginning import...");
    this.dbBulk.postDbDocs(reportDocs).then((res) => {
      Log.l("Done.");
    });
  }

  isDeveloper() {
    if(this.userLoggedIn && (this.auth.getUser() == 'Chorpler' || this.auth.getUser() == 'Hachero')) {
      this.userIsDeveloper = true;
      return true;
    } else {
      this.userIsDeveloper = false;
      return false;
    }
  }

  tryStartingBackgroundGeolocation() {
    return new Promise((resolve,reject) => {
      this.geoloc.startBackgroundGeolocation().then((res) => {
        Log.l("initializeApp(): Started background geolocation.\n", res);
        resolve(res);
      }).catch((err) => {
        Log.l("initializeApp(): Error starting background geolocation.");
        Log.e(err);
        reject(err);
      });
      resolve(true);
    });
  }
}
