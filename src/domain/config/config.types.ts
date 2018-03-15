/**
 * Name: Various TypeScript types for OnSiteX/OnSiteConsoleX apps
 * Vers: 4.0.0
 * Date: 2018-02-21
 * Auth: David Sargeant
 * Logs: 4.0.0 2018-02-21: Added a scheduleName property to CLL classes
 * Logs: 3.1.1 2018-02-09: Added Shift View page to Pages
 * Logs: 3.0.1 2018-02-04: Now requires bignumber.js@6.0.0 or later
 * Logs: 2.0.1 2018-01-21: Added to OnSiteXDomains,
 * Logs: 1.0.1 2018-01-20: Created (this statement is a paradoxical lie)
 */

import * as blobsUtil    from 'blob-util'       ;
import * as JSON8        from 'json8'           ;
import * as JSON5p0      from 'json5'           ;
import * as JSON8Patch   from 'json8-patch'     ;
import * as JSON8Pointer from 'json8-pointer'   ;
// import * as JSONPathLib  from 'jsonpath'        ;
import * as UUID0        from 'uuid'            ;
import * as XLSX0        from 'xlsx'            ;
import * as FILE_SAVER   from 'file-saver'      ;
import { sprintf } from 'sprintf-js';
import { BigNumber }     from 'bignumber.js';
import { round, roundMaxDecimals } from './config.functions';

export const blobUtil      = blobsUtil    ;
export const oo            = JSON8        ;
export const json8         = JSON8        ;
export const dec           = BigNumber    ;
// export const JSONPath      = JSONPathLib  ;
export type  Decimal       = BigNumber;
export type  DecimalConfig = BigNumber.Config;
// BigNumber.config({ERRORS: false});

// export type Moment = momentous.Moment;
export type JSON8 = JSON8.JSON8;
export const json5     = JSON5p0;
export const JSON5     = JSON5p0;
export const ooPatch   = JSON8Patch   ;
export const ooPointer = JSON8Pointer ;
export const pointer   = JSON8Pointer ;
export const UUID      = UUID0        ;
// export const XLSXStyle = XlsxStyle    ;
export const fileSaver = FILE_SAVER   ;
export type FileSaver  = FILE_SAVER.FileSaver;
export const SaveAs    = FILE_SAVER.saveAs;

export const XLSX = XLSX0;
export const xlsx = XLSX0;

// export var moment = momentous;

// var mom = momentous;

// momentous['parseFormat'] = parseFormat;
// momentous['timer'] = timer;
// momentous['round'] = momentround;

// momentous.fn['round'] = function (precision: number, key: string, direction?: string): Moment {
//   if (typeof direction === 'undefined') {
//     direction = 'round';
//   }

//   var keys = ['Hours', 'Minutes', 'Seconds', 'Milliseconds'];
//   var maxValues = [24, 60, 60, 1000];

//   // Capitalize first letter
//   key = key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();

//   // make sure key is plural
//   if (key.indexOf('s', key.length - 1) === -1) {
//     key += 's';
//   }
//   var value = 0;
//   var rounded = false;
//   var subRatio = 1;
//   var maxValue;
//   for (var i in keys) {
//     var k = keys[i];
//     if (k === key) {
//       value = this._d['get' + key]();
//       maxValue = maxValues[i];
//       rounded = true;
//     } else if (rounded) {
//       subRatio *= maxValues[i];
//       value += this._d['get' + k]() / subRatio;
//       this._d['set' + k](0);
//     }
//   };

//   value = Math[direction](value / precision) * precision;
//   value = Math.min(value, maxValue);
//   this._d['set' + key](value);

//   return this;
// }

// momentous.fn['ceil'] = function (precision, key) {
//   return this.round(precision, key, 'ceil');
// }

// momentous.fn['floor'] = function (precision, key) {
//   return this.round(precision, key, 'floor');
// }


// momentous.fn['toExcel'] = moment2excel;
// momentous['fromExcel'] = excel2moment;
// momentous.fn['fromExcel'] = excel2moment;
// mom['fromExcel'] = excel2moment;
// moment2excel.bind(moments);
// excel2moment.bind(moments);
// export type Moment = Momentous;


// export const moment = momentous;

export type Spinners = Map<string,any>;

export interface SpinnerRecord {
  id     : string;
  spinner: any;
}

export interface Tab {
  name     : string ;
  fullName : string ;
  icon     : string ;
  waiting ?: boolean;
  active  ?: boolean;
  show     : boolean;
  role     : string ;
}

export interface SelectString {
  name     : string;
  fullName?: string;
  value   ?: string;
  code    ?: string;
  hours   ?: number;
}

export interface CLL {
  name          : string;
  fullName      : string;
  value        ?: string;
  code         ?: string;
  capsName     ?: string;
  techClass    ?: string;
  scheduleName ?: string;
}

export class SESACLL implements CLL {
  public name         : string = "";
  public fullName     : string = "";
  public value        : string = "";
  public code         : string = "";
  public capsName     : string = "";
  public scheduleName : string = "";
  // constructor(name?:string, fullName?:string, value?:string, code?:string, capsName?:string, scheduleName?:string) {
  constructor({
    name         = "",
    fullName     = "",
    value        = "",
    code         = "",
    capsName     = "",
    scheduleName = "",
  }:{name?:string,fullName?:string,value?:string,code?:string,capsName?:string,scheduleName?:string}={}) {
    this.name         = name         ? name         : "";
    this.fullName     = fullName     ? fullName     : "";
    this.value        = value        ? value        : "";
    this.code         = code         ? code         : "";
    this.capsName     = capsName     ? capsName     : "";
    this.scheduleName = scheduleName ? scheduleName : "";
  }

  public readFromDoc(doc:any):SESACLL {
    let localKeys = Object.keys(this);
    let docKeys   = Object.keys(doc);
    for(let key of docKeys) {
      if(localKeys.indexOf(key) > -1) {
        this[key] = doc[key];
      }
    }
    return this;
  }

  public serialize():any {
    let keys = Object.keys(this);
    let doc:any = {};
    for(let key of keys) {
      doc[key] = this[key];
    }
    return doc;
  }

  public deserialize(doc:any):SESACLL {
    this.readFromDoc(doc);
    return this;
  }

  public static deserialize(doc:any):SESACLL {
    let item = new SESACLL();
    item.deserialize(doc);
    return item;
  }

  public getScheduleName():string {
    if(this.scheduleName) {
      return this.scheduleName;
    } else {
      return this.fullName;
    }
  }
}

export class SESAClient extends SESACLL {
  constructor({
    name         = "",
    fullName     = "",
    value        = "",
    code         = "",
    capsName     = "",
    scheduleName = "",
  }:{name?:string,fullName?:string,value?:string,code?:string,capsName?:string,scheduleName?:string}={}) {
    super(arguments[0]);
  }
  public static deserialize(doc:any) {
    let item = new SESAClient();
    item.deserialize(doc);
    return item;
  }
}

export class SESALocation extends SESACLL {
  // constructor(name?:string, fullName?:string, value?:string, code?:string, capsName?:string) {
  constructor({
    name         = "",
    fullName     = "",
    value        = "",
    code         = "",
    capsName     = "",
    scheduleName = "",
  }:{name?:string,fullName?:string,value?:string,code?:string,capsName?:string,scheduleName?:string}={}) {
    super(arguments[0]);
  }
  public static deserialize(doc:any) {
    let item = new SESALocation();
    item.deserialize(doc);
    return item;
  }
}

export class SESALocID extends SESACLL {
  public techClass:string = "";
  constructor({
    name         = "",
    fullName     = "",
    value        = "",
    code         = "",
    capsName     = "",
    scheduleName = "",
    techClass    = "",
  }:{name?:string,fullName?:string,value?:string,code?:string,capsName?:string,techClass?:string,scheduleName?:string}={}) {
    super(arguments[0]);
    this.techClass = techClass ? techClass : "";
  }

  public static deserialize(doc:any) {
    let item = new SESALocID();
    item.deserialize(doc);
    return item;
  }
}

export class SESAAux extends SESACLL {
  constructor({
    name         = "",
    fullName     = "",
    value        = "",
    code         = "",
    capsName     = "",
    scheduleName = "",
  }:{name?:string,fullName?:string,value?:string,code?:string,capsName?:string,scheduleName?:string}={}) {
    super(arguments[0]);
  }
  public static deserialize(doc:any) {
    let item = new SESAAux();
    item.deserialize(doc);
    return item;
  }
}

// export type CLL = SESAClient | SESALocation | SESALocID | SESALocAux;

export interface ReportFlag {
  field  : string;
  reason : string;
}

export enum Pages {
  'OnSiteHome'      = 0,
  'Report'          = 1,
  'ReportView'      = 1,
  'Report View'     = 1,
  'ReportHistory'   = 2,
  'Report History'  = 2,
  'User'            = 3,
  'Message List'    = 4,
  'MessageList'     = 4,
  'Settings'        = 5,
  'DevPage'         = 6,
  'Message'         = 7,
  'Comment'         = 8,
  'Fancy Select'    = 9,
  'Testing'         = 10,
  'Flagged Reports' = 11,
  'Reports Flagged' = 11,
  'ReportsFlagged'  = 11,
  'FlaggedReports'  = 11,
  'Shift View'      = 12,
  'ShiftView'       = 12,
}

export enum Icons {
  'box-check-no'   = 0,
  'box-check-yes'  = 1,
  'flag-blank'     = 2,
  'flag-checkered' = 3,
  'unknown'        = 4,
}

export const enum ReportType {
  'standby'  = 0,
  'training' = 1,
  'travel'   = 2,
  'holiday'  = 3,
  'vacation' = 4,
  'sick'     = 5,
};

export const enum reportType {
  'Standby'     = 0,
  'Training'    = 1,
  'Travel'      = 2,
  'Holiday'     = 3,
  'Vacation'    = 4,
  'Sick'        = 5,
  'Work Report' = 6,
};

export const SVGIcons = {
   'checkboxno'    : `<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50" version="1.1" preserveAspectRatio="xMidYMid meet" id="box-check-no">\n   <path d="M 45.833333,4.166667 V 45.833333 H 4.1666667 V 4.166667 Z M 50,0 H 0 v 50 h 50 z m -12.5,34.454167 -9.566667,-9.475 9.470834,-9.55625 -2.95,-2.922917 -9.46875,9.560417 L 15.427083,12.595833 12.5,15.522917 22.06875,25.00625 12.595833,34.572917 15.522917,37.5 25.0125,27.925 l 9.564583,9.479167 z" />\n</svg>`,
   'checkboxyes'   : `<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50" version="1.1" preserveAspectRatio="xMidYMid meet" id="box-check-yes">\n   <path d="M 22.916667,35.416667 12.5,24.377083 l 2.914583,-2.979166 7.445834,7.783333 13.691666,-14.597917 3.03125,2.922917 z m 22.916666,-31.25 V 45.833333 H 4.1666667 V 4.166667 Z M 50,0 H 0 v 50 h 50 z" />\n</svg>`,
   'flagblank'     : `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="50" viewBox="0 0 40 50" version="1.1" preserveAspectRatio="xMidYMid meet" id="flag-blank">\n   <path d="m 31.657777,6.790993 c -7.466667,0 -7.635555,-4.863905 -16.304444,-4.863905 -4.684444,0 -9.055555,1.646505 -10.9088886,2.846103 V 0 H 0 V 50 H 4.4444444 V 25.078958 C 7.075555,23.702948 11.064444,22.25471 15.384444,22.25471 c 8.186667,0 9.335555,4.62702 16.631111,4.62702 C 36.731111,26.88173 40,24.598447 40,24.598447 V 4.390126 c 0,0 -3.602223,2.400867 -8.342223,2.400867 z m 3.897778,16.034942 c -0.888889,0.347799 -2.131111,0.695571 -3.54,0.695571 -2.16,0 -3.328889,-0.60988 -5.268889,-1.619632 -2.435555,-1.26848 -5.768889,-3.007387 -11.362222,-3.007387 -4.397778,0 -8.244444,1.140786 -10.9399996,2.249668 V 8.56351 C 6.708889,7.048057 10.811111,5.288976 15.353333,5.288976 c 2.962222,0 4.208889,0.737577 6.091111,1.853162 2.146667,1.270155 5.084444,3.010744 10.213333,3.010744 1.393334,0 2.700001,-0.144488 3.897778,-0.374645 z" />\n</svg>`,
   'flagcheckered' : `<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50" preserveAspectRatio="xMidYMid meet" id="flag-checkered">\n   <path d="m 35.200566,6.315625 c -6.533349,0 -6.681132,-4.5234375 -14.266395,-4.5234375 -4.098888,0 -7.923605,1.53125 -9.545282,2.646875 V 0 H 7.5 v 50 h 3.888889 V 23.323437 C 13.691106,22.04375 17.181394,20.696875 20.961394,20.696875 28.124717,20.696875 29.13,25 35.513606,25 39.639717,25 42.5,22.876562 42.5,22.876562 V 4.0828125 c 0,0 -3.151934,2.2328125 -7.299434,2.2328125 z m 3.41054,8.160938 C 33.911394,17.253125 28.8325,13.945313 26.263894,12.582812 v 5.732813 l 0.0061,0.0016 c -1.471946,-0.435935 -3.198612,-0.74531 -5.308336,-0.74531 -3.848051,0 -7.213888,1.060937 -9.572499,2.092188 V 13.742228 C 15.78331,10.660977 22.17081,10.253165 26.263875,12.582852 V 6.640625 c 1.878328,1.18125 4.448893,2.8 8.93666,2.8 1.219168,0 2.3625,-0.134375 3.410562,-0.3484375 z" />\n</svg>`,
   'unknown'       : `<span class="fake-svg">?</span>`,
}

export interface ScheduleListItem {
  tech     : string;
  site     : number;
  rotation : string;
  shift    : "AM"|"PM";
}

export interface ScheduleDocItem {
  site     : number;
  rotation : string;
  shift    : "AM"|"PM";
}

export interface ConsoleMenuItemStyle {
  color        ?: string;
  "max-height" ?: string;
}

export interface ConsoleMenuIconStyle {
  color: string;
}

export interface ConsoleMenuIcon {
  class  : string;
  style ?: ConsoleMenuIconStyle;
}

export interface ConsoleSubMenuItem {
  parent       : string                ;
  title        : string                ;
  page         : string                ;
  tooltip      : string                ;
  icon         : ConsoleMenuIcon       ;
  class       ?: string                ;
  style       ?: string                ;
  hover        : boolean               ;
  active       : boolean               ;
}

export interface ConsoleMenuItem {
  title        : string                   ;
  page         : string                   ;
  tooltip      : string                   ;
  icon         : ConsoleMenuIcon          ;
  class       ?: string                   ;
  style       ?: ConsoleMenuItemStyle     ;
  hover        : boolean                  ;
  active       : boolean                  ;
  role         : string                   ;
  showSubMenu ?: boolean                  ;
  hasSubmenu  ?: boolean                  ;
  submenu     ?: Array<ConsoleSubMenuItem>;
}

export interface ConsoleMenu {
  home      : ConsoleMenuItem;
  schedule  : ConsoleMenuItem;
  employees : ConsoleMenuItem;
  sites     : ConsoleMenuItem;
  payroll   : ConsoleMenuItem;
  invoices  : ConsoleMenuItem;
  reports   : ConsoleMenuItem;
  issues    : ConsoleMenuItem;
  messages  : ConsoleMenuItem;
  phones    : ConsoleMenuItem;
  geo       : ConsoleMenuItem;
  config    : ConsoleMenuItem;
  dev       : ConsoleMenuItem;
}

export interface IDatabaseProgress {
  dbname  ?: string;
  dbkey   ?: string;
  done    ?: number;
  total   ?: number;
  percent ?: number;
}

export class DatabaseProgress implements IDatabaseProgress {
  public dbname  ?: string = "";
  public dbkey   ?: string = "";
  public done     : number = 0 ;
  public total    : number = 0 ;
  public percent  : number = 0 ;
  public touched  : boolean = false;
  constructor({dbname = "", dbkey = "", done = 0, total = 0, percent = 0}:IDatabaseProgress) {
    this.dbname  = dbname  ;
    this.dbkey   = dbkey   ;
    this.done    = done    ;
    this.total   = total   ;
    this.percent = percent ;
    this.touched = false   ;
    // this.dbname  = dbname  !== undefined ? dbname  : this.dbname  !== undefined ? this.dbname  : "";
    // this.dbkey   = dbkey   !== undefined ? dbkey   : this.dbkey   !== undefined ? this.dbkey   : "";
    // this.done    = done    !== undefined ? done    : this.done    !== undefined ? this.done    : 0 ;
    // this.total   = total   !== undefined ? total   : this.total   !== undefined ? this.total   : -1;
    // this.percent = percent !== undefined ? percent : this.percent !== undefined ? this.percent : 0 ;
  }
  public getFraction():number {
    if(this.total === 0) {
      if(this.touched) {
        return 1;
      } else {
        return 0;
      }
    } else {
      return this.done / this.total;
    }
  }
  public getPercent(maxDecimals?:number):number {
    let out:number = 100*this.getFraction();
    if(maxDecimals !== undefined) {
      out = roundMaxDecimals(out, maxDecimals);
    }
    this.percent = out;
    return out;
  }
  public getPercentString(decimalPlaces?:number):string {
    let places:number = decimalPlaces !== undefined ? decimalPlaces : 2;
    let percent:number = this.getPercent();
    percent = roundMaxDecimals(percent, places);
    let printString = `%.${places}f`;
    let out:string = sprintf(printString, percent);
    return out;
  }
}

 export var STRINGS = {
  NUMCHARS: ["⓪", "①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨"],
}

