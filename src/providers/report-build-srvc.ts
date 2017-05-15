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
    return this._localSrvcs.getDoc('_local/tmpReport'  ).then( res => { 
      this.report = res;
      return this._localSrvcs.getDoc('_local/techProfile');
  } ).then( res => { 
      this.profile = res;
      this.createReport();
    } );
  }

  createReport() {
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
    console.log('this.newReport: ' + this.newReport );
    this.putNewReport();
  }

  putNewReport() {
    this._localSrvcs.addDoc( this.newReport._id );
  }
}
