import * as moment from 'moment';
import { Log } from '../config/config.functions';

export class WorkOrder {
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
  public username: any;
  
  constructor(start?: any, end?: any, hours?: any, unit?: any, wo?: any, nts?: any, date?: any, last?: any, first?: any, shift?: any, client?: any, loc?: any, locid?: any, loc2?: any, shiftTime?: any, shiftLength?: any, shiftStartTime?: any, tech?: any, timestamp?: any, user?: any) {
    this.time_start = start || null;
    this.time_end = end || null;
    this.repair_hours = hours || null;
    this.unit_number = unit || null;
    this.work_order_number = wo || null;
    this.notes = nts || null;
    this.report_date = date || null;
    this.last_name = last || null;
    this.first_name = first || null;
    this.shift = shift || null;
    this.client = client || null;
    this.location = loc || null;
    this.location_id = locid || null;
    this.location_2 = loc2 || null;
    this.shift_time = shiftTime || null;
    this.shift_length = shiftLength || null;
    this.shift_start_time = shiftStartTime || null;
    this.technician = tech || null;
    this.timestamp = timestamp || null;
    this.username = user || null;
  }

  readFromDoc(doc:any) {
    for(let prop in doc) {
      this[prop] = doc[prop];
    }
  }

}