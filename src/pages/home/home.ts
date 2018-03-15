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
import { Log, moment, isMoment, Moment                    } from 'domain/onsitexdomain'      ;
import { DBService                                        } from 'providers/db-service'      ;
import { AuthSrvcs                                        } from 'providers/auth-srvcs'      ;
import { ServerService                                    } from 'providers/server-service'  ;
import { AlertService                                     } from 'providers/alerts'          ;
import { UserData                                         } from 'providers/user-data'       ;
import { Report                                           } from 'domain/onsitexdomain'      ;
import { ReportOther                                      } from 'domain/onsitexdomain'      ;
import { Shift                                            } from 'domain/onsitexdomain'      ;
import { PayrollPeriod                                    } from 'domain/onsitexdomain'      ;
import { Employee                                         } from 'domain/onsitexdomain'      ;
import { TabsService                                      } from 'providers/tabs-service'    ;
import { Preferences                                      } from 'providers/preferences'     ;
import { Vibration                                        } from '@ionic-native/vibration'   ;
import { SafePipe                                         } from 'pipes/safe'                ;
import { SmartAudio                                       } from 'providers/smart-audio'     ;
import { STRINGS                                          } from 'domain/onsitexdomain'      ;
import { Icons, Pages                                     } from 'domain/onsitexdomain'      ;
import { OnSiteApp                                        } from 'app/app.component'         ;

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
  public pauseSubscription           : Subscription                                   ;
  public resumeSubscription          : Subscription                                   ;
  public resizeSubscription          : Subscription                                   ;
  public translateSubscription       : Subscription                                   ;

  constructor(
    public http        : HttpClient        ,
    public platform    : Platform          ,
    public navCtrl     : NavController     ,
    public modalCtrl   : ModalController   ,
    public viewCtrl    : ViewController    ,
    public popoverCtrl : PopoverController ,
    public authService : AuthSrvcs         ,
    public navParams   : NavParams         ,
    public server      : ServerService     ,
    public ud          : UserData          ,
    public db          : DBService         ,
    public events      : Events            ,
    public tabServ     : TabsService       ,
    public alert       : AlertService      ,
    public zone        : NgZone            ,
    public translate   : TranslateService  ,
    public audio       : SmartAudio        ,
    public app         : OnSiteApp         ,
    public vibration   : Vibration         ,
  ) {
    window["onsitehome"] = window["onsitehome"] ? window["onsitehome"] : this;
    Log.l("HomePage: Hi, I'm the HomePage class constructor!");
  }

  ngOnInit() {
    Log.l("HomePage: ngOnInit() fired");
    if(this.ud.isAppLoaded()) {
      this.installSubscribers();
      this.runWhenReady();
    }
  }

  ngOnDestroy() {
    Log.l("HomePage: ngOnDestroy() fired");
    this.uninstallSubscribers();
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
    this.dataReady = false;
  }

  public installSubscribers() {
    let translations = [
      'error',
      'startup_error',
      'loading_work_reports',
      'spinner_fetching_reports',
      'alert_retrieve_reports_error',
      'function_in_development',
      'tap_to_hide_clock',
    ];
    HomePage.translations = translations;
    this.translations = HomePage.translations;
    this.translateSubscription = this.translate.get(this.translations).subscribe((result:any) => {
      this.lang = result;
    });

    this.pauseSubscription = this.platform.pause.subscribe(() => {
      Log.l(`OnSiteX app paused!`);
    });
    this.resumeSubscription = this.platform.resume.subscribe(() => {
      Log.l(`OnSiteX app resumed!`);
    });
    this.resizeSubscription = this.platform.resize.subscribe(() => {
      Log.l(`OnSiteX app resized!`);
    });
  }

  public uninstallSubscribers() {
    if(this.translateSubscription && !this.translateSubscription.closed) {
      this.translateSubscription.unsubscribe();
    }
    if(this.pauseSubscription && !this.pauseSubscription.closed) {
      this.pauseSubscription.unsubscribe();
    }
    if(this.resumeSubscription && !this.resumeSubscription.closed) {
      this.resumeSubscription.unsubscribe();
    }
    if(this.resizeSubscription && !this.resizeSubscription.closed) {
      this.resizeSubscription.unsubscribe();
    }
  }

  public runWhenReady() {
    Log.l("HomePage: ionViewDidEnter() called. First wait to make sure app is finished loading.");
    this.generateLegend();
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
    this.checkLoginStatus();
  }

  public async checkLoginStatus() {
    try {
      let lang = this.lang;
      let tech:Employee = this.ud.getTechProfile();
      this.tech = tech;

      // if(this.justLoggedIn) {
      //   this.justLoggedIn = false;
        try {
          let res:any;
          // let res:any = await this.newLoginSetup();
          res = await this.ifLoggedInAndAlreadySetUp();
        } catch(err) {
          Log.l("HomePage: Error after new login!");
          Log.e(err);
          let errMessage = err;
          if(err && err.message) {
            errMessage = err.message;
          }
          let msg = sprintf(lang['startup_error'], errMessage)
          let restart = await this.alert.showConfirmYesNo(lang['error'], msg);
          if(restart) {
            this.ud.reloadApp();
          }
          return false;
        }
      // } else {
      //   this.ifLoggedInAndAlreadySetUp();
      //   return true;
      // }
    } catch(err) {
      Log.l(`checkLoginStatus(): Error during check for user logged in!`);
      Log.e(err);
      throw new Error(err);
    }
  }

  public async ifLoggedInAndAlreadySetUp() {
    let lang = this.lang;
    let spinnerID;
    try {
      this.ud.setHomePageLoading(true);
      // let res:any = await this.fetchTechReports();
      let profile = this.ud.getTechProfile();
      let tech:Employee = new Employee();
      tech.readFromDoc(profile);
      this.techProfile = profile;
      this.tech = tech;
      Log.l("ifLoggedInAndAlreadySetUp(): Now attempting to get all data for user:\n", tech);
      let res:any = await this.db.getAllData(this.tech);
      Log.l("ifLoggedInAndAlreadySetUp(): Got all data, result:\n", res);
      this.ud.setData(res);
      Log.l("ifLoggedInAndAlreadySetUp(): Fetching work orders.");
      spinnerID = await this.alert.showSpinnerPromise(lang['loading_work_reports']);
      res = await this.fetchTechReports();
      Log.l("ifLoggedInAndAlreadySetUp(): Got tech reports, result:\n", res);
      Log.l(`ifLoggedInAndAlreadySetUp(): Payroll periods currently:\n`, this.payrollPeriods);
      this.shifts = this.ud.getPeriodShifts();
      HomePage.homePageStatus.startupFinished = true;
      this.ud.setHomePageReady(true);
      // this.watchScroll();
      // this.dataReady = true;
      // this.alert.hideSpinner(0, true).then(res => {
      // this.ud.setHomePageReady(true);
      HomePage.homePageStatus.startupFinished = true;
      // this.watchScroll();
      spinnerID = await this.alert.hideSpinnerPromise(spinnerID);
      this.tabServ.setPageLoaded(Pages.OnSiteHome);
      this.tabServ.enableTabs();
      this.dataReady = true;
      return true;
    } catch(err) {
      spinnerID = await this.alert.hideSpinnerPromise(spinnerID);
      Log.l(`ifLoggedInAndAlreadySetUp(): Error in post-login startup!`);
      Log.e(err);
      let res:any = this.alert.showAlert(lang['error'], lang['alert_retrieve_reports_error']);
      return false;
      // throw new Error(err);
    }
  }

  // public async newLoginSetup() {
  //   try {
  //     let profile = this.ud.getTechProfile();
  //     let tech = new Employee();
  //     tech.readFromDoc(profile);
  //     this.tech = tech;
  //     let res:any = await this.db.getAllData(this.tech);
  //     this.ud.setData(res);
  //     Log.l("newLoginSetup(): Got all data.");
  //     res = await this.db.getAllConfigData();
  //     Log.l("checkLogin(): Successfully retrieved config data...");
  //     this.ud.setSesaConfig(res);
  //     res = await this.ud.checkPhoneInfo();
  //     let phoneInfo = res;
  //     // let pp = this.ud.createPayrollPeriods(tech, this.prefs.getUserPayrollPeriodCount());
  //     if(phoneInfo) {
  //       try {
  //         Log.l("newLoginSetup(): Got phone data:\n", phoneInfo);
  //         res = await this.server.savePhoneInfo(tech, phoneInfo);
  //         return true;
  //       } catch(err) {
  //         Log.l("OnSite.bootApp(): Error saving phone info to server!");
  //         Log.e(err);
  //         return false;
  //       }
  //     } else {
  //       return true;
  //     }
  //   } catch(err) {
  //     Log.l(`newLoginSetup(): Error during new login startup!`);
  //     Log.e(err);
  //     throw new Error(err);
  //   }
  // }

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

  public async fetchTechReports():Promise<Array<any>> {
    let techid = this.ud.getCredentials().user;
    let res:Array<any> = [];
    try {
      let tech:Employee = this.tech;
      // let res:any = await this.server.getReportsForTech(techid);
      // res = await this.db.getReportsForTech(techid);
      // this.ud.setDataItem('reports', res);
      // Log.l(`HomePage: fetchTechReports(${techid}): Success! Result:\n`, res);
      // for(let report of res) {
        // this.ud.addNewReport(report);
      // }
      this.techWorkOrders = this.ud.getReportList();
      // res = await this.db.getReportsOtherForTech(techid);
      // this.ud.setDataItem('otherReports', res);
      // for(let other of res) {
        // this.ud.addNewOtherReport(other);
      // }
      this.otherReports      = this.ud.getReportOtherList();
      // let tech               = new Employee();
      // tech.readFromDoc(profile);
      // this.tech              = tech;
      let now                = moment();
      this.payrollPeriods    = this.ud.getPayrollPeriods();
      Log.l("fetchTechReports(): Payroll periods created as:\n", this.payrollPeriods);
      for(let period of this.payrollPeriods) {
        for(let shift of period.shifts) {
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
      if(prd && prd instanceof PayrollPeriod) {
        Log.l("fetchTechReports(): HomePage payroll period is set, checking for it:\n", prd);
        let periodDate = prd.start_date.format("YYYY-MM-DD")
        let i = this.payrollPeriods.findIndex((a:PayrollPeriod) => {
          // let period:PayrollPeriod = prd;
          return prd === a.start_date.format("YYYY-MM-DD");
        });
        // let i = this.payrollPeriods.indexOf(prd);
        if(i > -1) {
          Log.l("fetchTechReports(): Found payroll period at index %d.", i);
          this.period = this.payrollPeriods[i];
          this.ud.setHomePeriod(this.period);
        } else {
          Log.l("fetchTechReports(): Payroll periods not found.");
          // this.period = prd;
          // let pp = this.ud.createPayrollPeriods(this.tech);
          let pp:PayrollPeriod[] = this.ud.getPayrollPeriods() || [];
          let period = pp.find((a:PayrollPeriod) => {
            return a.start_date.format("YYYY-MM-DD") === periodDate;
          });
          this.payrollPeriods = pp;
          if(period) {
            this.period = period;
            this.ud.setHomePeriod(this.period);
          } else {
            let out:any = await this.alert.showAlert("ERROR", "Error determining payroll period");
          }
        }
      } else {
        Log.l("fetchTechReports(): HomePage payroll period will be:\n", this.payrollPeriods[0]);
        this.period = this.payrollPeriods[0];
        this.ud.setHomePeriod(this.period);
      }
      Log.l("fetchTechReports(): Got payroll periods and all work orders:\n", this.payrollPeriods);
      Log.l(this.techWorkOrders);
      Log.l(this.otherReports);
      let rpts:Report[] = this.ud.getData('reports');
      let othrs:ReportOther[] = this.ud.getData('otherReports');
      Log.l(rpts);
      Log.l(othrs);
      return this.techWorkOrders;
    } catch(err) {
      Log.l(`HomePage: getReportsForTech(${techid}): Error!`);
      Log.e(err);
      throw new Error(err);
    }
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
    // this.audio.play('help');
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
    this.ud.setHomePeriod(period);
  }

  public legendClick(item:Array<string>, evt?:any) {
    let lang = this.lang;
    Log.l(`legendClick(): Clicked on item:\n`, item);
    let code = item[0];
    let text = item[1];
    this.alert.showToast(lang['function_in_development'], 1500, 'middle');
  }

  public toggleClock(event?:any) {
    let lang = this.lang;
    Log.l("toggleClock(): Event is:\n", event);
    // this.dataReady = !this.dataReady;
    this.ud.showClock = !this.ud.showClock;
    this.vibration.vibrate([100, 200, 100, 70, 100, 70, 100, 120, 100, 500, 100, 150, 100]);
    if(this.ud.showClock) {
      this.app.clockCaption = lang['tap_to_hide_clock'];
    }
  }

}
