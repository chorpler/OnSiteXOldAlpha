import * as moment from 'moment';

export class Shift {
  public site_name:string;
  public shift_week:any;
  public shift_time:string = "AM";
  public start_time:any;
  public shift_length:number;
  
  constructor(site_name?, shift_week?, shift_time?, start_time?, shift_length?) {
    this.site_name = site_name || '';
    this.shift_week = shift_week || '';
    this.shift_time = shift_time || 'AM';
    this.start_time = start_time || '';
    this.shift_length = shift_length || -1;
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

  public getScheduleStartDate() {
    // Schedule starts on day 3 (Wednesday)
    return this.getShiftWeek();
  }

  public getShiftDescription() {
    // return this.site_name;
    let shiftWeek = this.shift_week.format("M/DD");
    // let shiftWeekDay = moment(this.shift_week).day() - 3;
    let end_shift_week = moment(this.shift_week).add(6, 'days');
    let shiftNum = Math.abs(this.shift_week.diff(this.start_time, 'days'))+1;
    let endWeek = end_shift_week.format("M/DD");
    let dayStr = moment(this.start_time).format("M/DD");
    // let thisDay = this.start_time.day();
    // let thisDay = moment(this.start_time).day() - shiftWeekDay;

    // return `${dayStr} (Shift ${shiftNum} in ${shiftWeek}-${endWeek})`;
    return `${dayStr} (Shift ${shiftNum} in ${shiftWeek}-${endWeek})`;
  }

  public getShift() {
    
  }
}