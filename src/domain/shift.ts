import { WorkOrder                     } from './workorder'                ;
import { ReportOther                   } from './reportother'              ;
import { Log, isMoment, moment, Moment } from '../config/config.functions' ;
import { sprintf                       } from 'sprintf-js'                 ;

const XL = moment([1900, 0, 1]);

export class Shift {
  public site_name           : string                        ;
  public shift_id            : number                        ;
  public shift_week_id       : number                        ;
  public payroll_period      : any                           ;
  public shift_week          : any                           ;
  public shift_time          : string             = "AM"     ;
  public start_time          : any                           ;
  public shift_length        : number                        ;
  public shift_number        : any                           ;
  public current_payroll_week: any                           ;
  public colors              : any                =      { } ;
  public XL                  : any                           ;
  public shift_serial        : any                           ;
  public shift_hours         : any                           ;
  public shift_reports       : Array<WorkOrder>   = []       ;
  public other_reports       : Array<ReportOther> = []       ;

  constructor(site_name?, shift_week?, shift_time?, start_time?, shift_length?) {
    if(arguments.length == 1 && typeof arguments[0] == 'object') {
      this.readFromDoc(arguments[0]);
    } else {
      this.site_name      = site_name    || ''   ;
      this.shift_week     = shift_week   || ''   ;
      this.shift_time     = shift_time   || 'AM' ;
      this.start_time     = start_time   || ''   ;
      this.shift_length   = shift_length || -1   ;
      this.shift_id       = -1                   ;
      this.shift_number   = -1                   ;
      this.shift_week_id  = -1                   ;
      this.payroll_period = null                 ;
      this.shift_serial   = null                 ;
      this.shift_hours    = 0                    ;
      this.updateShiftNumber();
      this.colors = {'red': false, 'green': false, 'blue': false};
      this.XL = { 'shift_time': null, 'shift_week': null, 'current_payroll_week': null};
      this.getShiftWeek();
      this.getShiftColor();
      this.getCurrentPayrollWeek();
      this.getExcelDates();
      this.getShiftNumber();
      this.getShiftSerial();
    }
  }

  public readFromDoc(doc) {
    for(let prop in doc) {
      this[prop] = doc[prop];
    }
    this.getShiftColor();
  }

  public getStartTime() {
    if(isMoment(this.start_time)) {
      return moment(this.start_time);
    } else {
      Log.w("getStartTime(): Can't, start_time is not a moment:\n", this.start_time);
    }
  }

  public setStartTime(time:Moment|string) {
    let start;
    if(time && isMoment(time)) {
      start = moment(time);
      this.start_time = start;
    } else if(time && typeof time === 'string' && time.length > 5) {
      start = moment(time);
      this.start_time = start;
    } else if(time && typeof time === 'string') {
      let xl = this.shift_id;
      start = moment().fromExcel(xl);
      let times = time.split(":");
      let hrs = Number(times[0]);
      let min = Number(times[1]);
      if(!isNaN(hrs)) {
        start.hour(hrs);
      }
      if(!isNaN(min)) {
        start.minutes(min);
      }
      this.start_time = start;
    }
    return this.start_time;
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
      this.current_payroll_week = moment(now).subtract(1, 'weeks').isoWeekday(scheduleStartsOnDay).startOf('day');
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
    // let start_date = moment(XL);
    if(moment.isMoment(this.shift_week)) {
      shift_week_number = this.shift_week.diff(XL, 'days') + 2;
    }
    return shift_week_number;
  }

  public getPayrollPeriod() {
    return this.getShiftWeekID();
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
    let week = this.shift_week_id;
    let num = sprintf("%02d", this.shift_number);
    let strShiftID = `${week}_${num}`;
    this.shift_serial = strShiftID;
    return strShiftID;
  }

  getExcelDates() {
    let now                      = moment()                             ;
    let day                      = moment(this.start_time)              ;
    let week                     = moment(this.getShiftWeek())          ;
    let nowWeek                  = moment(this.getCurrentPayrollWeek()) ;
    let nowXL                    = now.toExcel()                        ;
    let dayXL                    = day.toExcel()                        ;
    let weekXL                   = week.toExcel(true)                   ;
    let currentWeekXL            = nowWeek.toExcel(true)                ;
    let nextWeekXL               = weekXL + 7                           ;
    this.shift_week_id           = weekXL                               ;
    this.payroll_period          = weekXL                               ;
    this.shift_id                = dayXL                                ;
    this.XL.today_XL             = nowXL                                ;
    this.XL.shift_time           = dayXL                                ;
    this.XL.shift_id             = dayXL                                ;
    this.XL.shift_week           = weekXL                               ;
    this.XL.current_payroll_week = currentWeekXL                        ;
    this.XL.next_week_XL         = nextWeekXL                           ;
    return this.XL;
  }

  getShiftLength() {
    return this.shift_length;
  }

  setShiftLength(hours:number) {
    this.shift_length = hours;
    return this.shift_length;
  }

  getShiftColor() {
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
    // Log.l("getShiftColor(): Shift is now:\n", this);
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

  setShiftReports(reports:Array<WorkOrder>) {
    this.shift_reports = reports;
    return this.shift_reports;
  }

  addShiftReport(report:WorkOrder) {
    this.shift_reports.push(report);
    return this.shift_reports;
  }

  getShiftReports() {
    return this.shift_reports;
  }

  getShiftOtherReports() {
    return this.other_reports;
  }

  getTotalShiftHours() {
    return this.getNormalHours();
  }

  getTotalPayrollHoursForShift() {
    let shiftTotal = this.getTotalShiftHours();
    let bonusHours = this.getTotalBonusHoursForShift();
    shiftTotal += bonusHours;
    // Log.l("getTotalPayrollHoursForShift(): For shift %s, %d reports, %f hours, %f hours eligible, so bonus hours = %f.\nShift total: %f hours.", this.getShiftSerial(), this.shift_reports.length, shiftTotal, countsForBonusHours, bonusHours, shiftTotal);
    return shiftTotal;
  }

  public getTotalBonusHoursForShift() {
    let shiftTotal = 0, bonusHours = 0, countsForBonusHours = 0;
    for (let report of this.shift_reports) {
      if (!report['type'] || report['type'] === 'Work Report') {
        let subtotal = report.getRepairHours();
        shiftTotal += subtotal;
        if (report.client !== "SESA") {
          countsForBonusHours += subtotal;
        }
      }
    }
    if (countsForBonusHours >= 8 && countsForBonusHours <= 11) {
      bonusHours = 3;
    } else if (countsForBonusHours > 11) {
      bonusHours = 3 + (countsForBonusHours - 11);
    }
    // shiftTotal += bonusHours;
    // Log.l("getTotalPayrollHoursForShift(): For shift %s, %d reports, %f hours, %f hours eligible, so bonus hours = %f.\nShift total: %f hours.", this.getShiftSerial(), this.shift_reports.length, shiftTotal, countsForBonusHours, bonusHours, shiftTotal);
    return bonusHours;
  }

  getNormalHours() {
    let total = 0;
    for (let report of this.shift_reports) {
      if (report['type'] === undefined || report['type'] === 'Work Report') {
        total += report.getRepairHours();
      } else {
        /* ToDo(2017-07-05): Ask Mike if miscellaneous reports should count for shift hours, or what */
      }
    }
    return total;
  }

  getPayrollHours() {
    return this.getTotalPayrollHoursForShift();
  }

  getBonusHours() {
    return this.getTotalBonusHoursForShift();
  }

  getTrainingHours() {
    let total = 0;
    for(let other of this.other_reports) {
      if(other.type !== undefined && other.type === 'Training') {
        total += other.getTotalHours();
      }
    }
    return total;
  }

  getTravelHours() {
    let total = 0;
    for(let other of this.other_reports) {
      if(other.type !== undefined && other.type === 'Travel') {
        total += other.getTotalHours();
      }
    }
    return total;
  }

  getOtherReports() {
    return this.other_reports;
  }

  setOtherReports(others:Array<ReportOther>) {
    this.other_reports = [];
    for(let other of others) {
      this.other_reports.push(other);
    }
    return this.other_reports;
  }

  addOtherReport(other:ReportOther) {
    this.other_reports.push(other);
    return this.other_reports;
  }

  // getShiftHoursStatus() {
    // let ss = shift;
    // if (ss !== undefined && ss !== null) {
    //   let total = this.shiftSavedHours + this.currentRepairHours - this.thisWorkOrderContribution;
    //   let target = this.getShiftLength();
    //   // Log.l(`getShiftHoursStatus(): total = ${total}, target = ${target}.`);
    //   if (total < target) {
    //     return 'darkred';
    //   } else if (total > target) {
    //     return 'red';
    //   } else {
    //     return 'green';
    //   }
    // } else {
    //   return 'black';
    // }
  // }

  getShiftReportsStatus() {
    let others  = this.getOtherReports() ;
    let reports = this.getShiftReports() ;
    let output  = []                     ;
    // let slcode  = ""                     ;
    let data    = {status: 0, hours: 0, code: ""};
    // let data    = {status: 0, hours: 0, code: output};
    // M Training and Travel
    // T Training
    // Q Travel
    // S Standby for Duncan
    // E Sick Day or Sick Hrs
    // V Vacation
    // H Holiday
    for(let other of others) {
      let type = other.type;
      if(type === 'Training') {
        output.push("T");
        // if(data.code === "Q") {
        //   data.code = "M";
        // } else {
        //   data.code = "T";
        // }

        // let i = output.indexOf("Q");
        // let j = output.indexOf("T");
        // if(i > -1) {
        //   output[i] = "M";
        // } else if(j > -1) {
        //   output[i] = "M";
        // } else {
        //   output.push("T");
        // }
      } else if(type === 'Travel') {
        output.push("Q");
        // let i = output.indexOf("T");
        // let j = output.indexOf("Q");
        // if(i > -1) {
        //   output[i] = "M";
        // } else if(j > -1) {
        //   output[i] = "M";
        // } else {
        //   output.push("Q");
        // }
        // if(data.code === "T") {
        //   data.code = "M";
        // } else {
        //   data.code = "Q";
        // }
      } else if(type === 'Standby') {
        output.push("S");

      } else if(type === 'Standby: HB Duncan') {
        output.push("S");
        // if(output.indexOf("S") === -1) {
        //   output.push("S");
        // }
        // data.code = "S";
      } else if(type === 'Sick') {
        output.push("E");
        // if(output.indexOf("E") === -1) {
        //   output.push("E");
        // }
        // data.code = "E";
      } else if(type === 'Vacation') {
        output.push("V");
        // if(output.indexOf("V") === -1) {
        //   output.push("V");
        // }
        // data.code = "V"
      } else if(type === 'Holiday') {
        output.push("H");
        // if(output.indexOf("H") === -1) {
        //   output.push("H");
        // }
        // data.code = "H";
      }
    }
    if(reports.length > 0) {
      let hrs = this.getNormalHours();
      data.hours = hrs;
    }
    // Log.l("Shift: final ReportOther status is:\n", output);
    if(output.indexOf("T") > -1 && output.indexOf("Q") > -1) {
      data.code = "M";
    } else if(output.indexOf("T") > -1) {
      data.code = "T";
    } else if(output.indexOf("Q") > -1) {
      data.code = "Q";
    } else if(output.indexOf("S") > -1) {
      data.code = "S";
    } else if(output.indexOf("E") > -1) {
      data.code = "E";
    } else if(output.indexOf("V") > -1) {
      data.code = "V";
    } else if(output.indexOf("H") > -1) {
      data.code = "H";
    } else {
      data.code = "";
    }
    // if(output.length > 1) {
    //   data.status++;
    // }
    if(data.code) {
      data.status = 1;
    }
    return data;
  }

  public getSpecialHours(type?:string) {
    let others = this.getOtherReports();
    let total = 0;
    let codeTotal = 0;
    let codes = "";
    for(let other of others) {
      if(type) {
        if(other.type === type) {
          let hours = other.getTotalHours();
          if(typeof hours === 'number') {
            total += hours;
          } else {
            codes += hours;
            if(hours === "S") {
              total += 8;
            }
          }
        }
      } else {
        let hours = other.getTotalHours();
        if(typeof hours === 'number') {
          total += hours;
        } else {
          codes += hours;
          if (hours === "S") {
            total += 8;
          }
        }
      }
    }
    return {codes: codes, hours: total};
  }

  getShiftHours() {
    return this.getNormalHours();
  }

  setShiftHours(hours: number) {
    this.shift_hours = hours;
  }

  getShiftStatus() {
    let hours = this.getNormalHours();
    let total = this.getShiftLength();
    let status = this.getShiftReportsStatus().status;
    return status ? "hoursComplete" : (hours > total) ? "hoursOver" : (hours < total) ? "hoursUnder" : (hours === total) ? "hoursComplete" : "hoursUnknown";
  }

  toString(translate?:any) {
    let strOut:string = null;
    let start:string = moment(this.start_time).format("MMM DD");
    let weekID = this.getShiftWeekID();
    let weekStart = moment(this.shift_week).format("MMM DD");
    let payrollWeek = "Payroll week";
    if(translate) {
      payrollWeek = translate.instant('payroll_week');
    }
    strOut = `${start} (${payrollWeek} ${weekStart})`;
    return strOut;
  }

}
