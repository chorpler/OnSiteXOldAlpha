import { Component, ViewChild, OnInit,                } from '@angular/core'                     ;
import { ComponentFactoryResolver, ViewContainerRef,  } from '@angular/core'                     ;
import { ElementRef,                                  } from '@angular/core'                     ;
import { Platform, Nav, ToastController, Events, App  } from 'ionic-angular'                     ;
import { StatusBar                                    } from '@ionic-native/status-bar'          ;
import { SplashScreen                                 } from '@ionic-native/splash-screen'       ;
import { Storage                                      } from '@ionic/storage'                    ;
import { Push, PushObject, PushOptions                } from '@ionic-native/push'                ;
import { LocalNotifications                           } from '@ionic-native/local-notifications' ;
import { AppVersion                                   } from '@ionic-native/app-version'         ;
import { AppUpdate                                    } from '@ionic-native/app-update'          ;
import { UserData                                     } from 'providers/user-data'               ;
import { PouchDBService                               } from 'providers/pouchdb-service'         ;
import { DBSrvcs                                      } from 'providers/db-srvcs'                ;
import { SrvrSrvcs                                    } from 'providers/srvr-srvcs'              ;
import { AuthSrvcs                                    } from 'providers/auth-srvcs'              ;
import { AlertService                                 } from 'providers/alerts'                  ;
import { NetworkStatus                                } from 'providers/network-status'          ;
import { GeolocService                                } from 'providers/geoloc-service'          ;
import { Log, CONSOLE, moment, Moment                 } from 'config/config.functions'           ;
import { HomePage                                     } from 'pages/home/home'                   ;
import { MessageService                               } from 'providers/message-service'         ;
import { TabsComponent                                } from 'components/tabs/tabs'              ;
import { Preferences                                  } from 'providers/preferences'             ;
import { TranslateService                             } from '@ngx-translate/core'               ;
import { SmartAudio                                   } from 'providers/smart-audio'             ;
import { Jobsite                                      } from 'domain/jobsite'                    ;
import { ReportOther                                  } from 'domain/reportother'                ;
import { Report                                       } from 'domain/report'                     ;
import { Employee                                     } from 'domain/employee'                   ;
import { Shift                                        } from 'domain/shift'                      ;
import { PayrollPeriod                                } from 'domain/payroll-period'             ;
import { Message                                      } from 'domain/message'                    ;
import { IonDigitKeyboardCmp, IonDigitKeyboardOptions } from 'components/ion-digit-keyboard'     ;
import { TabsService                                  } from 'providers/tabs-service'            ;
// import { Sim                                          } from '@ionic-native/sim'                 ;

export const homePage:string = "OnSiteHome";
// export const homePage:string = "Testing";

@Component({ templateUrl: 'app.html' })
export class OnSiteApp implements OnInit {
  @ViewChild(Nav) nav: Nav;
  @ViewChild('tabsTarget') tabsTarget;

  public title                   : string  = 'OnSiteHome'      ;
  public rootPage                : string                      ;
  public pouchOptions            : any     = { }               ;
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
    public platform    : Platform          ,
    public toast       : ToastController   ,
    public statusBar   : StatusBar         ,
    public splashScreen: SplashScreen      ,
    public cfResolver  : ComponentFactoryResolver,
    public net         : NetworkStatus     ,
    public push        : Push              ,
    public localNotify : LocalNotifications,
    public storage     : Storage           ,
    public version     : AppVersion        ,
    public db          : DBSrvcs           ,
    public ud          : UserData          ,
    public auth        : AuthSrvcs         ,
    public server      : SrvrSrvcs         ,
    public events      : Events            ,
    public tabServ     : TabsService       ,
    public app         : App               ,
    public translate   : TranslateService  ,
    public alert       : AlertService      ,
    public audio       : SmartAudio        ,
    public msg         : MessageService    ,
    public appUpdate   : AppUpdate         ,
    public geoloc      : GeolocService     ,
    // public sim         : Sim               ,
  ) {
    window['onsiteapp'] = this;
    window['moment'] = moment;
  }

  ngOnInit() {
    Log.l(`OnSiteApp: ngOnInit() fired`);
    this.ud.setAppLoaded(false);
    this.platform.ready().then(res => {
      if(homePage === 'OnSiteHome') {
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

  public initializeApp(vagueParameter:any) {
    Log.l("AppComponent: Initializing app...");
    this.hiddenArray = this.tabServ.getHiddenArray();
    this.keysetup = {visible: false, width: '100%', swipeToHide: true};
    // let componentFactory = this.cfResolver.resolveComponentFactory(TabsComponent);
    // let vcRef = this.tabsTarget.viewContainer;
    // let tabsComponentRef = vcRef.createComponent(componentFactory);
    // let instance:TabsComponent = tabsComponentRef.instance as TabsComponent;

    Log.l("OnSite: platform ready returned:\n", vagueParameter);
    this.getAppVersion().then((res) => {
      this.platform.registerBackButtonAction(() => {
        let page = this.nav && this.nav.getActive ? this.nav.getActive() : {name: "none", id: "none"};
        if(page && page.id) {
          let pageName = page.id;
          if(pageName === 'OnSiteHome') {
            if (this.backButtonPressedAlready) {
              if(this.timeoutHandle) {
                clearTimeout(this.timeoutHandle);
              }
              this.platform.exitApp();
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
      this.translate.setDefaultLang('en');
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      NetworkStatus.watchForDisconnect();
      // this.pouchOptions = { adapter: 'websql', auto_compaction: true };
      this.pouchOptions = { auto_compaction: true };
      window["PouchDB"] = PouchDBService.PouchInit();
      window["Platform"] = this.platform;
      window["PouchDB" ].defaults(this.pouchOptions);

      // window[ "PouchDB"].debug.enable('*');
      window[ "PouchDB"].debug.disable('*');
      window[ 'moment' ] = moment;
      window[ 'Log'    ] = Log;
      window[ 't1'     ] = CONSOLE.t1;
      window[ 'c1'     ] = CONSOLE.c1;
      this.preloadAudioFiles();

      let callingClass = this;
      // this.checkPreferences().then(() => {
      //   Log.l("OnSite.initializeApp(): Done messing with preferences, now checking login...");
      //   let language = this.prefs.getLanguage();
      //   this.translate.addLangs(this.appLanguages);
      //   if (language !== 'en') {
      //     this.translate.use(language);
      //   }
      this.translate.get(['spinner_app_loading']).subscribe((result) => {
        let lang = result;
        if(!this.ud.isBootError()) {
          this.bootApp().then(res => {
            Log.l("OnSite.initializeApp(): bootApp() returned successfully!");
            this.alert.hideSpinner(0, true).then(res => {
              this.ud.showClock = false;
              Log.l("OnSiteApp: boot finished, setting home page to 'OnSiteHome'.")
              this.ud.setAppLoaded(true);
              this.rootPage = 'OnSiteHome';
              // setTimeout(() => {
              //   Log.l("OnSite.bootApp(): Publishing startup event after timeout!");
              //   callingClass.events.publish('startup:finished', true);
              // }, 50);
            })
          }).catch(err => {
            Log.l("OnSite.initializeApp(): bootApp() returned error.");
            Log.e(err);
            // let errorText = "";
            // if(err && err.message) {
            //   errorText = err.message;
            // } else if(typeof err === 'string') {
            //   errorText = err;
            // }
            // this.alert.showAlert("STARTUP ERROR", "Error on load, please tell developers:<br>\n<br>\n" + errorText).then(res => {
            this.ud.showClock = false;
            this.ud.setAppLoaded(true);
            this.rootPage = 'Login';
            // });
          });
        } else {
          Log.w("OnSite.initializeApp(): app boot error has been thrown.");
          // this.alert.showAlert("STARTUP ERROR", "Unknown error on loading app.").then(res => {
          this.ud.setAppLoaded(true);
          this.ud.showClock = false;
          this.rootPage = 'Login';
          // });
        }
      });
    }).catch(err => {
      Log.l("initializeApp(): Error in getAppVersion() or platform.ready()! That's bad! Or in checkPreferences or translate.get or something!");
      Log.e(err);
      let errorText = "";
      if (err && err.message) {
        errorText = err.message;
      } else if (typeof err === 'string') {
        errorText = err;
      }
      // this.alert.showAlert("ERROR", "Error starting app, please tell developers:<br>\n<br>\n" + errorText).then(res => {
      this.ud.showClock = false;
      this.rootPage = 'Login';
      // });
    });
  }

  public bootApp() {
    return new Promise((resolve,reject) => {
      let callingClass = this;
      Log.l("OnSite.bootApp(): Called.")
      this.checkPreferences().then(() => {
        Log.l("OnSite.bootApp(): Done messing with preferences, now checking login...");
        let language = this.prefs.getLanguage();
        if (language !== 'en') {
          this.translate.use(language);
        }
        this.checkLogin().then(res => {
          Log.l("OnSite.bootApp(): User passed login check. Should be fine. Checking for Android app update.");
          // this.checkForAndroidUpdate().then(res => {
          //   Log.l("OnSite.bootApp(): Done with Android update check. Now getting all data from server.");
            // return
            this.server.getAllData(this.tech)
            // ;
          // })
          .then(res => {
            this.data = res;
            this.ud.setData(this.data);
            return this.msg.getMessages();
          }).then(res => {
            Log.l("OnSite.bootApp(): Got new messages.");
            return this.ud.checkPhoneInfo();
          }).then(res => {
            let tech = this.ud.getData('employee')[0];
            this.checkForNewMessages();
            let phoneInfo = res;
            let pp = this.ud.createPayrollPeriods(this.data.employee[0], this.prefs.getPayrollPeriodCount());
            this.ud.getReportList();
            if(phoneInfo) {
              Log.l("OnSite.bootApp(): Got phone data:\n", phoneInfo);
              this.server.savePhoneInfo(tech, phoneInfo).then(res => {
                resolve(true);
              }).catch(err => {
                Log.l("OnSite.bootApp(): Error saving phone info to server!");
                Log.e(err);
                resolve(false);
              });
            } else {
              resolve(true);
            }
          }).catch(err => {
            Log.l("OnSite.bootApp(): Error starting up. ")
            Log.e(err);
            this.alert.showConfirmYesNo("STARTUP ERROR", "Caught app loading error:<br>\n<br>\n" + err.message + "<br>\n<br>\nTry to restart app?").then(res => {
              if(res) {
                this.ud.reloadApp();
              } else {
                reject(err);
              }
            });
          });
        }).catch(err => {
          Log.l("OnSite.bootApp(): Error with login");
          Log.e(err);
          reject(err);
        });
      }).catch(err => {
        Log.l("OnSite.bootApp(): Error with check preferences.");
        Log.e(err);
        this.alert.showConfirmYesNo("STARTUP ERROR", "Caught app loading error:<br>\n<br>\n" + err.message + "<br>\n<br>\nTry to restart app?").then(res => {
          if (res) {
            this.ud.reloadApp();
          } else {
            reject(err);
          }
        });
      })
    });
  }

  public finishStartup() {
    return new Promise((resolve,reject) => {
      try {
        Log.l("finishStartup(): Now attempting to publish startup:finished event and set home page...");
        this.events.publish('startup:finished', HomePage);
        resolve(true);
      } catch(err) {
        Log.l("finishStartup(): Error publishing startup:finished event, and/or seting root page!");
        Log.e(err);
        reject(false);
      }
    });
  }

  public checkForNewMessages() {
    let interval = this.prefs.getMessageCheckInterval();
    // Log.l("checkForNewMessages(): Interval is set to %d.", interval);
    this.messageCheckTimeout = setInterval(() => {
      Log.l("checkForNewMessages(): Fetching new messages...");
      this.msg.getMessages().then(res => {
        Log.l("checkForNewMessages(): Checked sucessfully.");
      }).catch(err => {
        Log.l("checkForNewMessages(): Caught error. Silently dying.");
        Log.e(err);
      });
    }, 1000 * 60 * interval);
  }

  public showToast(text: string) {
    let toast = this.toast.create({
      message: text,
      duration: 3000
    });
    toast.present();
  }

  public checkPreferences() {
    return new Promise((resolve,reject) => {
      this.storage.get('PREFS').then((storedPrefs) => {
        let updatePrefs = storedPrefs;
        if(storedPrefs !== null && storedPrefs !== undefined && typeof storedPrefs !== 'undefined' && storedPrefs !== 'undefined') {
          updatePrefs = this.prefs.comparePrefs(storedPrefs);
          this.prefs.setPrefs(updatePrefs);
        } else {
          updatePrefs = this.prefs.getPrefs();
        }
        Log.l("OnSite: Preferences at version %d, saving again.", this.prefs.USER.preferencesVersion);
        this.storage.set('PREFS', updatePrefs).then((res) => {
          Log.l("OnSite: Preferences stored:\n", this.prefs.getPrefs());
          resolve(res);
        }).catch(err => {
          Log.l("OnSite: Error while trying to save preferences.");
          Log.e(err);
          reject(err);
        });
      }).catch((err) => {
        Log.l("OnSite: Error while checking for stored preferences!");
        Log.e(err);
        reject(err);
      });
    });
  }

  public checkLogin() {
    return new Promise((resolve,reject) => {
      this.auth.areCredentialsSaved().then((res) => {
        Log.l("checkLogin(): Got saved credentials back:\n", res);
        Log.l("... using them to log in to the server...");
        let loginData = res;
        let u = loginData['username'];
        let p = loginData['password'];
        this.ui = {u:u, p:p};
        return this.server.loginToServer(u, p, '_session');
      }).then((res) => {
        Log.l("checkLogin(): Successfully logged in! Now retrieving config...");
        let profile = this.ud.getTechProfile();
        let tech:Employee = this.ud.getTechProfile();
        this.tech = tech;
        return this.db.getAllConfigData();
      }).then(res => {
        Log.l("checkLogin(): Successfully retrieved config data...");
        this.ud.setSesaConfig(res);
        resolve(res);
      }).catch((err) => {
        Log.l("checkLogin(): Error checking for saved credentials. User not authenticated properly!");
        Log.e(err);
        reject(err);
      });
    });
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

  public getAppVersion() {
    return new Promise((resolve) => {
      if (this.platform.is('cordova')) {
        return this.version.getVersionNumber().then(res => {
          this.ud.appdata.version = res;
          resolve(true);
        }).catch(err => {
          Log.l("Error getting app version!");
          Log.e(err);
          resolve(false);
        });
      } else {
        this.ud.appdata.version += "(b)";
        resolve(true);
      }
    });
  }

  public checkForAndroidUpdate() {
    return new Promise((resolve,reject) => {
      if(this.platform.is('android') && this.platform.is('cordova')) {
        this.appUpdate.checkAppUpdate(this.prefs.SERVER.androidUpdateURL).then(res => {
          Log.l("checkForAndroidUpdate(): Succeeded.");
          resolve(res);
        }).catch(err => {
          Log.l("checkForAndroidUpdate(): Error!");
          Log.e(err);
          resolve("Android update error, skipping it.");
        });
      } else {
        Log.l("checkForAndroidUpdate(): Platform is not Android. No need for a check.");
        resolve("Platform is not Android, not running update check");
      }
    });
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
}

