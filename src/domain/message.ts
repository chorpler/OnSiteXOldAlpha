import * as moment from 'moment';
import { Log, isMoment, date2xl, xl2date, xl2datetime } from '../config/config.functions';
import { SrvrSrvcs } from '../providers/srvr-srvcs';
import { DBSrvcs } from '../providers/db-srvcs';

export class Message {
  public _id: string;
  public _rev: string;
  public from: string;
  public date: moment.Moment;
  public XLdate: number;
  public duration: number;
  public subject: string;
  public text: string;
  public read:boolean;
  public readTS:moment.Moment;

  constructor(from?: string, date?: moment.Moment | Date | string, duration?:number, subject?:string, text?:string) {
    this.from     = from     || ''  ;
    this.duration = duration || null;
    this.subject  = subject  || ''  ;
    this.text     = text     || ''  ;
    let mDate     = isMoment(date) || date instanceof Date ? moment(date) : typeof date === 'string' ? moment(date, 'YYYY-MM-DD') : null;
    this.date     = moment(mDate)  || null;
    let xldate    = date2xl(mDate);
    this.XLdate   = xldate;
    this.read     = false;
    this.readTS   = null;
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
      } else if(key === 'readTS') {
        this[key] = moment(doc[key]);
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

  getMessageReadStatus() {
    return this.read;
  }

  setMessageRead() {
    this.read = true;
    this.readTS = moment();
    return this.read;
  }

  serialize() {
    let keys = ['_id', '_rev', 'from', 'date', 'XLdate', 'duration', 'subject', 'text', 'read', 'readTS'];
    let doc = {};
    for(let key of keys) {
      if(key === 'date' || key === 'readTS') {
        doc[key] = this[key].format();
      } else {
        doc[key] = this[key];
      }
    }
    return doc;
  }


}
