import { Street  } from './street'                   ;
import { Address } from './address'                  ;
import { Log     } from '../config/config.functions' ;

export class Jobsite {
  public client                     : any                    ;
  public location                   : any                    ;
  public locID                      : any                    ;
  public loc2nd                     : any                    ;
  public address                    : Address                ;
  public billing_address            : Address = this.address ;
  public latitude                   : number                 ;
  public longitude                  : number                 ;
  public within                     : number                 ;
  public account_number             : any                    ;
  public travel_time                : number                 ;
  public per_diem_rate              : number                 ;
  public requires_preauth           : boolean = false        ;
  public requires_preauth_pertech   : boolean = false        ;
  public requires_invoice_woreports : boolean = false        ;
  public account_or_contract        : string = 'Contract'    ;
  public billing_rate               : number = 65            ;
  public site_active                : boolean = true         ;
  public divisions                  : any                    ;
  public shiftRotations             : any                    ;
  public hoursList                  : any                    ;
  public techShifts                 : any                    ;

  constructor(inClient?:any, inLoc?: any, inLocID?:any, inAddress?:Address, inLat?:number, inLon?:number, inWI?:number) {
    this.client = inClient;
    this.location = inLoc;
    this.locID = inLocID;
    this.loc2nd = null;
    this.address = inAddress;
    this.billing_address = inAddress;
    this.latitude = inLat;
    this.longitude = inLon;
    this.within = inWI;
    this.account_number = '';
    this.travel_time = 0;
    this.per_diem_rate = 0;
    this.requires_preauth = false;
    this.requires_preauth_pertech = false;
    this.requires_invoice_woreports = false;
    this.account_or_contract = 'Contract';
    this.billing_rate = 65;
    this.site_active = true;
    this.divisions = {};
    this.shiftRotations = {};
    this.hoursList = {};
    this.techShifts = {};
  }

  public setBilling(inAddr: Address) {
    this.billing_address = inAddr;
  }

  public setAddress(inAddr: Address) {
    this.address = inAddr;
  }

  readFromDoc(doc:any) {
    if(typeof doc != 'object') {
      Log.l("Can't read jobsite from:\n", doc);
      throw new Error("readFromDoc(): Jobsite cannot be read");
    }
    if(doc.address !== undefined) {
      this.address = new Address(new Street(doc.address.street.street1, doc.address.street.street2), doc.address.city, doc.address.state, doc.address.zip);
    } else {
      this.address = new Address(new Street('', ''), '', '', '');
    }
    if (doc.billing_address !== undefined) {
      this.billing_address = new Address(new Street(doc.billing_address.street.street1, doc.billing_address.street.street2), doc.billing_address.city, doc.billing_address.state, doc.billing_address.zip);
    } else {
      this.billing_address = new Address(new Street('', ''), '', '', '');
    }
    for(let prop in doc) {
      if(prop != 'address' && prop != 'billing_address') {
        this[prop] = doc[prop];
      }
    }
  }

  public getSiteName() {
    let cli = this.client.fullName.toUpperCase();
    let loc = this.location.fullName.toUpperCase();
    let lid = this.locID.fullName.toUpperCase();
    let l2d = '';
    if(this.loc2nd) {
      l2d = this.loc2nd.fullName.toUpperCase();
    }

    let siteName = '';
    if(this.client.name == "HB") {
      siteName = '';
    } else {
      siteName = `${cli} `;
    }

    siteName += `${loc} `;

    if(this.loc2nd) {
      siteName += `${l2d} `;
    }

    if(this.locID.name != "MNSHOP") {
      siteName += `${lid}`
    }

    return siteName;
    // let siteName = `${cli} ${loc}
  }

  public updateSiteDivisions(rotations:any, hours:any) {
    let js = this;
    let cli = js.client.name;
    let loc = js.location.name;
    let sr = rotations;
    let sd = {};
    let hasLoc2nd = js.loc2nd.length;
    sd[cli] = {};
    sd[cli][loc] = {};
    if (hasLoc2nd) {
      for (let loc2 of js.loc2nd) {
        sd[cli][loc][loc2] = {};
        for (let locID of js.locID) {
          sd[cli][loc][loc2][locID] = {};
          for (let rotation of sr) {
            let rot = rotation.name;
            sd[cli][loc][loc2][locID][rot] = [];
          }
        }
      }
    } else {
      for (let locID of js.locID) {
        sd[cli][loc][locID] = {};
        for (let rotation of sr) {
          let rot = rotation.name;
          sd[cli][loc][locID][rot] = [];
        }
      }
    }
    this.divisions = sd;
    Log.l("JobSite.updateSiteDivisions(): Site divisions are now:\n", sd);
  }
}
