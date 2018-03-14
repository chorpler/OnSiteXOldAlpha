// import { HomePage                                     } from 'pages/home/home'                   ;
// import { Sim                                          } from '@ionic-native/sim'                 ;
import { Component, ViewChild, OnInit,                } from '@angular/core'                      ;
import { ComponentFactoryResolver, ViewContainerRef,  } from '@angular/core'                      ;
import { ElementRef, NgZone,                          } from '@angular/core'                      ;
import { Platform, Nav, ToastController, Events, App  } from 'ionic-angular'                      ;
import { StatusBar                                    } from '@ionic-native/status-bar'           ;
import { SplashScreen                                 } from '@ionic-native/splash-screen'        ;
// import { Push, PushObject, PushOptions                } from '@ionic-native/push'                 ;
// import { LocalNotifications                           } from '@ionic-native/local-notifications'  ;
import { AppVersion                                   } from '@ionic-native/app-version'          ;
// import { AppUpdate                                    } from '@ionic-native/app-update'           ;
import { OpenNativeSettings                           } from '@ionic-native/open-native-settings' ;
import { UserData                                     } from 'providers/user-data'                ;
import { PouchDBService                               } from 'providers/pouchdb-service'          ;
import { StorageService                               } from 'providers/storage-service'          ;
import { DBService                                    } from 'providers/db-service'               ;
import { ServerService                                } from 'providers/server-service'           ;
import { AuthSrvcs                                    } from 'providers/auth-srvcs'               ;
import { AlertService                                 } from 'providers/alerts'                   ;
import { NetworkStatus                                } from 'providers/network-status'           ;
// import { GeolocService                                } from 'providers/geoloc-service'           ;
import { Log, CONSOLE, moment, Moment                 } from 'domain/onsitexdomain'               ;
import { MessageService                               } from 'providers/message-service'          ;
import { TabsComponent                                } from 'components/tabs/tabs'               ;
import { Preferences                                  } from 'providers/preferences'              ;
import { TranslateService                             } from '@ngx-translate/core'                ;
import { SmartAudio                                   } from 'providers/smart-audio'              ;
import { Jobsite                                      } from 'domain/onsitexdomain'               ;
import { ReportOther                                  } from 'domain/onsitexdomain'               ;
import { Report                                       } from 'domain/onsitexdomain'               ;
import { Employee                                     } from 'domain/onsitexdomain'               ;
import { Shift                                        } from 'domain/onsitexdomain'               ;
import { PayrollPeriod                                } from 'domain/onsitexdomain'               ;
import { Message                                      } from 'domain/onsitexdomain'               ;
import { Street, Address, Geolocation, Schedule,      } from 'domain/onsitexdomain'               ;
import { Schedules, Jobsites,                         } from 'domain/onsitexdomain'               ;
// import { IonDigitKeyboardCmp, IonDigitKeyboardOptions } from 'components/ion-digit-keyboard'      ;
import { TabsService                                  } from 'providers/tabs-service'             ;
import { ClockComponent                               } from 'components/clock'                   ;
import { ColorService                                 } from 'providers/color-service'            ;

export const homePage:string = "OnSiteHome";
// export const homePage:string = "Testing";
// declare var resolve:Function;

@Component({ templateUrl: 'app.html' })
export class OnSiteApp implements OnInit {
  @ViewChild(Nav) nav:Nav;
  @ViewChild('tabsTarget') tabsTarget:ElementRef;
  @ViewChild('clock') clock:ClockComponent;

  public title                   : string  = 'OnSiteHome'      ;
  public rootPage                : string                      ;
  public lang                    : any                         ;
  public langStrings             : Array<string> = []          ;
  public pouchOptions            : any     = { }               ;
  public clockCaption            : string  = ""                ;
  public backButtonPressedAlready: boolean = false             ;
  public static status           : any     = {bootError: false};
  public static PREFS            : any     = new Preferences() ;
  public prefs                   : any     = OnSiteApp.PREFS   ;
  public status                  : any     = OnSiteApp.status  ;
  public network                 : any                         ;
  public data                    : any                         ;
  private ui                     : any                         ;
  public tech                    : Employee                    ;
  public appLanguages            : Array<string> = ['en','es'] ;
  public keysetup                : any                         ;
  public messageCheckTimeout     : any                         ;
  public timeoutHandle           : any                         ;
  public hiddenArray             : Array<boolean>              ;

  constructor(
    // public sim          : Sim                      ,
    public platform     : Platform                 ,
    public toast        : ToastController          ,
    public statusBar    : StatusBar                ,
    public splashScreen : SplashScreen             ,
    public zone         : NgZone                   ,
    public cfResolver   : ComponentFactoryResolver ,
    public net          : NetworkStatus            ,
    // public push         : Push                     ,
    // public localNotify  : LocalNotifications       ,
    public storage      : StorageService           ,
    public version      : AppVersion               ,
    public db           : DBService                ,
    public ud           : UserData                 ,
    public auth         : AuthSrvcs                ,
    public server       : ServerService            ,
    public events       : Events                   ,
    public tabServ      : TabsService              ,
    public app          : App                      ,
    public translate    : TranslateService         ,
    public alert        : AlertService             ,
    public audio        : SmartAudio               ,
    public msg          : MessageService           ,
    // public appUpdate    : AppUpdate                ,
    // public geoloc       : GeolocService            ,
    public settings     : OpenNativeSettings       ,
    public colors       : ColorService             ,
  ) {
    window['onsiteapp']     = this;
    window['moment']        = moment;
    this.createConsoleObjects();
  }

  ngOnInit() {
    Log.l(`OnSiteApp: ngOnInit() fired`);
    this.ud.setAppLoaded(false);
    this.platform.ready().then(res => {
      if(homePage === 'OnSiteHome') {
        this.langStrings = [
          'spinner_app_loading',
          'offline_alert_title',
          'offline_alert_message',
          'offline_login_title',
          'offline_login_message',
          'continue',
          'open_phone_settings',
          "retrieving_preferences",
          "checking_login_status",
          "refreshing_data",
          "checking_for_new_messages",
          "retrieving_local_data",
          "function_in_development",
        ];
        this.initializeApp(res);
      } else {
        Log.l(`OnSiteApp: skipping boot and setting homepage to '${homePage}'`);
        this.ud.showClock = false;
        // this.ud.setAppLoaded(true);
        // this.nav.setRoot(homePage);
        this.rootPage = homePage;
      }
    });
  }

  public createConsoleObjects() {
    window[ 'moment' ] = moment;
    window[ 'Log'    ] = Log;
    window[ 't1'     ] = CONSOLE.t1;
    window[ 'c1'     ] = CONSOLE.c1;
    window['onsitedebug'] = window['onsitedebug'] || {}    ;
    window['onsitedebug']['Jobsite']       = Jobsite       ;
    window['onsitedebug']['ReportOther']   = ReportOther   ;
    window['onsitedebug']['Report']        = Report        ;
    window['onsitedebug']['Employee']      = Employee      ;
    window['onsitedebug']['Shift']         = Shift         ;
    window['onsitedebug']['PayrollPeriod'] = PayrollPeriod ;
    window['onsitedebug']['Message']       = Message       ;
    window['onsitedebug']['Address']       = Address       ;
    window['onsitedebug']['Street']        = Street        ;
    window['onsitedebug']['Geolocation']   = Geolocation   ;
    window['onsitedebug']['Jobsite']       = Jobsite       ;
    window['onsitedebug']['Jobsites']      = Jobsites      ;
    window['onsitedebug']['Schedule']      = Schedule      ;
    window['onsitedebug']['Schedules']     = Schedules     ;

  }

  public registerListeners() {
    this.platform.registerBackButtonAction(() => {
      let page = this.nav && this.nav.getActive ? this.nav.getActive() : {name: "none", id: "none"};
      if(page && page.id) {
        let pageName = page.id;
        if(pageName === 'OnSiteHome') {
          if (this.backButtonPressedAlready) {
            if(this.timeoutHandle) {
              clearTimeout(this.timeoutHandle);
            }
            this.exitApp();
          } else {
            this.alert.showToast("Press back again to exit", 2000);
            this.backButtonPressedAlready = true;
            this.timeoutHandle = setTimeout(() => { this.backButtonPressedAlready = false; }, 2000)
          }
        } else {
          if(this.nav.canGoBack()) {
            this.nav.pop();
          } else {
            this.nav.setRoot('OnSiteHome');
          }
        }
      };
    });
  }

  public async initializeApp(vagueParameter:any) {
    try {
      Log.l("AppComponent: Initializing app...");
      this.hiddenArray = this.tabServ.getHiddenArray();
      this.keysetup = {visible: false, width: '100%', swipeToHide: true};
      // let componentFactory = this.cfResolver.resolveComponentFactory(TabsComponent);
      // let vcRef = this.tabsTarget.viewContainer;
      // let tabsComponentRef = vcRef.createComponent(componentFactory);
      // let instance:TabsComponent = tabsComponentRef.instance as TabsComponent;
      Log.l("OnSite: platform ready returned:\n", vagueParameter);
      let res = await this.getAppVersion();
      Log.l(`OnSite: version is: '${res}'`);
      this.translate.setDefaultLang('en');
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      // NetworkStatus.watchForDisconnect();
      // this.pouchOptions = { adapter: 'websql', auto_compaction: true };
      this.pouchOptions = { auto_compaction: true };
      window["PouchDB"] = PouchDBService.PouchInit();
      window["Platform"] = this.platform;
      window["PouchDB" ].defaults(this.pouchOptions);

      window[ "PouchDB"].debug.enable('*');
      // window[ "PouchDB"].debug.disable('*');
      Log.l(`OnSite: about to register listeners...`);
      this.registerListeners();
      Log.l(`OnSite: about to preload audio...`);
      this.preloadAudioFiles();
      this.translate.get(this.langStrings).subscribe(async (result) => {
        try {
          Log.l("Translate loader resulted in:\n", result);
          this.lang = result;
          let lang = this.lang;
          Log.l("OnSite: now checking for boot error...");
          if(!this.ud.isBootError()) {
            Log.l("OnSite: no boot error! Now checking first login...");
            let firstBoot = await this.isFirstLogin();
            if(firstBoot) {
              Log.l("OnSite.initializeApp(): bootApp() detected first boot, going to first boot page.");
              this.ud.showClock = false;
              this.ud.setAppLoaded(true);
              this.clock.setCaption("(Tap to hide clock)");
              this.rootPage = 'First Login';
              return;
            } else {
              Log.l("OnSite.initializeApp(): Not first login! Booting app...");
              let res = await this.bootApp();
              if(res) {
                Log.l("OnSite.initializeApp(): bootApp() returned successfully!");
                // let hide = await this.alert.hideSpinnerPromise();
                this.clock.setCaption("(Tap to hide clock)");
                this.ud.showClock = false;
                Log.l("OnSiteApp: boot finished, setting home page to 'OnSiteHome'.")
                this.ud.setAppLoaded(true);
                this.rootPage = 'OnSiteHome';
                return true;
              } else {
                // this.rootPage = 'Login';
                this.goToLogin();
                return false;
              }

            }
          } else {
            Log.l("OnSite: there was a boot error");
          }
        } catch(err) {
          Log.l("initializeApp(): Error in getAppVersion() or platform.ready()! That's bad! Or in checkPreferences or translate.get or something!");
          Log.e(err);
          let errorText = "";
          if (err && err.message) {
            errorText = err.message;
          } else if (typeof err === 'string') {
            errorText = err;
          }
          // this.ud.showClock = false;
          // this.rootPage = 'Login';
          this.goToLogin();
        }
        // }).catch(err => {
        //   Log.l("initializeApp(): Error in getAppVersion() or platform.ready()! That's bad! Or in checkPreferences or translate.get or something!");
        //   Log.e(err);
        //   let errorText = "";
        //   if (err && err.message) {
        //     errorText = err.message;
        //   } else if (typeof err === 'string') {
        //     errorText = err;
        //   }
        //   // this.alert.showAlert("ERROR", "Error starting app, please tell developers:<br>\n<br>\n" + errorText).then(res => {
        //   this.ud.showClock = false;
        //   this.rootPage = 'Login';
        //   // });
        // });
      });
      // } catch(err) {}
    } catch(err) {

    }
  }

  public goToLogin() {
    Log.l("goToLogin(): Going to Login page.");
    if(this.clock) {
      this.clock.setCaption("(Tap to hide clock)");
    }
    this.ud.showClock = false;
    this.ud.setAppLoaded(true);
    this.rootPage = 'Login';
    return true;
}

  public async onlineBoot() {
    let lang = this.lang;
    try {
      this.clock.setCaption(lang['retrieving_preferences']);
      let out:any = await this.checkPreferences();
      Log.l("OnSite.onlineBoot(): Done messing with preferences, now checking login...");
      let language = this.prefs.getLanguage();
      if (language !== 'en') {
        this.translate.use(language);
      }
      this.clock.setCaption(lang['checking_login_status']);
      out = await this.checkLogin();
      if(out === false) {
        // this.rootPage = 'Login';
        this.goToLogin();
        return false;
      }
      Log.l("OnSite.onlineBoot(): User passed login check. Should be fine. Checking for Android app update.");
      // let androidUpdate = await this.checkForAndroidUpdate();
      //   Log.l("OnSite.onlineBoot(): Done with Android update check. Now getting all data from server.");
      // return
      this.clock.setCaption(lang['refreshing_data']);
      let res = await this.server.getAllData(this.tech);
      this.data = res;
      this.ud.setData(this.data);
      let msgs = this.msg.getMessages();
      Log.l("OnSite.onlineBoot(): Checked new messages.");
      let phoneInfo = await this.ud.checkPhoneInfo();
      let tech = this.ud.getData('employee')[0];
      this.clock.setCaption(lang['checking_for_new_messages']);
      let newMsgs = await this.checkForNewMessages();
      let pp:PayrollPeriod[] = this.ud.createPayrollPeriods(tech, this.prefs.getPayrollPeriodCount());
      UserData.payrollPeriods = pp;
      // this.ud.getReportList();
      this.clock.clearCaption();
      if(phoneInfo) {
        Log.l("OnSite.onlineBoot(): Got phone data:\n", phoneInfo);
        let savePhoneInfo = await this.server.savePhoneInfo(tech, phoneInfo);
        return true;
      } else {
        return true;
      }
      // }).catch(err => {
        //   Log.l("OnSite.onlineBoot(): Error with check preferences.");
        //   Log.e(err);
        //   this.alert.showConfirmYesNo("STARTUP ERROR", "Caught app loading error:<br>\n<br>\n" + err.message + "<br>\n<br>\nTry to restart app?").then(res => {
          //     if (res) {
            //       this.ud.reloadApp();
            //     } else {
              //       reject(err);
              //     }
              //   });
              // });
    } catch(err) {
      this.clock.clearCaption();
      Log.l(`onlineBoot(): Error while checking for online status!`);
      Log.e(err);
      // throw new Error(err);
      return err;
    }
  }

  public async offlineBoot() {
    let lang = this.lang;
    try {
      let out = await this.checkPreferences();
      Log.l("OnSite.offlineBoot(): Done messing with preferences, now checking login...");
      let language = this.prefs.getLanguage();
      if(language !== 'en') {
        this.translate.use(language);
      }
      let credentials = await this.auth.areCredentialsSaved();
      if(credentials) {
        Log.l("offlineBoot(): Credentials found stored.");
      } else {
        Log.l("offlineBoot(): Credentials not found stored.");
      }
      // out = await this.checkLogin();
      // if(out === false) {
      //   return false;
      // }
      // Log.l("OnSite.offlineBoot(): User passed login check. Should be fine. Checking for Android app update.");
      // this.checkForAndroidUpdate().then(res => {
      //   Log.l("OnSite.offlineBoot(): Done with Android update check. Now getting all data from server.");
        // return
      let tech:Employee = await this.getEmployeeRecord();
      this.tech = tech;
      this.ud.setTechProfile(tech);
      this.clock.setCaption(lang['retrieving_local_data']);
      let res = await this.db.getAllData(this.tech);
      this.data = res;
      this.ud.setData(this.data);
      let msgs = this.msg.getMessages(true);
      // Log.l("OnSite.offlineBoot(): Checked new messages.");
      let phoneInfo = await this.ud.checkPhoneInfo();
      // let tech = this.ud.getData('employee')[0];
      let newMsgs = await this.checkForNewMessages();
      let pp:PayrollPeriod[] = this.ud.createPayrollPeriods(this.data.employee[0], this.prefs.getPayrollPeriodCount());
      UserData.payrollPeriods = pp;
      // this.ud.getReportList();
      this.clock.clearCaption();
      if(phoneInfo) {
        Log.l("OnSite.offlineBoot(): Got phone data:\n", phoneInfo);
        // let savePhoneInfo = await this.server.savePhoneInfo(tech, phoneInfo);
        let savePhoneInfo = await this.db.savePhoneInfo(tech, phoneInfo);
        return true;
      } else {
        return true;
      }
    } catch(err) {
      this.clock.clearCaption();
      Log.l(`offlineBoot(): Error while checking for online status!`);
      Log.e(err);
      throw new Error(err);
    }
  }

  public async bootApp() {
    let lang = this.lang;
    try {
      Log.l("OnSite.bootApp(): Called.");
      let isOnline = await this.networkCheck();
      if(isOnline) {
        let res:any = await this.onlineBoot();
        if(res === false) {
          this.goToLogin();
          return false;
        } else {
          return true;
        }
      } else {
        let res:any = await this.offlineBoot();
        return res;
      }
      // if(!this.ud.isOnline) {
      //     let result = await this.alert.showCustomConfirm(lang['offline_login_title'], lang['offline_login_message'], [
      //       { text: lang['open_phone_settings'], retVal: 2 },
      //       { text: lang['continue']           , retVal: 1 },
      //     ]);
      //     if(result === 1) {
      //       /* Continue opening app */
      //       Log.l("bootApp(): User chose to continue.");
      //       let res = await this.offlineBoot();
      //       return res;
      //     } else if(result === 2) {
      //       /* Open phone settings */
      //       Log.l("bootApp(): Opening phone settings...");
      //       let out = await this.settings.open('settings');
      //       // this.timeoutHandle = setTimeout(() => {
      //       //   this.exitApp();
      //       // }, 500);
      //     } else {
      //       // out = await this.settings.open('settings');
      //       // Log.l("bootApp(): Back from phone settings, result:\n", out);
      //       // if(!this.ud.isOnline) {
      //       //   this.offlineBoot();
      //       // } else {
      //     //   this.onlineBoot();
      //     // }
      //   }
      // } else {
      //   let res = await this.onlineBoot();
      //   if(res === false) {
      //     // this.rootPage = 'Login';
      //     this.goToLogin();
      //     return false;
      //   } else {
      //     return res;
      //   }
      // }
    } catch(err) {
      Log.l(`bootApp(): Error thrown during boot process!`);
      Log.e(err);
      if(err === false) {
        throw new Error(err);
      }
      let retry = await this.alert.showConfirmYesNo("STARTUP ERROR", "Caught app loading error:<br>\n<br>\n" + err.message + "<br>\n<br>\nTry to restart app?");
      if(retry) {
        this.ud.reloadApp();
      } else {
        throw new Error(err);
      }
    }
  }

  public async networkCheck() {
    let lang = this.lang;
    try {
      while(!this.ud.isOnline) {
        Log.l(`networkCheck(): not online.`);
        let result = await this.alert.showCustomConfirm(lang['offline_login_title'], lang['offline_login_message'], [
          { text: lang['open_phone_settings'], retVal: 2 },
          { text: lang['continue']           , retVal: 1 },
        ]);
        if(result === 1) {
          /* Continue opening app */
          Log.l("networkCheck(): User chose to continue.");
          return false;
        } else if(result === 2) {
          /* Open phone settings */
          Log.l("networkCheck(): Opening phone settings...");
          let out = await this.settings.open('settings');
        }
      }
      return true;
    } catch(err) {
      Log.l(`firstLoginNetworkCheck(): Error opening settings!`);
      Log.e(err);
      throw new Error(err);
    }
  }

  public async isFirstLogin() {
    try {
      let firstBoot:boolean = false;
      // let PouchDB = this.db.PouchDB;
      // let dblist:Array<string> = [];
      // let reportsDB = this.prefs.DB.reports;
      // dblist = await PouchDB.allDbs();
      // if(dblist && dblist.length && dblist.indexOf(reportsDB) > -1) {
      //   firstBoot = false;
      // } else {
      //   firstBoot = true;
      // }
      if(firstBoot) {
        return true;
      } else {
        // let reportsDB = this.prefs.DB.reports;
        // let res = await this.db.PouchDB.allDbs();
        // if(res && res.length && res.indexOf(reportsDB) > -1) {
        //   return false;
        // } else {
        //   return true;
        // }
        let sitesDB = this.prefs.DB.jobsites;
        let db = this.db.addDB(sitesDB);
        let res = await db.allDocs({include_docs:false});
        if(res && res.total_rows) {
          return false;
        } else {
          return true;
        }
      }
    } catch(err) {
      Log.l(`isFirstLogin(): Error checking first login via PouchDB databases!`);
      Log.e(err);
      // throw new Error(err);
      return true;
    }
  }

  public async finishStartup() {
    try {
      Log.l("finishStartup(): Now attempting to publish startup:finished event and set home page...");
      // this.events.publish('startup:finished', HomePage);
      return true;
    } catch(err) {
      Log.l("finishStartup(): Error publishing startup:finished event, and/or seting root page!");
      Log.e(err);
      throw new Error(err);
    }
  }

  public checkForNewMessages() {
    let interval = this.prefs.getMessageCheckInterval();
    // Log.l("checkForNewMessages(): Interval is set to %d.", interval);
    this.messageCheckTimeout = setInterval(() => {
      Log.l("checkForNewMessages(): Fetching new messages...");
      if(this.ud.isOnline) {
        this.msg.getMessages().then(res => {
          Log.l("checkForNewMessages(): Checked sucessfully.");
        }).catch(err => {
          Log.l("checkForNewMessages(): Caught error. Silently dying.");
          Log.e(err);
        });
      }
    }, 1000 * 60 * interval);
  }

  public async getEmployeeRecord():Promise<Employee> {
    try {
      let dbname = this.prefs.DB.reports;
      let db1 = this.db.addDB(dbname);
      let employeeDoc = await db1.get('_local/techProfile');
      let tech:Employee = new Employee();
      tech.deserialize(employeeDoc);
      return tech;
    } catch(err) {
      Log.l(`getEmployeeRecord(): Error during retrieval or reading of Employee record!`);
      Log.e(err);
      throw new Error(err);
    }
  }

  public showToast(text: string) {
    let toast = this.toast.create({
      message: text,
      duration: 3000
    });
    toast.present();
  }

  public async checkPreferences() {
    try {
      let storedPrefs:any = await this.storage.persistentGet('PREFS');
      let updatePrefs = storedPrefs;
      if(storedPrefs !== null && storedPrefs !== undefined && typeof storedPrefs !== 'undefined' && storedPrefs !== 'undefined') {
        updatePrefs = this.prefs.comparePrefs(storedPrefs);
        this.prefs.setPrefs(updatePrefs);
      } else {
        updatePrefs = this.prefs.getPrefs();
      }
      Log.l("OnSite: Preferences at version %d, saving again.", this.prefs.USER.preferencesVersion);
      let res:any = await this.storage.persistentSet('PREFS', updatePrefs);
      Log.l("OnSite: Preferences stored:\n", this.prefs.getPrefs());
      return res;
    } catch(err) {
      Log.l("OnSite: Error while checking for stored preferences!");
      Log.e(err);
      throw new Error(err);
    }
  }

  public async checkLogin():Promise<boolean> {
    try {
      let res:any = await this.auth.areCredentialsSaved();
      Log.l("checkLogin(): Got saved credentials back:\n", res);
      Log.l("... using them to log in to the server...");
      let loginData = res;
      let u = loginData['username'];
      let p = loginData['password'];
      this.ui = {u:u, p:p};
      res = await this.server.loginToServer(u, p, '_session');
      Log.l("checkLogin(): Successfully logged in! Now retrieving config...");
      let profile = this.ud.getTechProfile();
      let tech:Employee = this.ud.getTechProfile();
      this.tech = tech;
      this.ud.setLoginStatus(true);
      res = await this.db.getAllConfigData();
      Log.l("checkLogin(): Successfully retrieved config data:\n", res);
      this.ud.setSesaConfig(res);
      return true;
    } catch(err) {
      Log.l(`checkLogin(): Error during login check! User not authenticated properly.`);
      Log.e(err);
      return false;
      // throw new Error(err);
    }
  }

  public checkMessages() {

  }

  public preloadAudioFiles() {
    this.audio.preload('overtime'         , 'assets/audio/nospoilers.mp3' )  ;
    this.audio.preload('deletereport'     , 'assets/audio/nospoilers2.mp3')  ;
    this.audio.preload('help'             , 'assets/audio/nospoilers3.mp3')  ;
    this.audio.preload('dropit'           , 'assets/audio/nospoilers4.mp3')  ;
    this.audio.preload('sorry'            , 'assets/audio/nospoilers5.mp3')  ;
    this.audio.preload('deleteotherreport', 'assets/audio/nospoilers6.mp3')  ;
    this.audio.preload('funny'            , 'assets/audio/nospoilers7.mp3')  ;
    this.audio.preload('laugh'            , 'assets/audio/nospoilers8.mp3')  ;
  }

  public async getAppVersion() {
    try {
      if (this.platform.is('cordova')) {
        let res:any = await this.version.getVersionNumber();
        this.ud.appdata.version = res;
        return true;
      } else {
        this.ud.appdata.version += "(b)";
        return false;
      }
    } catch(err) {
      Log.l(`getAppVersion(): Error getting app version!`);
      Log.e(err);
      return false;
    }
  }

  public async checkForAndroidUpdate():Promise<boolean> {
    try {
      // if(this.platform.is('android') && this.platform.is('cordova')) {
      //   try {
      //     let res:any = await this.appUpdate.checkAppUpdate(this.prefs.SERVER.androidUpdateURL);
      //     Log.l("checkForAndroidUpdate(): Succeeded.");
      //     return res;
      //   } catch(err) {
      //     Log.l(`checkForAndroidUpdate(): Error while checking for update availability.`);
      //     Log.e(err);
      //     return false;
      //   }
      // } else {
      //   Log.l("checkForAndroidUpdate(): Platform is not Android. No need for a check.");
      //   return false;
      // }
      return false;
    } catch (err) {
      Log.l("checkForAndroidUpdate(): Error!");
      Log.e(err);
      return false;
    }
  }

  public goToTab(idx:number) {
    Log.l(`OnSiteConsoleX.goToTab(${idx}) running...`)
    let tabInfo = this.tabServ.getTabArray();
    let tab:any = tabInfo[idx];
    if(tab) {
      let name = tab.name;
      Log.l(`OnSiteConsoleX.goToTab(${idx}) found tab '${name}', going there.`)
      this.tabServ.setActive(idx);
      this.rootPage = name;
    }
  }

  public exitApp() {
    this.platform.exitApp();
  }

  public async resetAllAppData() {
    try {
      // Log.l(`resetAllAppData(): First deleting local databases...`)
      // let res:any = await this.db.deleteAllLocalDatabases();
      // Log.l(`resetAllAppData(): Deleted local databases, now clearing persistent storage...`)
      // res = await this.storage.persistentClear();
      // Log.l(`resetAllAppData(): All local databases and keys cleared.`);
      Log.l(`resetAllAppData(): This function is currently disabled due to pouchdb-all-dbs causing startup problems.`);
      return true;
    } catch(err) {
      Log.l(`resetAllAppData(): Error during reset`);
      Log.e(err);
      throw new Error(err);
    }
  }
}

