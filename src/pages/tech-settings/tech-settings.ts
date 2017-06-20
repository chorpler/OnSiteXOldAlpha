import { Component, OnInit                            } from '@angular/core'                          ;
import { FormGroup, FormControl, Validators           } from "@angular/forms"                         ;
import { IonicPage, NavController, NavParams          } from 'ionic-angular'                          ;
import { ViewController                               } from 'ionic-angular'                          ;
import { CLIENT, LOCATION, LOCID, SHIFTLENGTH         } from '../../config/config.constants.settings' ;
import { SHIFT, SHIFTSTARTTIME, SHIFTROTATION, LOC2ND } from '../../config/config.constants.settings' ;
import { REPORTHEADER, REPORTMETA                     } from '../../config/report.object'             ;
import { Log, sizeOf, isMoment                        } from '../../config/config.functions'          ;
import { DBSrvcs                                      } from '../../providers/db-srvcs'               ;
import { ReportBuildSrvc                              } from '../../providers/report-build-srvc'      ;
import { Login                                        } from '../login/login'                         ;
import { UserData                                     } from '../../providers/user-data'              ;
import { TabsComponent                                } from '../../components/tabs/tabs'             ;


@IonicPage({ name: 'User'})
@Component({
  selector: 'page-tech-settings',
  templateUrl: 'tech-settings.html',
})

export class TechSettingsPage implements OnInit {
  techProfile       : any        = {}               ;
  techProfileDB     : any        = {}               ;
  selClient         : string[  ] = CLIENT           ;
  selLocation       : string[  ] = LOCATION         ;
  selLocID          : string[  ] = LOCID            ;
  selShift          : string[  ] = SHIFT            ;
  selShiftLength    : number[  ] = SHIFTLENGTH      ;
  selShiftStartTime : number[  ] = SHIFTSTARTTIME   ;
  selShiftRotation  : string[  ] = SHIFTROTATION    ;
  selLoc2nd         : string[  ] = LOC2ND           ;
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
  reportHeader      : REPORTHEADER                  ;
  rprtDate          : Date                          ;
  techProfileURL    : string = "_local/techProfile" ;
  techSettingsReady : boolean = false               ;
  reportMeta        : any = {}                      ;
  reportWaiting     : boolean = false               ;
  navParamModal     : boolean                       ;
  mode              : string                        ;

  constructor( public navCtrl: NavController, public navParams    : NavParams,
               public db     : DBSrvcs,       public reportBuilder: ReportBuildSrvc,
               public tabs   : TabsComponent, public viewCtrl     : ViewController,
               public ud     : UserData ) {

    window["onsite"] = window["onsite"] || {};
    window["onsite"]["settings"] = this;
    window["onsite"]["settingsClass"] = TechSettingsPage;
    window["techsettings"] = this;
  }

  ngOnInit() {
    if ( this.navParams.get('mode') !== undefined ) {
     this.mode = this.navParams.get('mode');
    } else {
      this.mode = 'page';
    }
    this.rprtDate = new Date;
    Log.l("Settings: Now trying to get tech profile...");
    this.db.getTechProfile().then((res) => {
      Log.l("Settings: Got tech profile, now initFormData()...");
      this.techProfile = res;
      this.ud.setTechProfile(res);
      return this.initFormData();
    }).then((res2) => {
      Log.l("Settings: initFormData() done, now initializeForm()...");
      return this.initializeForm();
    }).then((res3) => {
      Log.l("Settings screen initialized successfully.");
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
    this.techSettingsReady = true;
  }

  initFormData() {
    let sesaConfig = this.ud.getSesaConfig();
    if (sizeOf(sesaConfig) > 0) {
      let keys = ['client', 'location', 'locid', 'loc2nd', 'shift', 'shiftlength', 'shiftstarttime'];
      let keys2 = ['selClient', 'selLocation', 'selLocID', 'selLoc2nd', 'selShift', 'selShiftLength', 'selShiftStartTime'];
      let keys3 = ['client', 'location', 'locID', 'loc2nd', 'shift', 'shiftLength', 'shiftStartTime'];
      for (let i in keys) {
        let sesaVar = keys[i];
        let selVar = keys2[i];
        let techVar = keys3[i];
        this[techVar] = this.selectMatch(this.techProfile[techVar], sesaConfig[sesaVar]);
        this[selVar] = sesaConfig[sesaVar];
        // this[] = sesaConfig[keys[i]];
      }
    }
    this.lastName       = this.techProfile.lastName       ;
    this.firstName      = this.techProfile.firstName      ;
    // let keys = ['client' ,'location' ,'locID' ,'loc2nd' ,'shift' ,'shiftLength' ,'shiftStartTime'];
    // for(let i in keys) {
    //   let sesaVar = keys [i];
    //   let selVar  = keys2[i];
    //   let techVar = keys3[i];
    //   this[techVar] = this.selectMatch(this.techProfile[techVar], sesaConfig[sesaVar]);
    //   this[selVar]  = sesaConfig[sesaVar];
    // }
    // this.client         = this.techProfile.client         ;
    // this.location       = this.techProfile.location       ;
    // this.locID          = this.techProfile.locID          ;
    // this.loc2nd         = this.techProfile.loc2nd         ;
    // this.shift          = this.techProfile.shift          ;
    // this.shiftLength    = this.techProfile.shiftLength    ;
    // this.shiftStartTime = this.techProfile.shiftStartTime ;
  }

  selectMatch(key:string, values:Array<any>) {
    // Log.l("selectMatch(): Finding matchinb object for '%s' in array...", key);
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

  onSubmit() {
    // let prof = this.techSettings.value;
    let rprt = this.techSettings.value;
    rprt.updated        = true;
    rprt.technician     = rprt.lastName + ', ' + rprt.firstName;
    rprt.client         = rprt.client.fullName.toUpperCase();
    rprt.location       = rprt.location.fullName.toUpperCase();
    rprt.locID          = rprt.locID.name.toUpperCase();
    rprt.loc2nd         = rprt.loc2nd.name.toUpperCase();
    rprt.shift          = rprt.shift.name;
    rprt.shiftLength    = Number(rprt.shiftLength.name);
    rprt.shiftStartTime = Number(rprt.shiftStartTime.name);
    this.reportMeta = rprt;
    Log.l("onSubmit(): Now attempting to save tech profile:");
    this.db.saveTechProfile(this.reportMeta).then((res) => {
      Log.l("onSubmit(): Saved techProfile successfully.");
      if ( this.mode === 'modal' ) {
        Log.l('Mode = ' + this.mode );
        this.viewCtrl.dismiss();
      }
      else {
        Log.l('Mode = ' + this.mode );
        this.tabs.goToPage('OnSiteHome');
      }
    }).catch((err) => {
      Log.l("onSubmit(): Error saving techProfile!");
      Log.e(err);
    });
  }
}
