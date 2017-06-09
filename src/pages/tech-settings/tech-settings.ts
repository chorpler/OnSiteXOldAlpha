import { Component, OnInit                            } from '@angular/core'                          ;
import { FormGroup, FormControl, Validators           } from "@angular/forms"                         ;
import { IonicPage, NavController, NavParams          } from 'ionic-angular'                          ;
import { CLIENT, LOCATION, LOCID, SHIFTLENGTH         } from '../../config/config.constants.settings' ;
import { SHIFT, SHIFTSTARTTIME, SHIFTROTATION, LOC2ND } from '../../config/config.constants.settings' ;
import { REPORTHEADER, REPORTMETA                     } from '../../config/report.object'             ;
import { DBSrvcs                                      } from '../../providers/db-srvcs'               ;
import { ReportBuildSrvc                              } from '../../providers/report-build-srvc'      ;
import { Login                                        } from '../login/login'                         ;


@IonicPage({ name: "Tech Settings"})
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
  techSettings      : FormGroup                     ;
  firstName         : string                        ;
  lastName          : string                        ;
  technician        : string    = 'Doe, John'       ;
  client            : string                        ;
  location          : string                        ;
  locID             : string                        ;
  loc2nd            : string                        ;
  shift             : string                        ;
  shiftLength       : string                        ;
  shiftStartTime    : string                        ;
  title             : string    = 'Report Settings' ;
  reportHeader      : REPORTHEADER                  ;
  rprtDate          : Date                          ;
  techProfileURL    : string = "_local/techProfile" ;
  techSettingsReady : boolean = false               ;
  reportMeta        : any = {}                      ;
  reportWaiting     : boolean = false               ;

  constructor(public navCtrl: NavController, public navParams: NavParams, public db: DBSrvcs, public reportBuilder: ReportBuildSrvc) {
    window["onsite"] = window["onsite"] || {};
    window["onsite"]["settings"] = this;
    window["onsite"]["settingsClass"] = TechSettingsPage;
  }

  ngOnInit() {
    this.rprtDate = new Date;
    console.log("Settings: Now trying to get tech profile...");
    this.db.getTechProfile().then((res) => {
      console.log("Settings: Got tech profile, now initFormData()...");
      this.techProfile = res;
      return this.initFormData();
    }).then((res2) => {
      console.log("Settings: initFormData() done, now initializeForm()...");
      return this.initializeForm();
    }).then((res3) => {
      console.log("Settings screen initialized successfully.");
    }).catch((err) => {
      console.log("Error while initializing Settings screen!");
      console.error(err);
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
    this.lastName       = this.techProfile.lastName       ;
    this.firstName      = this.techProfile.firstName      ;
    this.client         = this.techProfile.client         ;
    this.location       = this.techProfile.location       ;
    this.locID          = this.techProfile.locID          ;
    this.loc2nd         = this.techProfile.loc2nd         ;
    this.shift          = this.techProfile.shift          ;
    this.shiftLength    = this.techProfile.shiftLength    ;
    this.shiftStartTime = this.techProfile.shiftStartTime ;
  }

  onSubmit() {
    this.reportMeta = this.techSettings.value;
    this.reportMeta.technician = this.reportMeta.lastName + ', ' + this.reportMeta.firstName;
    this.reportMeta.updated = true;
    console.log("onSubmit(): Now attempting to save tech profile:");
    console.log(this.reportMeta);
    this.db.saveTechProfile(this.reportMeta).then((res) => {
      console.log("onSubmit(): Saved techProfile successfully.");
      if(this.reportWaiting) {
        this.reportWaiting = false;
        /* create and submit report here */
      } else {
        this.navCtrl.setRoot('OnSiteHome');
      }
    }).catch((err) => {
      console.log("onSubmit(): Error saving techProfile!");
      console.error(err);
    });
  }
}
