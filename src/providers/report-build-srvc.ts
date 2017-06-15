import { Injectable, NgZone } from '@angular/core'              ;
import { Http               } from '@angular/http'              ;
import 'rxjs/add/operator/map'                                  ;
import * as PouchDB from 'pouchdb'                              ;
import { DBSrvcs            } from './db-srvcs'                 ;
import { AuthSrvcs          } from './auth-srvcs'               ;
import { Log                } from '../config/config.functions' ;
import { UserData           } from './user-data'                ;
import { WorkOrder          } from '../domains/workorder'       ;
import { Shift              } from '../domains/shift'           ;
import { PREFS } from '../config/config.strings';



@Injectable()
export class ReportBuildSrvc {

  newReport: any = { };
  report   : any;
  profile  : any;

  constructor(public http: Http, public zone: NgZone, private db: DBSrvcs ) {
    console.log('Hello ReportBuildSrvc Provider');
  }

  getLocalDocs() {
    return new Promise((resolve,reject) => {
      console.log("ReportBuilder: About to get tmpReport...");
      this.db.getDoc(PREFS.DB.reports, '_local/tmpReport').then((res) => {
        console.log("ReportBuilder: Got tmpReport:\n", res);
        this.report = res;
        console.log("ReportBuilder: About to get techProfile");
        return this.db.getDoc(PREFS.DB.reports, '_local/techProfile');
      }).then((res) => {
        this.profile = res;
        console.log("ReportBuilder: got techProfile:\n", res);
        console.log("ReportBuilder: About to createReport()");
        return this.createReport();
      }).then((res) => {
        console.log("Generated report and saved it to be synchronized\n", res);
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
    return new Promise((resolve,reject) => {
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
      this.newReport.timeStamp      = this.report.timeStamp       ;
      this.newReport.username       = this.profile.avatarName     ;
      console.log('this.newReport:\n', this.newReport);
      this.putNewReport().then((res) => {
        Log.l("createReport(): Success!\n", res);
        resolve(res);
      }).catch((err) => {
        Log.l("createReport(): Error!");
        Log.e(err);
        reject(err);
      });
    });
  }

  putNewReport() {
    return new Promise((success, reject) => {
      this.db.addDoc(PREFS.DB.reports, this.newReport ).then((res) => {
        console.log("putNewReport(): Success:\n", res);
        success(res);
      }).catch((err) => {
        console.log("Error with putNewReport():");
        console.error(err);
        reject(err);
      });
    });
  }
}
