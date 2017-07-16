import { Address             } from './address'                  ;
import { Log, moment, Moment } from '../config/config.functions' ;

export interface IFEmployee {
  name                : string         ,
  username            : string         ;
  avatarName          : string         ;
  prefix              : string         ;
  firstName           : string         ;
  lastName            : string         ;
  middleName          : string         ;
  suffix              : string         ;
  technician          : string         ;
  type                : any            ;
  avtrNameAsUser      : boolean        ;
  userClass           : any            ;
  client              : any            ;
  location            : any            ;
  locID               : any            ;
  loc2nd              : any            ;
  shift               : string         ;
  shiftLength         : string|number  ;
  shiftStartTime      : string|number  ;
  shiftStartTimeMoment: Moment         ;
  shiftStartTimeHour  : string         ;
  rotation            : string         ;
  email               : Array<string>  ;
  phone               : string         ;
  cell                : string         ;
  address             : Address        ;
  payRate             : number         ;
  active              : boolean        ;
  updated             : boolean        ;
}

export class Employee implements IFEmployee {
  public name                : string         ;
  public username            : string         ;
  public avatarName          : string         ;
  public prefix              : string         ;
  public firstName           : string         ;
  public lastName            : string         ;
  public middleName          : string         ;
  public suffix              : string         ;
  public technician          : string         ;
  public type                : any            ;
  public avtrNameAsUser      : boolean        ;
  public userClass           : any            ;
  public client              : any            ;
  public location            : any            ;
  public locID               : any            ;
  public loc2nd              : any            ;
  public shift               : any            ;
  public shiftLength         : any            ;
  public shiftStartTime      : any            ;
  public shiftStartTimeMoment: any            ;
  public shiftStartTimeHour  : string         ;
  public rotation            : string         ;
  public email               : Array<string>  ;
  public phone               : any            ;
  public cell                : any            ;
  public address             : Address        ;
  public payRate             : number         ;
  public active              : boolean = true ;
  public updated             : boolean = false;

  constructor(prefix?, firstName?, lastName?, middleName?, suffix?, username?, name?, type?, avatarName?, avtrNameAsUser?, userClass?, client?, location?, locID?, loc2nd?, shift?, shiftLength?, shiftStartTime?, email?, phone?, cell?) {
    this.prefix              = prefix         || null;
    this.firstName           = firstName      || null;
    this.lastName            = lastName       || null;
    this.middleName          = middleName     || null;
    this.suffix              = suffix         || null;
    this.technician          = ""                    ;
    this.username            = username       || null;
    this.name                = name           || null;
    this.type                = type           || null;
    this.avatarName          = avatarName     || null;
    this.avtrNameAsUser      = avtrNameAsUser || null;
    this.userClass           = userClass      || null;
    this.client              = client         || null;
    this.location            = location       || null;
    this.locID               = locID          || null;
    this.loc2nd              = loc2nd         || null;
    this.shift               = shift          || null;
    this.shiftLength         = shiftLength    || null;
    this.shiftStartTime      = shiftStartTime || null;
    this.shiftStartTimeMoment= shiftStartTime || null;
    this.shiftStartTimeHour  = shiftStartTime || null;
    this.rotation            = ""                    ;
    this.email               = [email]        || null;
    this.phone               = phone          || null;
    this.cell                = cell           || null;
    this.address             = new Address()         ;
    this.payRate             = 0                     ;
    this.active              = true                  ;
    this.updated             = false                 ;
  }

  public readFromDoc(doc:any) {
    for(let prop in doc) {
      let docprop = doc[prop];
      if(docprop && typeof docprop === 'object') {
        if(prop === 'shiftStartTime') {
          let startHour = Number(doc[prop].name);
          this['shiftStartTimeMoment'] = moment().hour(startHour).startOf('hour');
          this[prop] = startHour;
          this['shiftStartTimeHour'] = this.shiftStartTimeMoment.format("HH:mm");
        } else if(prop === 'client' || prop === 'location') {
          this[prop] = doc[prop].fullName.toUpperCase();
        } else if(prop === 'locID' || prop === 'loc2nd' || prop === 'shift') {
          this[prop] = doc[prop].name.toUpperCase();
        } else if(prop === 'shiftLength' || prop === 'shiftStartTime') {
          this[prop] = Number(doc[prop].name);
        } else if (prop === 'address') {
          let a = doc[prop];
          if(typeof a['street'] === 'object') {
            this.address = a;
          } else if(a['street']) {
            this.address.street.street1 = a['street'];
            this.address.city = a['city'];
            this.address.state = a['state'];
            this.address.zip = a['zipcode'] ? a['zipcode'] : a['zip'] ? a['zip'] : '';
          }
        } else {
          this[prop] = doc[prop];
        }
      } else {
        if (prop === 'shiftStartTime') {
          let startHour = Number(doc[prop]);
          this['shiftStartTimeMoment'] = moment().hour(startHour).startOf('hour');
          this[prop] = doc[prop];
          this['shiftStartTimeHour'] = this.shiftStartTimeMoment.format("HH:mm");
        } else if (prop === 'street') {
          this.address.street.street1 = doc[prop];
        } else if (prop === 'zipcode') {
          this.address.zip = doc['prop'];
        } else {
          this[prop] = doc[prop];
        }
      }
    }
    if(!doc['name']) { this.name = doc['avatarName']; }
    this.avatarName = this.name;
    this.username   = this.name;
  }

  public getTechID() {
    return this.username;
  }

  public getFullName() {
    let fullName = "";
    fullName += this.lastName ? this.lastName : '';
    fullName += this.suffix ? ` ${this.suffix}` : '';
    fullName += ",";
    fullName += this.prefix ? ` ${this.prefix}` : '';
    fullName += this.firstName ? ` ${this.firstName}` : '';
    fullName += this.middleName ? ` ${this.middleName}` : '';
    return fullName;
  }

  public getTechName() { let fullName = `${this.lastName}, ${this.firstName}`; return fullName; }

  public getFullNameNormal() {
    let fullName = `${this.firstName} ${this.lastName}`;
    return fullName;
  }

  public getClient() {
    return this.client && typeof this.client === 'object' && this.client.fullName ? this.client.fullName.toUpperCase() : this.client;
  }

  public getUsername() {
    return this.username ? this.username : this.avatarName;
  }

  public getShiftType():string {
    return this.shift;
  }

  public setShiftType(AMorPM:string) {
    this.shift = AMorPM;
    return this.shift;
  }

  public getShiftRotation():string {
    if(this.rotation) {
      return this.rotation;
    } else {
      return "CONTN WEEK";
    }
  }

  public isActive() {
    return this.active;
  }

  public activate() {
    this.active = true;
    return this.active;
  }

  public deactivate() {
    this.active = false;
    return this.active;
  }

  public toString() {
    return this.getFullName();
  }
}

