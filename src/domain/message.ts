import { Log, moment, isMoment, Moment } from '../config/config.functions';
import { SrvrSrvcs } from '../providers/srvr-srvcs';
import { DBSrvcs } from '../providers/db-srvcs';

export class Message {
  public _id      : string  ;
  public _rev     : string  ;
  public from     : string  ;
  public date     : Moment  ;
  public XLdate   : number  ;
  public duration : number  ;
  public subject  : string  ;
  public text     : string  ;
  public subjectES: string  ;
  public textES   : string  ;
  public texts    : any     = { en: "", es: "" } ;
  public subjects : any     = { en: "", es: "" } ;
  public read     : boolean ;
  public readTS   : Moment  ;

  constructor(from?: string, date?: Moment | Date | string, duration?:number, subject?:string, text?:string) {
    this.from     = from     || ''  ;
    this.duration = duration || null;
    this.subject  = subject  || ''  ;
    this.text     = text     || ''  ;
    let mDate     = isMoment(date) || date instanceof Date ? moment(date) : typeof date === 'string' ? moment(date, 'YYYY-MM-DD') : moment();
    this.date     = moment(mDate)  || null;
    this.XLdate   = mDate.toExcel(true);
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
    this.XLdate = this.date.toExcel(true);
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

  getMessageSubjectES() {
    return this.subjectES;
  }

  getMessageBody() {
    return this.text;
  }

  getMessageBodyES() {
    return this.textES;
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

  public isExpired() {
    let now = moment();
    let message = this;
    let date = message.getMessageDate().startOf('day');
    let duration = message.getMessageDuration();
    let expires = moment(date).add(duration, 'days');
    if (now.isSameOrBefore(expires, 'day')) {
      return false;
    } else {
      return true;
    }
  }

  clone() {
    let doc = this.serialize();
    let newMsg = new Message();
    let keys = Object.keys(this);
    for(let key of keys) {
      let value = this[key];
      if(isMoment(value)) {
        newMsg[key] = moment(value);
      } else if(value && typeof value === 'object') {
        newMsg[key] = Object.assign({}, value);
      } else {
        newMsg[key] = this[key];
      }
    }
    return newMsg;
  }


}
