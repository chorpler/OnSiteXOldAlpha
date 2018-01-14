// import { TabsComponent                         } from 'components/tabs/tabs'    ;
import { sprintf                               } from 'sprintf-js'              ;
import { Component, OnInit, OnDestroy, NgZone  } from '@angular/core'           ;
import { AfterViewInit,                        } from '@angular/core'           ;
import { FormGroup, FormControl, Validators    } from "@angular/forms"          ;
import { IonicPage, NavController, NavParams   } from 'ionic-angular'           ;
import { ViewController                        } from 'ionic-angular'           ;
import { TranslateService                      } from '@ngx-translate/core'     ;
import { Log, sizeOf, isMoment, moment, Moment } from 'config/config.functions' ;
import { DBService                               } from 'providers/db-service'      ;
import { UserData                              } from 'providers/user-data'     ;
import { AlertService                          } from 'providers/alerts'        ;
import { Employee,Jobsite                      } from 'domain/domain-classes'   ;
import { TabsService                           } from 'providers/tabs-service'  ;
import { Pages                                 } from 'config/config.types'     ;

export const _cmp = (a,b) => {
  if(a === undefined || b === undefined || a['fullName'] === undefined || b['fullName'] === undefined) {
    return false;
  } else {
    return a['fullName'].toUpperCase() === b['fullName'].toUpperCase();
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
  clients           : Array<any>                    ;
  locations         : Array<any>                    ;
  locIDs            : Array<any>                    ;
  shiftTimes        : Array<any>                    ;
  shiftLengths      : Array<number>                 ;
  shiftStartTimes   : Array<number>                 ;
  shiftRotations    : Array<string>                 ;
  loc2nds           : Array<string>                 ;
  sesaConfig        : any        = {}               ;
  techSettings      : FormGroup                     ;
  firstName         : string                        ;
  lastName          : string                        ;
  technician        : string                        ;
  client            : any                           ;
  location          : any                           ;
  locID             : any                           ;
  allclient         : Array<any>                    ;
  alllocation       : Array<any>                    ;
  alllocID          : Array<any>                    ;
  allloc2nd         : Array<any>                    ;
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
      this.sites = this.ud.getData('sites');
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
    this.techSettings = new FormGroup({
      'lastName'      : new FormControl(this.lastName       , Validators.required) ,
      'firstName'     : new FormControl(this.firstName      , Validators.required) ,
      'client'        : new FormControl(this.client         , Validators.required) ,
      'location'      : new FormControl(this.location       , Validators.required) ,
      'locID'         : new FormControl(this.locID          , Validators.required) ,
      'shift'         : new FormControl(this.shift          , Validators.required) ,
      'shiftLength'   : new FormControl(this.shiftLength    , Validators.required) ,
      'shiftStartTime': new FormControl(this.shiftStartTime , Validators.required)
    });
  }

  public initializeFormListeners() {
    let _client   = this.techSettings.get('client');
    let _location = this.techSettings.get('location');
    let _locID    = this.techSettings.get('locID');

    _client.valueChanges.subscribe((value:any) => {
      Log.l("CLIENTCHANGE: Client changed to:\n", value);
      this.techSettingsReady = false;
      // this.initializeSites();
      let form = this.techSettings.getRawValue();
      let location = form.location;
      let locid    = form.locID;
      let locations = this.sites.filter((obj,pos,arr) => {return _cmp(value,obj['client'])});
      let tmpLocations = _dedupe(locations.map(obj => obj['location'])).sort(_sort);
      let loc = tmpLocations.find(a=>{return a['name']===location['name'];}) || tmpLocations[0];
      let locIDs = locations.filter((obj,pos,arr) => { return _cmp(loc,obj['location'])})
      let tmpLocIDs = _dedupe(locIDs.map(obj => obj['locID'])).sort(_sort);
      let lid       = tmpLocIDs.find(a=>{return a['name']===locid['name']}) || tmpLocIDs[0];

      Log.l(`CLIENTCHANGE: location is ${location.fullName}, got locations and locIDs:\n`, tmpLocations);
      Log.l(tmpLocIDs);
      this.locations = tmpLocations;
      this.locIDs    = tmpLocIDs;
      this.location  = loc;
      this.locID     = lid;
      this.location = loc;
      this.locID    = lid;
      _location.setValue(loc, {emitEvent: false});
      _locID.setValue(lid, {emitEvent: false});
      // if(tmpLocations.length) {
      //   if(loc) {
      //     setTimeout(() => {
      //       _location.setValue({name: loc, emitEvent: false});
      //     },100);
      //   } else {
      //     setTimeout(() => {
      //       _location.setValue({name: this.locations[0], emitEvent: false});
      //     }, 100);
      //   }
      // }
      this.techSettingsReady = true;
    });

    _location.valueChanges.subscribe((value:any) => {
      let client    = this.techSettings.getRawValue().client;
      Log.l(`LOCATIONCHANGE: Client is '${client.fullName}', location changed to '${value.fullName}' out of these:\n`, this.locations);
      // Log.l(this.locations);

      let locations = this.sites.filter((obj,pos,arr) => {return _cmp(client,obj['client'])});
      let locIDs    = locations.filter((obj, pos, arr) => {return _cmp(value,obj['location'])});
      Log.l("LOCATIONCHANGE: ended up with locations and locIDs:\n", locations);
      Log.l(locIDs);
      if(locIDs.length) {
        this.locIDs = _dedupe(locIDs.map(obj => obj['locID'])).sort(_sort);
        Log.l("LOCATIONCHANGE: Got locIDs:\n", this.locIDs);
        if(this.locIDs.length) {
          let lid = this.locIDs.find(a=>{return a['name']==='MNSHOP';});
          if(lid) {
            this.locID = lid;
            setTimeout(() => {
              _locID.setValue(lid, {emitEvent: false });
            }, 100);
          } else {
            this.locID = this.locIDs[0];
            setTimeout(() => {
              _locID.setValue(this.locIDs[0], {emitEvent: false});
            }, 100);
          }
        }
      }
    });

    _locID.valueChanges.subscribe((value:any) => {
      Log.l("LOCIDCHANGE: LocID changed to:\n", value);
    });
  }

  updateClient(client:any) {
    Log.l("updateClient(): Updated to:\n", client);
    let locid = this.locID;
    let locations = this.sites.filter((obj, pos, arr) => { return _cmp(client, obj['client']) });
    let tmpLocations = _dedupe(locations.map(obj => obj['location'])).sort(_sort);
    let loc1 = tmpLocations.find(a => { return a['name'] === location['name']; });
    let loc = loc1 ? loc1 : tmpLocations[0];
    this.locations = tmpLocations;
    this.location = loc;
    let locIDs = locations.filter((obj, pos, arr) => { return _cmp(loc, obj['location']) })
    let tmpLocIDs = _dedupe(locIDs.map(obj => obj['locID'])).sort(_sort);
    let lid1 = tmpLocIDs.find(a => { return a['name'].toUpperCase() === locid['name'].toUpperCase(); });
    let lid2 = tmpLocIDs.find(a => { return a['name'].toUpperCase() === 'MNSHOP'; });
    let lid = lid1 ? lid1 : lid2 ? lid2 : tmpLocIDs[0];
    this.locIDs = tmpLocIDs;
    this.locID = lid;

    let site = this.getSiteFromInfo(client, loc, lid);
    this.setTechTimes();

    Log.l(`CLIENTCHANGE: Client ${client.fullName}, location ${loc.fullName}, locID ${lid.fullName}.\ngot locations and locIDs:\n`, tmpLocations);
    Log.l(tmpLocIDs);
  }

  updateLocation(location:any) {
    Log.l("updateLocation(): Updated to:\n", location);
    let client = this.client;
    // let client = this.techSettings.getRawValue().client;
    // Log.l(`LOCATIONCHANGE: Client is '${client.fullName}', location changed to '${value.fullName}' out of these:\n`, this.locations);
    // Log.l(this.locations);
    let locid = this.locID;
    let locations = this.sites.filter((obj, pos, arr) => { return _cmp(client, obj['client']) });
    let locIDs = locations.filter((obj, pos, arr) => { return _cmp(location, obj['location']) });
    let tmpLocIDs = _dedupe(locIDs.map(obj => obj['locID'])).sort(_sort);
    let lid1  = tmpLocIDs.find(a => { return a['name'].toUpperCase() === locid['name'].toUpperCase(); });
    let lid2  = tmpLocIDs.find(a => { return a['name'].toUpperCase() === 'MNSHOP'; });
    let lid = lid1 ? lid1 : lid2 ? lid2 : tmpLocIDs[0];
    this.locIDs = tmpLocIDs;
    this.locID = lid;

    Log.l("LOCATIONCHANGE: ended up with locations and locIDs:\n", locations);
    Log.l(locIDs);
    let site = this.getSiteFromInfo(client, location, lid);
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

  updateLocID(locID:any) {
    Log.l("updateLocID(): Updated to:\n", locID);
    let client = this.client;
    let location = this.location;
    let lid = this.locID;
    let site = this.getSiteFromInfo(client, location, lid);
    this.setTechTimes();
  }

  public setTechTimes() {
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

  initFormData() {
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

  selectMatch(key:string, values:Array<any>) {
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
    let sites = this.ud.getData('sites');
    let clients   = new Array() ;
    let locations = new Array() ;
    let locIDs    = new Array() ;

    clients   = _dedupe(sites.map(obj => obj['client']));
    locations = _dedupe(sites.map(obj => obj['location']));
    locIDs    = _dedupe(sites.map(obj => obj['locID']));

    this.allclient   = clients.slice(0);
    this.alllocation = locations.slice(0);
    this.alllocID    = locIDs.slice(0);
    this.clients     = this.allclient.sort(_sort);
    this.locations   = this.alllocation.sort(_sort);
    this.locIDs      = this.alllocID.sort(_sort);
    let cli          = this.tech.client;
    let loc          = this.tech.location;
    let lid          = this.tech.locID;
    this.client      = this.clients.find(a=>{return a['fullName'].toUpperCase() === cli.toUpperCase() || a['name'] === cli.toUpperCase();});
    this.location    = this.locations.find(a=>{return a['fullName'].toUpperCase() === loc.toUpperCase() || a['name'] === loc.toUpperCase();});
    this.locID       = this.locIDs.find(a=>{return a['fullName'].toUpperCase() === lid.toUpperCase() || a['name'] === lid.toUpperCase();});
  }

  public getSiteFromInfo(client:any, location:any, locID:any, loc2nd?:any) {
    let lang = this.lang;
    let sites = this.sites;
    let site = sites.filter((obj, pos, arr) => { return _cmp(this.client, obj['client']) })
                    .filter((obj, pos, arr) => { return _cmp(this.location, obj['location']) })
                    .filter((obj, pos, arr) => { return _cmp(this.locID, obj['locID']) });
    Log.l("getSiteFromInfo(): Site narrowed down to:\n", site);
    if(site && !window['onsitedevflag']) {
      this.site = site[0];
      return site[0];
    } else {
      let msg = sprintf(lang['error_no_site_message'], this.client.fullName, this.location.fullName, this.locID.fullName);
      this.alert.showAlert(lang['error_no_site_title'], lang['error_no_site_message']);
      throw new Error("Site not found.")
    }
  }

  onSubmit() {
    let lang = this.lang;
    let form            = this.techSettings.value               ;
    let tech            = this.tech                             ;
    let keys = ['firstName', 'lastName', 'client', 'location', 'locID', 'shift', 'shiftLength', 'shiftStartTime'];
    let error = false;
    let errorKey = "";
    for(let key of keys) {
      if(error) {break};
      let value = this[key];
      if(!value) {
        error = true;
        errorKey = key;
      }
    }
    if(!error) {
      this.alert.showSpinner(lang['spinner_saving_tech_profile']) ;
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
      let site = this.getSiteFromInfo(this.client, this.location, this.locID);
      if(site) {
        this.site = site;
      }
      Log.l("onSubmit(): Now attempting to save tech profile:");
      this.db.saveTechProfile(this.reportMeta).then((res) => {
        Log.l("onSubmit(): Saved techProfile successfully. Now updating shift info for new site:\n", this.site);
        this.ud.updateAllShiftInfo(this.site, tech);
        this.ud.setTechUpdated(true);
        Log.l("onSubmit(): Updated all shift info successfully. Now returning from tech settings.");
        if ( this.mode === 'modal' ) {
          Log.l('Mode = ' + this.mode );
          this.alert.hideSpinner();
          this.viewCtrl.dismiss();
        } else {
          Log.l('Mode = ' + this.mode );
          this.alert.hideSpinner();
          this.tabServ.goToPage('OnSiteHome');
        }
      }).catch((err) => {
        Log.l("onSubmit(): Error saving techProfile!");
        Log.e(err);
        this.alert.showAlert(lang['error'], lang['error_saving_tech_profile'])
      });
    } else {
      let title = lang['error'];
      let text = sprintf(lang['error_blank_item'], errorKey);
      Log.l("onSubmit(): User left form item '%s' blank.", errorKey);
      this.alert.showAlert(title, text).catch(err => {
        Log.l("onSubmit(): Error showing alert to user!");
        Log.e(err);
      });
    }
  }

  public cancel() {
    if(this.mode === 'modal') {
      this.viewCtrl.dismiss();
    } else {
      this.tabServ.goToPage('OnSiteHome');
    }
  }
}
