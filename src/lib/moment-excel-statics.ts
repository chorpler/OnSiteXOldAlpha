import moment from './moment-excel';
// import * as parseFormat from 'moment-parseformat';
// import * as timer from 'moment-timer';
// import 'moment-recur';

// export type Moment = moment.Moment;
// export type MomentInput = moment.MomentInput;

declare global {
  interface moment {
    fromExcel(days: number | string):moment.Moment;
    toExcel(mo?:moment.MomentInput|boolean, dayOnly?: boolean): number;
  }
}

export default global;
