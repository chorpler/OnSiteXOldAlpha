import { Component, OnInit                                                       } from '@angular/core'                  ;
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular'                  ;
import { PopoverController, ViewController, Events                               } from 'ionic-angular'                  ;
import { FormGroup, FormControl, Validators                                      } from "@angular/forms"                 ;
import { AuthSrvcs                                                               } from '../../providers/auth-srvcs'     ;
import { SrvrSrvcs                                                               } from '../../providers/srvr-srvcs'     ;
import { DBSrvcs                                                                 } from '../../providers/db-srvcs'       ;
import { AlertService                                                            } from '../../providers/alerts'         ;
import { NetworkStatus                                                           } from '../../providers/network-status' ;
import { UserData                                                                } from '../../providers/user-data'      ;
import { Log                                                                     } from '../../config/config.functions'  ;
import { TabsComponent                                                           } from '../../components/tabs/tabs'     ;
import { TranslateService } from '@ngx-translate/core';
import { Preferences } from '../../providers/preferences';
import { PREFS } from '../../config/config.strings';
/**
 * Generated class for the Login page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage({name: 'Login'})
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class Login implements OnInit {
  public title          : string  = "OnSite Login"       ;
  private username      : string                         ;
  private password      : string                         ;
  public loginError     : boolean = false                ;
  public localURL       : string  = "_local/techProfile" ;
  public loading        : any     = {}                   ;
  public networkGood    : boolean = true                 ;
  private LoginForm     : FormGroup                      ;
  private formUser      : any                            ;
  private formPass      : any                            ;
  private submitAttempt : boolean = false                ;
  public mode           : string = "page"                ;
  // public static PREFS   : any = new Preferences()        ;
  // public prefs          : any = Login.PREFS              ;


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private auth: AuthSrvcs,
    private server: SrvrSrvcs,
    private db: DBSrvcs,
    private network: NetworkStatus,
    private alert: AlertService,
    public viewCtrl: ViewController,
    public ud: UserData,
    public events: Events,
    public tabs: TabsComponent,
    public translate: TranslateService,
    public prefs: Preferences,
  ) {
    window['loginscreen'] = this;
  }

  ionViewDidLoad() {
    Log.l('Login: ionViewDidLoad fired.');
  }

  ngOnInit() {
    Log.l("Starting login page...");
    if(this.navParams.get('mode') !== undefined) { this.mode = this.navParams.get('mode'); }
    this.initializeForm();
    // if(NetworkStatus.isConnected()) {
    // } else {
    //   this.alerter.showAlert('OFFLINE', "There is no Internet connection. Login will not work right now.");
    // }
  }

  private initializeForm() {
    this.LoginForm = new FormGroup({
      'formUser': new FormControl(null, Validators.required),
      'formPass': new FormControl(null, Validators.required)
    });
  }

  onSubmit() {
    this.submitAttempt = true;
    this.loginClicked();
  }

  loginClicked() {
    let tmpUserData = this.LoginForm.value;
    this.username = tmpUserData.formUser;
    this.password = tmpUserData.formPass;
    let lang = this.translate.instant('spinner_logging_in');
    if(NetworkStatus.isConnected()) {
      this.alert.showSpinner(lang['spinner_logging_in']);
      Log.l("Login: Now attempting login:");
      this.auth.setUser(this.username);
      this.auth.setPassword(this.password);
      Log.l("About to call auth.login()");
      this.auth.login().then((res) => {
        Log.l("Login succeeded.", res);
        return this.server.getUserData(this.username);
      }).then((res) => {
        let udoc = res;
        udoc.updated = true;
        udoc._id = this.localURL;
        return this.db.addLocalDoc(this.prefs.DB.reports, udoc);
      }).then((res) => {
        Log.l("loginAttempt(): Finished validating and saving user info, now downloading SESA config data.");
        return this.db.getAllConfigData();
      }).then(res => {
        Log.l("loginAtttempt(): Got SESA config data.");
        this.ud.setSesaConfig(res);
        let creds = { user: this.username, pass: this.password };
        this.ud.storeCredentials(creds);
        this.ud.setLoginStatus(true);
        this.alert.hideSpinner();
        this.events.publish('startup:finished', true);
        this.events.publish('login:finished', true);
        if(this.mode === 'modal') {
          this.tabs.setTabDisable(false);
          this.viewCtrl.dismiss(creds);
        } else {
          this.tabs.setTabDisable(false);
          this.tabs.goToPage('OnSiteHome');
        }
      }).catch((err) => {
        Log.l("loginAttempt(): Error validating and saving user info.");
        Log.l(err);
        this.loginError = true;
        this.alert.hideSpinner();
      });
    } else {
      this.alert.hideSpinner();
      let loginAlert = this.translate.instant(['offline_alert_title', 'offline_alert_message']);
      this.alert.showAlert(loginAlert['offline_alert_title'], loginAlert['offline_alert_message']);
    }
  }
}
