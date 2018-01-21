import { sprintf                                                                           } from 'sprintf-js'               ;
import { Component, OnInit                                                                 } from '@angular/core'            ;
import { IonicPage, NavController, NavParams, Platform, LoadingController, AlertController } from 'ionic-angular'            ;
import { PopoverController, ViewController, Events                                         } from 'ionic-angular'            ;
import { FormGroup, FormControl, Validators                                                } from "@angular/forms"           ;
import { AuthSrvcs                                                                         } from 'providers/auth-srvcs'     ;
import { ServerService                                                                     } from 'providers/server-service' ;
import { DBService                                                                         } from 'providers/db-service'     ;
import { AlertService                                                                      } from 'providers/alerts'         ;
import { NetworkStatus                                                                     } from 'providers/network-status' ;
import { UserData                                                                          } from 'providers/user-data'      ;
import { Preferences                                                                       } from 'providers/preferences'    ;
import { Employee                                                                          } from 'domain/domain-classes'    ;
import { Log                                                                               } from 'config/config.functions'  ;
import { TranslateService                                                                  } from '@ngx-translate/core'      ;
import { TabsService                                                                       } from 'providers/tabs-service'   ;

@IonicPage({name: 'First Login'})
@Component({
  selector: 'page-login-first',
  templateUrl: 'login-first.html',
})
export class LoginFirst implements OnInit {
  public title          : string  = "OnSite First Login" ;
  public static PREFS   : any     = new Preferences()    ;
  public get prefs():any { return LoginFirst.PREFS; }    ;
  public username       : string                         ;
  public password       : string                         ;
  public loginError     : boolean = false                ;
  public localURL       : string  = "_local/techProfile" ;
  public loading        : any     = {}                   ;
  public networkGood    : boolean = true                 ;
  public LoginForm      : FormGroup                      ;
  public formUser       : any                            ;
  public formPass       : any                            ;
  public submitAttempt  : boolean = false                ;
  public mode           : string = "page"                ;
  public version        : string = ""                    ;
  public lang           : string[] = []                  ;
  public langStrings    : string[] = [
    "login_first_title",
    "login_first_title",
    "login_first_message",
    "login_first_offline_title",
    "login_first_offline_message",
    "synchronizing_db",
    "username_or_password_error",
    "username",
    "username_error",
    "password",
    "password_error",
    "sign_in",
  ]                                                      ;
  public dataReady      : boolean = false                ;

  constructor(
    public navCtrl   : NavController    ,
    public navParams : NavParams        ,
    public platform  : Platform         ,
    public auth      : AuthSrvcs        ,
    public server    : ServerService    ,
    public db        : DBService        ,
    public network   : NetworkStatus    ,
    public alert     : AlertService     ,
    public viewCtrl  : ViewController   ,
    public ud        : UserData         ,
    public events    : Events           ,
    public tabServ   : TabsService      ,
    public translate : TranslateService ,
  ) {
    window['onsitefirstlogin'] = this;
  }

  ionViewDidLoad() {
    Log.l('FirstLogin: ionViewDidLoad fired.');
  }

  ngOnInit() {
    this.tabServ.disableTabs();
    if (this.ud.isOnline) {
      this.runFromInit();
    }
  }

  public runFromInit() {
    Log.l("Starting First Login page...");
    if(this.navParams.get('mode') !== undefined) { this.mode = this.navParams.get('mode'); }
    this.translate.get(this.langStrings).subscribe(async (result) => {
      this.lang = result;
      let lang = this.lang;
      let online = this.ud.isOnline;
      // online = false;

      if(!online) {
        let out = await this.alert.showAlertPromise(lang['login_first_offline_title'], lang['login_first_offline_message']);
        this.platform.exitApp();
      } else {
        this.initializeForm();
        this.version = this.ud.getVersion();
        let out = await this.alert.showAlertPromise(lang['login_first_title'], lang['login_first_message']);
        this.dataReady = true;
      }
    });
  }

  private initializeForm() {
    this.LoginForm = new FormGroup({
      'formUser': new FormControl(null, Validators.required),
      'formPass': new FormControl(null, Validators.required),
    });
  }

  public onSubmit() {
    this.submitAttempt = true;
    this.loginClicked();
  }

  public async loginClicked() {
    let lang = this.lang;
    try {
      let tmpUserData = this.LoginForm.value;
      this.username = tmpUserData.formUser;
      this.password = tmpUserData.formPass;
      // let lang = this.translate.instant('spinner_logging_in');
      if(this.ud.isOnline) {
        this.alert.showSpinner(lang['spinner_logging_in']);
        Log.l("Login: Now attempting login:");
        this.auth.setUser(this.username);
        this.auth.setPassword(this.password);
        Log.l("About to call auth.login()");
        let res:any = await this.auth.login();
        Log.l("Login succeeded.", res);
        res = await this.server.getUserData(this.username);
        let udoc = res;
        udoc.updated = true;
        let user:Employee = Employee.deserialize(udoc);
        Log.l(`loginClicked(): Employee record being set to:\n`, user);
        this.ud.setUser(user);
        udoc._id = this.localURL;
        res = await this.db.addLocalDoc(this.prefs.DB.reports, udoc);
        Log.l("loginAttempt(): Finished validating and saving user info, now downloading SESA config data.");
        res = await this.db.getAllConfigData();
        Log.l("loginAtttempt(): Got SESA config data.");
        this.ud.setSesaConfig(res);
        let creds = { user: this.username, pass: this.password, justLoggedIn: true};
        this.ud.storeCredentials(creds);
        this.ud.setLoginStatus(true);
        this.alert.hideSpinner();
        // let dbs = Object.keys(this.prefs.DB);
        let dbs = [
          'reports',
          'reports_other',
          'config',
          'scheduling',
          'jobsites',
        ];
        let syncText = lang['synchronizing_db'];
        for(let key of dbs) {
          // if(key === 'reports' || key === 'reports_other' || key === 'config') {
            let dbname = this.prefs.DB[key];
            Log.l(`loginClicked(): Now replicating database '${key}': '${dbname}'`);
            let spinnerText = sprintf("%s:\n'%s'", syncText, dbname);
            let spinnerID = this.alert.showSpinner(spinnerText);
            this.db.addDB(dbname);
            this.server.addRDB(dbname);
            let out = await this.server.syncFromServer(dbname);
            let outID = await this.alert.hideSpinnerPromise();
          // }
        }
        // this.events.publish('startup:finished', true);
        // this.events.publish('login:finished', true);
        // this.ud.reloadApp();
        if(this.mode === 'modal') {
          creds['justLoggedIn'] = true;
          this.ud.setAppLoaded(true);
          // this.tabServ.setTabDisable(false);
          this.tabServ.enableTabs();
          this.viewCtrl.dismiss(creds);
        } else {
          // this.tabServ.setTabDisable(false);
          creds['justLoggedIn'] = true;
          this.ud.setAppLoaded(true);
          this.tabServ.enableTabs();
          this.tabServ.goToPage('OnSiteHome', creds);
        }
        // }).catch((err) => {
        //   Log.l("loginAttempt(): Error validating and saving user info.");
        //   Log.l(err);
        //   this.loginError = true;
        //   this.alert.hideSpinner();
        // });
      } else {
        this.alert.hideSpinner();
        let loginAlert = this.translate.instant(['offline_alert_title', 'offline_alert_message']);
        this.alert.showAlert(loginAlert['offline_alert_title'], loginAlert['offline_alert_message']);
      }
    } catch(err) {
      Log.l(`loginClicked(): Error during login attempt!`);
      Log.e(err);
      throw new Error(err);
    }
  }
}
