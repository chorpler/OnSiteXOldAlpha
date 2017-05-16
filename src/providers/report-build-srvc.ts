import { Injectable, NgZone } from '@angular/core';
import { Http               } from '@angular/http';
import 'rxjs/add/operator/map'    ;
import * as PouchDB from 'pouchdb';
import { DBSrvcs            } from './db-srvcs';




@Injectable()
export class ReportBuildSrvc {

  newReport: any = { };
  report   : any;
  profile  : any;

  constructor(public http: Http, public zone: NgZone, private _localSrvcs: DBSrvcs) {
    console.log('Hello ReportBuildSrvc Provider');
  }

  getLocalDocs() {
    return new Promise((resolve,reject) => {
      console.log("ReportBuilder: About to get tmpReport...");
      this._localSrvcs.getDoc('_local/tmpReport').then((res) => { 
        console.log("ReportBuilder: Got tmpReport:");
        console.log(res);
        this.report = res;
        console.log("ReportBuilder: About to get techProfile");
        return this._localSrvcs.getDoc('_local/techProfile');
      }).then((res) => {
        this.profile = res;
        console.log("ReportBuilder: got techProfile:");
        console.log(res);
        console.log("ReportBuilder: About to createReport()");
        return this.createReport();
      }).then((res) => {
        console.log("Generated report and saved it to be synchronized.");
        console.log(res);
        resolve(res);
      }).catch((err) => {
        console.log("Error while generating/saving report!");
        console.error(err);
        reject(err);
      });
    });
  }

  createReport() {
    console.log("ReportBuilder: now in createReport()");
    this.newReport._id            = this.report.docID           ;
    this.newReport.timeStarts     = this.report.timeStarts      ;
    this.newReport.timeEnds       = this.report.timeEnds        ;
    this.newReport.repairHrs      = this.report.repairHrs       ;
    this.newReport.uNum           = this.report.uNum            ;
    this.newReport.wONum          = this.report.wONum           ;
    this.newReport.notes          = this.report.notes           ;
    this.newReport.rprtDate       = this.report.rprtDate        ;
    this.newReport.lastName       = this.profile.lastName       ;
    this.newReport.firstName      = this.profile.firstName      ;
    this.newReport.client         = this.profile.client         ;
    this.newReport.location       = this.profile.location       ;
    this.newReport.locID          = this.profile.locID          ;
    this.newReport.loc2nd         = this.profile.loc2nd         ;
    this.newReport.shift          = this.profile.shift          ;
    this.newReport.shiftLength    = this.profile.shiftLength    ;
    this.newReport.shiftStartTime = this.profile.shiftStartTime ;
    this.newReport.technician     = this.profile.technician     ;
    console.log('this.newReport: ');
    console.log(this.newReport);
    return this.putNewReport();
  }

  putNewReport() {
    return new Promise((success, failure) => {
      this._localSrvcs.addDoc( this.newReport ).then((res) => {
        console.log("putNewReport(): Success");
        success(res);
      }).catch((err) => {
        console.log("Error with putNewReport()");
        console.error(err);
        failure(err);
      });
    });
  }
}
