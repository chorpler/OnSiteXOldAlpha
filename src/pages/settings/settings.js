var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CLIENT, LOCATION, LOCID, SHIFTLENGTH } from '../../config/config.constants.settings';
import { SHIFT, SHIFTSTARTTIME, SHIFTROTATION, LOC2ND } from '../../config/config.constants.settings';
import { DBSrvcs } from '../../providers/db-srvcs';
import { ReportBuildSrvc } from '../../providers/report-build-srvc';
var Settings = (function () {
    function Settings(navCtrl, navParams, db, reportBuilder) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.db = db;
        this.reportBuilder = reportBuilder;
        this.techProfile = {};
        this.techProfileDB = {};
        this.selClient = CLIENT;
        this.selLocation = LOCATION;
        this.selLocID = LOCID;
        this.selShift = SHIFT;
        this.selShiftLength = SHIFTLENGTH;
        this.selShiftStartTime = SHIFTSTARTTIME;
        this.selShiftRotation = SHIFTROTATION;
        this.selLoc2nd = LOC2ND;
        this.technician = 'Doe, John';
        this.title = 'Report Settings';
        this.techProfileURL = "_local/techProfile";
        this.techSettingsReady = false;
        this.reportMeta = {};
        this.reportWaiting = false;
    }
    Settings.prototype.ngOnInit = function () {
        var _this = this;
        this.rprtDate = new Date;
        console.log("Settings: Now trying to get tech profile...");
        this.db.getTechProfile().then(function (res) {
            console.log("Settings: Got tech profile, now initFormData()...");
            _this.techProfile = res;
            return _this.initFormData();
        }).then(function (res2) {
            console.log("Settings: initFormData() done, now initializeForm()...");
            return _this.initializeForm();
        }).then(function (res3) {
            console.log("Settings screen initialized successfully.");
        }).catch(function (err) {
            console.log("Error while initializing Settings screen!");
            console.error(err);
        });
    };
    Settings.prototype.initializeForm = function () {
        this.techSettings = new FormGroup({
            'lastName': new FormControl(this.lastName, Validators.required),
            'firstName': new FormControl(this.firstName, Validators.required),
            'client': new FormControl(this.client, Validators.required),
            'location': new FormControl(this.location, Validators.required),
            'locID': new FormControl(this.locID, Validators.required),
            'loc2nd': new FormControl(this.loc2nd, Validators.required),
            'shift': new FormControl(this.shift, Validators.required),
            'shiftLength': new FormControl(this.shiftLength, Validators.required),
            'shiftStartTime': new FormControl(this.shiftStartTime, Validators.required)
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
    };
    Settings.prototype.initFormData = function () {
        this.lastName = this.techProfile.lastName;
        this.firstName = this.techProfile.firstName;
        this.client = this.techProfile.client;
        this.location = this.techProfile.location;
        this.locID = this.techProfile.locID;
        this.loc2nd = this.techProfile.loc2nd;
        this.shift = this.techProfile.shift;
        this.shiftLength = this.techProfile.shiftLength;
        this.shiftStartTime = this.techProfile.shiftStartTime;
    };
    Settings.prototype.ionViewDidLoad = function () {
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
    };
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
    Settings.prototype.onSubmit = function () {
        var _this = this;
        this.reportMeta = this.techSettings.value;
        this.reportMeta.technician = this.reportMeta.lastName + ', ' + this.reportMeta.firstName;
        this.reportMeta.updated = true;
        console.log("onSubmit(): Now attempting to save tech profile:");
        console.log(this.reportMeta);
        this.db.saveTechProfile(this.reportMeta).then(function (res) {
            console.log("onSubmit(): Saved techProfile successfully.");
            if (_this.reportWaiting) {
                _this.addReportMeta(_this.reportMeta);
                _this.reportWaiting = false;
                /* create and submit report here */
            }
            else {
                /* No report to submit. Just go back to home screen. */
                _this.navCtrl.push('OnSiteHome');
            }
        }).catch(function (err) {
            console.log("onSubmit(): Error saving techProfile!");
            console.error(err);
        });
    };
    Settings.prototype.addReportMeta = function (reportMeta) {
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
    };
    return Settings;
}());
Settings = __decorate([
    IonicPage({ name: 'Report Settings' }),
    Component({
        selector: 'page-settings',
        templateUrl: 'settings.html',
    }),
    __metadata("design:paramtypes", [NavController, NavParams, DBSrvcs, ReportBuildSrvc])
], Settings);
export { Settings };
//# sourceMappingURL=settings.js.map