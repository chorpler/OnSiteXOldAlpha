import { Component, OnInit                            } from '@angular/core'                          ;
import { FormGroup, FormControl, Validators           } from "@angular/forms"                         ;
import { IonicPage, NavController, NavParams          } from 'ionic-angular'                          ;
import { CLIENT, LOCATION, LOCID, SHIFTLENGTH         } from '../../config/config.constants.settings' ;
import { SHIFT, SHIFTSTARTTIME, SHIFTROTATION, LOC2ND } from '../../config/config.constants.settings' ;
import { REPORTHEADER, REPORTMETA                     } from '../../config/report.object'             ;
import { DBSrvcs                                      } from '../../providers/db-srvcs'               ;
import { ReportBuildSrvc                              } from '../../providers/report-build-srvc'      ;

@IonicPage({ name: 'Report Settings' })

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})

export class Settings implements OnInit {
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
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public db: DBSrvcs, public reportBuilder: ReportBuildSrvc) { }

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
    })
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
      // 'lastName'      : new FormControl(this.lastName             , Validators.required) ,
      // 'firstName'     : new FormControl(this.firstName            , Validators.required) ,
      // 'client'        : new FormControl(this.selClient[1]         , Validators.required) ,
      // 'location'      : new FormControl(this.selLocation[1]       , Validators.required) ,
      // 'locID'         : new FormControl(this.selLocID[1]          , Validators.required) ,
      // 'loc2nd'        : new FormControl(this.selLoc2nd[2]         , Validators.required) ,
      // 'shift'         : new FormControl(this.selShift[1]          , Validators.required) ,
      // 'shiftLength'   : new FormControl(this.selShiftLength[4]    , Validators.required) ,
      // 'shiftStartTime': new FormControl(this.selShiftStartTime[7] , Validators.required)
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad Settings'); 
    // console.log( this.selClient )         ; 
    // console.log( this.selLocation )       ; 
    // console.log( this.selLocID )          ; 
    // console.log( this.selShift )          ; 
    // console.log( this.selShiftLength )    ; 
    // console.log( this.selShiftStartTime ) ; 
    // console.log( this.selShiftRotation )  ; 
    // console.log( this.selLoc2nd )         ; 
    // console.log( this.techSettings )      ; 
  }

  // getTechProfile() {
  //   return this.db.checkLocalDoc(this.userProfileURL).then((res) => {
  //     console.log("techProfile exists, reading it in...");
  //     return this.db.getDoc(this.userProfileURL);
  //   }).then((res) => {
  //     console.log("techProfile read successfully:");
  //     console.log(res);
  //     this.techProfile = res;
  //   }).catch((err) => {
  //     console.log("techProfile not found, user not logged in.");
  //     console.error(err);
  //   });
  // }

  onSubmit() {
    this.reportMeta = this.techSettings.value;
    this.reportMeta.technician = this.reportMeta.lastName + ', ' + this.reportMeta.firstName;
    this.reportMeta.updated = true;
    console.log("onSubmit(): Now attempting to save tech profile:");
    console.log(this.reportMeta);
    this.db.saveTechProfile(this.reportMeta).then((res) => {
      console.log("onSubmit(): Saved techProfile successfully.");
      if(this.reportWaiting) {
        this.addReportMeta(this.reportMeta);
        this.reportWaiting = false;
        /* create and submit report here */
      } else {
        /* No report to submit. Just go back to home screen. */
        this.navCtrl.push('OnSiteHome');
      }
    }).catch((err) => {
      console.log("onSubmit(): Error saving techProfile!");
      console.error(err);
    });
  }

  addReportMeta(reportMeta) {

  //   this.reportHeader.firstName = reportMeta.firstName;
  //   this.reportHeader.lastName = reportMeta.lastName;
  //   this.reportHeader.client = reportMeta.client;
  //   this.reportHeader.location = reportMeta.location;
  //   this.reportHeader.locID = reportMeta.locID;
  //   this.reportHeader.loc2nd = reportMeta.loc2nd;
  //   this.reportHeader.shift= reportMeta.shift;
  //   this.reportHeader.shiftLength = reportMeta.shiftLength;
  //   this.reportHeader.shiftStartTime = reportMeta.shiftStartTime;
  //   this.reportHeader.shiftRotation = reportMeta.shiftRotation;
  //   console.log(this.reportHeader);
  }
}
