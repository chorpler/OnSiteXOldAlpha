import { Injectable             } from '@angular/core'              ;
import { Events, Platform       } from 'ionic-angular'              ;
import { Storage                } from '@ionic/storage'             ;
import { NativeStorage          } from 'ionic-native'               ;
import { DBSrvcs                } from './db-srvcs'                 ;
import { Shift                  } from '../domain/shift'            ;
import { WorkOrder              } from '../domain/workorder'        ;
import { Log, isMoment          } from '../config/config.functions' ;
import { Preferences            } from './preferences'              ;
import { PREFS, STRINGS         } from '../config/config.strings'   ;
import moment from 'moment';

const XL = moment([1900, 0, 1]);

@Injectable()
export class UserData {
  public static _favorites: string[] = [];
  public static HAS_LOGGED_IN = 'hasLoggedIn';
  public static HAS_SEEN_TUTORIAL = 'hasSeenTutorial';
  public static BOOT_STATUS:any = {finished: false};
  public BOOT_STATUS:any = UserData.BOOT_STATUS;
  public static shift: Shift;
  // public static PREFS:any = new Preferences();
  // public prefs:any = UserData.PREFS;
  public static workOrderList: Array<WorkOrder> = [];
  public static current_shift_hours: any;
  public static circled_numbers:Array<string>;
  public static circled_numbers_chars: Array<string> = STRINGS.NUMCHARS;
  public static techWOArrayInitialized:boolean = false;
  public static shifts:Array<Shift> = [];
  public static techProfile:any;
  public static userLoggedIn:boolean = false;
  public static sesaConfig:any = {};
  public sesaConfig:any = UserData.sesaConfig;
  private static loginData:any = null;

  constructor(public events: Events, public storage: Storage, public platform: Platform, public prefs: Preferences) {
    window["onsiteuserdata"] = this;
    window["UserData"] = UserData;
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

  getWorkOrdersForShift(serial:string):Array<WorkOrder> {
    let result = [];
    for(let wo of UserData.workOrderList) {
      if(wo.shift_serial === serial) {
        result.push(wo);
      }
    }
    return result;
  }

  getWorkOrdersForPayrollPeriod(period:any):Array<any> {
    let result = [];
    let key = 0;
    if(isMoment(period)) {
      key = moment(period).diff(XL, 'days') + 2;
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
      let xlDate = moment(week).diff(XL, 'days') + 2;
      return xlDate;
    } else {
      Log.l("getPayrollPeriodForDate(): Need moment, got:\n", date);
      return -1;
    }
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

}
