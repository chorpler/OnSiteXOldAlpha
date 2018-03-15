import { sprintf                                  } from 'sprintf-js'             ;
import { Component, OnInit, OnDestroy, NgZone     } from '@angular/core'          ;
import { AfterViewInit,                           } from '@angular/core'          ;
import { FormGroup, FormControl, Validators       } from "@angular/forms"         ;
import { IonicPage, NavController, NavParams      } from 'ionic-angular'          ;
import { ViewController                           } from 'ionic-angular'          ;
import { TranslateService                         } from '@ngx-translate/core'    ;
import { Log, sizeOf, isMoment, moment, Moment    } from 'domain/onsitexdomain'         ;
import { SESAClient, SESALocation, SESALocID, CLL } from 'domain/onsitexdomain'         ;
import { DBService                                } from 'providers/db-service'   ;
import { UserData                                 } from 'providers/user-data'    ;
import { AlertService                             } from 'providers/alerts'       ;
import { Employee,Jobsite                         } from 'domain/onsitexdomain'         ;
import { TabsService                              } from 'providers/tabs-service' ;
import { Pages                                    } from 'domain/onsitexdomain'         ;

export const _matchCLL = (a:CLL, b:string):boolean => {
  let cA1 = a.name.toUpperCase();
  let cA2 = a.fullName.toUpperCase();
  let cB = b.toUpperCase();
  return cA1 === cB || cA2 === cB;
}
export const _cmp = (a:CLL|string, b:CLL|string):boolean => {
  // if(a === undefined || b === undefined || a['fullName'] === undefined || b['fullName'] === undefined) {
  //   return false;
  // } else {
  //   return a['fullName'].toUpperCase() === b['fullName'].toUpperCase();
  // }
  if(typeof a === 'object') {
    if(typeof b === 'object') {
      /* Both objects */
      return _matchCLL(a, b.name);
    } else {
      /* a is object, b is string */
      return _matchCLL(a, b);
    }
  } else {
    if(typeof b === 'object') {
      /* b is object, a is string */
      return _matchCLL(b, a);
    }
  }
  /* a and b are both strings */
  if(a.toUpperCase() === b.toUpperCase()) {
    return true;
  } else {
    return false;
  }
};

export const _dedupe = (array, property?) => {
  let prop = "fullName";
  if(property) {
    prop = property;
  }
  return array.filter((obj, pos, arr) => {
    return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
  });
}

export const _sort = (a,b,sortField?) => {
  let field = sortField || 'name';
  // if(!a || !b || !a[field] || !b[field]) return 0;
  return a[field] < b[field] ? -1 : a[field] > b[field] ? 1 : 0;
}

export const _sortSites = (a:Jobsite, b:Jobsite):number => {
  let dA = a.getSiteSelectName();
  let dB = b.getSiteSelectName();
  return dA > dB ? 1 : dA < dB ? -1 : 0;
}

export const _sortCLL = (a:CLL, b:CLL):number => {
  let dA = a.fullName;
  let dB = b.fullName;
  return dA > dB ? 1 : dA < dB ? -1 : 0;
}

@IonicPage({
  name: 'User'
})
@Component({
  selector: 'page-tech-settings',
  templateUrl: 'tech-settings.html',
})
export class TechSettingsPage implements OnInit,OnDestroy,AfterViewInit {
  // @ViewChild('ionheader') mapElement: ElementRef;
  fixedHeight       : any        = "0px"            ;
  _cmp              : any        = _cmp             ;
  lang              : any                           ;
  tech              : Employee                      ;
  techProfile       : any        = {}               ;
  site              : Jobsite                       ;
  static sites      : Array<Jobsite> = []           ;
  sites             : Array<Jobsite> = TechSettingsPage.sites;
  clients           : Array<SESAClient>   = []      ;
  locations         : Array<SESALocation> = []      ;
  locIDs            : Array<SESALocID>    = []      ;
  shiftTimes        : Array<any>      = []          ;
  shiftLengths      : Array<number>   = []          ;
  shiftStartTimes   : Array<number>   = []          ;
  shiftRotations    : Array<string>   = []          ;
  loc2nds           : Array<string>   = []          ;
  sesaConfig        : any        = {}               ;
  // techSettings      : FormGroup                     ;
  firstName         : string                        ;
  lastName          : string                        ;
  technician        : string                        ;
  client            : SESAClient                    ;
  location          : SESALocation                  ;
  locID             : SESALocID                     ;
  allclient         : Array<SESAClient>   = []      ;
  alllocation       : Array<SESALocation> = []      ;
  alllocID          : Array<SESALocID>    = []      ;
  shift             : any                           ;
  shiftLength       : any                           ;
  shiftStartTime    : any                           ;
  shiftRotation     : any                           ;
  title             : string    =  'User'           ;
  techProfileURL    : string = "_local/techProfile" ;
  techSettingsReady : boolean = false               ;
  reportMeta        : any = {}                      ;
  reportWaiting     : boolean = false               ;
  mode              : string                        ;
  siteInfo          : Map<any,any> = new Map()      ;
  dataReady         : boolean = false;              ;

  constructor(
    public navCtrl   : NavController    ,
    public navParams : NavParams        ,
    public db        : DBService          ,
    public translate : TranslateService ,
    // public tabs      : TabsComponent    ,
    public tabServ   : TabsService      ,
    public viewCtrl  : ViewController   ,
    public ud        : UserData         ,
    public alert     : AlertService     ,
    public zone      : NgZone           ,
  ) {

    window["onsite"] = window["onsite"] || {};
    window["onsite"]["techsettings"] = this;
    window["onsite"]["techsettingsClass"] = TechSettingsPage;
    window["techsettings"] = this;
    window["_cmp"] = _cmp;
    window["_dedupe"] = _dedupe;
    window["_sortSites"] = _sortSites;
    window["_sortCLL"] = _sortCLL;
    window["_sort"] = _sort;
  }

  ngOnInit() {
    // this.fixedHeight = this.mapElement.nativeElement.fixed;
    Log.l("TechSettingsPage: ngOnInit() fired");
    if(this.ud.isAppLoaded()) {
      this.runWhenReady();
    }
  }

  ngOnDestroy() {
    Log.l("TechSettingsPage: ngOnDestroy() fired");
  }

  ngAfterViewInit() {
    Log.l("TechSettingsPage: ngAfterViewInit() fired");
    this.tabServ.setPageLoaded(Pages.User);
  }

  public runWhenReady() {
    let translations = [
      'error',
      'spinner_saving_tech_profile',
      'error_saving_tech_profile',
      'error_blank_item',
      'error_no_site_title',
      'error_no_site_message'
    ];
    this.lang = this.translate.instant(translations);
    if ( this.navParams.get('mode') !== undefined ) {
     this.mode = this.navParams.get('mode');
    } else {
      this.mode = 'page';
    }
    Log.l("User: Now trying to get tech profile...");
    this.db.getTechProfile().then((res) => {
      Log.l("User: Got tech profile, now initFormData()...");
      this.techProfile = res;
      this.tech = new Employee();
      this.tech.readFromDoc(this.techProfile);
      this.ud.setTechProfile(this.techProfile);
      this.sites = this.ud.getData('sites').filter((a:Jobsite) => {
        return a.site_active && a.site_number !== 10000006;
      }).sort(_sortSites);
      // this.site = this.ud.get
      this.initFormData();
      this.initializeSites();
      Log.l("User: initFormData() done, now initializeForm()...");
      this.initializeForm();
      this.initializeFormListeners();
      Log.l("Settings screen initialized successfully.");
      this.techSettingsReady = true;
    }).catch((err) => {
      Log.l("Error while initializing Settings screen!");
      Log.e(err);
    });
  }

  private initializeForm() {
    // this.techSettings = new FormGroup({
    //   'lastName'      : new FormControl(this.lastName       , Validators.required) ,
    //   'firstName'     : new FormControl(this.firstName      , Validators.required) ,
    //   'client'        : new FormControl(this.client         , Validators.required) ,
    //   'location'      : new FormControl(this.location       , Validators.required) ,
    //   'locID'         : new FormControl(this.locID          , Validators.required) ,
    //   'shift'         : new FormControl(this.shift          , Validators.required) ,
    //   'shiftLength'   : new FormControl(this.shiftLength    , Validators.required) ,
    //   'shiftStartTime': new FormControl(this.shiftStartTime , Validators.required)
    // });
    let cli = this.tech.client;
    let loc = this.tech.location;
    let lid = this.tech.locID;
    let unassigned:Jobsite = this.sites.find((a:Jobsite) => {
      return a.site_number == 1;
    });
    let site:Jobsite = this.sites.find((a:Jobsite) => {
      return _matchCLL(a.client, cli) && _matchCLL(a.location, loc) && _matchCLL(a.locID, lid);
    });

    // let site = this.getSiteFromInfo(cli, loc, lid);
    this.site = site || unassigned;
  }

  public initializeFormListeners() {
    // let _client   = this.techSettings.get('client');
    // let _location = this.techSettings.get('location');
    // let _locID    = this.techSettings.get('locID');

    // let cli = this.tech.client;
    // let loc = this.tech.location;
    // let lid = this.tech.locID;
    // let site = this.getSiteFromInfo(cli, loc, lid);
    // this.site = site;

    // _client.valueChanges.subscribe((value:CLL) => {
    //   Log.l("CLIENTCHANGE: Client changed to:\n", value);
    //   this.techSettingsReady = false;
    //   // this.initializeSites();
    //   let form = this.techSettings.getRawValue();
    //   let location = form.location;
    //   let locid    = form.locID;
    //   let locations:Array<Jobsite> = this.sites.filter((a:Jobsite) => {return _cmp(value,a['client'])});
    //   let tmpLocations:Array<CLL> = _dedupe(locations.map((a:Jobsite) => a.location)).sort(_sort);
    //   let loc:CLL = tmpLocations.find((a:CLL) => {return a.name === location.name;}) || tmpLocations[0];
    //   let locIDs:Array<Jobsite> = locations.filter((a:Jobsite) => { return _cmp(loc,a.location)})
    //   let tmpLocIDs:Array<CLL> = _dedupe(locIDs.map((a:Jobsite) => a.locID)).sort(_sort);
    //   let lid:CLL       = tmpLocIDs.find((a:CLL)=>{return a.name === locid.name}) || tmpLocIDs[0];

    //   Log.l(`CLIENTCHANGE: location is ${location.fullName}, got locations and locIDs:\n`, tmpLocations);
    //   Log.l(tmpLocIDs);
    //   this.locations = tmpLocations;
    //   this.locIDs    = tmpLocIDs;
    //   this.location = loc;
    //   this.locID    = lid;
    //   _location.setValue(loc, {emitEvent: false});
    //   _locID.setValue(lid, {emitEvent: false});
    //   // if(tmpLocations.length) {
    //   //   if(loc) {
    //   //     setTimeout(() => {
    //   //       _location.setValue({name: loc, emitEvent: false});
    //   //     },100);
    //   //   } else {
    //   //     setTimeout(() => {
    //   //       _location.setValue({name: this.locations[0], emitEvent: false});
    //   //     }, 100);
    //   //   }
    //   // }
    //   this.techSettingsReady = true;
    // });

    // _location.valueChanges.subscribe((value:any) => {
    //   let client    = this.techSettings.getRawValue().client;
    //   Log.l(`LOCATIONCHANGE: Client is '${client.fullName}', location changed to '${value.fullName}' out of these:\n`, this.locations);
    //   // Log.l(this.locations);

    //   let locations = this.sites.filter((obj,pos,arr) => {return _cmp(client,obj['client'])});
    //   let locIDs    = locations.filter((obj, pos, arr) => {return _cmp(value,obj['location'])});
    //   Log.l("LOCATIONCHANGE: ended up with locations and locIDs:\n", locations);
    //   Log.l(locIDs);
    //   if(locIDs.length) {
    //     this.locIDs = _dedupe(locIDs.map(obj => obj['locID'])).sort(_sort);
    //     Log.l("LOCATIONCHANGE: Got locIDs:\n", this.locIDs);
    //     if(this.locIDs.length) {
    //       let lid = this.locIDs.find(a=>{return a['name']==='MNSHOP';});
    //       if(lid) {
    //         this.locID = lid;
    //         setTimeout(() => {
    //           _locID.setValue(lid, {emitEvent: false });
    //         }, 100);
    //       } else {
    //         this.locID = this.locIDs[0];
    //         setTimeout(() => {
    //           _locID.setValue(this.locIDs[0], {emitEvent: false});
    //         }, 100);
    //       }
    //     }
    //   }
    // });

    // _locID.valueChanges.subscribe((value:any) => {
    //   Log.l("LOCIDCHANGE: LocID changed to:\n", value);
    // });
  }

  public updateSite(site:Jobsite, event?:any) {
    Log.l("updateSite(): Updated site to:\n", site);
    this.site = site;
    this.tech.site_number = site.site_number;
    let cli = site.client;
    let loc = site.location;
    let lid = site.locID;

    // this.updateLocID(lid);
    // this.updateLocation(loc);
    this.updateClient(cli);
  }

  public updateClient(client:SESAClient, event?:any) {
    Log.l("updateClient(): Updated to:\n", client);
    this.client = client;
    let locid:SESALocID = this.locID;
    let location:SESALocation = this.location;
    let locations:Array<Jobsite> = this.sites.filter((a:Jobsite) => { return _cmp(client, a.client) });
    let tmpLocations:Array<SESALocation> = _dedupe(locations.map((a:Jobsite) => a.location)).sort(_sortCLL);
    let loc:SESALocation = tmpLocations.find((a:SESALocation) => { return _cmp(a, location); }) || tmpLocations[0];
    // let loc = loc1 ? loc1 : tmpLocations[0];
    this.locations = tmpLocations;
    this.location = loc;
    let locIDs:Array<Jobsite> = locations.filter((a:Jobsite) => { return _cmp(loc, a.location) })
    let tmpLocIDs:Array<SESALocID> = _dedupe(locIDs.map((a:Jobsite) => a.locID)).sort(_sortCLL);
    // let lid1:CLL = tmpLocIDs.find(a => { return a['name'].toUpperCase() === locid['name'].toUpperCase(); });
    let lid1:SESALocID = tmpLocIDs.find((a:SESALocID) => { return _cmp(a, locid)})
    let lid2:SESALocID = tmpLocIDs.find((a:SESALocID) => { return a.name.toUpperCase() === 'MNSHOP'; });
    let lid:SESALocID = lid1 ? lid1 : lid2 ? lid2 : tmpLocIDs[0];
    this.locIDs = tmpLocIDs;
    this.locID = lid;

    let site:Jobsite = this.getSiteFromInfo(client, loc, lid);

    this.setTechTimes();

    Log.l(`CLIENTCHANGE: Client ${client.fullName}, location ${loc.fullName}, locID ${lid.fullName}.\ngot locations and locIDs:\n`, tmpLocations);
    Log.l(tmpLocIDs);
  }

  public updateLocation(location:SESALocation, event?:any) {
    Log.l("updateLocation(): Updated to:\n", location);
    let client:SESAClient = this.client;
    // let client = this.techSettings.getRawValue().client;
    // Log.l(`LOCATIONCHANGE: Client is '${client.fullName}', location changed to '${value.fullName}' out of these:\n`, this.locations);
    // Log.l(this.locations);
    let locid:SESALocID = this.locID;
    let locations:Array<Jobsite> = this.sites.filter((a:Jobsite) => { return _cmp(client, a.client); });
    let locIDs:Array<Jobsite> = locations.filter((a:Jobsite) => { return _cmp(location, a.location) });
    let tmpLocIDs:Array<SESALocID> = _dedupe(locIDs.map((a:Jobsite) => a.locID)).sort(_sortCLL);
    let lid1:SESALocID  = tmpLocIDs.find((a:SESALocID) => { return _cmp(a, locid); });
    let lid2:SESALocID  = tmpLocIDs.find((a:SESALocID) => { return a.name.toUpperCase() === 'MNSHOP'; });
    let lid:SESALocID = lid1 ? lid1 : lid2 ? lid2 : tmpLocIDs[0];
    this.locIDs = tmpLocIDs;
    this.locID = lid;

    Log.l("LOCATIONCHANGE: ended up with locations and locIDs:\n", locations);
    Log.l(locIDs);
    let site:Jobsite = this.getSiteFromInfo(client, location, lid);
    this.setTechTimes();

    // if (locIDs.length) {
    //   this.locIDs = _dedupe(locIDs.map(obj => obj['locID'])).sort(_sort);
    //   Log.l("LOCATIONCHANGE: Got locIDs:\n", this.locIDs);
    //   if (this.locIDs.length) {
    //     let lid = this.locIDs.find(a => { return a['name'] === 'MNSHOP'; });
    //     if (lid) {
    //       this.locID = lid;
    //       // setTimeout(() => {
    //       //   _locID.setValue(lid, { emitEvent: false });
    //       // }, 100);
    //     } else {
    //       this.locID = this.locIDs[0];
    //       // setTimeout(() => {
    //       //   _locID.setValue(this.locIDs[0], { emitEvent: false });
    //       // }, 100);
    //     }
    //   }
    // }
  }

  public updateLocID(locID:SESALocID, event?:any) {
    Log.l("updateLocID(): Updated to:\n", locID);
    let client:SESAClient = this.client;
    let location:SESALocation = this.location;
    let lid:SESALocID = this.locID;
    let site:Jobsite = this.getSiteFromInfo(client, location, lid);
    this.setTechTimes();
  }

  public setTechTimes() {
    Log.l("setTechTimes(): Now running...");
    let site = this.site;
    let rot = this.tech.rotation;
    let shift = this.tech.shift;
    let now = moment();
    let shiftLength = site.getShiftLengthForDate(rot, shift, now);
    let shiftStartTime = site.getShiftStartTime(shift);
    shiftLength = this.shiftLengths.find(a => a['name'] === shiftLength);
    shiftStartTime = this.shiftStartTimes.find(a => a['fullName'] === shiftStartTime);
    this.shiftLength = shiftLength;
    this.shiftStartTime = shiftStartTime;
  }

  public initFormData() {
    let sesaConfig = this.ud.getSesaConfig();
    if (sizeOf(sesaConfig) > 0) {
      let keys  = ['client', 'location', 'locid', 'shift', 'shiftlength', 'shiftstarttime'];
      let keys2 = ['client', 'location', 'locID', 'shift', 'shiftLength', 'shiftStartTime'];
      let keys3 = ['clients', 'locations', 'locIDs', 'shiftTimes', 'shiftLengths', 'shiftStartTimes'];
      for (let i in keys) {
        let sesaVar   = keys[i];
        let techVar   = keys2[i];
        let selVar    = keys3[i];
        this[techVar] = this.selectMatch(this.techProfile[techVar], sesaConfig[sesaVar]);
        this[selVar]  = sesaConfig[sesaVar];
      }
    }
    this.lastName       = this.techProfile.lastName       ;
    this.firstName      = this.techProfile.firstName      ;
  }

  public selectMatch(key:string, values:Array<any>) {
    Log.l(values);
    let matchKey = String(key).toUpperCase();
    for(let value of values) {
      let name = String(value.name).toUpperCase();
      let fullName = String(value.fullName).toUpperCase();
      if (name === matchKey || fullName === matchKey) {
        return value;
      }
    }
    return null;
  }

  public initializeSites() {
    this.techSettingsReady = false;
    let sites:Array<Jobsite>          = this.sites && this.sites.length ? this.sites : this.ud.getData('sites');
    let clients:Array<SESAClient>     = _dedupe(sites.map((a:Jobsite) => a.client));
    let locations:Array<SESALocation> = _dedupe(sites.map((a:Jobsite) => a.location));
    let locIDs:Array<SESALocID>       = _dedupe(sites.map((a:Jobsite) => a.locID));

    this.allclient   = clients.slice(0);
    this.alllocation = locations.slice(0);
    this.alllocID    = locIDs.slice(0);
    this.clients     = this.allclient.sort(_sortCLL);
    this.locations   = this.alllocation.sort(_sortCLL);
    this.locIDs      = this.alllocID.sort(_sortCLL);
    let cli:string   = this.tech.client;
    let loc:string   = this.tech.location;
    let lid:string   = this.tech.locID;
    this.client      = this.clients.find((a:SESAClient)=>_cmp(a, cli));
    this.location    = this.locations.find((a:SESALocation)=>_cmp(a,loc));
    this.locID       = this.locIDs.find((a:SESALocID)=>_cmp(a,lid));
    this.updateClient(this.client);
  }

  public getSiteFromInfo(client:SESAClient, location:SESALocation, locID:SESALocID) {
    let lang = this.lang;
    let sites = this.sites;
    let site:Jobsite = sites.find((a:Jobsite) => {
      return _cmp(a.client, client) && _cmp(a.location, location) && _cmp(a.locID, locID);
    });
    // let site = sites.filter((obj, pos, arr) => { return _cmp(this.client, obj['client']) })
    //                 .filter((obj, pos, arr) => { return _cmp(this.location, obj['location']) })
    //                 .filter((obj, pos, arr) => { return _cmp(this.locID, obj['locID']) });
    Log.l("getSiteFromInfo(): Site narrowed down to:\n", site);
    if(site && !window['onsitedevflag']) {
      this.site = site;
      return site;
    } else {
      let msg = sprintf(lang['error_no_site_message'], this.client.fullName, this.location.fullName, this.locID.fullName);
      this.alert.showAlert(lang['error_no_site_title'], lang['error_no_site_message']);
      throw new Error("Site not found.")
    }
  }

  public async onSubmit() {
    let lang = this.lang;
    let spinnerID;
    try {
      // let form            = this.techSettings.value               ;
      let tech            = this.tech                             ;
      let keys = ['firstName', 'lastName', 'client', 'location', 'locID', 'shift', 'shiftLength', 'shiftStartTime'];
      let error = false;
      let errorKey = "";
      for(let key of keys) {
        if(error) {
          break;
        };
        let value = this[key];
        if(!value) {
          error = true;
          errorKey = key;
        }
      }
      if(!error) {
        spinnerID = await this.alert.showSpinnerPromise(lang['spinner_saving_tech_profile']);
        tech.updated        = true                                  ;
        tech.technician     = this.lastName + ', ' + this.firstName ;
        tech.client         = this.client.fullName.toUpperCase()    ;
        tech.location       = this.location.fullName.toUpperCase()  ;
        tech.locID          = this.locID.name.toUpperCase()         ;
        tech.shift          = this.shift.name                       ;
        tech.shiftLength    = Number(this.shiftLength.name)         ;
        tech.shiftStartTime = Number(this.shiftStartTime.name)      ;
        tech.firstName      = this.firstName                        ;
        tech.lastName       = this.lastName                         ;
        this.reportMeta     = tech                                  ;
        let site:Jobsite = this.getSiteFromInfo(this.client, this.location, this.locID);
        if(site) {
          this.site = site;
        }
        Log.l("onSubmit(): Now attempting to save tech profile:");
        let res:any = await this.db.saveTechProfile(this.reportMeta);
        Log.l("onSubmit(): Saved techProfile successfully. Now updating shift info for new site:\n", this.site);
        this.ud.updateAllShiftInfo(this.site, tech);
        this.ud.setTechUpdated(true);
        Log.l("onSubmit(): Updated all shift info successfully. Now returning from tech settings.");
        if ( this.mode === 'modal' ) {
          Log.l('Mode = ' + this.mode );
          let out = await this.alert.hideSpinnerPromise(spinnerID);
          this.viewCtrl.dismiss();
          return true;
        } else {
          Log.l('Mode = ' + this.mode );
          let out = await this.alert.hideSpinnerPromise(spinnerID);
          this.tabServ.goToPage('OnSiteHome');
          return true;
        }
      } else {
        let title = lang['error'];
        let text = sprintf(lang['error_blank_item'], errorKey);
        Log.l("onSubmit(): User left form item '%s' blank.", errorKey);
        this.alert.showAlert(title, text);
      }
    } catch(err) {
      Log.l("onSubmit(): Error saving techProfile!");
      Log.e(err);
      let out = await this.alert.showAlert(lang['error'], lang['error_saving_tech_profile'])
    }
  }

  public async updateUser() {

  }


  public cancel() {
    if(this.mode === 'modal') {
      this.viewCtrl.dismiss();
    } else {
      this.tabServ.goToPage('OnSiteHome');
    }
  }
}
