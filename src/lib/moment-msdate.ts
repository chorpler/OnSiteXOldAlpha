// import { moment, Moment, isMoment } from 'domain/onsitexdomain'
import * as moment from 'moment-timezone';
import { momentTimezone } from 'domain/onsitexdomain';
import { truncate } from 'fs';
import { Log } from 'domain/onsitexdomain';
// import * as momentMSDate from './moment-msdate-plugin';
import { convertEnumToColumn } from '../components/ion-multi-picker/util';
// declare module "moment" {

// }
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
  }
  function fromExcel(days:number|string):moment.Moment;
}


export type Moment = moment.Moment;
export type MomentZone = moment.MomentZone;
export type MomentTimezone = moment.MomentTimezone;

/**
 * @description converts a moment to a UTC OLE automation date represented as a double
 *
 * @returns {double}
 */
export const convertMomentToOADate = function(momentDate:Moment, truncateToDateOnly?:boolean) {
// moment.fn.toOADate = function() {
  try {
    let milliseconds = momentDate.valueOf();
    let out:number = momentMSDate.ticksToOADate(milliseconds);
    if(!truncateToDateOnly) {
      out = Math.trunc(out);
    }
    return out;
  } catch(err) {
    Log.w(`convertMomentToOADate(): Error during conversion, perhaps moment date is not a valid Moment object`);
    // Log.e(err);
    throw new Error(err);
  }
};

export const momentToOADateOnly = function(momentDate:Moment):number {
  return convertMomentToOADate(momentDate, true);
}

export const toOADateFromAMomentObject = function():number {
  return convertMomentToOADate(this, false);
}

export const toOADateOnlyFromAMomentObject = function():number {
  return convertMomentToOADate(this, true);
}

export const toOADateFromStaticMoment = function(momentDate:Moment):number {
  return convertMomentToOADate(momentDate, false);
}

export const toOADateOnlyFromStaticMoment = function(momentDate:Moment):number {
  return convertMomentToOADate(momentDate, true);
}

export class momentMSDate {
  public static MINUTE_MILLISECONDS :number  = 60 * 1000;
  public static DAY_MILLISECONDS    :number  = 86400000;
  public static MS_DAY_OFFSET       :number  = 25569;

  public static momentVersion : string[] = moment.version.split('.');
  public static major         : number = Number(momentMSDate.momentVersion[0])
  public static minor         : number = Number(momentMSDate.momentVersion[1])
  public static now:Moment = moment();
  constructor() {

  }

  public static oaDateToTicks(oaDate:number):number {
    return ((oaDate - momentMSDate.MS_DAY_OFFSET) * momentMSDate.DAY_MILLISECONDS) + (oaDate >= 0.0 ? 0.5 : -0.5);
  };

  public static ticksToOADate(ticks:number):number {
    return (ticks / momentMSDate.DAY_MILLISECONDS) + momentMSDate.MS_DAY_OFFSET;
  };

  /**
   * @description takes an oaDate that is not in utc and converts it to a utc moment offset by a number of minutes
   *
   * @param {double} oaDate
   * @param {string} offsetToUtcInMinutes
   * @returns moment
   */
  public static fromOADateOffsetToUtcByMinutes(oaDate, offsetToUtcInMinutes):Moment {
    const offsetInTicks = offsetToUtcInMinutes * momentMSDate.MINUTE_MILLISECONDS;
    const ticks = momentMSDate.oaDateToTicks(oaDate);
    return moment(ticks + offsetInTicks).utc();
  };

  /**
   * @description takes an oaDate that is not in utc and converts it to a utc moment offset by the specified timezone
   *
   * @param {double} oaDate
   * @param {string} timezone
   * @returns moment
   */
  public static fromOADateOffsetToUtcByTimezone(oaDate:string|number, timezone:string):Moment {
    // if (!moment.tz.zone(timezone)) { throw new Error('timezone provided is not available in moment-timezone.js', 'moment-msdate.js', 59); }
    if (!(moment && moment['tz'] && moment['tz']['zone'] && moment['tz']['zone'](timezone))) {
      throw new Error(`timezone provided ('${timezone}') is not available in moment-timezone library`);
    }
    let msDate = Number(oaDate);
    if(isNaN(msDate)) {
      throw new Error(`fromOADateOffsetToUtcByTimezone(): oaDate provided ('${oaDate}') is not a number or number-like string!`);
    }
    const ticks = momentMSDate.oaDateToTicks(msDate);
    const offset = moment(ticks).tz(timezone).utcOffset() * momentMSDate.MINUTE_MILLISECONDS;
    return moment.tz(ticks - offset, timezone).utc();
  };

  /**
   * @description takes an oaDate that is in utc and converts it to a utc moment or takes an oaDate and an offset to utc and converts it to a utc moment. The offset can be an int representing the offset to utc in minutes or a string indicating the timezone of the oaDate.
   *
   * @param {double} oaDate
   * @param {string=} {int=} offset
   * @returns moment
   */
  public static fromOADate(oaDate:string|number, offset?:string|number):Moment {
  // moment.fromOADate = function(oaDate, offset) {
    // if (isNaN(parseInt(oaDate, 10))) { throw new TypeError('fromOADate requires an oaDate that is not null or undefined', 'moment-msdate.js', 72); }
    let MSDate:number = Number(oaDate);
    if(isNaN(MSDate)) {
      throw new TypeError('fromOADate requires an oaDate that is not null or undefined');
    }

    /* no offset */
    if(!offset) {
      return momentMSDate.fromOADateOffsetToUtcByMinutes(oaDate, 0);
    }

    /* timezone */
    const parsedOffset:number = Number(offset);

    if(isNaN(parsedOffset)) {
      let stringOffset = String(offset);
      return momentMSDate.fromOADateOffsetToUtcByTimezone(oaDate, stringOffset);
    }

    /* minutes */
    return momentMSDate.fromOADateOffsetToUtcByMinutes(oaDate, parsedOffset);
  };


  public createMomentMSDatePlugin() {
    if (momentMSDate.major < 2 || (momentMSDate.major === 2 && momentMSDate.minor < 6)) {
      throw new Error(`moment-msdate requires Moment.js >= 2.6.0. You are using Moment.js ${moment.version}. See momentjs.com`);
    }

    if (!momentTimezone || !moment.tz) {
      throw new Error('moment-msdate requires moment-timezone.js. see momentjs.com/timezone');
    }

    let mo = moment as any;

    mo.fromOADate = momentMSDate.fromOADate;
    mo.toOADate = toOADateFromStaticMoment;
    mo.toOADateOnly = toOADateOnlyFromAMomentObject;
    mo.fn.toOADate = toOADateFromAMomentObject;
    mo.fn.toOADateOnly = toOADateOnlyFromStaticMoment;
  }
}

// export default function momentMS(...args) {
//   return momentMSDate(args);
//   // const momentMS = function() {
//   //   return momentMSDate();
//   // }

//   // momentMS();
// }

// const momentMS = momentMSDate;

// export default momentMS;

// export default momentMS;

// export default momentMS;

//   var MINUTE_MILLISECONDS = 60 * 1000;
//   var DAY_MILLISECONDS = 86400000;
//   var MS_DAY_OFFSET = 25569;

//   const momentVersion = moment.version.split('.');
//   const major = +momentVersion[0];
//   const minor = +momentVersion[1];

//   if (major < 2 || (major === 2 && minor < 6)) {
//     throw new Error(`moment-msdate requires Moment.js >= 2.6.0. You are using Moment.js ${moment.version}. See momentjs.com`);
//   }

//   if (!momentTimezone || !moment.tz) {
//     throw new Error('moment-msdate requires moment-timezone.js. see momentjs.com/timezone');
//   }

//   const oaDateToTicks = function(oaDate) {
//     return ((oaDate - MS_DAY_OFFSET) * DAY_MILLISECONDS) + (oaDate >= 0.0 ? 0.5 : -0.5);
//   };

//   const ticksToOADate = function(ticks) {
//     return (ticks / DAY_MILLISECONDS) + MS_DAY_OFFSET;
//   };

//   /**
//    * @description takes an oaDate that is not in utc and converts it to a utc moment offset by a number of minutes
//    *
//    * @param {double} oaDate
//    * @param {string} offsetToUtcInMinutes
//    * @returns moment
//    */
//   const fromOADateOffsetToUtcByMinutes = function(oaDate, offsetToUtcInMinutes) {
//     const offsetInTicks = offsetToUtcInMinutes * MINUTE_MILLISECONDS;
//     const ticks = oaDateToTicks(oaDate);
//     return moment(ticks + offsetInTicks).utc();
//   };

//   /**
//    * @description takes an oaDate that is not in utc and converts it to a utc moment offset by the specified timezone
//    *
//    * @param {double} oaDate
//    * @param {string} timezone
//    * @returns moment
//    */
//   const fromOADateOffsetToUtcByTimezone = function(oaDate, timezone) {
//     if (!moment.tz.zone(timezone)) { throw new Error('timezone provided is not available in moment-timezone.js', 'moment-msdate.js', 59); }
//     const ticks = oaDateToTicks(oaDate);
//     const offset = moment(ticks).tz(timezone).utcOffset() * MINUTE_MILLISECONDS;
//     return moment.tz(ticks - offset, timezone).utc();
//   };

//   /**
//    * @description takes an oaDate that is in utc and converts it to a utc moment or takes an oaDate and an offset to utc and converts it to a utc moment. The offset can be an int representing the offset to utc in minutes or a string indicating the timezone of the oaDate.
//    *
//    * @param {double} oaDate
//    * @param {string=} {int=} offset
//    * @returns moment
//    */
//   moment.fromOADate = function(oaDate, offset) {
//     if (isNaN(parseInt(oaDate, 10))) { throw new TypeError('fromOADate requires an oaDate that is not null or undefined', 'moment-msdate.js', 72); }

//     /* no offset */
//     if (!offset) { return fromOADateOffsetToUtcByMinutes(oaDate, 0); }

//     /* timezone */
//     const parsedOffset = parseInt(offset, 10);
//     if (isNaN(parsedOffset)) { return fromOADateOffsetToUtcByTimezone(oaDate, offset); }

//     /* minutes */
//     return fromOADateOffsetToUtcByMinutes(oaDate, parsedOffset);
//   };

//   /**
//    * @description converts a moment to a UTC OLE automation date represented as a double
//    *
//    * @returns {double}
//    */
//   moment.fn.toOADate = function() {
//     const milliseconds = this.valueOf();
//     return ticksToOADate(milliseconds);
//   };


//   return moment;
// }
