import * as moment from 'moment';

export class Shift {
  public site_name:string;
  public payroll_period:any;
  public shift_week:any;
  public shift_time:string = "AM";
  public start_time:any;
  public shift_length:number;
  public shift_number:any;
  
  constructor(site_name?, shift_week?, shift_time?, start_time?, shift_length?) {
    if(arguments.length == 1 && typeof arguments[0] == 'object') {
      this.readFromDoc(arguments[0]);
    } else {
      this.site_name = site_name || '';
      this.shift_week = shift_week || '';
      this.shift_time = shift_time || 'AM';
      this.start_time = start_time || '';
      this.shift_length = shift_length || -1;
      this.updateShiftNumber();
    }
  }

  public readFromDoc(doc) {
    for(let prop in doc) {
      this[prop] = doc[prop];
    }
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

  public updateShiftWeek() {
    // Schedule starts on day 3 (Wednesday)
    return this.getShiftWeek();
  }

  public getPayroll

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
    let endWeek = end_shift_week.format("M/DD");
    let dayStr = moment(this.start_time).format("M/DD");
    // let thisDay = this.start_time.day();
    // let thisDay = moment(this.start_time).day() - shiftWeekDay;

    // return `${dayStr} (Shift ${shiftNum} in ${shiftWeek}-${endWeek})`;
    return `${dayStr} (Shift ${shiftNum} in ${shiftWeek}-${endWeek})`;
  }

  public getShiftWeekID() {
    let shift_week_number = -1;
    let start_date = moment([1900, 1, 1]);
    if(moment.isMoment(this.shift_week)) {
      shift_week_number = this.shift_week.diff(start_date);
    }
    return shift_week_number;
  }
}