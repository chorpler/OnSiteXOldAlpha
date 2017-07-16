import { Component, OnInit, Input, NgZone, ViewChild      } from '@angular/core'                 ;
import { Http                                             } from '@angular/http'                 ;
import { DomSanitizer                                     } from '@angular/platform-browser'     ;
import { trigger, state, style, animate, transition       } from '@angular/animations'           ;
import { TranslateService                                 } from '@ngx-translate/core'           ;
import { Pipe, PipeTransform                              } from '@angular/core'                 ;
import { Platform, IonicPage, NavParams, Events           } from 'ionic-angular'                 ;
import { NavController, ToastController                   } from 'ionic-angular'                 ;
import { ModalController,ViewController,PopoverController } from 'ionic-angular'                 ;
import { Log, moment, isMoment, Moment                    } from '../../config/config.functions' ;
import { DBSrvcs                                          } from '../../providers/db-srvcs'      ;
import { AuthSrvcs                                        } from '../../providers/auth-srvcs'    ;
import { SrvrSrvcs                                        } from '../../providers/srvr-srvcs'    ;
import { AlertService                                     } from '../../providers/alerts'        ;
import { UserData                                         } from '../../providers/user-data'     ;
import { WorkOrder                                        } from '../../domain/workorder'        ;
import { ReportOther                                      } from '../../domain/reportother'      ;
import { Shift                                            } from '../../domain/shift'            ;
import { PayrollPeriod                                    } from '../../domain/payroll-period'   ;
import { Employee                                         } from '../../domain/employee'         ;
import { TabsComponent                                    } from '../../components/tabs/tabs'    ;
import { STRINGS                                          } from '../../config/config.strings'   ;
import { Preferences                                      } from '../../providers/preferences'   ;
import { SafePipe                                         } from '../../pipes/safe'              ;
import { SmartAudio                                       } from '../../providers/smart-audio'   ;

enum Icons {
  'box-check-no'   = 0,
  'box-check-yes'  = 1,
  'flag-blank'     = 2,
  'flag-checkered' = 3,
  'unknown'        = 4,
}

@IonicPage({
  name: 'OnSiteHome'
})
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
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
  static techWorkOrders              : Array<WorkOrder>   = []                  ;
  static shiftWorkOrders             : Array<WorkOrder>   = []                  ;
  static payrollWorkOrders           : Array<WorkOrder>   = []                  ;
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
  static hands                       : any        = UserData.getClockHands()    ;
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
  public techWorkOrders              : Array<WorkOrder>    = HomePage.techWorkOrders;
  public shiftWorkOrders             : Array<WorkOrder>    = HomePage.shiftWorkOrders;
  public payrollWorkOrders           : Array<WorkOrder>    = HomePage.payrollWorkOrders;
  public otherReports                : Array<ReportOther>  = HomePage.otherReports;
  public hoursTotalList              : Array<any>    = []  = HomePage.hoursTotalList;
  public shifts                      : Array<Shift>  = []  = HomePage.shifts;
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
  public hands                       : any                 = HomePage.hands  ;
  public translations                : Array<string>       = HomePage.translations;

  constructor(public http        : Http,
              public platform    : Platform,
              public navCtrl     : NavController,
              public modalCtrl   : ModalController,
              public viewCtrl    : ViewController ,
              public popoverCtrl : PopoverController,
              public authService : AuthSrvcs,
              public navParams   : NavParams,
              public server      : SrvrSrvcs,
              public ud          : UserData,
              public db          : DBSrvcs,
              public events      : Events,
              public tabs        : TabsComponent,
              public alert       : AlertService,
              public zone        : NgZone,
              public translate   : TranslateService,
              public audio       : SmartAudio,
  ) {
    window["onsitehome"] = window["onsitehome"] ? window["onsitehome"] : this;
    Log.l("HomePage: Hi, I'm the HomePage class constructor!");
    let translations = [
      'error',
      'alet_retrieve_reports_error',
      'spinner_fetching_reports'
    ];
    HomePage.translations = translations;
    this.translations = HomePage.translations;
    // this.lang = this.translate.instant(translations);
    if(!this.lang) {
      this.translate.get(this.translations).subscribe((result: any) => {
        this.lang = result;
      });
    }
    HomePage.EVENTS = events;
    var caller = this;
    this.dataReady = false;
    if(!this.ud.isAppLoaded()) {
      Log.l("HOMEPAGE SAYS DON'T LOAD ME YET, D-BAG!");
    }
    if(HomePage.startupHandler === undefined || HomePage.startupHandler === null) {
      HomePage.startupHandler = (homepage: any) => {
        Log.l("HomePage.startupHandler(): startup:finished event detected. Target is:\n", homepage);
        Log.l("HomePage.startupHandler(): now unsubscribing from startup:finished event...");
        HomePage.EVENTS.unsubscribe('startup:finished', HomePage.startupHandler);
        HomePage.homePageStatus.startupFinished = true;
        Log.l("HomePage.startupHandler(): now executing runEveryTime() function...");
        if(!this.ud.isHomePageReady()) {
          if(!this.ud.isHomePageLoading()) {
            Log.l("HomePage: Loading from ");
            this.runEveryTime();
          } else {
            Log.l("HomePage: Stop trying to dual-load!");
          }
        } else {
          // this.dataReady = true;
          Log.l("HomePage: stop trying to load prematurely!")
        }
        // caller.translate.get().subscribe(result => {
        //   caller.spinnerText = result;
        //   caller.runEveryTime();
        // });
      };
    }
    if(HomePage.homePageStatus.startupFinished === false) {
      this.events.subscribe('startup:finished', HomePage.startupHandler);
    }
  }

  ionViewDidEnter() {
    Log.l("HomePage: ionViewDidEnter() called. First wait to make sure app is finished loading.");
    var caller = this;
    // if(HomePage.homePageStatus.startupFinished) {
    // Log.l("HomePage.ionViewDidEnter(): startup already finished, just continuing with runEveryTime()...");
    this.tabs.highlightPageTab('OnSiteHome');
    let loaded = this.ud.isAppLoaded();
    let ready = this.ud.isHomePageReady();
    let loading = this.ud.isHomePageLoading();
    let attempts = this.ud.getLoadAttempts();
    if (!this.ud.isAppLoaded()) {
      Log.l("HOMEPAGE.ionViewDidEnter() SAYS DON'T LOAD ME YET, D-BAG!");
    } else {
      this.runEveryTime();
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

  runEveryTime() {
    // try {
      // let lang = this.translate.instant(['error', 'alert_retrieve_reports_error'])
      this.dataReady = false;
      this.ud.setHomePageLoading(true);
      this.ud.setHomePageReady(true);
      let lang = this.lang;
      if (this.ud.getLoginStatus() === false) {
        Log.l("HomePage.runEveryTime(): User not logged in, showing login modal.");
        this.presentLoginModal();
      } else {
        this.ud.setHomePageLoading(true);
        Log.l("HomePage.runEveryTime(): Fetching work orders.");
        // this.fixedHeight = this.mapElement.nativeElement.offsetHeight;
        // this.alert.showSpinner(lang['spinner_fetching_reports']);
        this.fetchTechWorkorders().then((res) => {
          this.techProfile = this.ud.getTechProfile();
          this.shifts = this.ud.getPeriodShifts();
          // this.countHoursForShifts();
          HomePage.homePageStatus.startupFinished = true;
          this.ud.setHomePageReady(true);
          this.dataReady = true;
          // this.alert.hideSpinner(0, true).then(res => {
            this.ud.setHomePageReady(true);
            HomePage.homePageStatus.startupFinished = true;
            this.dataReady = true;
          // }).catch(err => {
          //   Log.l("Error hiding spinner!");
          //   HomePage.homePageStatus.startupFinished = true;
          //   this.ud.setHomePageReady(true);
          //   this.dataReady = true;
        // }).catch((err) => {
        //   Log.l("HomePage: ionViewDidEnter() got error while fetching tech work orders.");
        //   Log.e(err);
        //   this.pageError = true;
        //   this.alert.hideSpinner(0, true).then(res => {
        //     this.alert.showAlert(lang['error'], lang['alert_retrieve_reports_error']);
        //   }).catch(err => {
        //     Log.l("Error hiding spinner again!");
        //     Log.e(err);
        //     this.pageError = true;
        //   });
        // });
      }).catch(err => {
        Log.l("Error fetching tech work orders!");
        Log.e(err);
        // this.alert.hideSpinner();
        this.alert.showAlert(lang['error'], lang['alert_retrieve_reports_error']);
      });
    // } catch(err) {
    //   this.alert.hideSpinner();
    //   let lang = this.translate.instant(['error', 'alert_retrieve_reports_error'])
    //   this.alert.showAlert(lang['error'], lang['alert_retrieve_reports_error']);
    // }
    }
  }

  public runAfterTranslation() {
  }

  // runWhenReady() {
  //   Log.l("HomePage: app finished loading. Now, checking user login status.");
  //   if (this.ud.getLoginStatus()) {
  //     Log.l("HomePage: user logged in, fetching work orders.");
  //     this.fetchTechWorkorders().then((res) => {
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

  static checkStartupStatus() {

  }

  checkStartupStatus() {
    return HomePage.checkStartupStatus();
  }

  fetchTechWorkorders():Promise<Array<any>> {
    let techid = this.ud.getCredentials().user;
    return new Promise((resolve,reject) => {
      this.server.getReportsForTech(techid).then((res:Array<WorkOrder>) => {
        Log.l(`HomePage: getReportsForTech(${techid}): Success! Result:\n`, res);
        for(let report of res) {
          this.ud.addNewReport(report);
        }
        // this.ud.setWorkOrderList(res);
        this.techWorkOrders    = this.ud.getWorkOrderList();
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
        // let payrollPeriod      = this.ud.getPayrollPeriodForDate(now);
        // this.payrollPeriods    = this.ud.createPayrollPeriods(tech, this.payrollPeriodCount);
        this.payrollPeriods    = this.ud.getPayrollPeriods();
        Log.l("fetchTechWorkorders(): Payroll periods created as:\n", this.payrollPeriods);
        for(let period of this.payrollPeriods) {
          for(let shift of period.shifts) {
            // let reports = new Array<WorkOrder>();
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
            let techLoc2nd   = typeof tech.loc2nd === 'string' ? tech.loc2nd.toUpperCase().trim() : "";
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
              let loc2Name     = site.loc2nd && typeof site.loc2nd === 'object' ? site.loc2nd.name.toUpperCase() : "NA";
              let loc2Full     = site.loc2nd && typeof site.loc2nd === 'object' ? site.loc2nd.fullName.toUpperCase() : "N/A";
              if((techClient === clientName || techClient === clientFull) && (techLocation === locationName || techLocation === locationFull) && (techLocID === locIDName || techLocID === locIDFull) && (techLoc2nd === loc2Name || techLoc2nd === loc2Full)) {
                // Log.l("User is at site '%s', site object is:", site.getSiteName());
                // Log.l(site);
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
            Log.l("fetchTechWorkOrders(): Found payroll period at index %d.", i);
            this.period = this.payrollPeriods[i];
            this.ud.setHomePeriod(this.period);
          } else {
            Log.l("fetchTechWorkOrders(): Payroll periods not found.");
            this.period = prd;
            this.ud.setHomePeriod(this.period);
          }
          // for(let period of this.payrollPeriods) {
          //   if(period.serial_number === prd.serial_number) {
          //     this.period = period;
          //     break;
          //   }
          // }
        } else {
          Log.l("fetchTechWorkOrders(): HomePage payroll period will be:\n", this.payrollPeriods[0]);
          this.period            = this.payrollPeriods[0];
          this.ud.setHomePeriod(this.period);
        }
        Log.l("fetchTechWorkOrders(): Got payroll periods and all work orders:\n", this.payrollPeriods);
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

  isAuthorized() {
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

  isLoggedIn() {
    Log.l("HomePage.isLoggedIn(): Checking login status...");
    let loggedin = Boolean( this.isAuthorized() && this.userLoggedIn );
    Log.l("HomePage.isLoggedIn(): Login status: ", loggedin);
    return loggedin;
  }

  // countHoursForShifts() {
  //   if(this.shifts && this.shifts.length) {
  //     this.hoursTotalList = [];
  //     for(let shift of this.shifts) {
  //       let hours = this.ud.getTotalHoursForShift(shift.getShiftSerial());
  //       this.hoursTotalList.push(hours);
  //     }
  //   }
  //   let thisPayPeriod = this.ud.getPayrollPeriodForDate(moment());
  //   this.payrollPeriodHours = this.ud.getTotalHoursForPayrollPeriod(thisPayPeriod);
  //   this.payrollPeriodBonusHours = this.ud.getPayrollHoursForPayrollPeriod(thisPayPeriod);
  // }

  presentLoginModal() {
    let loginPage = this.modalCtrl.create('Login', {user: '', pass: ''}, { enableBackdropDismiss: false, cssClass: 'login-modal'});
    loginPage.onDidDismiss(data => {
      Log.l("Got back:\n", data);
      this.userLoggedIn = this.ud.getLoginStatus();
      if( this.userLoggedIn ) {
        console.log("Login Modal succeeded, now opening user modal.");
        // this.userLoggedIn = true;
        this.presentUserModal(); }
      else { console.log("Login Modal did not succeed."); }
    });
    loginPage.present();
  }

  getCheckboxSVG(shift:Shift) {
    let checkBox = '?';
    let chks = this.checkboxSVG;
    let status = shift.getShiftStatus();
    // if(status) {
    //   let hours = shift.getNormalHours();
    //   if(hours !== status) {
    //     return chks[Icons['box-check-no']];
    //   } else {
    //     return chks[Icons["box-check-yes"]];
    //   }
    // } else {
      // let hours = shift.getNormalHours();
      // let total = shift.getShiftLength();
      // if (hours > total) {
      //   checkBox = chks[Icons["flag-checkered"]];
      // } else if (hours < total) {
      //   checkBox = chks[Icons["box-check-no"]];
      // } else {
      //   checkBox = chks[Icons["box-check-yes"]];
      // }
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
    // }
  }

  getCheckbox(idx:number) {
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

  showHelp(event:any) {
    this.audio.play('help');
    let params = { cssClass: 'popover-template', showBackdrop: true, enableBackdropDismiss: true, ev: event };
    let pup = this.popoverCtrl.create('Popover', {contents: 'home_app_help_text'}, params);
    pup.onDidDismiss(data => {
      Log.l("HomePage.showHelp(): Got back:\n", data);
    });
    pup.present();
  }

  presentUserModal() {
    let TechSettings = this.modalCtrl.create('User', { mode: 'modal' });
    TechSettings.present();
  }

  showShiftReports(shift:Shift) {
    if(shift.getAllShiftReports().length > 0) {
      this.tabs.goToPage('ReportHistory', {mode: 'Shift', shift: shift, payroll_period: this.period});
    } else {
      this.tabs.goToPage('Report', {mode: 'Add', shift: shift, payroll_period: this.period});
    }
    // if(this.ud.getWorkOrdersForShift(shift.getShiftSerial()).length > 0) {
    //   this.tabs.goToPage('ReportHistory', {mode: 'Shift', shift: shift, payroll_period: this.period});
    // } else {
    //   this.tabs.goToPage('Report', {mode: 'Add', shift: shift, payroll_period: this.period});
    // }
  }

  possibleSound(shift:Shift) {
    let status = shift.getShiftStatus();
    if(status === 'hoursOver') {
      this.audio.play('overtime');
    }
  }

  changedPayrollPeriod(period:PayrollPeriod) {
    Log.l("changedPayrollPeriod(): Payroll period changed to:\n", period);
    this.ud.setHomePeriod(this.period);
  }

  toggleClock() {
    let now = moment();
    this.ud.updateClock(now);
    this.dataReady = !this.dataReady;
    let hpr = this.ud.isHomePageReady();
    this.ud.setHomePageReady(!hpr);
  }

}
