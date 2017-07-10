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
  clients           : Array<string>                 ;
  locations         : Array<string>                 ;
  locIDs            : Array<string>                 ;
  shiftTimes        : Array<string>                 ;
  shiftLengths      : Array<number>                 ;
  shiftStartTimes   : Array<number>                 ;
  shiftRotations    : Array<string>                 ;
  loc2nds           : Array<string>                 ;
  // selClient         : Array<string>                 ;
  // selLocation       : Array<string>                 ;
  // selLocID          : Array<string>                 ;
  // selShift          : Array<string>                 ;
  // selShiftLength    : Array<number>                 ;
  // selShiftStartTime : Array<number>                 ;
  // selShiftRotation  : Array<string>                 ;
  // selLoc2nd         : Array<string>                 ;

  // selClient         : string[  ] = CLIENT           ;
  // selLocation       : string[  ] = LOCATION         ;
  // selLocID          : string[  ] = LOCID            ;
  // selShift          : string[  ] = SHIFT            ;
  // selShiftLength    : number[  ] = SHIFTLENGTH      ;
  // selShiftStartTime : number[  ] = SHIFTSTARTTIME   ;
  // selShiftRotation  : string[  ] = SHIFTROTATION    ;
  // selLoc2nd         : string[  ] = LOC2ND           ;
  sesaConfig        : any        = {}               ;
  techSettings      : FormGroup                     ;
  firstName         : string                        ;
  lastName          : string                        ;
  technician        : string                        ;
  client            : string                        ;
  location          : string                        ;
  locID             : string                        ;
  loc2nd            : string                        ;
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
      'error_saving_tech_profile'
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
      this.initFormData();
      Log.l("User: initFormData() done, now initializeForm()...");
      this.initializeForm();
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

  initFormData() {
    let sesaConfig = this.ud.getSesaConfig();
    if (sizeOf(sesaConfig) > 0) {
      let keys  = ['client', 'location', 'locid', 'loc2nd', 'shift', 'shiftlength', 'shiftstarttime'];
      // let keys2 = ['selClient', 'selLocation', 'selLocID', 'selLoc2nd', 'selShift', 'selShiftLength', 'selShiftStartTime'];
      // let keys3 = ['client', 'location', 'locID', 'loc2nd', 'shift', 'shiftLength', 'shiftStartTime'];
      let keys2 = ['client', 'location', 'locID', 'loc2nd', 'shift', 'shiftLength', 'shiftStartTime'];
      let keys3 = ['clients', 'locations', 'locIDs', 'loc2nds', 'shiftTimes', 'shiftLengths', 'shiftStartTimes'];
      for (let i in keys) {
        let sesaVar   = keys[i];
        let techVar   = keys2[i];
        let selVar    = keys3[i];
        this[techVar] = this.selectMatch(this.techProfile[techVar], sesaConfig[sesaVar]);
        this[selVar]  = sesaConfig[sesaVar];
        // this[] = sesaConfig[keys[i]];
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

  public initializeSites() {
    let sites = this.ud.getData('sites');
    let js = new Map();
    let clients = new Map();
    for(let site of sites) {
      let client = site.client;
      let name = client.fullName;
      if(!clients.has(client)) {
        clients.set(client, new Map());
      }
      let locations = clients.get(client);
      let location  = site.location;
      name = location.fullName;
      if(!locations.has(location)) {
        locations.set(location, new Map());
      }
      let locIDs = locations.get(location);
      let locID  = site.locID;
      name = locID.fullName;
      if(!locIDs.has(locID)) {
        locIDs.set(locID, locID);
      }
    }
    Log.l("initializeSites(): New clients list is:\n", clients);
  }

  onSubmit() {
    let lang = this.lang;
    this.alert.showSpinner(lang['spinner_saving_tech_profile']);
    let form            = this.techSettings.value               ;
    let tech            = this.tech                             ;
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
    tech.lastName       = tech.lastName                         ;
    this.reportMeta     = tech;
    Log.l("onSubmit(): Now attempting to save tech profile:");
    this.db.saveTechProfile(this.reportMeta).then((res) => {
      Log.l("onSubmit(): Saved techProfile successfully.");
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
  }
}
