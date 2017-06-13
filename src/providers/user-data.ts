import { Injectable             } from '@angular/core'              ;
import { Events, Platform       } from 'ionic-angular'              ;
import { Storage                } from '@ionic/storage'             ;
import { NativeStorage          } from 'ionic-native'               ;
import { DBSrvcs                } from './db-srvcs'                 ;
import { Shift                  } from '../domain/shift'            ;
import { WorkOrder              } from '../domain/workorder'        ;
import { Log, isMoment          } from '../config/config.functions' ;
import moment from 'moment';

const XL = moment([1900, 0, 1]);

@Injectable()
export class UserData {
  public static _favorites: string[] = [];
  public static HAS_LOGGED_IN = 'hasLoggedIn';
  public static HAS_SEEN_TUTORIAL = 'hasSeenTutorial';
  public static shift: Shift;
  public static workOrderList: Array<WorkOrder>;
  public static current_shift_hours: any;
  public static circled_numbers:Array<string>;
  public static circled_numbers_chars: Array<string> = ["⓵", "⓶", "⓷", "⓸", "⓹", "⓺", "⓻", "⓼", "⓽"];
  public static techWOArrayInitialized:boolean = false;
  public static shifts:Array<Shift> = [];
  public static techProfile:any;
  public static userLoggedIn:boolean = false;
  private static loginData:any = null;


  constructor(public events: Events, public storage: Storage, public platform: Platform) {
    window["onsiteuserdata"] = this;
    window["UserData"] = UserData;
   }

  getPlatforms() {
  	return this.platform.platforms();
  }

  getPlatform() {
  	let p = this.platform;
  	return p.is('ios') ? 'ios' : p.is('android') ? 'android' : (p.is('windows') && p.is('mobile')) ? 'winphone' : 'nonphone';
  }

  getShift():Shift {
    return UserData.shift;
  }

  setShift(shift:Shift) {
    UserData.shift = shift;
  }

  getWorkOrderList():Array<any> {
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

  getTotalPayrollHoursForPayrollPeriod(period:any):number {
    let filtered = this.getWorkOrdersForPayrollPeriod(period);
    let total = 0;
    for(let wo of filtered) {
      let subtotal = wo.getRepairHours();
      let payrollhour = subtotal;
      if(subtotal >= 8 && subtotal <= 11) {
        payrollhour += 3;
      } else if(subtotal > 11) {
        payrollhour *= 2;
      }
      total += payrollhour;
    }
    return total;
  }

  getUsername() {
    return UserData.loginData['user'] || null;
  }

  getCredentials() {
    return UserData.loginData;
  }

  storeCredentials(loginData:any, pass?:any) {
    if(typeof loginData == 'object') {
      UserData.loginData = loginData;
      UserData.userLoggedIn = true;
    } else if(typeof loginData == 'string' && typeof pass == 'string') {
      UserData.loginData = {user: loginData, pass: pass};
      UserData.userLoggedIn = true;
    } else {
      Log.l("UserData.storeCredentials(): Invalid login data provided:\n", loginData);
    }
  }

  getLoginStatus() {
    Log.l("UD.getLoginStatus(): login status is:\n", UserData.userLoggedIn);
    return UserData.userLoggedIn;
  }

  setLoginStatus(status:boolean) {
    UserData.userLoggedIn = status;
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
      for (let i = 0; i < 7; i++) {
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
    return UserData.shifts || [];
  }

  setTechProfile(profile:any) {
    UserData.techProfile = profile;
  }

  getTechProfile():any {
    return UserData.techProfile;
  }

}
