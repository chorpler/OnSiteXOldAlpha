import { Component, OnInit, NgZone                        } from '@angular/core'                 ;
import { Http                                             } from '@angular/http'                 ;
import { Platform, IonicPage, NavParams, Events           } from 'ionic-angular'                 ;
import { NavController, ToastController                   } from 'ionic-angular'                 ;
import { ModalController,ViewController,PopoverController } from 'ionic-angular'                 ;
import { Log                                              } from '../../config/config.functions' ;
import { DBSrvcs                                          } from '../../providers/db-srvcs'      ;
import { AuthSrvcs                                        } from '../../providers/auth-srvcs'    ;
import { SrvrSrvcs                                        } from '../../providers/srvr-srvcs'    ;
import { AlertService                                     } from '../../providers/alerts'        ;
import { UserData                                         } from '../../providers/user-data'     ;
import { WorkOrder                                        } from '../../domain/workorder'        ;
import { Shift                                            } from '../../domain/shift'            ;
import { PayrollPeriod                                    } from '../../domain/payroll-period'   ;
import { Employee                                         } from '../../domain/employee'         ;
import * as moment from 'moment'                                                                 ;
import { TabsComponent                                    } from '../../components/tabs/tabs'    ;
import { STRINGS                                          } from '../../config/config.strings'   ;
import { Preferences                                      } from '../../providers/preferences'   ;
import { TranslateService                                 } from '@ngx-translate/core'           ;
import { Pipe, PipeTransform                              } from '@angular/core'                 ;
import { DomSanitizer                                     } from '@angular/platform-browser'     ;
import { SafePipe                                         } from '../../pipes/safe'              ;

enum Icons {
  'box-check-no'   = 0,
  'box-check-yes'  = 1,
  'flag-blank'     = 2,
  'flag-checkered' = 3,
}

@IonicPage({
  name: 'OnSiteHome'
})
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  moment                      : any           = moment                   ;
  today                       : any           = moment()                 ;
  loginData                   : any           = null                     ;
  username                    : string        = "unknown"                ;
  userLoggedIn                : boolean                                  ;
  title                       : string        = 'OnSite Home'            ;
  numChars                    : Array<string> = STRINGS.NUMCHARS         ;
  chkBxBool                   : boolean                                  ;
  chkBx                       : string                                   ;
  static PREFS                : any           = new Preferences()        ;
  PREFS                       : any           = HomePage.PREFS           ;
  shftHrs                     : number                                   ;
  hrsSubmitted                : number                                   ;
  dataReady                   : boolean       = false                    ;
  spinnerText                 : string        = ""                       ;
  static EVENTS               : Events                                   ;
  techProfile                 : any                                      ;
  techWorkOrders              : Array<WorkOrder>                         ;
  shiftWorkOrders             : Array<WorkOrder>                         ;
  static pageLoadedPreviously : boolean       = false                    ;
  static homePageStatus       : any           = {startupFinished: false} ;
  homePageStatus              : any           = HomePage.homePageStatus  ;
  payrollWorkOrders           : Array<WorkOrder>                         ;
  hoursTotalList              : Array<any>    = []                       ;
  shifts                      : Array<Shift>  = []                       ;
  payrollPeriods              : Array<PayrollPeriod> = []                ;
  period                      : PayrollPeriod = null                     ;
  payrollPeriodHoursTotal     : number        = 0                        ;
  payrollPeriodHours          : number        = 0                        ;
  payrollPeriodBonusHours     : number        = 0                        ;
  databases                                   = this.PREFS.DB            ;
  checkboxes                  : any           = [
    '../../assets/images/box-check-yes.svg',
    '../../assets/images/box-check-no.svg',
    '../../assets/images/flag-blank.svg',
    '../../assets/images/flag-checkered.svg'
  ];
  checkboxSVG  : any = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50" version="1.1" preserveAspectRatio="xMidYMid meet" id="box-check-no">
      <path d="M 45.833333,4.166667 V 45.833333 H 4.1666667 V 4.166667 Z M 50,0 H 0 v 50 h 50 z m -12.5,34.454167 -9.566667,-9.475 9.470834,-9.55625 -2.95,-2.922917 -9.46875,9.560417 L 15.427083,12.595833 12.5,15.522917 22.06875,25.00625 12.595833,34.572917 15.522917,37.5 25.0125,27.925 l 9.564583,9.479167 z" />
    </svg>`,
    `<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50" version="1.1" preserveAspectRatio="xMidYMid meet" id="box-check-yes">
      <path d="M 22.916667,35.416667 12.5,24.377083 l 2.914583,-2.979166 7.445834,7.783333 13.691666,-14.597917 3.03125,2.922917 z m 22.916666,-31.25 V 45.833333 H 4.1666667 V 4.166667 Z M 50,0 H 0 v 50 h 50 z" />
    </svg>`,
    `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="50" viewBox="0 0 40 50" version="1.1" preserveAspectRatio="xMidYMid meet" id="flag-blank">
      <path d="m 31.657777,6.790993 c -7.466667,0 -7.635555,-4.863905 -16.304444,-4.863905 -4.684444,0 -9.055555,1.646505 -10.9088886,2.846103 V 0 H 0 V 50 H 4.4444444 V 25.078958 C 7.075555,23.702948 11.064444,22.25471 15.384444,22.25471 c 8.186667,0 9.335555,4.62702 16.631111,4.62702 C 36.731111,26.88173 40,24.598447 40,24.598447 V 4.390126 c 0,0 -3.602223,2.400867 -8.342223,2.400867 z m 3.897778,16.034942 c -0.888889,0.347799 -2.131111,0.695571 -3.54,0.695571 -2.16,0 -3.328889,-0.60988 -5.268889,-1.619632 -2.435555,-1.26848 -5.768889,-3.007387 -11.362222,-3.007387 -4.397778,0 -8.244444,1.140786 -10.9399996,2.249668 V 8.56351 C 6.708889,7.048057 10.811111,5.288976 15.353333,5.288976 c 2.962222,0 4.208889,0.737577 6.091111,1.853162 2.146667,1.270155 5.084444,3.010744 10.213333,3.010744 1.393334,0 2.700001,-0.144488 3.897778,-0.374645 z" />
    </svg>`,
    `<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50" preserveAspectRatio="xMidYMid meet" id="flag-checkered">
      <path d="m 35.200566,6.315625 c -6.533349,0 -6.681132,-4.5234375 -14.266395,-4.5234375 -4.098888,0 -7.923605,1.53125 -9.545282,2.646875 V 0 H 7.5 v 50 h 3.888889 V 23.323437 C 13.691106,22.04375 17.181394,20.696875 20.961394,20.696875 28.124717,20.696875 29.13,25 35.513606,25 39.639717,25 42.5,22.876562 42.5,22.876562 V 4.0828125 c 0,0 -3.151934,2.2328125 -7.299434,2.2328125 z m 3.41054,8.160938 C 33.911394,17.253125 28.8325,13.945313 26.263894,12.582812 v 5.732813 l 0.0061,0.0016 c -1.471946,-0.435935 -3.198612,-0.74531 -5.308336,-0.74531 -3.848051,0 -7.213888,1.060937 -9.572499,2.092188 V 13.742228 C 15.78331,10.660977 22.17081,10.253165 26.263875,12.582852 V 6.640625 c 1.878328,1.18125 4.448893,2.8 8.93666,2.8 1.219168,0 2.3625,-0.134375 3.410562,-0.3484375 z" />
    </svg>`
  ];

  constructor(public http        : Http,
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
              public translate   : TranslateService )
  {
    window["onsitehome"] = this;
    Log.l("HomePage: Hi, I'm the HomePage class constructor! And I personally am a logger. In half, I pee feces. (I'm also Yoda.)");
    HomePage.EVENTS = events;
    var caller = this;
    var startupHandler = function (homepage: any) {
      Log.l("HomePage.startupHandler(): startup:finished event detected. Target is:\n", homepage);
      Log.l("HomePage.startupHandler(): now unsubscribing from startup:finished event...");
      HomePage.EVENTS.unsubscribe('startup:finished', startupHandler);
      Log.l("HomePage.startupHandler(): now executing runEveryTime() function...");
      HomePage.homePageStatus.startupFinished = true;
      caller.runEveryTime();
    };
    if(HomePage.homePageStatus.startupFinished === false) {
      this.events.subscribe('startup:finished', startupHandler);
    }
  }

  ionViewDidEnter() {
    Log.l("HomePage: ionViewDidEnter() called. First wait to make sure app is finished loading.");
    var caller = this;
    if(this.homePageStatus.startupFinished) {
      Log.l("HomePage.ionViewDidEnter(): startup already finished, just continuing with runEveryTime()...");
      this.tabs.highlightTab(0);
      this.runEveryTime();
    }
  }

  ionViewDidLoad() {
    Log.l("HomePage: ionViewDidLoad() called... not doing anything right now.");
    this.dataReady = false;
  }

  runEveryTime() {
    if (this.ud.getLoginStatus() === false) {
      Log.l("HomePage.ionViewDidEnter(): User not logged in, showing login modal.");
      this.presentLoginModal();
    } else {
      Log.l("HomePage: ionViewDidEnter() says work order array not initialized, fetching work orders.");
      this.tabs.highlightPageTab('OnSiteHome');
      var caller = this;
      this.translate.get('spinner_fetching_reports').subscribe((result) => {
        caller.spinnerText = result;
        caller.alert.showSpinner(caller.spinnerText);
        caller.fetchTechWorkorders().then((res) => {
          Log.l("HomePage: ionViewDidEnter() fetched work reports, maybe:\n", res);
          caller.ud.setWorkOrderList(res);
          // caller.ud.createShifts();
          caller.techProfile = caller.ud.getTechProfile();
          caller.shifts = caller.ud.getPeriodShifts();
          caller.countHoursForShifts();
          caller.alert.hideSpinner();
          caller.dataReady = true;
        }).catch((err) => {
          Log.l("HomePage: ionViewDidEnter() got error while fetching tech work orders.");
          Log.e(err);
          caller.alert.hideSpinner();
          let lang = caller.translate.instant(['error', 'alert_retrieve_reports_error'])
          caller.alert.showAlert(lang['error'], lang['alert_retrieve_reports_error']);
        });
      });
    }
  }

  runWhenReady() {
    Log.l("HomePage: app finished loading. Now, checking user login status.");
    if (this.ud.getLoginStatus()) {
      Log.l("HomePage: user logged in, fetching work orders.");
      this.fetchTechWorkorders().then((res) => {
        Log.l("HomePage: fetched work orders, maybe:\n", res);
        this.ud.createShifts();
        this.shifts = this.ud.getPeriodShifts();
        HomePage.pageLoadedPreviously = true;
        this.events.publish('pageload:finished', this.ud.getLoginStatus());
      });
    } else {
      Log.l("HomePage: user not authorized in ionViewDidLoad(). Guess ionViewDidEnter() can present a login modal.");
    }
  }

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
      this.server.getReportsForTech(techid).then((res) => {
        Log.l(`HomePage: getReportsForTech(${techid}): Success! Result:\n`, res);
        this.ud.setWorkOrderList(res);
        this.techWorkOrders    = this.ud.getWorkOrderList();
        let tech               = this.ud.getTechProfile();
        let now                = moment();
        let payrollPeriod      = this.ud.getPayrollPeriodForDate(now);
        this.payrollPeriods    = this.ud.createPayrollPeriods(tech);
        for(let period of this.payrollPeriods) {
          for(let shift of period.shifts) {
            let reports = this.ud.getWorkOrdersForShift(shift);
            shift.setShiftWorkOrders(reports);
          }
        }
        this.period            = this.payrollPeriods[0];
        Log.l("fetchTechWorkOrders(): Got payroll periods and all work orders:\n", this.payrollPeriods);
        Log.l(this.techWorkOrders);
        // this.payrollWorkOrders = this.ud.getWorkOrdersForPayrollPeriod(payrollPeriod);
        // Log.l(`HomePage: filteredWorkOrders(${payrollPeriod}) returned:\n`, this.payrollWorkOrders);
        // if(this.period.shifts && this.period.shifts.length) {
        //   this.hoursTotalList = [];
        //   for(let shift of this.period.shifts) {
        //     let total = this.ud.getTotalHoursForShift(shift.getShiftSerial());
        //     this.hoursTotalList.push(total);
        //   }
        // }
        resolve(res);
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

  countHoursForShifts() {
    if(this.shifts && this.shifts.length) {
      this.hoursTotalList = [];
      for(let shift of this.shifts) {
        let hours = this.ud.getTotalHoursForShift(shift.getShiftSerial());
        this.hoursTotalList.push(hours);
      }
    }
    let thisPayPeriod = this.ud.getPayrollPeriodForDate(moment());
    this.payrollPeriodHours = this.ud.getTotalHoursForPayrollPeriod(thisPayPeriod);
    this.payrollPeriodBonusHours = this.ud.getPayrollHoursForPayrollPeriod(thisPayPeriod);
  }

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

  getShiftStatus(idx:number) {
    let hours = this.hoursTotalList[idx];
    let total = this.techProfile.shiftLength;
    let retVal = (hours > total) ? "hoursOver" : (hours < total) ? "hoursUnder" : (hours === total) ? "hoursComplete" : "hoursUnknown";
    return retVal;
  }

  getCheckboxSVG(shift:Shift) {
    let checkBox = '?';
    let chks = this.checkboxSVG;
    let hours = shift.getNormalHours();
    let total = shift.getShiftLength();
    if (hours > total) {
      checkBox = chks[Icons["flag-checkered"]];
    } else if (hours < total) {
      checkBox = chks[Icons["box-check-no"]];
    } else {
      checkBox = chks[Icons["box-check-yes"]];
    }
    return checkBox;
  }

  // getCheckboxSVG(idx:number) {
  //   let checkBox = '?';
  //   let chks = this.checkboxSVG;
  //   let hours = this.hoursTotalList[idx];
  //   let total = this.techProfile.shiftLength;
  //   if (hours > total) {
  //     checkBox = chks[Icons["flag-checkered"]];
  //   } else if (hours < total) {
  //     checkBox = chks[Icons["box-check-no"]];
  //   } else {
  //     checkBox = chks[Icons["box-check-yes"]];
  //   }
  //   return checkBox;
  // }

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

  getShiftColor(idx:number) {
    let status = this.getShiftStatus(idx);
    if(status) {
      return 'green';
    } else {
      return 'red';
    }
  }

  chkHrs(i) {
    if(this.shftHrs === this.hrsSubmitted ) {
      this.chkBx = '☑';
      this.chkBxBool = true;
    } else {
      let tmpBx = '☒';
      this.chkBxBool = false;
    }
  }

  showHelp(event:any) {
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
    if(this.ud.getWorkOrdersForShift(shift.getShiftSerial()).length > 0) {
      this.tabs.goToPage('ReportHistory', {mode: 'Shift', shift: shift});
    } else {
      this.tabs.goToPage('Report', {mode: 'Add', shift: shift});
    }
  }

  possibleSound(index:number) {
    let status = this.getShiftStatus(index);
    if(status === 'hoursOver') {
      this.ud.playSoundClip();
    }
  }

  changedPayrollPeriod(period:PayrollPeriod) {
    Log.l("changedPayrollPeriod(): Payroll period changed to:\n", period);
  }

}
