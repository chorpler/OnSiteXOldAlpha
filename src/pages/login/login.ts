import { Component, OnInit                                                                 } from '@angular/core'              ;
import { IonicPage, NavController, NavParams, Platform, LoadingController, AlertController } from 'ionic-angular'              ;
import { PopoverController, ViewController, Events                                         } from 'ionic-angular'              ;
import { FormGroup, FormControl, Validators                                                } from "@angular/forms"             ;
import { AuthSrvcs                                                                         } from 'providers/auth-srvcs'       ;
import { ServerService                                                                     } from 'providers/server-service'   ;
import { DBService                                                                         } from 'providers/db-service'       ;
import { AlertService                                                                      } from 'providers/alerts'           ;
import { NetworkStatus                                                                     } from 'providers/network-status'   ;
import { UserData                                                                          } from 'providers/user-data'        ;
import { Preferences                                                                       } from 'providers/preferences'      ;
import { Employee                                                                          } from 'domain/onsitexdomain'       ;
import { Log                                                                               } from 'domain/onsitexdomain'       ;
import { TranslateService                                                                  } from '@ngx-translate/core'        ;
import { TabsService                                                                       } from 'providers/tabs-service'     ;
import { DispatchService, ClockAction, OSAppEvent,                                         } from 'providers/dispatch-service' ;

@IonicPage({name: 'Login'})
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class Login implements OnInit {
  public title          : string  = "OnSite Login"       ;
  public static PREFS   : any     = new Preferences()    ;
  public prefs          : any     = Login.PREFS          ;
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
  public version        : string = ""                    ;
  public dataReady      : boolean = false                ;

  constructor(
    public navCtrl  : NavController,
    public navParams: NavParams,
    public platform : Platform,
    public dispatch : DispatchService,
    private auth    : AuthSrvcs,
    private server  : ServerService,
    private db      : DBService,
    private network : NetworkStatus,
    private alert   : AlertService,
    public viewCtrl : ViewController,
    public ud       : UserData,
    public events   : Events,
    public tabServ  : TabsService,
    public translate: TranslateService,
  ) {
    window['onsitelogin'] = this;
  }

  ionViewDidLoad() {
    Log.l('Login: ionViewDidLoad fired.');
  }

  ngOnInit() {
    Log.l('Login: ionViewDidLoad fired.');
    this.tabServ.disableTabs();
    if (!(this.ud.isAppLoaded())) {
      this.tabServ.goToPage('OnSiteHome');
    } else {
      this.runFromInit();
    }
    // if(NetworkStatus.isConnected()) {
    // } else {
    //   this.alerter.showAlert('OFFLINE', "There is no Internet connection. Login will not work right now.");
    // }
  }

  public runFromInit() {
    Log.l("Starting login page...");
    if(this.navParams.get('mode') !== undefined) { this.mode = this.navParams.get('mode'); }

    this.initializeForm();
    this.version = this.ud.getVersion();
    this.dataReady = true;
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
    let spinnerID;
    try {
      let tmpUserData = this.LoginForm.value;
      this.username = tmpUserData.formUser;
      this.password = tmpUserData.formPass;
      let lang = this.translate.instant('spinner_logging_in');
      if(this.ud.isOnline) {
        spinnerID = await this.alert.showSpinnerPromise(lang['spinner_logging_in']);
        Log.l("Login: Now attempting login:");
        this.auth.setUser(this.username);
        this.auth.setPassword(this.password);
        Log.l("About to call auth.login()");
        let res:any = await this.auth.login();
        Log.l("Login succeeded.", res);
        let out:any = this.alert.hideSpinnerPromise(spinnerID);
        this.dispatch.triggerClockEvent('show');
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
        let creds:any = { user: this.username, pass: this.password, justLoggedIn: true};
        this.ud.storeCredentials(creds);
        this.ud.setLoginStatus(true);
        this.alert.hideSpinnerPromise(spinnerID);
        // this.events.publish('startup:finished', true);
        // this.events.publish('login:finished', true);
        this.dispatch.triggerAppEvent('login', creds);
        // this.ud.reloadApp();
        // if(this.mode === 'modal') {
        //   creds.justLoggedIn = true;
        //   // this.tabServ.setTabDisable(false);
        //   this.tabServ.enableTabs();
        //   this.viewCtrl.dismiss(creds);
        //   return true;
        // } else {
        //   // this.tabServ.setTabDisable(false);
        //   this.tabServ.enableTabs();
        //   this.tabServ.goToPage('OnSiteHome', creds);
        //   return true;
        // }
      } else {
        this.alert.hideSpinnerPromise(spinnerID);
        let loginAlert = this.translate.instant(['offline_alert_title', 'offline_alert_message']);
        this.alert.showAlert(loginAlert['offline_alert_title'], loginAlert['offline_alert_message']);
      }
    } catch(err) {
      Log.l("loginAttempt(): Error validating and saving user info.");
      Log.l(err);
      this.loginError = true;
      this.alert.hideSpinner();
    }
  }
}
