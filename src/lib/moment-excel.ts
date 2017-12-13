import * as moment from 'moment';
import * as parseFormat from 'moment-parseformat';
import * as timer from 'moment-timer';
import 'moment-recur';

// export type Moment = moment.Moment;
// export type MomentInput = moment.MomentInput;

declare global {
  interface moment {
    fromExcel(days: number | string):moment.Moment;
    toExcel(mo?:moment.MomentInput|boolean, dayOnly?: boolean): number;
  }
  // interface momentConstructor {
  //   fromExcel(days: number | string):moment.Moment;
  //   toExcel(mo?:moment.MomentInput|boolean, dayOnly?: boolean): number;
  // }
}

// export interface moment {
//   fromExcel(days: number | string):moment.Moment;
//   toExcel(mo?:moment.MomentInput|boolean, dayOnly?: boolean): number;
// }

declare module "moment" {
// export namespace momentX {
  export interface Moment {
    /**
     * 2017-07-04: Added by David Sargeant so TypeScript won't freak out
     * @param e number or string that is an Excel-format date.
     */
    fromExcel(days: number | string):moment.Moment;
    toExcel(mo?:moment.MomentInput|boolean, dayOnly?: boolean): number;
    round(precision: number, key: string, direction?: string):moment.Moment;
    ceil(precision:number, key:string);
    floor(precision:number, key:string);
  }
}

const excel2moment = function(days:number|string):moment.Moment {
  let value;
  if(typeof days === 'number') {
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
  var XLDay0 = moment([1900, 0, 1, 0, 0, 0]);
  var now = moment();
  var daysInMilliseconds = moment.duration(moment.duration(value - 2, 'days').asMilliseconds());
  var newMoment = moment(XLDay0).add(daysInMilliseconds);
  let tzDifference = now.utcOffset() - XLDay0.utcOffset();
  // Log.l("New Moment and XLDay0 TZ difference is (%d - %d = %d):", now.utcOffset(), XLDay0.utcOffset(), tzDifference);
  // Log.l(newMoment);
  // Log.l(XLDay0);
  // window['xldays'] = { xlday0: XLDay0, value: value, now: newMoment };
  newMoment.subtract(tzDifference, 'minutes').round(10, 'milliseconds');
  return newMoment;
};

const moment2excel = function(mo?:moment.MomentInput|boolean, dayOnly?: boolean):number {
  let xlDate;
  let XLDay0 = moment([1900, 0, 1]).startOf('day');
  let value;
  if(mo) {
    if(typeof mo === 'boolean') {
      value  = this;
      xlDate = Math.trunc(moment(value).diff(XLDay0, 'days', true) + 2);
    } else {
      value = mo;
      if(dayOnly) {
        xlDate = Math.trunc(moment(value).diff(XLDay0, 'days', true) + 2);
      } else {
        xlDate = moment(value).diff(XLDay0, 'days', true) + 2;
      }
    }
  } else {
    value  = this;
    xlDate = moment(value).diff(XLDay0, 'days', true) + 2;
  }
  return xlDate;
};

(moment as any).fn.round = function(precision:number, key:string, direction?:'round' | 'ceil' | 'floor'):moment.Moment {
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
};

(moment as any).fn.ceil = function (precision, key) {
  return this.round(precision, key, 'ceil');
};

(moment as any).fn.floor = function (precision, key) {
  return this.round(precision, key, 'floor');
};

(moment as any).fn.fromExcel = excel2moment;
(moment as any).fn.toExcel   = moment2excel;

(moment as any).parseFormat = parseFormat;
(moment as any).timer = timer;
(moment as any).toExcel = moment2excel;
(moment as any).fromExcel = excel2moment;

// export const mo = moment;

// export default moment;
// export namespace momentX;

export default moment;
