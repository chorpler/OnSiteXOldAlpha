import { Injectable                    } from '@angular/core'              ;
import { Events, Platform              } from 'ionic-angular'              ;
import { Storage                       } from '@ionic/storage'             ;
import { NativeStorage                 } from 'ionic-native'               ;
import { DBSrvcs                       } from './db-srvcs'                 ;
import { Shift                         } from '../domain/shift'            ;
import { PayrollPeriod                 } from '../domain/payroll-period'   ;
import { WorkOrder                     } from '../domain/workorder'        ;
import { ReportOther                   } from '../domain/reportother'      ;
import { Employee                      } from '../domain/employee'         ;
import { Log, isMoment, moment, Moment } from '../config/config.functions' ;
import { Preferences                   } from './preferences'              ;
import { STRINGS                       } from '../config/config.strings'   ;

@Injectable()
export class UserData {
  public static appdata               : any = {ready: false, version: "10.11.05", homeLoading:false, attempts: 0, homeReady:false, bootError: false};
  public static _favorites            : string[]             = []                      ;
  public static HAS_LOGGED_IN         = 'hasLoggedIn'                                  ;
  public static HAS_SEEN_TUTORIAL     = 'hasSeenTutorial'                              ;
  public static BOOT_STATUS           : any                  =   {finished: false }    ;
  public BOOT_STATUS                  : any                  = UserData.BOOT_STATUS    ;
  public static shift                 : Shift                                          ;
  public static workOrderList         : Array<WorkOrder>     = []                      ;
  public static current_shift_hours   : any                                            ;
  public static circled_numbers       : Array<string>                                  ;
  public static circled_numbers_chars : Array<string>        = STRINGS.NUMCHARS        ;
  public static techWOArrayInitialized: boolean              = false                   ;
  public static shifts                : Array<Shift>         = []                      ;
  public static payrollPeriods        : Array<PayrollPeriod> = []                      ;
  public static reports               : Array<WorkOrder>     = []                      ;
  public static otherReports          : Array<ReportOther>   = []                      ;
  public static user                  : Employee             = null                    ;
  public static techProfile           : any                                            ;
  public static userLoggedIn          : boolean              = false                   ;
  public static sesaConfig            : any                  = {}                      ;
  public static data                  : any                                            ;
  public appdata                      : any = UserData.appdata                         ;
  public shifts                       : Array<Shift>         = UserData.shifts         ;
  public payrollPeriods               : Array<PayrollPeriod> = UserData.payrollPeriods ;
  public reports                      : Array<WorkOrder>     = UserData.reports        ;
  public otherReports                 : Array<ReportOther>   = UserData.otherReports   ;
  public user                         : Employee             = UserData.user           ;
  public techProfile                  : any                  = UserData.techProfile    ;
  public sesaConfig                   : any                  = UserData.sesaConfig     ;
  public data                         : any                  = UserData.data           ;
  public userLoggedIn                 : boolean              = UserData.userLoggedIn   ;
  public appReady                     : boolean              = false                   ;

  private static loginData:any = null;

  constructor(public events: Events, public storage: Storage, public platform: Platform, public prefs: Preferences) {
    window["onsiteuserdata"] = this;
    window["UserData"] = UserData;
    UserData.data = { employee: [], sites: [], reports: [], otherReports: [], payrollPeriods: [], shifts: [], messages: [], report_types: [], training_types: []};
  }

  public isBootError() {
    return UserData.appdata.bootError;
  }

  public setBootError(value:boolean) {
    UserData.appdata.bootError = value;
    return UserData.appdata.bootError;
  }

  public isHomePageLoading() {
    return UserData.appdata.homeLoading;
  }

  public setHomePageLoading(value:boolean) {
    UserData.appdata.homeLoading = value;
    return UserData.appdata.homeLoading;
  }

  public isHomePageReady() {
    return UserData.appdata.homeReady;
  }

  public setHomePageReady(value:boolean) {
    UserData.appdata.homeReady = value;
    return UserData.appdata.homeReady;
  }

  public isAppLoaded() {
    return UserData.appdata.ready;
  }

  public setAppLoaded(value:boolean) {
    UserData.appdata.ready = value;
    return UserData.appdata.ready;
  }

  public getLoadAttempts() {
    return UserData.appdata.attempts;
  }

  public setLoadAttempts(value:number) {
    UserData.appdata.attempts = value;
    return UserData.appdata.attempts;
  }

  public setHomePeriod(period:PayrollPeriod) {
    this.sesaConfig['home_period'] = period;
    return this.sesaConfig.home_period;
  }

  public getHomePeriod() {
    if(this.sesaConfig.home_period) {
      return this.sesaConfig.home_period;
    } else {
      return false;
    }
  }

  public setData(data:any) {
    Log.l("setData(): Attempting to set UserData.data to:\n", data);
    if(data['sites']['length'] === undefined || data['reports']['length'] === undefined || data['otherReports']['length'] === undefined) {
      Log.e("setData(): Can't use this data to set data property. It is incomplete.\n", data);
      return false;
    } else {
      let keys = Object.keys(data);
      for(let key of keys) {
        if(key === 'config') {
          this.setSesaConfig(data.config);
          let configKeys = Object.keys(data.config);
          for(let configKey of configKeys) {
            UserData.data[configKey] = [];
            for(let object of data.config[configKey]) {
              UserData.data[configKey].push(object);
            }
          }
        } else {
          UserData.data[key] = [];
          for(let object of data[key]) {
            UserData.data[key].push(object);
          }
        }
      }
      Log.l("setData(): Done. UserData.data is now:\n", UserData.data);
      this.data = UserData.data;
      return UserData.data;
    }
  }

  public getData(key?:string) {
    if(key) {
      if(UserData.data[key]['length'] !== undefined) {
        return UserData.data[key];
      } else {
        Log.e(`getData('${key}') could not be found.`);
        return null;
      }
    } else {
      return UserData.data;
    }
  }

  public getReportsForTech() {
    return this.reports;
  }

  public setReportsForTech(reports:Array<WorkOrder>) {
    let workReports = [];
    for(let report of reports) {
      workReports.push(report);
    }
    UserData.reports = workReports;
    this.reports = workReports;
    return workReports;
  }

  public getReportsOtherForTech() {
    return this.otherReports;
  }

  public setReportsOtherForTech(reportsOther:Array<ReportOther>) {
    let otherReports = [];
    for(let report of reportsOther) {
      otherReports.push(report);
    }
    UserData.reports = otherReports;
    this.reports = otherReports;
    return otherReports;
  }

  public getShifts() {
    return this.shifts;
  }

  public setShifts(shifts:Array<Shift>) {
    let newShifts = [];
    for(let shift of shifts) {
      newShifts.push()
    }
  }

  public static getSesaConfig() {
    return UserData.sesaConfig;
  }
  public getSesaConfig() {
    return UserData.getSesaConfig();
  }
  public static setSesaConfig(config:any) {
    for(let key of Object.keys(config)) {
      UserData.sesaConfig[key] = config[key];
    }
    return UserData.sesaConfig;
  }
  public setSesaConfig(config:any) {
  return UserData.setSesaConfig(config);
  }

  public static startupFinished() {
    UserData.BOOT_STATUS.finished = true;
    return UserData.BOOT_STATUS.finished;
  }
  public startupFinished() {
    return UserData.startupFinished();
  }

  public static waitForStartup() {
    return new Promise((resolve,reject) => {
    if(UserData.BOOT_STATUS.finished) {
      resolve(true);
    }
    });
  }

  getPlatforms() {
  	return this.platform.platforms();
  }

  getPlatform() {
  	let p = this.platform;
  	return p.is('ios') ? 'ios' : p.is('android') ? 'android' : (p.is('windows') && p.is('mobile')) ? 'winphone' : 'nonphone';
  }

  getTechName() {
    let tp = UserData.techProfile;
    if(tp) {
      return `${tp.avatarName} (${tp.firstName} ${tp.lastName})`;
    } else {
      return '(unknown)';
    }
  }

  getShift():Shift {
    return UserData.shift;
  }

  setShift(shift:Shift) {
    UserData.shift = shift;
  }

  getWorkOrderList():Array<WorkOrder> {
    return UserData.workOrderList;
  }

  setWorkOrderList(list:Array<any>) {
    UserData.workOrderList = list;
    UserData.techWOArrayInitialized = true;
  }

  getWorkOrdersForShift(shift:Shift | string):Array<WorkOrder> {
    let result = [];
    let shift_serial = shift instanceof Shift ? shift.getShiftSerial() : shift;
    for(let report of UserData.workOrderList) {
      let serial = report.shift_serial;
      if(serial === undefined || serial === null) {
        /* TODO(2017-06-22): add code to extrapolate shift from report_date in report */
      } else {
        if(serial === shift_serial) {
          result.push(report);
        }
      }
    }
    return result;
  }

  getWorkOrdersForPayrollPeriod(period:any):Array<any> {
    let result = [];
    let key = 0;
    if(period instanceof PayrollPeriod) {
      key = period.getPayrollSerial();
    } else if(isMoment(period)) {
      key = period.toExcel();
    } else {
      key = Number(period);
    }
    for(let wo of UserData.workOrderList) {
      if(wo.payroll_period === key) {
        result.push(wo);
      }
    }
    return result;
  }

  getTotalHoursForShift(serial:string):number {
    let filtered = this.getWorkOrdersForShift(serial);
    let total = 0;
    for(let wo of filtered) {
      total += wo.getRepairHours();
    }
    return total;
  }

  getTotalHoursForPayrollPeriod(period:any):number {
    let filtered = this.getWorkOrdersForPayrollPeriod(period);
    let total = 0;
    for(let wo of filtered) {
      total += wo.getRepairHours();
    }
    return total;
  }

  getPayrollHoursForPayrollPeriod(period:any):number {
    let shifts = this.getPeriodShifts();
    let payPeriodTotal = 0;
    for(let shift of shifts) {
      if(shift.getShiftWeekID() === period) {
        let shiftReports = this.getWorkOrdersForShift(shift.getShiftSerial());
        let shiftTotal = 0, countsForBonusHours = 0, count = 0, bonushours = 0;
        for(let report of shiftReports) {
          let subtotal = report.getRepairHours();
          shiftTotal += subtotal;
          count++;
          if(report.client !== "SESA") {
            countsForBonusHours += subtotal;
          }
        }
        if(countsForBonusHours >= 8 && countsForBonusHours <= 11) {
          bonushours = 3;
        } else if(countsForBonusHours > 11) {
          bonushours = 3 + (countsForBonusHours - 11);
        }
        Log.l("getPayrollHoursForPayrollPeriod(): For shift %s, %d reports, %f hours, and %f count for bonus hours, so bonus hours = %f.", shift.getShiftSerial(), count, shiftTotal, countsForBonusHours, bonushours);
        shiftTotal += bonushours;
        payPeriodTotal += shiftTotal;
      }
    }
    return payPeriodTotal;
    // let filtered = this.getWorkOrdersForPayrollPeriod(period);
    // let total = 0;
    // for(let wo of filtered) {
    //   let subtotal = wo.getRepairHours();
    //   let bonushours = 0;
    //   if(wo.location !== 'WESLACO' && wo.location !== 'LAS CUATAS') {
    //     if(subtotal >= 8 && subtotal <= 11) {
    //       bonushours = 3;
    //     } else if(subtotal > 11) {
    //       bonushours = ((subtotal - 11)*2)+3;
    //     }
    //   }
    //   subtotal += bonushours;
    //   total += subtotal;
    // }
    // return total;
  }

  getUsername() {
    return UserData.loginData['user'] || null;
  }

  getPassword() {
    return UserData.loginData['pass'] || null;
  }

  getCredentials() {
    return UserData.loginData;
  }

  storeCredentials(loginData:any, pass?:any) {
    if(typeof loginData == 'object') {
      UserData.loginData = loginData;
      // UserData.userLoggedIn = true;
    } else if(typeof loginData == 'string' && typeof pass == 'string') {
      UserData.loginData = {user: loginData, pass: pass};
      // UserData.userLoggedIn = true;
    } else {
      Log.l("UserData.storeCredentials(): Invalid login data provided:\n", loginData);
    }
  }

  getLoginStatus() {
    Log.l("UD.getLoginStatus(): login status is:\n", UserData.userLoggedIn);
    Log.l("UD.getLoginStatus(): creds are: ", UserData.userLoggedIn, "\n", UserData.loginData);
    return UserData.userLoggedIn;
  }

  setLoginStatus(status:boolean) {
    UserData.userLoggedIn = status;
  }

  clearCredentials() {
    UserData.userLoggedIn = false;
    UserData.loginData = null;
  }

  logout() {
    this.clearCredentials();
  }

  woArrayInitialized() {
    if (UserData.techWOArrayInitialized) {
      return true;
    } else {
      return false;
    }
  }

  getCurrentPayrollWeek(date?:any) {
    let scheduleStartsOnDay = 3;
    let now = moment();
    if(isMoment(date)) {
      now = moment(date);
    }
    // let day = moment(this.start_time);
    let cpw = null;
    if (now.isoWeekday() >= scheduleStartsOnDay) {
      cpw = now.isoWeekday(scheduleStartsOnDay);
    } else {
      cpw = moment(now).subtract(1, 'weeks').isoWeekday(scheduleStartsOnDay).startOf('day');
    }
    return cpw;
  }

  getPayrollPeriodForDate(date?:any) {
    let now = moment();
    if(isMoment(date)) {
      now = moment(date);
    }
    if(now.isValid()) {
      let week = this.getCurrentPayrollWeek(now);
      let xlDate = moment(week).toExcel();
      return xlDate;
    } else {
      Log.l("getPayrollPeriodForDate(): Need moment, got:\n", date);
      return -1;
    }
  }

  createPayrollPeriods(tech:Employee, count?:number):Array<PayrollPeriod> {
    let now = moment().startOf('day');
    UserData.payrollPeriods = [];
    let periodCount = count || 2;
    for(let i = 0; i < periodCount; i++) {
      let start = PayrollPeriod.getPayrollPeriodDateForShiftDate(moment(now).subtract(i, 'weeks'));
      let pp = new PayrollPeriod();
      pp.setStartDate(start);
      pp.createPayrollPeriodShiftsForTech(tech);
      UserData.payrollPeriods.push(pp);
    }
    return UserData.payrollPeriods;
  }

  getPayrollPeriods() {
    return UserData.payrollPeriods;
  }

  createShifts() {
    let now = moment();
    UserData.shifts = [];
    let tp = UserData.techProfile;
    if(tp !== undefined && tp !== null) {
      for (let i = 0; i < STRINGS.NUMBER_OF_SHIFTS; i++) {
        let tmpDay = moment(now).subtract(i, 'days');
        let shift_day = tmpDay.startOf('day');
        let tmpStart = UserData.techProfile.shiftStartTime;
        let shift_start_time = moment(shift_day).add(tmpStart, 'hours');
        // let shiftStartDay = moment(now).subtract(i, 'days');
        let client = UserData.techProfile.client || "SITENAME";
        let type = UserData.techProfile.shift;
        let length = UserData.techProfile.shiftLength;
        let thisShift = new Shift(client, null, type, shift_start_time, length);
        thisShift.updateShiftWeek();
        thisShift.updateShiftNumber();
        thisShift.getExcelDates();
        UserData.shifts.push(thisShift);
        Log.l(`Now adding day ${i}: ${moment(shift_day).format()}`);
      }
    } else {
      Log.w("createShifts(): Failed, techProfile does not exist.")
    }
  }

  getPeriodShifts():Array<Shift> {
    return UserData.shifts;
  }

  setTechProfile(profile:any) {
    UserData.techProfile = profile;
  }

  getTechProfile():any {
    return UserData.techProfile;
  }

  playSoundClip(index?:number) {
    let i = index ? index : 0;
    let prefix = '/assets/audio/';
    let audioclips = ['nospoilers.wav', 'nospoilers2.wav'];
    let fullurl = prefix + audioclips[i];
    Log.l("playSoundClip(): Attempting to play sound file '%s' ...", fullurl);
    let audio = new Audio(fullurl);
    audio.play();
  }

  static getSVGData() {
    let svgs = [
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
    </svg>`,
      `<span class="fake-svg">?</span>`,
    ];
    return svgs;
  }

  getSVGData() {
    return UserData.getSVGData();
  }

}
