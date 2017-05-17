webpackJsonp([0],{

/***/ 343:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(114);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__work_order__ = __webpack_require__(464);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WorkOrderModule", function() { return WorkOrderModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var WorkOrderModule = (function () {
    function WorkOrderModule() {
    }
    return WorkOrderModule;
}());
WorkOrderModule = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["a" /* NgModule */])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_2__work_order__["a" /* WorkOrder */],
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2__work_order__["a" /* WorkOrder */]),
        ],
        exports: [
            __WEBPACK_IMPORTED_MODULE_2__work_order__["a" /* WorkOrder */]
        ]
    })
], WorkOrderModule);

//# sourceMappingURL=work-order.module.js.map

/***/ }),

/***/ 464:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_forms__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(114);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_db_srvcs__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_time_parse_srvc__ = __webpack_require__(260);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_report_build_srvc__ = __webpack_require__(259);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_moment__ = __webpack_require__(344);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_moment__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__config_config_functions__ = __webpack_require__(467);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return WorkOrder; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var WorkOrder = (function () {
    // , private dbSrvcs: DBSrvcs
    function WorkOrder(navCtrl, navParams, dbSrvcs, timeSrvc, reportBuilder, loadingCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.dbSrvcs = dbSrvcs;
        this.timeSrvc = timeSrvc;
        this.reportBuilder = reportBuilder;
        this.loadingCtrl = loadingCtrl;
        this.title = 'Work Report';
        this.setDate = new Date();
        this.year = this.setDate.getFullYear();
        this.mode = 'New';
        this.profile = {};
        this.rprtDate = new Date();
        this.timeStarts = new Date();
        this.reportDate = __WEBPACK_IMPORTED_MODULE_6_moment__();
        this.startTime = __WEBPACK_IMPORTED_MODULE_6_moment__();
        this.syncError = false;
    }
    WorkOrder.prototype.ionViewDidLoad = function () { console.log('ionViewDidLoad WorkOrder'); };
    WorkOrder.prototype.ngOnInit = function () {
        if (this.navParams.get('mode') !== undefined) {
            this.mode = this.navParams.get('mode');
        }
        console.log(this.mode);
        console.log(this.setDate);
        console.log(this.year);
        console.log(this.rprtDate);
        this.initializeForm();
    };
    WorkOrder.prototype.initializeForm = function () {
        this.workOrder = new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["e" /* FormGroup */]({
            'timeStarts': new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["f" /* FormControl */](this.startTime.format(), __WEBPACK_IMPORTED_MODULE_1__angular_forms__["g" /* Validators */].required),
            'timeEnds': new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["f" /* FormControl */](null, __WEBPACK_IMPORTED_MODULE_1__angular_forms__["g" /* Validators */].required),
            'repairHrs': new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["f" /* FormControl */](null, __WEBPACK_IMPORTED_MODULE_1__angular_forms__["g" /* Validators */].required),
            'uNum': new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["f" /* FormControl */](null, __WEBPACK_IMPORTED_MODULE_1__angular_forms__["g" /* Validators */].required),
            'wONum': new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["f" /* FormControl */](null, __WEBPACK_IMPORTED_MODULE_1__angular_forms__["g" /* Validators */].required),
            'notes': new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["f" /* FormControl */](null, __WEBPACK_IMPORTED_MODULE_1__angular_forms__["g" /* Validators */].required),
            'rprtDate': new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["f" /* FormControl */](this.reportDate.format(), __WEBPACK_IMPORTED_MODULE_1__angular_forms__["g" /* Validators */].required),
            'timeStamp': new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["f" /* FormControl */]({ value: this.reportDate, disabled: true }, __WEBPACK_IMPORTED_MODULE_1__angular_forms__["g" /* Validators */].required)
        });
        // setTimeout(_ => {
        //   this.reportDateField.setValue(this.reportDate.format());
        //   this.startTimeField.setValue(this.startTime.format());
        // });
    };
    WorkOrder.prototype.onSubmit = function () {
        this.processWO();
    };
    /**
     * Calcualtes workOrderData.timeEnds given workOrderData.timeStarts
     * and workOrderData.repairHrs
     *
     * @private
     * @param {any} workOrderData
     *
     * @memberOf WorkOrder
     */
    WorkOrder.prototype.calcEndTime = function (workOrderData) {
        var _Xdec = /(00|15|30|45)(?!\:\d{2})/;
        var _Xhrs = /([0-9]{2})(?=:\d{2})/;
        this.prsHrs = _Xhrs.exec(workOrderData.timeStarts);
        this.strtHrs = parseInt(this.prsHrs[0]).toString();
        this.prsMin = _Xdec.exec(workOrderData.timeStarts);
        if (parseInt(this.prsMin[0]) === 0) {
            this.strtMin = '00';
        }
        else if (parseInt(this.prsMin[0]) === 15) {
            this.strtMin = '15';
        }
        else if (parseInt(this.prsMin[0]) === 30) {
            this.strtMin = '30';
        }
        else {
            this.strtMin = '45';
        }
        workOrderData.timeStarts = this.strtHrs + ':' + this.strtMin;
        this.hrsHrs = Math.floor(workOrderData.repairHrs);
        this.hrsMin = (workOrderData.repairHrs % 1) * 60;
        if (parseInt(this.strtMin) + this.hrsMin > 60) {
            if (parseInt(this.strtHrs) + this.hrsHrs + 1 > 24) {
                this.endHrs = parseInt(this.strtHrs) + this.hrsHrs - 23;
                this.endMin = parseInt(this.strtMin) + this.hrsMin - 60;
            }
            else {
                this.endHrs = parseInt(this.strtHrs) + this.hrsHrs + 1;
                this.endMin = parseInt(this.strtMin) + this.hrsMin - 60;
            }
        }
        else {
            if (parseInt(this.strtHrs) + this.hrsHrs > 24) {
                this.endHrs = parseInt(this.strtHrs) + this.hrsHrs - 24;
                this.endMin = parseInt(this.strtMin) + this.hrsMin;
            }
            else {
                this.endHrs = parseInt(this.strtHrs) + this.hrsHrs;
                this.endMin = parseInt(this.strtMin) + this.hrsMin;
            }
        }
        if (this.endHrs < 10) {
            if (this.endHrs === 0) {
                this.endHrs = '00';
            }
            else {
                this.endHrs = '0' + this.endHrs.toString();
            }
        }
        else {
            this.endHrs = this.endHrs.toString();
        }
        if (this.endMin === 0) {
            this.endMin = '00';
        }
        if (this.hrsMin === 0) {
            this.hrsMin = '00';
        }
        this.timeEnds = this.endHrs + ':' + this.endMin;
        workOrderData.timeEnds = this.endHrs + ':' + this.endMin;
        workOrderData.repairHrs = this.hrsHrs + ':' + this.hrsMin;
        console.log(this.strtHrs);
        console.log(this.endHrs);
        workOrderData.repairHrs = this.hrsHrs + ':' + this.hrsMin;
    };
    WorkOrder.prototype.genReportID = function () {
        this.timeSrvc.getParsedDate();
        this.idDate = this.timeSrvc._arrD[1].toString() +
            this.timeSrvc._arrD[2].toString() +
            this.timeSrvc._arrD[0].toString() +
            this.timeSrvc._arrD[3].toString();
        this.idTime = this.timeSrvc._arrD[4].toString() +
            this.timeSrvc._arrD[5].toString() +
            this.timeSrvc._arrD[6].toString();
        console.log(this.idDate);
        // let firstInitial = this.profile.firstName.slice(0,1);
        // let lastInitial = this.profile.lastName.slice(0,1);
        this.docID = this.profile.avatarName + '_' + this.idDate + this.idTime;
        console.log(this.docID);
    };
    WorkOrder.prototype.processWO = function () {
        var _this = this;
        var workOrderData = this.workOrder.value;
        this.calcEndTime(workOrderData);
        console.log("processWO() has initial workOrderData:");
        console.log(workOrderData);
        this.dbSrvcs.checkLocalDoc('_local/techProfile')
            .then(function (docExists) {
            if (docExists) {
                console.log("docExists is true");
                _this.dbSrvcs.getDoc('_local/techProfile').then(function (res) {
                    _this.profile = res;
                    if (typeof _this.profile.avatarName == 'undefined') {
                        _this.profile.avatarName = 'PaleRider';
                    }
                    delete _this.profile._id;
                    delete _this.profile._rev;
                    _this.genReportID();
                    if (typeof _this.profile.updated == 'undefined' || _this.profile.updated === false) {
                        /* Update flag not set, force user to visit Settings page at gunpoint */
                        _this.tmpReportData = workOrderData;
                        _this.tmpReportData._id = '_local/tmpReport';
                        _this.tmpReportData.docID = _this.docID;
                        // this.tmpReportData._rev = ;
                        console.log("Update flag not set, tmpReportData is:");
                        console.log(_this.tmpReportData);
                        _this.dbSrvcs.addLocalDoc(_this.tmpReportData);
                        /* Notify user and go to Settings page */
                        // this.navCtrl.push('Report Settings');
                    }
                    else {
                        /* Update flag is true, good to submit work order */
                        console.log("docExists is false");
                        _this.tmpReportData = workOrderData;
                        _this.tmpReportData.profile = _this.profile;
                        _this.tmpReportData._id = '_local/tmpReport';
                        _this.tmpReportData.docID = _this.docID;
                        // this.tmpReportData._rev = '0-1';
                        console.log("Update flag set, tmpReportData is:");
                        console.log(_this.tmpReportData);
                        _this.dbSrvcs.addLocalDoc(_this.tmpReportData).then(function (res) {
                            console.log("About to generate work order");
                            return _this.reportBuilder.getLocalDocs();
                        }).then(function (final) {
                            console.log("Done generating work order.");
                            return __WEBPACK_IMPORTED_MODULE_3__providers_db_srvcs__["a" /* DBSrvcs */].syncSquaredToServer('reports');
                        }).then(function (final2) {
                            __WEBPACK_IMPORTED_MODULE_7__config_config_functions__["a" /* Log */].l("Successfully synchronized work order to CouchDB server!");
                            __WEBPACK_IMPORTED_MODULE_7__config_config_functions__["a" /* Log */].l(final2);
                            // this.navCtrl.push('Report Settings');
                            // this.navCtrl.push("OnSiteHome");
                        }).catch(function (err) {
                            __WEBPACK_IMPORTED_MODULE_7__config_config_functions__["a" /* Log */].l("Error while trying to sync work order to CouchDB server!");
                            __WEBPACK_IMPORTED_MODULE_7__config_config_functions__["a" /* Log */].w(err);
                            _this.syncError = true;
                        });
                    }
                });
            }
            else {
                console.error("Tech profile does not exist. Contact developers.");
            }
        }).catch(function (outerError) {
            __WEBPACK_IMPORTED_MODULE_7__config_config_functions__["a" /* Log */].l("Error checking existence of local document store.");
            __WEBPACK_IMPORTED_MODULE_7__config_config_functions__["a" /* Log */].w(outerError);
        });
    };
    return WorkOrder;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_4" /* ViewChild */])('reportDate'),
    __metadata("design:type", Object)
], WorkOrder.prototype, "reportDateField", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_4" /* ViewChild */])('startTime'),
    __metadata("design:type", Object)
], WorkOrder.prototype, "startTimeField", void 0);
WorkOrder = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["f" /* IonicPage */])({ name: 'Work Order Form' }),
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_2" /* Component */])({
        selector: 'page-work-order',template:/*ion-inline-start:"C:\code\OnSiteX\src\pages\work-order\work-order.html"*/'<!--\n\n  Generated template for the WorkOrder page.\n\n\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n\n  Ionic pages and navigation.\n\n-->\n\n<ion-header>\n\n\n\n  <ion-navbar>\n\n    <ion-title>WorkOrder</ion-title>\n\n  </ion-navbar>\n\n\n\n</ion-header>\n\n\n\n\n\n<ion-content padding>\n\n  <p class="hdrDate"> Today: <span class="date">{{ setDate | date:\'EEE, MMM dd yyyy\'}}</span>, Time: <span class="time"> {{setDate| date:\'HH:mm\'}} </span>    </p>\n\n\n\n  <form [formGroup]="workOrder" (ngSubmit)="onSubmit()">\n\n    <ion-list>\n\n      <ion-item>\n\n        <ion-input type=\'text\' formControlName="timeStamp"></ion-input>\n\n      </ion-item>\n\n      <ion-item>\n\n        <ion-label>Start Date</ion-label>\n\n        <ion-datetime #reportDate displayFormat="DDD, MMM DD YYYY" yearValues="2017" formControlName="rprtDate"></ion-datetime>\n\n      </ion-item>\n\n      <ion-item>\n\n        <ion-label>Start Time</ion-label>\n\n        <ion-datetime #startTime displayFormat="HH:mm" pickerFormat="HH:mm" minuteValues="00,15,30,45" formControlName="timeStarts"></ion-datetime>\n\n      </ion-item>\n\n      <ion-item>\n\n        <ion-label floating>JOB HRS: (Decimal Hours) </ion-label>\n\n        <ion-input type=\'number\' formControlName=\'repairHrs\'></ion-input>\n\n      </ion-item>\n\n\n\n      <ion-item>\n\n        <ion-label floating>UNIT No.</ion-label>\n\n        <ion-input type=\'text\' formControlName=\'uNum\'></ion-input>\n\n      </ion-item>\n\n      <ion-item>\n\n        <ion-label floating>WORK ORDER No.</ion-label>\n\n        <ion-input type=\'text\' formControlName=\'wONum\'></ion-input>\n\n      </ion-item>\n\n      <ion-item>\n\n        <ion-label floating>JOB NOTES:</ion-label>\n\n        <ion-textarea formControlName=\'notes\'></ion-textarea>\n\n      </ion-item>\n\n      <ion-item *ngIf="syncError" class="alert danger">\n\n        <div>Error submitting work order. Please try again.</div>\n\n      </ion-item>\n\n    </ion-list>\n\n    <button type="submit" ion-button block>Submit {{title}} </button>\n\n  </form>\n\n</ion-content>\n\n\n\n\n\n<!--\n\n   placeholder="{{ setDate | date:\'EEE, MMM dd yyyy\'}}"\n\n   placeholder="{{setDate| date:\'HH:mm\'}}" \n\n-->\n\n'/*ion-inline-end:"C:\code\OnSiteX\src\pages\work-order\work-order.html"*/,
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["c" /* NavController */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["c" /* NavController */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["g" /* NavParams */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["g" /* NavParams */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_3__providers_db_srvcs__["a" /* DBSrvcs */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__providers_db_srvcs__["a" /* DBSrvcs */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_4__providers_time_parse_srvc__["a" /* TimeSrvc */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__providers_time_parse_srvc__["a" /* TimeSrvc */]) === "function" && _d || Object, typeof (_e = typeof __WEBPACK_IMPORTED_MODULE_5__providers_report_build_srvc__["a" /* ReportBuildSrvc */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_5__providers_report_build_srvc__["a" /* ReportBuildSrvc */]) === "function" && _e || Object, typeof (_f = typeof __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["h" /* LoadingController */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["h" /* LoadingController */]) === "function" && _f || Object])
], WorkOrder);

var _a, _b, _c, _d, _e, _f;
//# sourceMappingURL=work-order.js.map

/***/ })

});
//# sourceMappingURL=0.main.js.map