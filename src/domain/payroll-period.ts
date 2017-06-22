import { Shift } from './shift';
import { Log, isMoment } from '../config/config.functions';
import * as moment from 'moment';

export const XL = moment([1900, 0, 1]);

export class PayrollPeriod {
  public start_date:any;
  public end_date:any;
  public serial_number:number;
  public shifts:Array<Shift> = [];
  public total_hours:number = 0;


  constructor(start_date?: moment.Moment | string | number, end_date?: moment.Moment | string | number, serial_number?:number, shifts?:Array<Shift>, total_hours?:number) {
    this.start_date    = start_date    || null;
    this.end_date      = end_date      || null;
    this.serial_number = serial_number || null;
    this.shifts        = shifts        || null;
    this.total_hours   = total_hours   || null;
  }

  readFromDoc(doc:any) {
    for(let key in doc) {
      let value = doc[key];
      if(key === 'start_date' || key === 'end_date') {
        this[key] = moment(value);
      } else {
        this[key] = value;
      }
    }
  }

  setStartDate(start:moment.Moment | Date | string | number) {
    if(isMoment(start) || start instanceof Date) {
      this.start_date = moment(start).startOf('day');
      this.end_date = moment(start).add(6, 'days');
      this.getPayrollSerial();
    } else if(typeof start === 'string') {
      this.start_date = moment(start, 'YYYY-MM-DD').startOf('day');
      this.end_date = moment(start).add(6, 'days');
      this.getPayrollSerial();
    } else if(typeof start === 'number') {
      this.start_date = moment(start).startOf('day');
      this.end_date = moment(start).add(6, 'days');
      this.getPayrollSerial();
    } else {
      Log.e(`PayrollPeriod.setStartDate(): Error, need moment or Date or number or string as argument, got:\n`, start);
    }
  }

  getPayrollSerial() {
    if(this.serial_number) {
      return this.serial_number;
    } else {
      let start = moment(this.start_date).startOf('day');
      let xldate = moment(XL).startOf('day');
      let serial = moment(this.start_date).diff(moment(XL), 'days') + 2;
      this.serial_number = serial;
      return this.serial_number;
    }
  }

  getPayrollShifts() {
    if(this.shifts && this.shifts.length > 0) {
      return this.shifts;
    } else {
      for(let i = 0; i < 7; i++) {
        let start = moment(this.start_date).add(i, 'days');
        let shift = new Shift('UNKNOWN', start, 'AM', moment(start), 12);
        this.shifts.push(shift);
      }
      return this.shifts;
    }
  }

  getNormalHours() {
    return this.total_hours;
  }

  setNormalHours(hours:number) {
    this.total_hours = hours;
    return this.total_hours;
  }

  /**
   * Need to add work report specific calculations in here for bonus hours
   *
   * @returns total_hours: a number ostensibly representing total normal hours plus bonus hours, where hours are eligible
   * @memberof PayrollPeriod
   */
  getPayrollHours() {
    return this.total_hours;
  }

  static getPayrollPeriodDateForShiftDate(date:moment.Moment | Date | string) {
    let scheduleStartsOnDay = 3;
    let day = null, periodStart = null;
    // return this.shift_week;
    if(isMoment(date) || date instanceof Date) {
      day = moment(date).startOf('day');
    } else if(typeof date === 'string') {
      day = moment(date, 'YYYY-MM-DD').startOf('day');
    } else {
      Log.e("PayrollPeriod.getPayrollPeriodForDate(): Error, need moment or Date or string, got:\n", date);
      return periodStart;
    }
    if (day.isoWeekday() >= scheduleStartsOnDay) {
      periodStart = day.isoWeekday(scheduleStartsOnDay).startOf('day');
    } else {
      periodStart = moment(day).subtract(1, 'weeks').isoWeekday(scheduleStartsOnDay).startOf('day');
    }
    return periodStart;
  }

}
