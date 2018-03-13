// import * as momentParseFormat from 'moment-parseformat' ;
// import * as momentRecur       from 'moment-recur'       ;
// import * as momentRound       from 'moment-round'       ;
// import * as moment            from 'moment-timezone'    ;
declare const require                                    ;
import   * as moment              from 'moment'             ;
import   * as momentTimezone      from 'moment-timezone'    ;
import   * as momentShortFormat   from 'moment-shortformat' ;
import   * as momentTimer         from 'moment-timer'       ;
import { Log                    } from './config.functions' ;

// const twix = require('twix');
// import {Twix,TwixStatic,} from 'twix';

declare module "moment" {
  interface Moment {
    /**
     * 2017-07-04: Added by David Sargeant so TypeScript won't freak out
     * @param e number or string that is an Excel-format date.
     */
    // fn:any;
    fromExcel(days:number|string):moment.Moment;
    toExcel(mo?: Date | moment.Moment | string | boolean, dayOnly?: boolean): number;
    round(precision: number, key: string, direction?: string): moment.Moment;
    ceil(precision:number, key:string):moment.Moment;
    floor(precision:number, key:string):moment.Moment;
    toOADate():number;
  }
  function fromExcel(days:number|string):moment.Moment;
  function fromOADate(oaDate:string|number, offset?:string|number):moment.Moment;
}

export var momentRound = function (precision: number, key: string, direction?: string): moment.Moment {
  if (typeof direction === 'undefined') {
    direction = 'round';
  }

  var keys = ['Hours', 'Minutes', 'Seconds', 'Milliseconds'];
  var maxValues = [24, 60, 60, 1000];

  // Capitalize first letter
  key = key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();

  // make sure key is plural
  if (key.indexOf('s', key.length - 1) === -1) {
    key += 's';
  }
  var value = 0;
  var rounded = false;
  var subRatio = 1;
  var maxValue;
  for (var i in keys) {
    var k = keys[i];
    if (k === key) {
      value = this._d['get' + key]();
      maxValue = maxValues[i];
      rounded = true;
    } else if (rounded) {
      subRatio *= maxValues[i];
      value += this._d['get' + k]() / subRatio;
      this._d['set' + k](0);
    }
  };

  value = Math[direction](value / precision) * precision;
  value = Math.min(value, maxValue);
  this._d['set' + key](value);

  return this;
}

export var momentCeil = function(precision, key) {
  return this.round(precision, key, 'ceil');
}

export var momentFloor = function(precision, key) {
  return this.round(precision, key, 'floor');
}

export const isMoment = function(val:any) {
  return (moment.isMoment(val) && moment(val).isValid());
}

// export var moment2excel = function (mo?: Date | moment.Moment | string | boolean, dayOnly?: boolean) {
//   let xlDate;
//   let XLDay0 = moment([1900, 0, 1]).startOf('day');
//   let value;
//   if (mo) {
//     if (typeof mo === 'boolean') {
//       value = this;
//       xlDate = Math.trunc(moment(value).diff(XLDay0, 'days', true) + 2);
//     } else {
//       value = mo;
//       if (dayOnly) {
//         xlDate = Math.trunc(moment(value).diff(XLDay0, 'days', true) + 2);
//       } else {
//         xlDate = moment(value).diff(XLDay0, 'days', true) + 2;
//       }
//     }
//   } else {
//     value = this;
//     xlDate = moment(value).diff(XLDay0, 'days', true) + 2;
//   }
//   return xlDate;
// };

export var ConvertProvidedMomentToExcel = function(day:moment.MomentInput, dayOnly:boolean) {
  let xlDate:number, out:number;
  let XLDay0 = moment([1900, 0, 1, 0, 0, 0]);
  let tempMoment = moment(day);
  if(!isMoment(tempMoment)) {
    Log.l(`moment.toExcel(): Error converting moment '${day}' to excel, moment is:\n`, day);
    throw new TypeError(`moment provided was not a valid MomentInput, cannot convert moment to Excel date`);
  } else {
    let now:Moment = moment(tempMoment);
    let offset:number = now.utcOffset();
    let xl1:number = now.toOADate();
    let n2:Moment = moment.fromOADate(xl1);
    let n3:Moment = moment(n2);
    let n4:Moment = n3.utcOffset(offset);
    let momentString:string = n4.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
    let n5:Moment = moment.utc(momentString);
    let out:number = n5.toOADate();
    if(dayOnly) {
      out = Math.trunc(out);
    }
    return out;
  }
};

export var MomentObjectToExcel = function(dayOnly?:boolean) {
  var mo = this;
  let outputInteger = false;
  if(dayOnly === true) {
    outputInteger = true;
  }
  return ConvertProvidedMomentToExcel(this, outputInteger);
}

// var moment2excel = MomentObjectToExcel;

export var moment2excel = function (mo?: Date | moment.Moment | string | boolean, dayOnly?: boolean):number {
  let xlDate;
  let XLDay0 = moment([1900, 0, 1]).startOf('day');
  let value;
  if (mo) {
    if (typeof mo === 'boolean') {
      value = this;
      xlDate = Math.trunc(moment(value).diff(XLDay0, 'days', true) + 2);
    } else {
      value = mo;
      if (dayOnly) {
        xlDate = Math.trunc(moment(value).diff(XLDay0, 'days', true) + 2);
      } else {
        xlDate = moment(value).diff(XLDay0, 'days', true) + 2;
      }
    }
  } else {
    value = this;
    xlDate = moment(value).diff(XLDay0, 'days', true) + 2;
  }
  return xlDate;
};

export var excel2moment = function(days:number|string, sourceIsMacExcel?:boolean) {
  let value;
  if (typeof days === 'number') {
    value = days;
  } else if (typeof days === 'string') {
    let tmp1 = Number(days);
    if (!isNaN(tmp1)) {
      value = tmp1;
    } else {
      throw new TypeError("Cannot convert Excel date if it is not a number or numberlike string: " + days + " (" + typeof days + ")");
    }
  } else {
    throw new TypeError("Cannot convert Excel date if it is not a number or numberlike string: " + days + " (" + typeof days + ")");
  }
  // let xlDay0Array = [1900, 0, 1, 0, 0, 0];
  // if(sourceIsMacExcel) {
    // xlDay0Array = [1904, 0, 1, 0, 0, 0];
  // }
  // let XLDay0 = moment(xlDay0Array);
  // let now = moment();
  // let daysInMilliseconds = moment.duration(moment.duration(value - 2, 'days').asMilliseconds());
  // let newMoment = moment(XLDay0).add(daysInMilliseconds);
  // let tzDifference = now.utcOffset() - XLDay0.utcOffset();
  // // Log.l("New Moment and XLDay0 TZ difference is (%d - %d = %d):", now.utcOffset(), XLDay0.utcOffset(), tzDifference);
  // // Log.l(newMoment);
  // // Log.l(XLDay0);
  // window['xldays'] = { xlday0: XLDay0, value: value, now: newMoment };
  // let midnightDateInQuestion = moment(newMoment).startOf('day');
  // let morningDateInQuestion  = moment(newMoment).startOf('day').add(6, 'hours');
  // let offset1 = midnightDateInQuestion.utcOffset();
  // let offset2 = morningDateInQuestion.utcOffset();
  // if(offset1 !== offset2) {
  //   tzDifference = tzDifference +
  // }
  // let lastMoment = moment(newMoment).subtract(tzDifference, 'minutes');
  // lastMoment.round(10, 'milliseconds');
  // let outMoment = moment(lastMoment);
  // let DSTTest1 = moment(lastMoment).startOf('day').add(30, 'minutes');
  // let DSTTest2 = moment(DSTTest1).add(2, 'hours');
  // if(!DSTTest1.isDST() && DSTTest2.isDST()) {
  //   outMoment.add(1, 'hour');
  // }
  // let testForDSTMoment = moment(lastMoment).startOf('day').add(2, 'hours');
  // return lastMoment;
  let OADate:Moment = moment.fromOADate(days);
  let OADateString:string = moment(OADate).format("YYYY-MM-DDTHH:mm:ss.SSS");
  let CorrectedOADate:Moment = moment(OADateString);
  return CorrectedOADate;
}

// (<any>moment).fromExcel = excel2moment;

var momentFnObject:any = moment.fn || {};
(<any>moment).fn = momentFnObject;
// .toExcel = moment2excel;
(<any>moment).fn.round     = momentRound;
(<any>moment).fn.fromExcel = excel2moment;
(<any>moment).fn.toExcel   = moment2excel;
(<any>moment).fn.ceil      = momentCeil;
(<any>moment).fn.floor     = momentFloor;
(<any>moment).fromExcel    = excel2moment;
// (moment as any).fn.toExcel = moment2excel;
// (moment as any).fn.fromExcel = excel2moment;
// (moment as any).fromExcel = excel2moment;
// (moment as any).round = momentRound;
// (moment as any).ceil = momentCeil;
// (moment as any).floor = momentFloor;

export type Moment = moment.Moment;
export type Duration = moment.Duration;
export type MomentInput = moment.MomentInput;
export type MomentZone = momentTimezone.MomentZone;
export type MomentTimezone = momentTimezone.MomentTimezone;
// export type Twix = Twix;
// export type TwixStatic = TwixStatic;

// momentMS.momentMS(moment, momentTimezone);
// momentMSPlugin();
// const momentTimezone = moment;
const msDatePlugin = require('lib/moment-msdate-plugin.js');

export {moment, momentTimezone};
// export {moment, momentTimezone};
