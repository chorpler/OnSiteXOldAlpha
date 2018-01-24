// import { TabsComponent                                    } from 'components/tabs/tabs'      ;
import { Subscription                                     } from 'rxjs/Subscription'         ;
import { sprintf                                          } from 'sprintf-js'                ;
import { Component, OnInit, Input, NgZone, ViewChild      } from '@angular/core'             ;
import { AfterViewChecked, AfterViewInit, OnDestroy,      } from '@angular/core'             ;
import { ElementRef,                                      } from '@angular/core'             ;
import { HttpClient                                       } from '@angular/common/http'      ;
import { DomSanitizer                                     } from '@angular/platform-browser' ;
import { trigger, state, style, animate, transition       } from '@angular/animations'       ;
import { TranslateService                                 } from '@ngx-translate/core'       ;
import { Pipe, PipeTransform                              } from '@angular/core'             ;
import { Platform, IonicPage, NavParams, Events           } from 'ionic-angular'             ;
import { NavController, ToastController, Content          } from 'ionic-angular'             ;
import { ModalController,ViewController,PopoverController } from 'ionic-angular'             ;
import { Log, moment, isMoment, Moment                    } from 'onsitex-domain'            ;
import { DBService                                        } from 'providers/db-service'      ;
import { AuthSrvcs                                        } from 'providers/auth-srvcs'      ;
import { ServerService                                    } from 'providers/server-service'  ;
import { AlertService                                     } from 'providers/alerts'          ;
import { UserData                                         } from 'providers/user-data'       ;
import { Report                                           } from 'onsitex-domain'            ;
import { ReportOther                                      } from 'onsitex-domain'            ;
import { Shift                                            } from 'onsitex-domain'            ;
import { PayrollPeriod                                    } from 'onsitex-domain'            ;
import { Employee                                         } from 'onsitex-domain'            ;
import { TabsService                                      } from 'providers/tabs-service'    ;
import { Preferences                                      } from 'providers/preferences'     ;
import { SafePipe                                         } from 'pipes/safe'                ;
import { SmartAudio                                       } from 'providers/smart-audio'     ;
import { STRINGS                                          } from 'onsitex-domain'            ;
import { Icons, Pages                                     } from 'onsitex-domain'            ;

// enum Icons {
//   'box-check-no'   = 0,
//   'box-check-yes'  = 1,
//   'flag-blank'     = 2,
//   'flag-checkered' = 3,
//   'unknown'        = 4,
// }

@IonicPage({ name: 'OnSiteHome' })
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage implements OnInit,OnDestroy,AfterViewInit {
  @ViewChild(Content) content:Content;
  public scrollContent:ElementRef;
  static PREFS                       : any           = new Preferences()        ;
  static EVENTS                      : Events                                   ;
  static startupHandler              : any                                      ;
  static pageLoadedPreviously        : boolean       = false                    ;
  static homePageStatus              : any           = {startupFinished: false} ;
  static lang                        : any                                      ;
  static fixedHeight                 : any           = "0px"                    ;
  static moment                      : any           = moment                   ;
  static today                       : any           = moment()                 ;
  static loginData                   : any           = null                     ;
  static username                    : string        = "unknown"                ;
  static userLoggedIn                : boolean                                  ;
  static title                       : string        = 'OnSite Home'            ;
  static numChars                    : Array<string> = STRINGS.NUMCHARS         ;
  static chkBxBool                   : boolean                                  ;
  static chkBx                       : string                                   ;
  static shftHrs                     : number                                   ;
  static hrsSubmitted                : number                                   ;
  static dataReady                   : boolean       = false                    ;
  static techProfile                 : any                                      ;
  static techWorkOrders              : Array<Report>   = []                     ;
  static shiftWorkOrders             : Array<Report>   = []                     ;
  static payrollWorkOrders           : Array<Report>   = []                     ;
  static otherReports                : Array<ReportOther> = []                  ;
  static hoursTotalList              : Array<any>    = []                       ;
  static shifts                      : Array<Shift>  = []                       ;
  static payrollPeriods              : Array<PayrollPeriod> = []                ;
  static period                      : PayrollPeriod = null                     ;
  static tech                        : Employee                                 ;
  static payrollPeriodCount          : number        = 2                        ;
  static payrollPeriodHoursTotal     : number        = 0                        ;
  static payrollPeriodHours          : number        = 0                        ;
  static payrollPeriodBonusHours     : number        = 0                        ;
  static pageError                   : boolean       = false                    ;
  static databases                   : any           = HomePage.PREFS.DB        ;
  static checkboxSVG                 : any           = UserData.getSVGData()    ;
  // static hands                       : any        = UserData.getClockHands()    ;
  static translations                : Array<string> = []                       ;

  public PREFS                       : any                 = HomePage.PREFS           ;
  public prefs                       : any                 = HomePage.PREFS           ;
  public EVENTS                      : Events              = HomePage.EVENTS;
  public startupHandler              : any                 = HomePage.startupHandler;
  public pageLoadedPreviously        : boolean             = HomePage.pageLoadedPreviously;
  public homePageStatus              : any                 = HomePage.homePageStatus;
  public lang                        : any                 = HomePage.lang;
  public fixedHeight                 : any                 = HomePage.fixedHeight;
  public moment                      : any                 = HomePage.moment;
  public today                       : any                 = HomePage.today;
  public loginData                   : any                 = HomePage.loginData;
  public username                    : string              = HomePage.username;
  public userLoggedIn                : boolean             = HomePage.userLoggedIn;
  public title                       : string              = HomePage.title;
  public numChars                    : Array<string>       = HomePage.numChars;
  public chkBxBool                   : boolean             = HomePage.chkBxBool;
  public chkBx                       : string              = HomePage.chkBx;
  public shftHrs                     : number              = HomePage.shftHrs;
  public hrsSubmitted                : number              = HomePage.hrsSubmitted;
  public dataReady                   : boolean             = HomePage.dataReady;
  public techProfile                 : any                 = HomePage.techProfile;
  public techWorkOrders              : Array<Report>    = HomePage.techWorkOrders;
  public shiftWorkOrders             : Array<Report>    = HomePage.shiftWorkOrders;
  public payrollWorkOrders           : Array<Report>    = HomePage.payrollWorkOrders;
  public otherReports                : Array<ReportOther>  = HomePage.otherReports;
  public hoursTotalList              : Array<any>          = HomePage.hoursTotalList;
  public shifts                      : Array<Shift>        = HomePage.shifts;
  public payrollPeriods              : Array<PayrollPeriod>= HomePage.payrollPeriods;
  public period                      : PayrollPeriod       = HomePage.period;
  public tech                        : Employee            = HomePage.tech;
  public payrollPeriodCount          : number              = HomePage.payrollPeriodCount;
  public payrollPeriodHoursTotal     : number              = HomePage.payrollPeriodHoursTotal;
  public payrollPeriodHours          : number              = HomePage.payrollPeriodHours;
  public payrollPeriodBonusHours     : number              = HomePage.payrollPeriodBonusHours;
  public pageError                   : boolean             = HomePage.pageError;
  public databases                   : any                 = this.PREFS.DB            ;
  public checkboxSVG                 : any                 = UserData.getSVGData()    ;
  // public hands                       : any                 = HomePage.hands  ;
  public translations                : Array<string>       = HomePage.translations;
  public justLoggedIn                : boolean             = false                    ;
  public showScrollbar               : boolean             = false                    ;
  public scrollStartSub              : Subscription                                   ;
  public scrollEndSub                : Subscription                                   ;
  public legend                      : Array<Array<string>> = []                      ;

  constructor(public http        : HttpClient,
              public platform    : Platform,
              public navCtrl     : NavController,
              public modalCtrl   : ModalController,
              public viewCtrl    : ViewController ,
              public popoverCtrl : PopoverController,
              public authService : AuthSrvcs,
              public navParams   : NavParams,
              public server      : ServerService,
              public ud          : UserData,
              public db          : DBService,
              public events      : Events,
              public tabServ     : TabsService,
              public alert       : AlertService,
              public zone        : NgZone,
              public translate   : TranslateService,
              public audio       : SmartAudio,
  ) {
    window["onsitehome"] = window["onsitehome"] ? window["onsitehome"] : this;
    Log.l("HomePage: Hi, I'm the HomePage class constructor!");
  }

  ngOnInit() {
    Log.l("HomePage: ngOnInit() fired");
    if(this.ud.isAppLoaded()) {
      this.runWhenReady();
    }
  }

  ngOnDestroy() {
    Log.l("HomePage: ngOnDestroy() fired");
  }

  ngAfterViewInit() {
    Log.l("HomePage: ngAfterViewInit() fired");
    // this.watchScroll();
    // this.content.ionScrollStart.subscribe((data) => {
    //   this.showScrollbar = true;
    // });
    // this.content.ionScrollEnd.subscribe((data) => {
    //   this.showScrollbar = false;
    // });
    // this.tabServ.setPageLoaded();
  }

  public scrollStarted(event?:any) {
    Log.l("scrollStarted(): event is:\n", event);
    this.showScrollbar = true;
  }

  public scrollEnded(event?:any) {
    Log.l("scrollEnded(): event is:\n", event);
    this.showScrollbar = false;
  }

  public scrolling(event?:any) {
    Log.l("scrolling(): event is:\n", event);
  }

  public watchScroll() {
    if(this.content && this.content.ionScrollStart) {
      this.scrollStartSub = this.content.ionScrollStart.subscribe((data) => {
        Log.l("ionScrollStart event fired! Scrolling started!")
        this.showScrollbar = true;
      });
      Log.l("ionScrollEnd event fired! Scrolling over!")
      this.scrollEndSub = this.content.ionScrollEnd.subscribe((data) => {
        this.showScrollbar = false;
      });
    }
  }

  public endWatchScroll() {
    if(this.scrollStartSub && !this.scrollStartSub.closed) {
      this.scrollStartSub.unsubscribe();
    }
    if(this.scrollEndSub && !this.scrollEndSub.closed) {
      this.scrollEndSub.unsubscribe();
    }
  }

  public constructorShit() {
    // if(this.navParams.get('justLoggedIn') !== undefined) { this.justLoggedIn = this.navParams.get('justLoggedIn');}
    // HomePage.EVENTS = events;
    // var caller = this;
    // this.endWatchScroll();
    this.dataReady = false;
    // if(!this.ud.isAppLoaded()) {
    //   Log.l("HOMEPAGE SAYS DON'T LOAD ME YET, D-BAG!");
    // }
    // if(HomePage.startupHandler === undefined || HomePage.startupHandler === null) {
    //   HomePage.startupHandler = (homepage: any) => {
    //     Log.l("HomePage.startupHandler(): startup:finished event detected. Target is:\n", homepage);
    //     Log.l("HomePage.startupHandler(): now unsubscribing from startup:finished event...");
    //     HomePage.EVENTS.unsubscribe('startup:finished', HomePage.startupHandler);
    //     HomePage.homePageStatus.startupFinished = true;
    //     Log.l("HomePage.startupHandler(): now executing runEveryTime() function...");
    //     if(!this.ud.isHomePageReady()) {
    //       if(!this.ud.isHomePageLoading()) {
    //         Log.l("HomePage: Loading from ");
    //         this.runEveryTime();
    //       } else {
    //         Log.l("HomePage: Stop trying to dual-load!");
    //       }
    //     } else {
    //       // this.dataReady = true;
    //       Log.l("HomePage: stop trying to load prematurely!")
    //     }
    //   };
    // }
    // if(HomePage.homePageStatus.startupFinished === false) {
    //   this.events.subscribe('startup:finished', HomePage.startupHandler);
    // }

  }

  public runWhenReady() {
    Log.l("HomePage: ionViewDidEnter() called. First wait to make sure app is finished loading.");
    let translations = [
      'error',
      'startup_error',
      'alert_retrieve_reports_error',
      'spinner_fetching_reports'
    ];
    this.generateLegend();
    HomePage.translations = translations;
    this.translations = HomePage.translations;
    if(!this.lang) {
      this.translate.get(this.translations).subscribe((result: any) => {
        this.lang = result;
      });
    }
    let lang = this.lang;
    if(this.navParams.get('justLoggedIn') !== undefined) { this.justLoggedIn = this.navParams.get('justLoggedIn');}
    // if(HomePage.homePageStatus.startupFinished) {
    // Log.l("HomePage.ionViewDidEnter(): startup already finished, just continuing with runEveryTime()...");
    // this.tabs.highlightPageTab('OnSiteHome');
    this.tabServ.setActive(0);
    let loaded = this.ud.isAppLoaded();
    let ready = this.ud.isHomePageReady();
    let loading = this.ud.isHomePageLoading();
    let attempts = this.ud.getLoadAttempts();
    if (!this.ud.isAppLoaded()) {
      Log.l("HOMEPAGE.ionViewDidEnter() SAYS QUIT TRYING TO DUAL LOAD!");
    } else {
      if(this.justLoggedIn) {
        this.justLoggedIn = false;
        this.newLoginSetup().then(res => {
          this.runEveryTime();
          Log.l("HomePage: Done loading in ionViewDidEnter().");
        }).catch(err => {
          Log.l("HomePage: Error after new login!");
          Log.e(err);
          let errMessage = err;
          if(err && err.message) {
            errMessage = err.message;
          }
          let msg = sprintf(lang['startup_error'], errMessage)
          this.alert.showConfirmYesNo(lang['error'], msg).then(res => {
            if(res) {
              this.ud.reloadApp();
            }
          });
        });
      } else {
        this.runEveryTime();
      }
    }
    if(loaded) {
      // if(!ready && !loading) {
        // this.runEveryTime();
      // } else {
        // this.dataReady = true;
      // }
      // else {
      //   if (!this.pageError && attempts < 20) {
      //     setTimeout(() => {
      //       Log.l("HomePage attempting reload attempt %d.", attempts);
      //       this.ud.setLoadAttempts(attempts + 1);
      //       this.ionViewDidEnter();
      //     }, 1500);
      //   } else {
      //     this.pageError = true;
      //   }

      // }
    } else {
      // Log.l("HomePage.ionViewDidEnter(): PREMATURE ELOADULATION DETECTED!");
      // if(!this.pageError && attempts < 20) {
      //   setTimeout(() => {
      //     Log.l("HomePage attempting reload attempt %d.", attempts);
      //     this.ud.setLoadAttempts(attempts+1);
      //     this.ionViewDidEnter();
      //   }, 1500);
      // } else {
      //   this.alert.showAlert(this.lang['error'], this.lang['alet_retrieve_reports_error'])
      // }
    }
    //  else if(loaded && ready) {
    //   // this.dataReady = true;
    // } else {
      // Log.l("HomePage.ionViewDidEnter(): EXTRA LARGE LOAD DETECTED");
    // }
    // this.runEveryTime();
    // }
  }

  ionViewDidLoad() {
    Log.l("HomePage: ionViewDidLoad() called... not doing anything right now.");
    // this.dataReady = false;
    // if(this.ud.isAppLoaded()) {
    //   this.runEveryTime();
    // }
    // this.
  }

  public runEveryTime() {
    // try {
      // let lang = this.translate.instant(['error', 'alert_retrieve_reports_error'])
    this.dataReady = false;
    this.ud.setHomePageLoading(true);
    this.ud.setHomePageReady(true);
    let lang = this.lang;
    if (this.ud.getLoginStatus() === false) {
      Log.l("HomePage.runEveryTime(): User not logged in, showing login modal.");
      this.presentLoginModal();
    } else if(this.justLoggedIn) {
      this.justLoggedIn = false;
      this.newLoginSetup().then(res => {
        Log.l("HomePage: Done loading in ionViewDidEnter().");
        this.ifLoggedInAndAlreadySetUp();
      }).catch(err => {
        Log.l("HomePage: Error after new login!");
        Log.e(err);
        let errMessage = err;
        if (err && err.message) {
          errMessage = err.message;
        }
        let msg = sprintf(lang['startup_error'], errMessage)
        this.alert.showConfirmYesNo(lang['error'], msg).then(res => {
          if (res) {
            this.ud.reloadApp();
          }
        });
      });
    } else {
      this.ifLoggedInAndAlreadySetUp();
    }
  }

  public ifLoggedInAndAlreadySetUp() {
    let lang = this.lang;
    this.ud.setHomePageLoading(true);
    Log.l("HomePage.runEveryTime(): Fetching work orders.");
    this.fetchTechReports().then((res) => {
      this.techProfile = this.ud.getTechProfile();
      this.shifts = this.ud.getPeriodShifts();
      HomePage.homePageStatus.startupFinished = true;
      this.ud.setHomePageReady(true);
      // this.watchScroll();
      // this.dataReady = true;
      // this.alert.hideSpinner(0, true).then(res => {
      this.ud.setHomePageReady(true);
      HomePage.homePageStatus.startupFinished = true;
      // this.watchScroll();
      this.dataReady = true;
      this.tabServ.enableTabs();
      this.tabServ.setPageLoaded(Pages.OnSiteHome);
    }).catch(err => {
      Log.l("Error fetching tech work orders!");
      Log.e(err);
      // this.alert.hideSpinner();
      this.alert.showAlert(lang['error'], lang['alert_retrieve_reports_error']);
    });
  }

  public newLoginSetup() {
    return new Promise((resolve,reject) => {
      let profile = this.ud.getTechProfile();
      let tech = new Employee();
      tech.readFromDoc(profile);
      this.tech = tech;
      this.server.getAllData(this.tech).then(res => {
        this.ud.setData(res);
        Log.l("newLoginSetup(): Got all data.");
        return this.server.getAllConfigData();
      }).then(res => {
        Log.l("checkLogin(): Successfully retrieved config data...");
        this.ud.setSesaConfig(res);
        return this.ud.checkPhoneInfo();
      }).then(res => {
        let tech = this.tech;
        let phoneInfo = res;
        let pp = this.ud.createPayrollPeriods(tech, this.prefs.getPayrollPeriodCount());
        if(phoneInfo) {
          Log.l("newLoginSetup(): Got phone data:\n", phoneInfo);
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
      });
    });
  }

  public runAfterTranslation() {
  }

  public generateLegend() {
    let legend:Array<Array<string>> = [];
    legend = [
      [ 'T', 'key_training'            ],
      [ 'Q', 'key_travel'              ],
      [ 'M', 'key_training_and_travel' ],
      [ 'S', 'key_standby_duncan'      ],
      [ 'E', 'key_sick_day_or_hours'   ],
      [ 'H', 'key_holiday'             ],
    ];
    this.legend = legend;
    return legend;
  }

  // runWhenReady() {
  //   Log.l("HomePage: app finished loading. Now, checking user login status.");
  //   if (this.ud.getLoginStatus()) {
  //     Log.l("HomePage: user logged in, fetching work orders.");
  //     this.fetchTechReports().then((res) => {
  //       Log.l("HomePage: fetched work orders, maybe:\n", res);
  //       this.ud.createShifts();
  //       this.shifts = this.ud.getPeriodShifts();
  //       HomePage.pageLoadedPreviously = true;
  //       this.events.publish('pageload:finished', this.ud.getLoginStatus());
  //     });
  //   } else {
  //     Log.l("HomePage: user not authorized in ionViewDidLoad(). Guess ionViewDidEnter() can present a login modal.");
  //   }
  // }

  public static async waitForStartupEvent() {
    try {
      let val = await this.checkStartupStatus();
    } catch(err) {
      Log.l("waitForStartupEvent(): Error while awaiting event!");
      Log.e(err);
    }
  }

  public static checkStartupStatus() {

  }

  public checkStartupStatus() {
    return HomePage.checkStartupStatus();
  }

  public fetchTechReports():Promise<Array<any>> {
    let techid = this.ud.getCredentials().user;
    return new Promise((resolve,reject) => {
      this.server.getReportsForTech(techid).then((res:Array<Report>) => {
        Log.l(`HomePage: getReportsForTech(${techid}): Success! Result:\n`, res);
        for(let report of res) {
          this.ud.addNewReport(report);
        }
        // this.ud.setWorkOrderList(res);
        // this.techWorkOrders    = this.ud.getWorkOrderList();
        this.techWorkOrders = this.ud.getReportList();
        return this.server.getReportsOtherForTech(techid);
      }).then((res:Array<ReportOther>) => {
        for(let other of res) {
          this.ud.addNewOtherReport(other);
        }
        this.otherReports      = this.ud.getReportOtherList();
        let profile            = this.ud.getTechProfile();
        let tech               = new Employee();
        tech.readFromDoc(profile);
        this.tech              = tech;
        let now                = moment();
        this.payrollPeriods    = this.ud.getPayrollPeriods();
        Log.l("fetchTechReports(): Payroll periods created as:\n", this.payrollPeriods);
        for(let period of this.payrollPeriods) {
          for(let shift of period.shifts) {
            // let reports = new Array<Report>();
            // for(let report of this.techWorkOrders) {
            //   if(report.report_date === shift.start_time.format("YYYY-MM-DD")) {
            //     reports.push(report);
            //   }
            // }
            // let otherReports = new Array<ReportOther>();
            // for(let other of this.otherReports) {
            //   if(other.report_date.format("YYYY-MM-DD") === shift.start_time.format("YYYY-MM-DD")) {
            //     otherReports.push(other);
            //   }
            // }
            // shift.setShiftReports(reports);
            // shift.setOtherReports(otherReports);
            let shiftDay     = shift.start_time.isoWeekday()      ;
            let ppIndex      = (shiftDay + 4) % 7                 ;
            let sites        = this.ud.getData('sites')           ;
            let techClient   = tech.client.toUpperCase().trim()   ;
            let techLocation = tech.location.toUpperCase().trim() ;
            let techLocID    = tech.locID.toUpperCase().trim()    ;
            // let techLoc2nd   = typeof tech.loc2nd === 'string' ? tech.loc2nd.toUpperCase().trim() : "";
            let rotation     = tech.rotation && typeof tech.rotation === 'string' ? tech.rotation : "CONTN WEEK";
            tech.rotation    = rotation;
            innerloop:
            for(let site of sites) {
              let clientName   = site.client.name.toUpperCase()       ;
              let clientFull   = site.client.fullName.toUpperCase()   ;
              let locationName = site.location.name.toUpperCase()     ;
              let locationFull = site.location.fullName.toUpperCase() ;
              let locIDName    = site.locID.name.toUpperCase()        ;
              let locIDFull    = site.locID.fullName.toUpperCase()    ;
              if((techClient === clientName || techClient === clientFull) && (techLocation === locationName || techLocation === locationFull) && (techLocID === locIDName || techLocID === locIDFull)) {
                let times             = site.getShiftStartTimes()                   ;
                let shiftType         = tech.shift                                  ;
                let shiftRotation     = tech.rotation                               ;
                let hoursList         = site.getHoursList(shiftRotation, shiftType) ;
                let shiftLengthString = hoursList[ppIndex]                          ;
                let shiftLength;
                if(isNaN(Number(shiftLengthString))) {
                  shiftLength = shiftLengthString;
                } else {
                  shiftLength = Number(shiftLengthString);
                }
                shift.setShiftLength(shiftLength);
                let startTimeString = times[shiftType]            ;
                let xl              = shift.shift_id              ;
                let startTime       = moment().fromExcel(xl)      ;
                let hrsMins         = startTimeString.split(":")  ;
                let hrs             = hrsMins[0]                  ;
                let min             = hrsMins[1]                  ;
                startTime.hours(hrs).minutes(min)                 ;
                shift.setStartTime(startTime)                     ;
                break innerloop;
              }
            }
          }
        }
        let prd = this.ud.getHomePeriod();
        if(prd) {
          let i = this.payrollPeriods.indexOf(prd);
          if(i > -1) {
            Log.l("fetchTechReports(): Found payroll period at index %d.", i);
            this.period = this.payrollPeriods[i];
            this.ud.setHomePeriod(this.period);
          } else {
            Log.l("fetchTechReports(): Payroll periods not found.");
            this.period = prd;
            this.ud.setHomePeriod(this.period);
          }
        } else {
          Log.l("fetchTechReports(): HomePage payroll period will be:\n", this.payrollPeriods[0]);
          this.period = this.payrollPeriods[0];
          this.ud.setHomePeriod(this.period);
        }
        Log.l("fetchTechReports(): Got payroll periods and all work orders:\n", this.payrollPeriods);
        Log.l(this.techWorkOrders);
        Log.l(this.otherReports);
        resolve(this.techWorkOrders);
      }).catch((err) => {
        Log.l(`HomePage: getReportsForTech(${techid}): Error!`);
        Log.e(err);
        reject(err);
      });
    });
  }

  public isAuthorized() {
    Log.l("HomePage.isAuthorized(): Checking auth status...");
    let authorized = Boolean( this.loginData !== undefined
                              && this.loginData !== null
                              && typeof this.loginData.user === 'string'
                              && typeof this.loginData.pass === 'string'
                              && this.loginData.user !== ''
                              && this.loginData.pass !== '');
    Log.l("HomePage.isAuthorized(): Auth status is: ", authorized);
    return authorized;
  }

  public isLoggedIn() {
    Log.l("HomePage.isLoggedIn(): Checking login status...");
    let loggedin = Boolean( this.isAuthorized() && this.userLoggedIn );
    Log.l("HomePage.isLoggedIn(): Login status: ", loggedin);
    return loggedin;
  }

  public presentLoginModal() {
    this.tabServ.goToPage('Login');
  }

  public getCheckboxSVG(shift:Shift) {
    let checkBox = '?';
    let chks = this.checkboxSVG;
    let status = shift.getShiftStatus();
    if(status === "hoursComplete") {
      checkBox = "box-check-yes";
    } else if(status === "hoursUnder") {
      checkBox = "box-check-no";
    } else if(status === "hoursOver") {
      checkBox = "flag-checkered";
    } else {
      checkBox = "box-check-no";
    }
    return chks[Icons[checkBox]];
  }

  public getCheckbox(idx:number) {
    let checkBox = '?';
    let hours = this.hoursTotalList[idx];
    let total = this.techProfile.shiftLength;

    if(hours > total) {
      checkBox = '⚐';
    } else if(hours < total) {
      checkBox = '✖';
    } else {
      checkBox = '✔';
    }
    return checkBox;
  }

  public showHelp(event:any) {
    this.audio.play('help');
    let params = { cssClass: 'popover-template', showBackdrop: true, enableBackdropDismiss: true, ev: event };
    let popup = this.popoverCtrl.create('Popover', {contents: 'home_app_help_text'}, params);
    popup.onDidDismiss(data => {
      Log.l("HomePage.showHelp(): Got back:\n", data);
    });
    popup.present();
  }

  public presentUserModal() {
    let TechSettings = this.modalCtrl.create('User', { mode: 'modal' });
    TechSettings.present();
  }

  public showShiftReports(shift:Shift) {
    if(shift.getAllShiftReports().length > 0) {
      this.tabServ.goToPage('ReportHistory', {mode: 'Shift', shift: shift, payroll_period: this.period});
    } else {
      this.tabServ.goToPage('Report View', {mode: 'Add', shift: shift, payroll_period: this.period});
    }
  }

  public possibleSound(shift:Shift) {
    let status = shift.getShiftStatus();
    if(status === 'hoursOver') {
      this.audio.play('overtime');
    }
  }

  public changedPayrollPeriod(period:PayrollPeriod) {
    Log.l("changedPayrollPeriod(): Payroll period changed to:\n", period);
    this.ud.setHomePeriod(this.period);
  }

  public legendClick(item:Array<string>, evt?:any) {
    Log.l(`legendClick(): Clicked on item:\n`, item);
    let code = item[0];
    let text = item[1];
    this.alert.showToast("Not implemented yet", 1500);
  }

  public toggleClock(event?:any) {
    Log.l("toggleClock(): Event is:\n", event);
    let now = moment();
    if(this.dataReady === true) {
    }
    this.dataReady = !this.dataReady;
    this.ud.showClock = !this.ud.showClock;
  }

}
