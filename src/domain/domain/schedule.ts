/**
 * Name: Schedule domain class
 * Vers: 5.0.1
 * Date: 2018-02-26
 * Auth: David Sargeant
 * Logs: 5.0.1 2018-02-26: Updated getScheduleStartDateFor() and getNextScheduleStartDateFor() methods
 * Logs: 4.3.1 2018-02-21: Added auto-creation of startXL/endXL fields if they don't exist in serialized doc
 * Logs: 4.2.1 2018-02-21: Added actual schedule document string->Employee conversion to loadTechs()
 * Logs: 4.1.1 2018-02-21: Fixed getTechRotation() to account for schedule being strings or Employee objects
 * Logs: 4.0.1 2018-02-21: Added a debugging output for loadTechs Log line
 * Logs: 4.0.0 2018-02-20: Added getTechUsernames(), isTechInSchedule(), isUsernameInSchedule(), getTechRotation(), getTechRotationSeq(), getRotationSeq() methods
 * Logs: 3.1.4 2017-09-19: Initial keeping of logs.
 */

import { sprintf                                        } from 'sprintf-js'       ;
import { Log, moment, Moment, isMoment, MomentInput, oo } from '../config'        ;
import { ScheduleListItem, ScheduleDocItem, SESACLL,    } from '../config'        ;
import { Jobsite, Employee, Shift                       } from './domain-classes' ;


export class Schedule {
  public sites         : Array<Jobsite>       = []    ;
  // public techs         : Array<Employee>      = []    ;
  // public shifts        : Array<Shift>         = []    ;
  // public payroll_period: number                       ;
  // public stats         : any = null                   ;
  // public techs         : Array<Employee>      = []    ;
  // public unassigned    : Array<Employee>      = []    ;
  public type          : string               = 'week';
  public creator       : string               = ""    ;
  public start         : Moment               = null  ;
  public end           : Moment               = null  ;
  public startXL       : number                       ;
  public endXL         : number                       ;
  public timestamp     : Moment                       ;
  public timestampXL   : number                       ;
  public schedule      : any = null                   ;
  public scheduleDoc   : Object                       ;
  public scheduleList  : Array<ScheduleListItem> = [] ;
  public techs         : Array<Employee>      = []    ;
  public unassigned    : Array<Employee>      = []    ;
  public backup        : boolean              = false ;
  public _id           : string               = ""    ;
  public _rev          : string               = ""    ;

  constructor(type?:string,creator?:string,start?:Moment|Date,end?:Moment|Date) {
    window['onsitedebug'] = window['onsitedebug'] || {};
    window['onsitedebug']['Schedule'] = Schedule;
    let today        = moment().startOf('day')  ;
    this.type        = type                     || "week"                       ;
    this.creator     = creator                  || "grumpy"                     ;
    this.start       = moment(start)            || moment(today)                ;
    this.end         = moment(end)              || moment(today).add(6, 'days') ;
    this.startXL     = moment(start).toExcel(true);
    this.endXL       = moment(end).toExcel(true);
    this.schedule    =                          {                               } ;
    this.scheduleDoc =                          {                               } ;
    this.techs       = []                       ;
    this.unassigned  = []                       ;
    this.timestamp   = moment()                 ;
    this.timestampXL = this.timestamp.toExcel() ;
    this.backup      = false                    ;
  }

  public readFromDoc(doc:any):Schedule {
    let keys = Object.keys(doc);
    for(let key of keys) {
      if(key === 'start' || key === 'end') {
        this[key] = moment(doc[key], "YYYY-MM-DD");
      } else if(key === 'timestamp') {
        this[key] = moment(doc[key]);
      } else if(key === 'schedule') {
        this[key] = doc[key];
        this.scheduleDoc = oo.clone(doc[key]);
      } else {
        this[key] = doc[key];
      }
    }
    if(keys.indexOf('creator') === -1) {
      this.creator = 'grumpy';
    }
    if(!this.startXL) {
      this.startXL = moment(this.start).toExcel(true);
    }
    if(!this.endXL) {
      this.endXL = moment(this.end).toExcel(true);
    }
    return this;
  }

  public saveToDoc():any {
    let doc:any = {};
    let keys = Object.keys(this);
    for(let key of keys) {
      if(key === 'techs' || key === 'unassigned') {
        let value:Array<any> = this[key];
        if(value[0] instanceof Employee) {
          let tmp = value.map((a:Employee) => a.username);
          doc[key] = tmp;
        } else if(typeof value[0] === 'string') {
          doc[key] = value;
        } else {
          doc[key] = this[key];
        }
      } else if(key === 'start' || key ==='end') {
        doc[key] = this[key].format("YYYY-MM-DD");
      } else if(key === 'startXL' || key === 'endXL') {
        doc[key] = this.start.toExcel(true);
      } else if(key === 'endXL') {
        doc[key] = this.end.toExcel(true);
      } else if(key === 'schedule') {
        let schDoc:any = {};
        for(let sitename in this.schedule) {
          schDoc[sitename] = {};
          for(let rotation in this.schedule[sitename]) {
            let shiftTechs = this.schedule[sitename][rotation];
            schDoc[sitename][rotation] = shiftTechs.map((a:Employee) => a.username);
          }
        }
        doc[key] = schDoc;
      } else if(key === 'timestamp') {
        doc[key] = this[key].format();
      } else {
        doc[key] = this[key];
      }
    }
    if(doc._id === undefined) {
      doc._id = this.getScheduleID();
    }
    doc.startXL = this.start.toExcel(true);
    doc.endXL = this.end.toExcel(true);
    return doc;
  }

  public deserialize(doc:any):Schedule {
    return this.readFromDoc(doc);
  }

  public static deserialize(doc:any):Schedule {
    let schedule = new Schedule();
    schedule.deserialize(doc);
    return schedule;
  }

  public serialize():any {
    return this.saveToDoc();
  }

  public loadTechs(employees:Array<Employee>):Schedule {
    let techNames = this.techs.slice(0);
    let unassignedNames = this.unassigned.slice(0);
    let techCount = techNames.length;
    let unassignedCount = unassignedNames.length;
    let techsConverted = 0, unassignedConverted = 0;
    for(let i = 0; i < techCount; i++) {
      let name:any = techNames[i];
      if(typeof name === 'string') {
        let tech:Employee = employees.find((a:Employee) => a.username === name);
        if(tech) {
          this.techs[i] = tech;
          techsConverted++;
        }
      }
    }
    for(let i = 0; i < unassignedCount; i++) {
      let name:any = unassignedNames[i];
      if(typeof name === 'string') {
        let tech:Employee = employees.find((a:Employee) => a.username === name);
        if(tech) {
          this.unassigned[i] = tech;
          unassignedConverted++;
        }
      }
    }
    let schedule = this.getSchedule();
    for(let siteName in schedule) {
      let siteRotations = schedule[siteName];
      for(let rotation in siteRotations) {
        let techNames = siteRotations[rotation];
        let techs:Array<Employee> = [];
        let len = techNames.length;
        for(let i = 0; i < len; i++) {
          let name:string = techNames[i];
          let tech = employees.find((a:Employee) => a.username === name);
          if(tech) {
            techNames[i] = tech;
          }
        }
      }
    }

    let id = this._id || 'unknown'
    Log.l(`Schedule.loadTechs(${id}): Converted ${techsConverted} working techs and ${unassignedConverted} unassigned techs.`);
    return this;
  }

  public loadSites(sites:Array<Jobsite>):Array<Jobsite> {
    let out:Array<Jobsite> = [];
    this.sites = sites;
    return this.sites;
  }

  public getType():string {
    return this.type;
  }

  public setType(value:string):string {
    if(value === 'week' || value === 'day') {
      this.type = value;
    } else {
      Log.e(`SCHEDULE.setType(): Error setting type '${value}', must be 'week' (default) or 'day'.`);
      return null;
    }
    return this.type;
  }

  public getCreator():string {
    return this.creator;
  }

  public setCreator(value:string):string {
    this.creator = value;
    return this.creator;
  }

  public getScheduleID():string {
    if(this._id) {
      return this._id;
    } else {
      let date = moment(this.start).format("YYYY-MM-DD");
      // let type = this.type;
      let creator = this.getCreator();
      let out = this._id ? this._id : `${date}_${creator}`;
      if(creator === 'grumpy') {
        out = this._id ? this._id : `${date}`;
      }
      this._id = out;
      return out;
    }
  }

  public getScheduleTitle():string {
    return moment(this.start).format("DD MMM YYYY");
  }

  public getStartDate(str?:boolean):Moment {
    return moment(this.start);
  }

  public setStartDate(day:Date|Moment):Moment {
    // let date;
    // if(isMoment(day) || day instanceof Date) {
    //   date = moment(day);
    // } else {
    //   date = moment(day, "YYYY-MM-DD");
    // }
    let date = moment(day);
    this.start = date.startOf('day');
    this.startXL = date.toExcel(true);
    return moment(this.start);
  }

  public getEndDate():Moment {
    return moment(this.end);
  }

  public setEndDate(day:Moment|Date):Moment {
    // let date;
    // if (isMoment(day) || day instanceof Date) {
    //   date = moment(day);
    // } else {
    //   date = moment(day, "YYYY-MM-DD");
    // }
    let date = moment(day);
    this.end = date.startOf('day');
    this.endXL = date.toExcel(true);
    return moment(this.end);
  }

  public getStartXL():number {
    return this.startXL;
  }

  public getEndXL():number {
    return this.endXL;
  }

  public getSchedule():any {
    return this.schedule;
  }

  public setSchedule(schedule:any):any {
    for(let i1 in schedule) {
      let el1 = schedule[i1];
      for(let i2 in el1) {
        let el2 = el1[i2];
        let employees = [];
        let replace = false;
        for(let entry of el2) {
          if(entry instanceof Employee) {
            continue;
          } else {
            // Log.l("setSchedule(): Entry is")
            let employee = new Employee();
            employee.readFromDoc(entry);
            let i = el2.indexOf(entry);
            el2[i] = employee;
          }
        }
        // if(replace) {
        //   el2 = employees;
        // }
      }
    }
    this.schedule = schedule;
    return this.schedule;
  }

  public getScheduleDoc():Object {
    let schedule:any = this.getSchedule();
    let keys = Object.keys(schedule);
    if(keys.length > 0) {
      return schedule;
    } else {
      Log.w(`Schedule.getScheduleDoc(): For schedule '${this.getScheduleID()}', unable to find proper scheduleDoc to return. Returning empty object.`);
      return {};
    }
  }

  public getScheduleList():Array<ScheduleListItem> {
    let list:Array<any> = this.scheduleList;
    if(list && Array.isArray(list) && list.length) {
      return list;
    } else {
      Log.w(`Schedule.getScheduleList(): For schedule '${this.getScheduleID()}', unable to get proper schedule list. Returning empty array.`);
      return [];
    }
  }

  public getTechs():Array<Employee> {
    return this.techs;
  }

  public setTechs(value:Array<Employee>) {
    // let techNames:Array<Employee> = [];
    // for(let tech of value) {
    //   if(tech instanceof Employee) {
    //     let name = tech.getUsername();
    //     techNames.push(name);
    //   } else if(typeof tech === 'string') {
    //     techNames.push(tech);
    //   }
    // }

    // this.techs = techNames;
    this.techs = value;
    return this.techs;
  }

  public getUnassigned():Array<Employee> {
    return this.unassigned;
  }

  public setUnassigned(value:Array<Employee>) {
    this.unassigned = value;
    return this.unassigned;
  }

  public addTech(tech:Employee):Array<Employee> {
    let ts = this.techs;
    let i = ts.findIndex((a:Employee) => {
      return a.username === tech.username;
    });
    if(i > -1) {
      ts.splice(i,1);
    }
    ts.push(tech);
    return this.techs;
  }

  public removeTech(tech:Employee):Array<Employee> {
    let ts = this.techs;
    let i = ts.findIndex((a:Employee) => {
      return a.username === tech.username;
    });
    if(i > -1) {
      ts.splice(i,1);
    }
    return this.techs;
  }

  public addUnassignedTech(tech:Employee):Array<Employee> {
    let ua = this.unassigned;
    let ts = this.techs;
    let i = ua.findIndex((a:Employee) => {
      return a.username === tech.username;
    });
    let j = ts.findIndex((a:Employee) => {
      return a.username === tech.username;
    });
    if(i > -1) {
      ua.splice(i,1);
    }
    ua.push(tech);
    if(j === -1) {
      ts.push(tech);
    }
    return this.unassigned;
  }

  public removeUnassignedTech(tech:Employee):Array<Employee> {
    let ua = this.unassigned;
    let ts = this.techs;
    let i = ua.findIndex((a:Employee) => {
      return a.username === tech.username;
    });
    let j = ts.findIndex((a:Employee) => {
      return a.username === tech.username;
    });
    if(i > -1) {
      ua.splice(i,1);
    }
    return this.unassigned;
  }

  public createSchedulingObject(sites:Array<Jobsite>, techs:Array<Employee>):any {
    let scheduleObject = {};
    this.unassigned = techs.slice(0);
    this.techs = techs.slice(0);
    let sch = this.schedule;
    let siteNames = Object.keys(sch);
    for(let site of sites) {
      let siteName = site.getScheduleName();
      scheduleObject[siteName] = {};
      for(let siteRotation of site.shiftRotations) {
        let rotation = siteRotation.name;
        scheduleObject[siteName][rotation] = [];
      }
    }
    for(let siteName of siteNames) {
      let siteObject = sch[siteName];
      scheduleObject[siteName] = scheduleObject[siteName] || {};
      let siteRotations = Object.keys(siteObject);
      for(let siteRotation of siteRotations) {
        let techList = siteObject[siteRotation];
        scheduleObject[siteName][siteRotation] = scheduleObject[siteName][siteRotation] || [];
        for(let tech of techList) {
          let name;
          if(tech instanceof Employee) {
            name = tech.getUsername();
          } else {
            name = tech;
          }
          let i = techs.findIndex((a:Employee) => {
            return a.username === name;
          });
          if(i > -1) {
            let tech = techs.splice(i, 1)[0];
            scheduleObject[siteName][siteRotation].push(tech);
          } else {
            Log.w(`createSchedulingObject(): Can't find tech '${name}' in tech array:\n`, techs);
          }
        }
      }
    }
    this.unassigned = techs.slice(0);
    this.schedule = scheduleObject;
    return scheduleObject;
  }

  public createEmptySchedule(sites:Array<Jobsite>):any {
    let schedule = {};
    for(let site of sites) {
      let siteName = site.getScheduleName();
      schedule[siteName] = {};
      for (let rot of site.shiftRotations) {
        let rotation = rot.name;
        schedule[siteName][rotation] = [];
      }
    }
    this.schedule = schedule;
    return this.schedule;
  }

  public createScheduleList():Array<Object> {
    let output:Array<Object> = [];
    let outDoc:any = {};
    let schedule = this.getSchedule();
    let sites:Jobsite[] = this.sites || [];
    for(let siteName in schedule) {
      let siteRotations = schedule[siteName];
      let site:Jobsite = this.sites.find((a:Jobsite) => {
        return a.schedule_name.toUpperCase() === siteName.toUpperCase();
      });
      let site_number:number = site.getSiteNumber();
      let output:Array<any> = [];
      for(let rotationName in siteRotations) {
        let techList = siteRotations[rotationName];
        for(let tech of techList) {
          let docRecord:any = {};
          let name = tech.getUsername();
          docRecord = {
            site: site_number,
            rotation: rotationName,
            shift: tech.getTech
          };
          outDoc[name] = docRecord;
          let newRecord = docRecord;
          docRecord['tech'] = name;
          output.push(docRecord);
          // if(tech instanceof Employee) {

          // } else if(typeof tech === 'string') {

          // }
        }
      }
      this.scheduleDoc = outDoc;
      this.scheduleList = output;
    }
    return output;
  }

  public getScheduleDocument():any {
    let sites:Jobsite[] = this.sites || [];
    let output:Array<Object> = [];
    let outDoc:any = {};
    let schedule = this.getSchedule();
    for(let siteName in schedule) {
      let siteRotations = schedule[siteName];
      let site:Jobsite = this.sites.find((a:Jobsite) => {
        return a.schedule_name.toUpperCase() === siteName.toUpperCase();
      });
      let site_number:number = site.getSiteNumber();
      let output:Array<any> = [];
      for(let rotationName in siteRotations) {
        let techList = siteRotations[rotationName];
        for(let tech of techList) {
          let docRecord:any = {};
          let name = tech.getUsername();
          docRecord = {
            site: site_number,
            rotation: rotationName,
            shift: tech.getTech
          };
          outDoc[name] = docRecord;
          let newRecord = docRecord;
          docRecord['tech'] = name;
          output.push(docRecord);
          // if(tech instanceof Employee) {

          // } else if(typeof tech === 'string') {

          // }
        }
      }
      this.scheduleDoc = outDoc;
      this.scheduleList = output;
    }
  }

  public getTechUsernames():Array<string> {
    let out:Array<string> = this.getTechs().map((a:Employee) => a.username);
    return out;
  }

  public isTechInSchedule(tech:Employee):boolean {
    let username = tech.getUsername();
    return this.isUsernameInSchedule(username);
  }

  public isUsernameInSchedule(name:string):boolean {
    let techInList = this.getTechs().find((a:Employee) => a.username === name);
    if(techInList) {
      return true;
    } else {
      let techUnassigned = this.getUnassigned().find((a:Employee) => a.username === name);
      if(techUnassigned) {
        return true;
      } else {
        return false;
      }
    }
  }

  public getTechRotation(tech:Employee):string {
    if(!this.isTechInSchedule(tech)) {
      // return "MISSING";
      return "UNASSIGNED";
    } else {
      let techRotation:string;
      let name = tech.getUsername();
      let schedule = this.getSchedule();
      outerloop:
      for(let siteName in schedule) {
        let siteRotations = schedule[siteName];
        for(let rotation in siteRotations) {
          let techs = siteRotations[rotation];
          let testCase = techs[0];
          let techNames:Array<string> = [];
          if(testCase) {
            if(testCase instanceof Employee) {
              techNames = techs.map((a:Employee) => a.username);
            } else if(typeof testCase === 'string') {
              techNames = techs;
            }
          }
          if(techNames.indexOf(name) > -1) {
            techRotation = rotation;
            break outerloop;
          }
          // let i = techs.findIndex((a:Employee) => {
          //   return a.username === tech.username;
          // });
          // if(i > -1) {
          //   techRotation = rotation;
          //   break outerloop;
          // }
        }
      }
      if(techRotation) {
        return techRotation;
      } else {
        let date = this.getStartDate().format("YYYY-MM-DD");
        Log.w(`Schedule.getTechRotation(): Unable to find tech rotation for '${tech.getUsername()}', date '${date}'`);
        return "UNASSIGNED";
      }
    }
  }

  public getTechRotationSeq(tech:Employee):string {
    let rotation = this.getTechRotation(tech);
    return this.getRotationSeq(rotation);
  }

  public static getRotationSeq(rotation:string|SESACLL):string {
    let a = "";
    if(typeof rotation === 'string') {
      a = rotation;
    } else if(typeof rotation === 'object' && rotation.name !== undefined) {
      a = rotation.name;
    } else {
      a = JSON.stringify(rotation);
    }
    let out = a === 'FIRST WEEK' ? "A" : a === 'CONTN WEEK' ? "B" : a === 'FINAL WEEK' ? "C" : a === 'DAYS OFF' ? "D" : a === 'VACATION' ? "V" : a === "UNASSIGNED" ? "X" : a === "MISSING" ? "Y" : "Z";
    return out;
  }

  public getRotationSeq(rotation:string|SESACLL):string {
    return Schedule.getRotationSeq(rotation);
  }

  public getTechLocation(tech:Employee, sites:Array<Jobsite>):Jobsite {
    let unassigned_site = sites.find((a:Jobsite) => a.site_number === 1);
    let name = tech.getUsername();
    let id = this.getScheduleID();
    if(!this.isTechInSchedule(tech)) {
      Log.w(`Schedule.getTechLocation(): tech '${name}' not found in schedule '${id}'.`);
      return unassigned_site;
    } else {
      let schedule = this.getSchedule();
      let scheduleName;
      outerloop:
      for(let siteName in schedule) {
        let siteRotations = schedule[siteName];
        for(let rotation in siteRotations) {
          let techs = siteRotations[rotation];
          let testCase = techs[0];
          let techNames:Array<string> = [];
          if(testCase) {
            if(testCase instanceof Employee) {
              techNames = techs.map((a:Employee) => a.username);
            } else if(typeof testCase === 'string') {
              techNames = techs;
            }
          }
          if(techNames.indexOf(name) > -1) {
            scheduleName = siteName;
            break outerloop;
          }
        }
      }
      if(scheduleName) {
        let site = sites.find((a:Jobsite) => a.getScheduleName().toUpperCase() === scheduleName.toUpperCase());
        if(site) {
          return site;
        } else {
          return unassigned_site;
        }
      } else {
        Log.w(`Schedule.getTechLocation(): tech '${name}' not found in any location of schedule '${id}'.`);
        return unassigned_site;
      }
    }
  }

  public getAllTechsForSite(site:Jobsite):Array<Employee> {
    let out:Array<Employee> = [];
    let outList:Array<any> = [];
    let scheduleName:string = site.getScheduleName() || "";
    let scheduleKey = scheduleName.toUpperCase();
    let schedule = this.getSchedule();
    let scheduleKeys = Object.keys(schedule);
    let keys:Array<string> = [];
    for(let key of scheduleKeys) {
      let scheduleName = key.toUpperCase();
      keys.push(scheduleName);
    }
    if(keys.indexOf(scheduleKey) === -1) {
      return out;
    } else {
      let siteRecord = schedule[scheduleName];
      if(siteRecord) {
        for(let rotationName in siteRecord) {
          let siteRotationTechs = siteRecord[rotationName];
          for(let tech of siteRotationTechs) {
            out.push(tech);
          }
        }
      }
      return out;
    }
  }

  public static getScheduleStartDateFor(date?:Moment|Date):Moment {
    let day                 = date ? moment(date).startOf('day') : moment().startOf('day');
    let scheduleStartsOnDay = 3;
    if(day.isoWeekday() < scheduleStartsOnDay) {
      return moment(day).subtract(1, 'weeks').isoWeekday(scheduleStartsOnDay);
    } else {
      return moment(day).isoWeekday(scheduleStartsOnDay);
    }
  }
  public static getNextScheduleStartDateFor(date?:Moment|Date):Moment {
    let day                 = date ? moment(date).startOf('day') : moment().startOf('day');
    let scheduleStartsOnDay = 3;
    if(day.isoWeekday() < scheduleStartsOnDay) {
      return day.isoWeekday(scheduleStartsOnDay);
    } else {
      return day.add(1, 'weeks').isoWeekday(scheduleStartsOnDay);
    }
  }
  public static getScheduleStartDateString(date?:Moment|Date):string {
    return Schedule.getScheduleStartDateFor(date).format("YYYY-MM-DD");
  }
  public static getNextScheduleStartDateString(date?:Moment|Date):string {
    return Schedule.getNextScheduleStartDateFor(date).format("YYYY-MM-DD");
  }

  public getScheduleStartDateFor(date?:Moment|Date):Moment {
    return Schedule.getScheduleStartDateFor(date);
  }
  public getNextScheduleStartDateFor(date?:Moment|Date):Moment {
    return Schedule.getNextScheduleStartDateFor(date);
  }
  public getScheduleStartDateString(date?:Moment|Date):string {
    return this.getScheduleStartDateFor(date).format("YYYY-MM-DD");
  }
  public getNextScheduleStartDateString(date?:Moment|Date):string {
    return this.getNextScheduleStartDateFor(date).format("YYYY-MM-DD");
  }

  public toString():string {
    return this.getScheduleID();
  }

}
