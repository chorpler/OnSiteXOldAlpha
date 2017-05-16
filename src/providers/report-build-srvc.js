var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, NgZone } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { DBSrvcs } from './db-srvcs';
var ReportBuildSrvc = (function () {
    function ReportBuildSrvc(http, zone, _localSrvcs) {
        this.http = http;
        this.zone = zone;
        this._localSrvcs = _localSrvcs;
        this.newReport = {};
        console.log('Hello ReportBuildSrvc Provider');
    }
    ReportBuildSrvc.prototype.getLocalDocs = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            console.log("ReportBuilder: About to get tmpReport...");
            _this._localSrvcs.getDoc('_local/tmpReport').then(function (res) {
                console.log("ReportBuilder: Got tmpReport:");
                console.log(res);
                _this.report = res;
                console.log("ReportBuilder: About to get techProfile");
                return _this._localSrvcs.getDoc('_local/techProfile');
            }).then(function (res) {
                _this.profile = res;
                console.log("ReportBuilder: got techProfile:");
                console.log(res);
                console.log("ReportBuilder: About to createReport()");
                return _this.createReport();
            }).then(function (res) {
                console.log("Generated report and saved it to be synchronized.");
                console.log(res);
                resolve(res);
            }).catch(function (err) {
                console.log("Error while generating/saving report!");
                console.error(err);
                reject(err);
            });
        });
    };
    ReportBuildSrvc.prototype.createReport = function () {
        console.log("ReportBuilder: now in createReport()");
        this.newReport._id = this.report.docID;
        this.newReport.timeStarts = this.report.timeStarts;
        this.newReport.timeEnds = this.report.timeEnds;
        this.newReport.repairHrs = this.report.repairHrs;
        this.newReport.uNum = this.report.uNum;
        this.newReport.wONum = this.report.wONum;
        this.newReport.notes = this.report.notes;
        this.newReport.rprtDate = this.report.rprtDate;
        this.newReport.lastName = this.profile.lastName;
        this.newReport.firstName = this.profile.firstName;
        this.newReport.client = this.profile.client;
        this.newReport.location = this.profile.location;
        this.newReport.locID = this.profile.locID;
        this.newReport.loc2nd = this.profile.loc2nd;
        this.newReport.shift = this.profile.shift;
        this.newReport.shiftLength = this.profile.shiftLength;
        this.newReport.shiftStartTime = this.profile.shiftStartTime;
        this.newReport.technician = this.profile.technician;
        console.log('this.newReport: ');
        console.log(this.newReport);
        return this.putNewReport();
    };
    ReportBuildSrvc.prototype.putNewReport = function () {
        var _this = this;
        return new Promise(function (success, failure) {
            _this._localSrvcs.addDoc(_this.newReport).then(function (res) {
                console.log("putNewReport(): Success");
                success(res);
            }).catch(function (err) {
                console.log("Error with putNewReport()");
                console.error(err);
                failure(err);
            });
        });
    };
    return ReportBuildSrvc;
}());
ReportBuildSrvc = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Http, NgZone, DBSrvcs])
], ReportBuildSrvc);
export { ReportBuildSrvc };
//# sourceMappingURL=report-build-srvc.js.map