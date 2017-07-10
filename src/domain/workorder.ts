import { Log, isMoment, Moment, moment } from '../config/config.functions';
import { sprintf } from 'sprintf-js';
import { Employee } from './employee';

export const fields = [
  // [ "type"              , "type"           ] ,
  // [ "training_type"     , "training_type"  ] ,
  // [ "training_time"     , "training_time"  ] ,
  [ "time_start"        , "timeStarts"     ] ,
  [ "time_end"          , "timeEnds"       ] ,
  [ "repair_hours"      , "repairHrs"      ] ,
  [ "unit_number"       , "uNum"           ] ,
  [ "work_order_number" , "wONum"          ] ,
  [ "notes"             , "notes"          ] ,
  [ "report_date"       , "rprtDate"       ] ,
  [ "last_name"         , "lastName"       ] ,
  [ "first_name"        , "firstName"      ] ,
  [ "client"            , "client"         ] ,
  [ "location"          , "location"       ] ,
  [ "location_id"       , "locID"          ] ,
  [ "location_2"        , "loc2nd"         ] ,
  [ "shift_time"        , "shift"          ] ,
  [ "shift_length"      , "shiftLength"    ] ,
  [ "shift_start_time"  , "shiftStartTime" ] ,
  [ "shift_serial"      , "shiftSerial"    ] ,
  [ "payroll_period"    , "payrollPeriod"  ] ,
  [ "technician"        , "technician"     ] ,
  [ "timestamp"         , "timeStamp"      ] ,
  [ "timestampM"        , "timeStampM"     ] ,
  [ "username"          , "username"       ] ,
  [ "shift_serial"     ,  "shift_serial"   ] ,
  [ "payroll_period"   ,  "payroll_period" ] ,
  [ "_id"               , "_id"            ] ,
  [ "_rev"              , "_rev"           ] ,
];


export class WorkOrder {
  // public type             : string;
  // public training_type    : string;
  // public training_time    : number;
  public time_start       : any;
  public time_end         : any;
  public repair_hours     : any;
  public unit_number      : any;
  public work_order_number: any;
  public notes            : any;
  public report_date      : any;
  public last_name        : any;
  public first_name       : any;
  public shift            : any;
  public client           : any;
  public location         : any;
  public location_id      : any;
  public location_2       : any;
  public shift_time       : any;
  public shift_length     : any;
  public shift_start_time : any;
  public technician       : any;
  public timestamp        : any;
  public timestampM       : any;
  public username         : any;
  public shift_serial     : any;
  public payroll_period   : any;
  public _id              : any;
  public _rev             : any;

  constructor(start?: any, end?: any, hours?: any, unit?: any, wo?: any, nts?: any, date?: any, last?: any, first?: any, shift?: any, client?: any, loc?: any, locid?: any, loc2?: any, shiftTime?: any, shiftLength?: any, shiftStartTime?: any, tech?: any, timestamp?: any, user?: any) {
    // this.type              = ""                    ;
    // this.training_type     = ""                    ;
    // this.training_time     = 0                     ;
    this.time_start        = start          || null;
    this.time_end          = end            || null;
    this.repair_hours      = hours          || null;
    this.unit_number       = unit           || null;
    this.work_order_number = wo             || null;
    this.notes             = nts            || null;
    this.report_date       = date           || null;
    this.last_name         = last           || null;
    this.first_name        = first          || null;
    this.shift             = shift          || null;
    this.client            = client         || null;
    this.location          = loc            || null;
    this.location_id       = locid          || null;
    this.location_2        = loc2           || null;
    this.shift_serial      = null                  ;
    this.shift_time        = shiftTime      || null;
    this.shift_length      = shiftLength    || null;
    this.shift_start_time  = shiftStartTime || null;
    this.technician        = tech           || null;
    this.timestamp         = timestamp      || null;
    this.username          = user           || null;
    this.timestampM        = null                  ;
    this.shift_serial      = null                  ;
    this.payroll_period    = null                  ;
    this._id               = null                  ;
    this._rev              = null                  ;
  }

  public readFromDoc(doc:any) {
    let len = fields.length;
    for(let i = 0; i < len; i++) {
      let thisKey = fields[i][0];
      let docKey  = fields[i][1];
      this[thisKey] = doc[docKey];
    }
    this.time_start = moment(this.time_start);
    this.time_end   = moment(this.time_end);

  }

  public genReportID(tech:Employee) {
    let now = moment();
    // let idDateTime = now.format("dddDDMMMYYYYHHmmss");
    let idDateTime = now.format("YYYY-MM-DD_HH-mm-ss_ZZ_ddd");
    let docID = tech.avatarName + '_' + idDateTime;
    Log.l("genReportID(): Generated ID:\n", docID);
    return docID;
  }

  public serialize(tech:Employee) {
    Log.l("WorkOrder.serialize(): Now serializing report...");
    let ts = moment(this.timestamp);
    Log.l("WorkOrder.serialize(): timestamp moment is now:\n", ts);
    this.timestamp = ts.toExcel();
    this.timestampM = ts;
    let newReport = {_id: ""};
    let len = fields.length;
    for(let i = 0; i < len; i++) {
      let key1 = fields[i][0];
      let key2 = fields[i][1];
      if(key1 === 'time_start' || key1 === 'time_end' || key1 === 'timestampM') {
        newReport[key2] = this[key1].format();
      } else if(key1 === 'technician') {
        newReport[key2] = tech.getTechName();
      } else {
        newReport[key2] = this[key1] || tech[key2];
      }
      newReport['username'] = tech['avatarName'];
    }
    newReport._id = this._id || this.genReportID(tech);
    // newReport["_id"] = this._id;
    Log.l("WorkOrder.serialize(): Final serialized document is:\n", newReport);
    return newReport;
  }

  public getRepairHours() {
    let val = this.repair_hours || 0;
    return val;
  }

  public getRepairHoursString() {
    let hours = this.getRepairHours();
    let h = parseInt(hours);
    let m = (hours - h) * 60;
    let out = sprintf("%02d:%02d", h, m);
    return out;
  }

  public setStartTime(time:any) {
    if (isMoment(time) || moment.isDate(time)) {
      this.time_start = moment(time);
      this.report_date = moment(time).format("YYYY-MM-DD");
      this.checkTimeCalculations(0);
    } else {
      Log.l("WorkOrder.setStartTime(): Needs a date/moment, was given this:\n", time);
    }
  }

  public setEndTime(time:any) {
    if (isMoment(time) || moment.isDate(time)) {
      this.time_end = moment(time);
      this.checkTimeCalculations(1);
    } else {
      Log.l("WorkOrder.setEndTime(): Needs a date/moment, was given this:\n", time);
    }
  }

  public setRepairHours(duration:any) {
    if(moment.isDuration(duration)) {
      this.repair_hours = duration.asHours();
      this.checkTimeCalculations(2);
    } else if(typeof duration === 'number') {
      this.repair_hours = duration;
      this.checkTimeCalculations(2);
    } else {
      Log.l("WorkOrder.setRepairHours(): Need a duration or number, was given this:\n", duration);
    }
  }

  public adjustEndTime() {
    let start = this.time_start;
    let time = this.repair_hours;
    let end = this.time_end;
    // Log.l("adjustEndTime(): Now adjusting end time of work report. time_start, repair_hours, and time_end are:\n", start, time, end);
    if(typeof time !== 'number') {
      if(moment.isDuration(time)) {
        time = time.asHours();
      }
    }
    if(start !== null && isMoment(start) && typeof time === 'number') {
      let newEnd = moment(start).add(time, 'hours');
      if(end.isSame(newEnd)) {
        Log.l("adjustEndTime(): No need, end time is already correct.");
      } else {
        Log.l("adjustEndTime(): Adjusting end time to:\n", newEnd);
        this.time_end = newEnd;
      }
    } else {
      Log.l("adjustEndTime(): Can't adjust end time, time_start is not a valid moment or repair_hours is not a number:\n", start, time);
    }
  }

  public checkTimeCalculations(mode:number) {
    let start = this.time_start;
    let end = this.time_end;
    let time = this.repair_hours;
    let flag = false;
    if(isMoment(start) && isMoment(end) && start !== null && end !== null && typeof time === 'number') {
      let check = moment(start).add(time, 'hours');
      if (!check.isSame(end)) {
        Log.w("WO.checkTimeCalculations(): Start time plus repair hours does not equal end time!");
        Log.w("Start: %s\nEnd: %s\nHours: %s", start.format(), end.format(), time);
        this.adjustEndTime();
      }
    } else if(isMoment(start) && typeof time === 'number') {
      let end = moment(start).add(time, 'hours');
      this.time_end = end;
    } else if(isMoment(end) && typeof time === 'number') {
      let start = moment(end).subtract(time, 'hours');
      this.time_start = start;
    } else if(isMoment(start) && isMoment(end)) {
      let hours = moment(end).diff(start, 'hours', true);
      this.repair_hours = hours;
    } else {
      Log.w("WO.checkTimeCalculations(): Start or end times are not moments, or repair hours is not a number/duration!\nStart: %s\nEnd: %s\nHours: %s", start, end, time);
    }
  }

  public clone() {
    let newWO = new WorkOrder();
    let keys = Object.keys(this);
    for(let key of keys) {
      if(moment.isMoment(this[key])) {
        newWO[key] = moment(this[key]);
      } else if(typeof this[key] === 'object') {
        newWO[key] = Object.assign({}, this[key]);
      } else {
        newWO[key] = this[key];
      }
    }
    return newWO;
  }

}
