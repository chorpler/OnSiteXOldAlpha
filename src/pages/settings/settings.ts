import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CLIENT, LOCATION, LOCID, SHIFTLENGTH         } from '../../config/config.constants.settings';
import { SHIFT, SHIFTSTARTTIME, SHIFTROTATION, LOC2ND } from '../../config/config.constants.settings';
import { REPORTHEADER, REPORTMETA } from '../../config/report.object';

@IonicPage({ name: 'Report Settings' })

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})

export class Settings implements OnInit {
  selClient         : string[  ] = CLIENT         ;
  selLocation       : string[  ] = LOCATION       ;
  selLocID          : string[  ] = LOCID          ;
  selShift          : string[  ] = SHIFT          ;
  selShiftLength    : number[  ] = SHIFTLENGTH    ;
  selShiftStartTime : number[  ] = SHIFTSTARTTIME ;
  selShiftRotation  : string[  ] = SHIFTROTATION  ;
  selLoc2nd         : string[  ] = LOC2ND         ;
  techSettings      : FormGroup                   ;
  firstName         : string                      ;
  lastName          : string                      ;
  technician        : string    = 'Doe, John'     ;
  title             : string    = 'Report Settings';
  reportHeader      : REPORTHEADER;
  rprtDate          : Date;
  
  constructor(public navCtrl: NavController, public navParams: NavParams) { }

  ngOnInit() {
    this.rprtDate = new Date
    this.initializeForm();
  }

  private initializeForm() {
    this.techSettings = new FormGroup({
      'lastName'      : new FormControl(this.lastName             , Validators.required) ,
      'firstName'     : new FormControl(this.firstName            , Validators.required) ,
      'client'        : new FormControl(this.selClient[1]         , Validators.required) ,
      'location'      : new FormControl(this.selLocation[1]       , Validators.required) ,
      'locID'         : new FormControl(this.selLocID[1]          , Validators.required) ,
      'loc2nd'        : new FormControl(this.selLoc2nd[2]         , Validators.required) ,
      'shift'         : new FormControl(this.selShift[1]          , Validators.required) ,
      'shiftLength'   : new FormControl(this.selShiftLength[4]    , Validators.required) ,
      'shiftStartTime': new FormControl(this.selShiftStartTime[7] , Validators.required)
    })
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

  onSubmit() { 
    const reportMeta = this.techSettings.value;
    reportMeta.technician = reportMeta.lastName + ', ' + reportMeta.firstName;
    console.log(reportMeta);
    this.addReportMeta(reportMeta);
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
