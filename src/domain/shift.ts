import moment from 'moment';
import { Log } from '../config/config.functions';
import { sprintf } from 'sprintf-js';

const XL = moment([1900, 1, 1]);

export class Shift {
  public site_name:string;
  public shift_id:number;
  public shift_week_id:number;
  public payroll_period:any;
  public shift_week:any;
  public shift_time:string = "AM";
  public start_time:any;
  public shift_length:number;
  public shift_number:any;
  public current_payroll_week:any;
  public colors:any = {};
  public XL:any;
  public shift_serial:any;
  public shift_hours:any;
  
  constructor(site_name?, shift_week?, shift_time?, start_time?, shift_length?) {
    if(arguments.length == 1 && typeof arguments[0] == 'object') {
      this.readFromDoc(arguments[0]);
    } else {
      this.site_name = site_name || '';
      this.shift_week = shift_week || '';
      this.shift_time = shift_time || 'AM';
      this.start_time = start_time || '';
      this.shift_length = shift_length || -1;
      this.shift_id = -1;
      this.shift_number = -1;
      this.shift_week_id = -1;
      this.payroll_period = null;
      this.shift_serial = null;
      this.shift_hours = 0;
      this.updateShiftNumber();
      this.colors = {'red': false, 'green': false, 'blue': false};
      this.XL = { 'shift_time': null, 'shift_week': null, 'current_payroll_week': null};
      this.getShiftWeek();
      this.getShiftColor();
      this.getCurrentPayrollWeek();
    }
  }
// 
  public readFromDoc(doc) {
    for(let prop in doc) {
      this[prop] = doc[prop];
    }
    this.getShiftColor();
  }

  public getShiftWeek() {
    let scheduleStartsOnDay = 3;
    let day = moment(this.start_time);
    if (day.isoWeekday() >= scheduleStartsOnDay) {
      this.shift_week = day.isoWeekday(scheduleStartsOnDay);
    } else {
      this.shift_week = moment(day).subtract(1, 'weeks').isoWeekday(scheduleStartsOnDay);
    }
    return this.shift_week;
  }

  public getShiftNumber() {
    this.getShiftWeek();
    this.getExcelDates();
    let shiftNumber = this.XL.shift_time - this.XL.shift_week + 1;
    this.shift_number = shiftNumber;
    return shiftNumber;
  }

  public getCurrentPayrollWeek() {
    let scheduleStartsOnDay = 3;
    let now = moment();
    // let day = moment(this.start_time);
    if (now.isoWeekday() >= scheduleStartsOnDay) {
      this.current_payroll_week = now.isoWeekday(scheduleStartsOnDay);
    } else {
      this.current_payroll_week = moment(now).subtract(1, 'weeks').isoWeekday(scheduleStartsOnDay);
    }
    return this.current_payroll_week;
  }

  public updateShiftWeek() {
    // Schedule starts on day 3 (Wednesday)
    return this.getShiftWeek();
  }

  public updateShiftNumber() {
    let start = this.start_time;
    let week = this.shift_week;
    if(moment.isMoment(start) && moment.isMoment(week)) {
      this.shift_number = start.diff(week, 'days')+1;
    } else {
      this.shift_number = -1;
    }
    return this.shift_number;
  }

  public getShiftDescription() {
    // return this.site_name;
    let shiftWeek = this.shift_week.format("M/DD");
    // let shiftWeekDay = moment(this.shift_week).day() - 3;
    let end_shift_week = moment(this.shift_week).add(6, 'days');
    let shiftNum = Math.abs(this.start_time.diff(this.shift_week, 'days'))+1;
    let endWeek = end_shift_week.format("MMM D");
    let dayStr = moment(this.start_time).format("MMM D");
    // let thisDay = this.start_time.day();
    // let thisDay = moment(this.start_time).day() - shiftWeekDay;

    // return `${dayStr} (Shift ${shiftNum} in ${shiftWeek}-${endWeek})`;
    return `${dayStr} (Shift week ${shiftWeek})`;
  }

  public getShiftWeekID() {
    let shift_week_number = -1;
    let start_date = moment([1900, 1, 1]);
    if(moment.isMoment(this.shift_week)) {
      shift_week_number = this.shift_week.diff(start_date, 'days') + 1;
    }
    return shift_week_number;
  }

  public isShiftInCurrentPayPeriod() {
    let now = moment();
    let day = moment(this.start_time);
    let week = moment(this.shift_week);
    let nowXL = now.diff(XL, 'days') + 1;
    let dayXL = day.diff(XL, 'days');
    let weekXL = week.diff(XL, 'days');
    let nextWeekXL = weekXL + 7;
    if(dayXL >= weekXL && dayXL < nextWeekXL) {
      return true;
    } else {
      return false;
    }
  }

  getShiftSerial() {
    this.getExcelDates();
    let weekXL = this.shift_week_id;
    let payrollPeriodID = weekXL;
    let shiftXL = this.XL.shift_time;
    let shiftNum = shiftXL - weekXL + 1;
    let strWeekID = `${weekXL}`;
    let strShiftNum = sprintf("%02d", shiftNum);
    let strShiftID = `${strWeekID}_${strShiftNum}`;
    this.shift_serial = strShiftID;
    return strShiftID;
  }

  getExcelDates() {
    let now = moment();
    let day = moment(this.start_time);
    let week = moment(this.getShiftWeek());
    let nowWeek = moment(this.getCurrentPayrollWeek());
    let nowXL = now.diff(XL, 'days') + 1;
    let dayXL = day.diff(XL, 'days') + 1;
    let weekXL = week.diff(XL, 'days') + 1;
    let currentWeekXL = nowWeek.diff(XL, 'days') + 1;
    let nextWeekXL = weekXL + 7;
    this.shift_week_id = weekXL;
    this.shift_id = dayXL;
    this.XL.today_XL   = nowXL;
    this.XL.shift_time = dayXL;
    this.XL.shift_id   = dayXL;
    this.XL.shift_week = weekXL;
    this.XL.current_payroll_week = currentWeekXL;
    this.XL.next_week_XL = nextWeekXL;
    return this.XL;
  }

  getShiftHours() {
    return this.shift_hours;
  }

  setShiftHours(hours:number) {
    this.shift_hours = hours;
  }

  public getShiftColor() {
    let now = moment();
    this.getExcelDates();
    let colorClass="";
    let dayXL = this.XL.shift_id;
    let nowXL = this.XL.today_XL;
    let weekXL = this.XL.shift_week;
    let prWeek = this.XL.current_payroll_week;
    if(dayXL == nowXL) {
      colorClass="green";
    } else if (dayXL < prWeek) {
      colorClass="red";
    } else {
      colorClass="blue";
    }
    Log.l("getShiftColor(): Shift is now:\n", this);
    return colorClass;
  }

  getShiftClasses() {
    this.getShiftColor();
    return this.colors;
  }

  isRed() {
    // this.getShiftColor();
    return this.colors.red;
  }
  isGreen() {
    // this.getShiftColor();
    return this.colors.green;
  }
  isBlue() {
    // this.getShiftColor();
    return this.colors.blue;
  }

  toString() {
    // { { selectedShift.start_time.format("MMM DD") } } (Payroll week #{ { selectedShift.getShiftWeekID() } })
    let strOut:string = null;
    let start:string = moment(this.start_time).format("MMM DD");
    let weekID = this.getShiftWeekID();
    strOut = `${start} (Payroll week #${weekID})`;
    Log.l('Shift.toString() should output:\n', strOut);
    return strOut;
  }

}