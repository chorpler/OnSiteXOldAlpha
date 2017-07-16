// import { Component, OnInit, ViewChild, ElementRef     } from '@angular/core'                          ;
import { Component, OnInit                            } from '@angular/core'                          ;
import { FormGroup, FormControl, Validators           } from "@angular/forms"                         ;
import { IonicPage, NavController, NavParams          } from 'ionic-angular'                          ;
import { ViewController                               } from 'ionic-angular'                          ;
import { TranslateService                             } from '@ngx-translate/core'                    ;
// import { CLIENT, LOCATION, LOCID, SHIFTLENGTH         } from '../../config/config.constants.settings' ;
// import { SHIFT, SHIFTSTARTTIME, SHIFTROTATION, LOC2ND } from '../../config/config.constants.settings' ;
// import { REPORTHEADER, REPORTMETA                     } from '../../config/report.object'             ;
import { Log, sizeOf, isMoment, moment, Moment        } from '../../config/config.functions'          ;
import { DBSrvcs                                      } from '../../providers/db-srvcs'               ;
// import { ReportBuildSrvc                              } from '../../providers/report-build-srvc'      ;
// import { Login                                        } from '../login/login'                         ;
import { UserData                                     } from '../../providers/user-data'              ;
import { AlertService                                 } from '../../providers/alerts'                 ;
import { TabsComponent                                } from '../../components/tabs/tabs'             ;
import { Employee,Jobsite                             } from '../../domain/domain-classes'            ;

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

@IonicPage({
  name: 'User'
})
@Component({
  selector: 'page-tech-settings',
  templateUrl: 'tech-settings.html',
})
export class TechSettingsPage implements OnInit {
  // @ViewChild('ionheader') mapElement: ElementRef;
  fixedHeight       : any        = "0px"            ;
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
  client            : string                        ;
  location          : string                        ;
  locID             : string                        ;
  loc2nd            : string                        ;
  allclient         : Array<any>                    ;
  alllocation       : Array<any>                    ;
  alllocID          : Array<any>                    ;
  allloc2nd         : Array<any>                    ;
  shift             : string                        ;
  shiftLength       : string                        ;
  shiftStartTime    : string                        ;
  shiftRotation     : string                        ;
  title             : string    =  'User'           ;
  techProfileURL    : string = "_local/techProfile" ;
  techSettingsReady : boolean = false               ;
  reportMeta        : any = {}                      ;
  reportWaiting     : boolean = false               ;
  mode              : string                        ;
  siteInfo          : Map<any,any> = new Map()      ;
  dataReady         : boolean = false;              ;

  constructor( public navCtrl: NavController, public navParams    : NavParams,
               public db     : DBSrvcs      , public translate    : TranslateService,
               public tabs   : TabsComponent, public viewCtrl     : ViewController,
               public ud     : UserData     , public alert        : AlertService,
  ) {

    window["onsite"] = window["onsite"] || {};
    window["onsite"]["settings"] = this;
    window["onsite"]["settingsClass"] = TechSettingsPage;
    window["techsettings"] = this;
  }

  ngOnInit() {
    // this.fixedHeight = this.mapElement.nativeElement.fixed;
    let translations = [
      'error',
      'spinner_saving_tech_profile',
      'error_saving_tech_profile',
      'error_blank_item'
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
      this.initializeSites();
      this.initFormData();
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
      'loc2nd'        : new FormControl(this.loc2nd         , Validators.required) ,
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
      Log.l("Client changed to:\n", value);
      this.dataReady = false;
      this.initializeSites();
      let locations = this.sites.filter((obj,pos,arr) => {return _cmp(value,obj['client'])});
      let locIDs = locations.filter((obj,pos,arr) => { return _cmp()})
      this.locations = _dedupe(locations.map(obj => obj['location']));
      // this.locIDs    = _dedupe()
      Log.l("Got locations:\n", this.locations);
      // Log.l(this.locIDs);
      _location.setValue(this.locations[0]);
    });

    _location.valueChanges.subscribe((value:any) => {
      Log.l("Location changed to:\n", value);
      let client    = this.techSettings.value.client;
      let locations = this.sites.filter((obj,pos,arr) => {return _cmp(client,obj['client'])});
      let locIDs    = locations.filter((obj, pos, arr) => {return _cmp(value, obj['location'])});
      this.locIDs   = _dedupe(locIDs.map(obj => obj['locID']));
      Log.l("Got locID:\n", this.locIDs);
      _locID.setValue(this.locIDs[0]);
    });

    _locID.valueChanges.subscribe((value:any) => {
      Log.l("LocID changed to:\n", value);
    });
  }

  initFormData() {
    let sesaConfig = this.ud.getSesaConfig();
    if (sizeOf(sesaConfig) > 0) {
      let keys  = ['client', 'location', 'locid', 'loc2nd', 'shift', 'shiftlength', 'shiftstarttime'];
      let keys2 = ['client', 'location', 'locID', 'loc2nd', 'shift', 'shiftLength', 'shiftStartTime'];
      let keys3 = ['clients', 'locations', 'locIDs', 'loc2nds', 'shiftTimes', 'shiftLengths', 'shiftStartTimes'];
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
      let nameKey = String(value.name).toUpperCase();
      let fullNameKey = String(value.fullName).toUpperCase();
      if(nameKey === matchKey || fullNameKey === matchKey) {
        return value;
      }
    }
    return null;
  }

  // public getSitesFor(cli:any, loc?:any, lid?:any, lc2?:any) {
  //   let sites = this.ud.getData('sites');
  //   for(let site of sites) {
  //     if(_cmp(cli, site.client)) {
  //       this.locations
  //     }
  //   }
  // }

  public initializeSites() {
    let sites = this.ud.getData('sites');
    let clients   = new Array() ;
    let locations = new Array() ;
    let locIDs    = new Array() ;
    let loc2nds   = new Array() ;
    // for(let site of sites) {
    //   site.filter((a,b) => {
    //     return
    //   },[]);
    // }
    this.siteInfo = this.ud.createSiteComponentsList();
    // clients = [...this.siteInfo.keys()];
    for(let site of sites) {
      // let cli = JSON.stringify(site.client);
      // let cli = site.client;

      clients.push  (site.client  );
      locations.push(site.location);
      locIDs.push   (site.locID   );
      // if(site.loc2nd) { loc2nds.push  (site.loc2nd  )};
      // clients.add(  JSON.stringify(site.client  ));
      // locations.add(JSON.stringify(site.location));
      // locIDs.add(   JSON.stringify(site.locID   ));
      // loc2nds.add(  JSON.stringify(site.loc2nd  ));
    }
    let k = [clients,locations,locIDs,loc2nds];
    window['funqy1'] = k;
    Log.l("Arrays:\n", k);
    this.allclient   = _dedupe(clients, 'fullName');
    this.alllocation = _dedupe(locations, 'fullName');
    this.alllocID    = _dedupe(locIDs, 'fullName');
    this.allloc2nd   = _dedupe(loc2nds, 'fullName');
    this.clients     = this.allclient.map(obj => obj['fullName'].toUpperCase());
    this.locations   = this.alllocation.map(obj => obj['fullName'].toUpperCase());
    this.locIDs      = this.alllocID.map(obj => obj['fullName'].toUpperCase());
    this.loc2nds     = this.allloc2nd.map(obj => obj['fullName'].toUpperCase());
    let j = [clients,locations,locIDs,loc2nds];
    window['funqy']=j;

    // let js = new Map();

    // let clients = new Map();
    // for(let site of sites) {
    //   let client = site.client;
    //   let name = client.fullName;
    //   if(!clients.has(client)) {
    //     clients.set(client, new Map());
    //   }
    //   let locations = clients.get(client);
    //   let location  = site.location;
    //   name = location.fullName;
    //   if(!locations.has(location)) {
    //     locations.set(location, new Map());
    //   }
    //   let locIDs = locations.get(location);
    //   let locID  = site.locID;
    //   name = locID.fullName;
    //   if(!locIDs.has(locID)) {
    //     locIDs.set(locID, locID);
    //   }
    // }
    // Log.l("initializeSites(): New clients list is:\n", clients);
    // return clients;
  }

  public getSiteFromInfo(client:any, location:any, locID:any, loc2nd?:any) {
    let cli, loc, lid, lc2;
    if(client && typeof client === 'object' && typeof client.fullName === 'string') {
      cli = client.fullName.toUpperCase();
    } else if(client && typeof client === 'string') {
      cli = client.toUpperCase();
    }

    if(location && typeof location === 'object' && typeof location.fullName === 'string') {
      loc = location.fullName.toUpperCase();
    } else if(location && typeof location === 'string') {
      loc = location.toUpperCase();
    }

    if(locID && typeof locID === 'object' && typeof locID.fullName === 'string') {
      lid = locID.fullName.toUpperCase();
    } else if(locID && typeof locID === 'string') {
      lid = locID.toUpperCase();
    }

    if(loc2nd && typeof loc2nd === 'object' && typeof loc2nd.fullName === 'string') {
      lc2 = loc2nd.fullName.toUpperCase();
    } else if(loc2nd && typeof loc2nd === 'string') {
      lc2 = loc2nd.toUpperCase();
    }

    let js = null;

    for(let site of this.sites) {
      let cli1 = site.client.fullName.toUpperCase();
      let loc1 = site.location.fullName.toUpperCase();
      let lid1 = site.locID.fullName.toUpperCase();
      let lc21 = "";
      if(site.loc2nd && typeof site.loc2nd.fullName === 'string') {
        lc21 = site.loc2nd.fullName.toUpperCase();
      } else if(site.loc2nd && typeof site.loc2nd === 'string') {
        lc21 = site.loc2nd.toUpperCase();
      } else {
        lc21 = "NA";
      }
      if(cli === cli1 && loc === loc1 && lid === lid1) {
        if(lc2 !== 'NA' && lc2 !== "N/A") {
          if(lc2 === lc21) {
            js = site;
            break;
          }
        } else {
          js = site;
          break;
        }
      }
    }

    if(js) {
      return js;
    } else {
      Log.w("getSiteFromInfo(): Could not find job site for '%s_%s_%s'.", cli, loc, lid);
      return false;
    }

  }

  onSubmit() {
    let lang = this.lang;
    let form            = this.techSettings.value               ;
    let tech            = this.tech                             ;
    let keys = Object.keys(form);
    let error = false;
    let errorKey = "";
    for(let key of keys) {
      if(error) {break};
      let value = form[key];
      if(!value) {
        error = true;
        errorKey = key;
      }
    }
    if(!error) {
      this.alert.showSpinner(lang['spinner_saving_tech_profile']);
      tech.updated        = true                                  ;
      tech.technician     = form.lastName + ', ' + form.firstName ;
      tech.client         = form.client.fullName.toUpperCase()    ;
      tech.location       = form.location.fullName.toUpperCase()  ;
      tech.locID          = form.locID.name.toUpperCase()         ;
      tech.loc2nd         = form.loc2nd.name.toUpperCase()        ;
      tech.shift          = form.shift.name                       ;
      tech.shiftLength    = Number(form.shiftLength.name)         ;
      tech.shiftStartTime = Number(form.shiftStartTime.name)      ;
      tech.firstName      = form.firstName                        ;
      tech.lastName       = form.lastName                         ;
      this.reportMeta     = tech                                  ;
      let site = this.getSiteFromInfo(tech.client, tech.location, tech.locID, tech.loc2nd);
      if(site) {
        this.site = site;
      }
      Log.l("onSubmit(): Now attempting to save tech profile:");
      this.db.saveTechProfile(this.reportMeta).then((res) => {
        Log.l("onSubmit(): Saved techProfile successfully.");
        this.ud.updateAllShiftInfo(site, tech);
        if ( this.mode === 'modal' ) {
          Log.l('Mode = ' + this.mode );
          this.alert.hideSpinner();
          this.viewCtrl.dismiss();
        }
        else {
          Log.l('Mode = ' + this.mode );
          this.alert.hideSpinner();
          this.tabs.goToPage('OnSiteHome');
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
}
