var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DBSrvcs } from '../../providers/db-srvcs';
import { TimeSrvc } from '../../providers/time-parse-srvc';
import { ReportBuildSrvc } from '../../providers/report-build-srvc';
import * as moment from 'moment';
var WorkOrder = (function () {
    // , private dbSrvcs: DBSrvcs
    function WorkOrder(navCtrl, navParams, dbSrvcs, timeSrvc, reportBuilder) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.dbSrvcs = dbSrvcs;
        this.timeSrvc = timeSrvc;
        this.reportBuilder = reportBuilder;
        this.title = 'Work Report';
        this.setDate = new Date();
        this.year = this.setDate.getFullYear();
        this.mode = 'New';
        this.profile = {};
        this.rprtDate = new Date();
        this.timeStarts = new Date();
        this.reportDate = moment();
        this.startTime = moment();
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
        var _this = this;
        this.workOrder = new FormGroup({
            'timeStarts': new FormControl('', Validators.required),
            'timeEnds': new FormControl(null, Validators.required),
            'repairHrs': new FormControl(null, Validators.required),
            'uNum': new FormControl(null, Validators.required),
            'wONum': new FormControl(null, Validators.required),
            'notes': new FormControl(null, Validators.required),
            'rprtDate': new FormControl('', Validators.required)
            // 'timeStarts': new FormControl(this.timeStarts, Validators.required), 
            // 'timeEnds'  : new FormControl(null, Validators.required),
            // 'repairHrs' : new FormControl(null, Validators.required), 
            // 'uNum'      : new FormControl(null, Validators.required), 
            // 'wONum'     : new FormControl(null, Validators.required), 
            // 'notes'     : new FormControl(null, Validators.required), 
            // 'rprtDate'  : new FormControl(this.rprtDate, Validators.required)
        });
        setTimeout(function (_) {
            _this.reportDateField.setValue(_this.reportDate.format());
            _this.startTimeField.setValue(_this.startTime.format());
        });
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
                        });
                    }
                });
            }
            else {
                console.error("Tech profile does not exist. Contact developers.");
            }
        });
    };
    return WorkOrder;
}());
__decorate([
    ViewChild('reportDate'),
    __metadata("design:type", Object)
], WorkOrder.prototype, "reportDateField", void 0);
__decorate([
    ViewChild('startTime'),
    __metadata("design:type", Object)
], WorkOrder.prototype, "startTimeField", void 0);
WorkOrder = __decorate([
    IonicPage({ name: 'Work Order Form' }),
    Component({
        selector: 'page-work-order',
        templateUrl: 'work-order.html',
    }),
    __metadata("design:paramtypes", [NavController, NavParams, DBSrvcs, TimeSrvc, ReportBuildSrvc])
], WorkOrder);
export { WorkOrder };
//# sourceMappingURL=work-order.js.map