export class Employee {
  public firstName      : any;
  public lastName       : any;
  public username       : any;
  public name           : any;
  public type           : any;
  public avatarName     : any;
  public avtrNameAsUser : any;
  public userClass      : any;
  public client         : any;
  public location       : any;
  public locID          : any;
  public loc2nd         : any;
  public shift          : any;
  public shiftLength    : any;
  public shiftStartTime : any;
  public email          : any;
  public phone          : any;
  public cell           : any;

  constructor(firstName?, lastName?, username?, name?, type?, avatarName?, avtrNameAsUser?, userClass?, client?, location?, locID?, loc2nd?, shift?, shiftLength?, shiftStartTime?, email?, phone?, cell?) {
    this.firstName      = firstName      || null ;
    this.lastName       = lastName       || null ;
    this.username       = username       || null ;
    this.name           = name           || null ;
    this.type           = type           || null ;
    this.avatarName     = avatarName     || null ;
    this.avtrNameAsUser = avtrNameAsUser || null ;
    this.userClass      = userClass      || null ;
    this.client         = client         || null ;
    this.location       = location       || null ;
    this.locID          = locID          || null ;
    this.loc2nd         = loc2nd         || null ;
    this.shift          = shift          || null ;
    this.shiftLength    = shiftLength    || null ;
    this.shiftStartTime = shiftStartTime || null ;
    this.email          = email          || null ;
    this.phone          = phone          || null ;
    this.cell           = cell           || null ;
  }

  readFromDoc(doc:any) { for(let prop in doc) { this[prop] = doc[prop]; } }

  getFullName() { let fullName = `${this.lastName}, ${this.firstName}`; return fullName; }

  getTechName() { let fullName = `${this.lastName}, ${this.firstName}`; return fullName; }

  getFullNameNormal() {
    let fullName = `${this.firstName} ${this.lastName}`;
    return fullName;
  }


}

