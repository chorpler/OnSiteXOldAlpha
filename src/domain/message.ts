import * as moment from 'moment';
import { Log, isMoment, date2xl, xl2date, xl2datetime } from '../config/config.functions';
import { SrvrSrvcs } from '../providers/srvr-srvcs';
import { DBSrvcs } from '../providers/db-srvcs';

export class Message {
  public _id: string;
  public _rev: string;
  public from: string;
  public date: moment.Moment | Date | string;
  public XLdate: number;
  public duration: moment.Duration | number;
  public subject: string;
  public text: string;

  constructor(from?: string, date?: moment.Moment | Date | string, duration?:moment.Duration | number, subject?:string, text?:string) {
    this.from     = from     || ''  ;
    this.date     = date     || null;
    this.duration = duration || null;
    this.subject  = subject  || ''  ;
    this.text     = text     || ''  ;
    let mDate     = isMoment(date) || date instanceof Date ? moment(date) : typeof date === 'string' ? moment(date, 'YYYY-MM-DD') : null;
    let xldate    = date2xl(mDate);
    this.XLdate   = xldate;
  }

  readFromDoc(doc:any) {
    for(let key in doc) {
      let value = doc[key];
      if(key === 'date') {
        if(isMoment(value) || value instanceof Date) {
          this[key] = moment(value);
        } else if(typeof value === 'string') {
          this[key] = moment(value, "YYYY-MM-DD");
        }
      } else if(key === 'duration') {
        if(moment.isDuration(value)) {
          this[key] = moment.duration(value).hours();
        } else {
          this[key] = value;
        }
      } else {
        this[key] = value;
      }
    }
    this.XLdate = date2xl(this.date);
  }



  getMessageDate() {
    return moment(this.date);
  }

  getMessageSender() {
    return this.from;
  }

  getMessageDateString() {
    let d = this.date;
    return moment(d).format("ddd, MMM D, YYYY");
  }

  getMessageSubject() {
    return this.subject;
  }

  getMessageBody() {
    return this.text;
  }

  getMessageDuration() {
    return this.duration;
  }
}
