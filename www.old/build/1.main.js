webpackJsonp([1],{

/***/ 342:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(114);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__settings__ = __webpack_require__(463);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SettingsModule", function() { return SettingsModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var SettingsModule = (function () {
    function SettingsModule() {
    }
    return SettingsModule;
}());
SettingsModule = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["a" /* NgModule */])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_2__settings__["a" /* Settings */],
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2__settings__["a" /* Settings */]),
        ],
        exports: [
            __WEBPACK_IMPORTED_MODULE_2__settings__["a" /* Settings */]
        ]
    })
], SettingsModule);

//# sourceMappingURL=settings.module.js.map

/***/ }),

/***/ 345:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CLIENT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return LOCATION; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return LOCID; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return SHIFT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return SHIFTLENGTH; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return SHIFTSTARTTIME; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return SHIFTROTATION; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return LOC2ND; });
var CLIENT = [
    "HALLIBURTON",
    "KEANE",
    "SESA"
];
var LOCATION = [
    "SAN ANTONIO",
    "ODESSA",
    "BROWNFIELD",
    "DUNCAN",
    "SHAWNEE",
    "SPRINGTOWN",
    "WESLACO",
    "ARTESIA",
    "MATHIS",
    "LAS CUATAS"
];
var LOCID = [
    "E-TECH",
    "MNSHOP",
    "PMPSHP",
    "TOPPER"
];
// export const SHIFT          = [
//                                 "☽ PM"        ,
//                                 "☼ AM"
//                                                 ];
var SHIFT = [
    "PM",
    "AM"
];
var SHIFTLENGTH = [
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18
];
var SHIFTSTARTTIME = [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12
];
var SHIFTROTATION = [
    "FIRST WEEK",
    "CONTN WEEK",
    "FINAL WEEK"
];
var LOC2ND = [
    "North",
    "South",
    "NA"
];
//# sourceMappingURL=config.constants.settings.js.map

/***/ }),

/***/ 463:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_forms__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(114);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__config_config_constants_settings__ = __webpack_require__(345);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_db_srvcs__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_report_build_srvc__ = __webpack_require__(259);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Settings; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var Settings = Settings_1 = (function () {
    function Settings(navCtrl, navParams, db, reportBuilder) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.db = db;
        this.reportBuilder = reportBuilder;
        this.techProfile = {};
        this.techProfileDB = {};
        this.selClient = __WEBPACK_IMPORTED_MODULE_3__config_config_constants_settings__["a" /* CLIENT */];
        this.selLocation = __WEBPACK_IMPORTED_MODULE_3__config_config_constants_settings__["b" /* LOCATION */];
        this.selLocID = __WEBPACK_IMPORTED_MODULE_3__config_config_constants_settings__["c" /* LOCID */];
        this.selShift = __WEBPACK_IMPORTED_MODULE_3__config_config_constants_settings__["d" /* SHIFT */];
        this.selShiftLength = __WEBPACK_IMPORTED_MODULE_3__config_config_constants_settings__["e" /* SHIFTLENGTH */];
        this.selShiftStartTime = __WEBPACK_IMPORTED_MODULE_3__config_config_constants_settings__["f" /* SHIFTSTARTTIME */];
        this.selShiftRotation = __WEBPACK_IMPORTED_MODULE_3__config_config_constants_settings__["g" /* SHIFTROTATION */];
        this.selLoc2nd = __WEBPACK_IMPORTED_MODULE_3__config_config_constants_settings__["h" /* LOC2ND */];
        this.technician = 'Doe, John';
        this.title = 'Report Settings';
        this.techProfileURL = "_local/techProfile";
        this.techSettingsReady = false;
        this.reportMeta = {};
        this.reportWaiting = false;
        window["onsite"] = window["onsite"] || {};
        window["onsite"]["settings"] = this;
        window["onsite"]["settingsClass"] = Settings_1;
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
        this.techSettings = new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["e" /* FormGroup */]({
            'lastName': new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["f" /* FormControl */](this.lastName, __WEBPACK_IMPORTED_MODULE_1__angular_forms__["g" /* Validators */].required),
            'firstName': new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["f" /* FormControl */](this.firstName, __WEBPACK_IMPORTED_MODULE_1__angular_forms__["g" /* Validators */].required),
            'client': new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["f" /* FormControl */](this.client, __WEBPACK_IMPORTED_MODULE_1__angular_forms__["g" /* Validators */].required),
            'location': new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["f" /* FormControl */](this.location, __WEBPACK_IMPORTED_MODULE_1__angular_forms__["g" /* Validators */].required),
            'locID': new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["f" /* FormControl */](this.locID, __WEBPACK_IMPORTED_MODULE_1__angular_forms__["g" /* Validators */].required),
            'loc2nd': new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["f" /* FormControl */](this.loc2nd, __WEBPACK_IMPORTED_MODULE_1__angular_forms__["g" /* Validators */].required),
            'shift': new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["f" /* FormControl */](this.shift, __WEBPACK_IMPORTED_MODULE_1__angular_forms__["g" /* Validators */].required),
            'shiftLength': new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["f" /* FormControl */](this.shiftLength, __WEBPACK_IMPORTED_MODULE_1__angular_forms__["g" /* Validators */].required),
            'shiftStartTime': new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["f" /* FormControl */](this.shiftStartTime, __WEBPACK_IMPORTED_MODULE_1__angular_forms__["g" /* Validators */].required)
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
Settings = Settings_1 = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["f" /* IonicPage */])({ name: 'Report Settings' }),
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_2" /* Component */])({
        selector: 'page-settings',template:/*ion-inline-start:"C:\code\OnSiteX\src\pages\settings\settings.html"*/'<!--\n\n  Generated template for the Settings page.\n\n\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n\n  Ionic pages and navigation.\n\n-->\n\n<ion-header>\n\n\n\n  <ion-navbar>\n\n    <ion-title> {{title}} </ion-title>\n\n  </ion-navbar>\n\n\n\n</ion-header>\n\n\n\n\n\n<ion-content padding *ngIf="techSettingsReady">\n\n  <form [formGroup]="techSettings" (ngSubmit)="onSubmit()">\n\n    <ion-list>\n\n      <ion-item>\n\n        <ion-label floating>FIRST NAME:</ion-label>\n\n        <ion-input type=\'text\' formControlName=\'firstName\'>{{firstName}} </ion-input>\n\n      </ion-item>\n\n      <ion-item>\n\n        <ion-label floating>LAST NAME:</ion-label>\n\n        <ion-input type=\'text\' formControlName=\'lastName\'>{{lastName}} </ion-input>\n\n      </ion-item>\n\n      <ion-item>\n\n        <ion-label floating>CLIENT:</ion-label>\n\n        <ion-select formControlName=\'client\'>\n\n          <ion-option *ngFor=\'let client of selClient\' [value]=\'client\'> {{client}} </ion-option>\n\n        </ion-select>\n\n      </ion-item>\n\n      <ion-item>\n\n        <ion-label floating>LOCATION:</ion-label>\n\n        <ion-select formControlName=\'location\'>\n\n          <ion-option *ngFor=\'let location of selLocation\' [value]=\'location\'> {{location}} </ion-option>\n\n        </ion-select>\n\n      </ion-item>\n\n      <ion-item>\n\n        <ion-label floating>LOCID:</ion-label>\n\n        <ion-select formControlName=\'locID\'>\n\n          <ion-option *ngFor=\'let locID of selLocID\' [value]=\'locID\'> {{locID}} </ion-option>\n\n        </ion-select>\n\n      </ion-item>\n\n      <ion-item>\n\n        <ion-label floating>LOC2ND:</ion-label>\n\n        <ion-select formControlName=\'loc2nd\'>\n\n          <ion-option *ngFor=\'let loc2nd of selLoc2nd\' [value]=\'loc2nd\'> {{loc2nd}} </ion-option>\n\n        </ion-select>\n\n      </ion-item>\n\n      <ion-item>\n\n        <ion-label floating>SHIFT:</ion-label>\n\n        <ion-select formControlName=\'shift\'>\n\n          <ion-option *ngFor=\'let shift of selShift\' [value]=\'shift\'> {{shift}} </ion-option>\n\n        </ion-select>\n\n      </ion-item>\n\n      <ion-item>\n\n        <ion-label floating>SHIFT LENGTH:</ion-label>\n\n        <ion-select formControlName=\'shiftLength\'>\n\n          <ion-option *ngFor=\'let shiftLength of selShiftLength\' [value]=\'shiftLength\'> {{shiftLength}} </ion-option>\n\n        </ion-select>\n\n      </ion-item>\n\n      <ion-item>\n\n        <ion-label floating>SHIFT START TIME:</ion-label>\n\n        <ion-select formControlName=\'shiftStartTime\'>\n\n          <ion-option *ngFor=\'let shiftStartTime of selShiftStartTime\' [value]=\'shiftStartTime\'> {{shiftStartTime}} </ion-option>\n\n        </ion-select>\n\n      </ion-item>\n\n    </ion-list>\n\n    <button type="submit" ion-button block>Update {{title}} </button>\n\n  </form>\n\n</ion-content>\n\n'/*ion-inline-end:"C:\code\OnSiteX\src\pages\settings\settings.html"*/,
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["c" /* NavController */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["c" /* NavController */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["g" /* NavParams */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["g" /* NavParams */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_4__providers_db_srvcs__["a" /* DBSrvcs */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__providers_db_srvcs__["a" /* DBSrvcs */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_5__providers_report_build_srvc__["a" /* ReportBuildSrvc */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_5__providers_report_build_srvc__["a" /* ReportBuildSrvc */]) === "function" && _d || Object])
], Settings);

var Settings_1, _a, _b, _c, _d;
//# sourceMappingURL=settings.js.map

/***/ })

});
//# sourceMappingURL=1.main.js.map