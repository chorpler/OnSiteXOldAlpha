import { Component, OnInit, ChangeDetectionStrategy, NgZone,                 } from '@angular/core'           ;
import { OnDestroy, AfterViewInit,                                           } from '@angular/core'           ;
import { IonicPage, NavController, NavParams, LoadingController, ItemSliding } from 'ionic-angular'           ;
import { DBService                                                             } from 'providers/db-service'      ;
import { AuthSrvcs                                                           } from 'providers/auth-srvcs'    ;
import { ServerService                                                           } from 'providers/server-service'    ;
import { UserData                                                            } from 'providers/user-data'     ;
import { AlertService                                                        } from 'providers/alerts'        ;
import { Log, isMoment, moment, Moment                                       } from 'domain/onsitexdomain' ;
import { Report, ReportOther, Shift, PayrollPeriod, Employee, Jobsite        } from 'domain/onsitexdomain'   ;
import { Preferences                                                         } from 'providers/preferences'   ;
import { TranslateService                                                    } from '@ngx-translate/core'     ;
import { SmartAudio                                                          } from 'providers/smart-audio'   ;
import { TabsService                                                         } from 'providers/tabs-service'  ;
import { Pages                                                               } from 'domain/onsitexdomain'     ;

export const _sortReports = (a:Report,b:Report):number => {
  let dateA  = a.report_date;
  let dateB  = b.report_date;
  let startA = a.time_start;
  let startB = b.time_start;
  // dateA  = isMoment(dateA)  ? dateA  : moment(dateA).startOf('day');
  // dateB  = isMoment(dateB)  ? dateB  : moment(dateB).startOf('day');
  // startA = isMoment(startA) ? startA : moment(startA);
  // startB = isMoment(startB) ? startB : moment(startB);
  // return dateA.isBefore(dateB) ? -1 : dateA.isAfter(dateB) ? 1 : startA.isBefore(startB) ? -1 : startA.isAfter(startB) ? 1 : 0;
  return dateA > dateB ? 1 : dateA < dateB ? -1 : startA > startB ? 1 : startA < startB ? -1 : 0;
};

export const _sortOtherReports = (a:ReportOther,b:ReportOther):number => {
  let dateA:Moment = a.report_date;
  let dateB:Moment = b.report_date;
  dateA = isMoment(dateA) ? dateA : moment(dateA).startOf('day');
  dateB = isMoment(dateB) ? dateB : moment(dateB).startOf('day');
  return dateA.isBefore(dateB) ? -1 : dateA.isAfter(dateB) ? 1 : 0;
  // return dateA < dateB ? -1 : dateA > dateB ? 1 : 0;
  // if (isMoment(a) && isMoment(b)) {
  //   return moment(a).isBefore(moment(b)) ? -1 : moment(a).isAfter(moment(b)) ? 1 : 0;
  // } else {
  //   return 0;
  // }
};

@IonicPage({ name    : 'Flagged Reports'                                           })
@Component({ selector: 'page-reports-flagged',
templateUrl: 'reports-flagged.html',
})
export class ReportsFlaggedPage implements OnInit,OnDestroy,AfterViewInit {
  public title        : string           = 'Flagged Reports'                                            ;
  public lang         : any                                                                             ;
  public pageReady    : boolean          = false                                                        ;
  public selectedItem : any                                                                             ;
  public items        : Array<{title: string, note: string}> = new Array<{title:string, note:string}>() ;
  public allReports   : Array<Report>        = []                                                       ;
  public reports      : Array<Report>        = []                                                       ;
  public otherReports : Array<ReportOther>   = []
  public shifts       : Array<Shift>         = []                                                       ;
  public periods      : Array<PayrollPeriod> = []                                                       ;
  public period       : PayrollPeriod = null                                                            ;
  public tech         : Employee                                                                        ;
  public filtReports  : any                  = {}                                                       ;
  public filterKeys   : Array<string>                                                                   ;
  public data         : any                                                                             ;
  public loading      : any                                                                             ;
  public static PREFS : any                  = new Preferences()                                        ;
  public get prefs() { return ReportsFlaggedPage.PREFS; };
  public shiftToUse   : Shift                = null                                                     ;

  constructor(
    public navCtrl     : NavController     ,
    public navParams   : NavParams         ,
    public db          : DBService           ,
    public alert       : AlertService      ,
    private auth       : AuthSrvcs         ,
    public loadingCtrl : LoadingController ,
    public server      : ServerService         ,
    public ud          : UserData          ,
    public translate   : TranslateService  ,
    // public tabs        : TabsComponent     ,
    public tabServ     : TabsService       ,
    public zone        : NgZone            ,
    public audio       : SmartAudio        ,
  ) {
    window["onsitereportsflagged"] = this;
    window["onsiteflaggedreports"] = this;
  }

  ngOnInit() {
    Log.l("ReportsFlaggedPage: ngOnInit() fired");
    if(this.ud.isAppLoaded()) {
      this.runWhenReady();
    }
    // if (!(this.ud.isAppLoaded() && this.ud.isHomePageReady())) {
    //   this.tabs.goToPage('OnSiteHome');
    // } else {
    //   this.runOnPageLoad();
    // }
  }

  ngOnDestroy() {
    Log.l("ReportsFlaggedPage: ngOnDestroy() fired");
  }

  ngAfterViewInit() {
    Log.l("ReportsFlaggedPage: ngAfterViewInit() fired");
    this.tabServ.setPageLoaded(Pages.ReportsFlagged);
  }

  ionViewDidEnter() {
    // Log.l("ReportsFlaggedPage: ionViewDidEnter called...");
    // window["onsitereporthistory"] = this;
    // this.pageReady = false;
    // if(!(this.ud.isAppLoaded() && this.ud.isHomePageReady())) {
    //   this.tabServ.goToPage('OnSiteHome');
    // } else {
    //   this.runOnPageLoad();
    // }
  }

  public runWhenReady() {
    this.pageReady   = false ;
    this.allReports  = this.ud.getData('reports');
    // this.allReports  = []    ;
    this.reports     = []    ;
    this.tech        = this.ud.getTechProfile();
    // this.filterKeys  = []    ;
    // this.filtReports = {}    ;

    let translations = [
      'error',
      'confirm',
      'delete_report',
      'error_report_not_found',
      'spinner_deleting_report',
      'spinner_retrieving_reports',
      'spinner_retrieving_reports_other',
      'error_server_connect_message',
      'error_fetching_reports_title',
      'error_fetching_reports_message',
      'error_deleting_report_message'
    ];
    this.lang = this.translate.instant(translations);
    let lang = this.lang;
    this.allReports = this.generateShifts();
    Log.l("After generateShifts(), allReports array is:\n", this.allReports);
    this.reports = this.generateFlaggedReportsList();
    Log.l("After generateFlaggedReportsList(), reports array is:\n", this.reports);
    // this.alert.showSpinner(lang['spinner_retrieving_reports']);
    this.pageReady = true;
  }

  public generateShifts() {
    Log.l(`generateShifts(): Generating shifts for periods:`)
    this.periods = this.ud.getPayrollPeriods() || [];
    Log.l(this.periods)
    // this.periods = this.ud.createPayrollPeriods(this.tech);
    this.period = this.periods[0];
    this.shifts = [];
    this.reports = [];
    let rawReports:Report[] = [];
    Log.l("ReportsFlaggedPage: Got payroll periods:\n", this.periods);
    for(let period of this.periods) {
      let periodShifts = period.getPayrollShifts();
      for(let shift of periodShifts) {
        this.shifts.push(shift);
        let reports = shift.getShiftReports();
        for(let report of reports) {
          rawReports.push(report);
        }
      }
    }
    return rawReports;
  }

  public generateFlaggedReportsList() {
    let allReports:Report[] = this.allReports;
    let reports:Report[] = [];
    for(let report of allReports) {
      Log.l("generateFlaggedReportsList(): Now checking report:\n", report);
      let wo = report.work_order_number.trim();
      let cli = report.client.trim().toUpperCase();
      let crew = report && typeof report.crew_number === 'string' ? report.crew_number.trim().toUpperCase() : "";
      if(report.isFlagged()) {
        reports.push(report);
        continue;
      } else if(cli === 'HB' || cli === "HALLIBURTON") {
        if(!wo) {
          // report.flagged = true;
          report.setFlag('work_order_number', 'blank')
          reports.push(report);
          continue;
        } else {
          let wonumber = Number(wo);
          if(!isNaN(wonumber)) {
            if(wonumber < 1000000 || wonumber > 9999999999) {
              // report.flagged = true;
              report.setFlag('work_order_number', 'wrong_length')
              reports.push(report);
              continue;
            }
          }
          let unit = report.unit_number.trim();
          if(!unit) {
            // report.flagged = true;
            report.setFlag('unit_number', 'blank')
            reports.push(report);
            continue;
          }
        }
      } else if(cli === 'KN' || cli === 'KEANE') {
        if(!wo) {
          // report.flagged = true;
          report.setFlag('work_order_number', 'blank')
          reports.push(report);
          continue;
        } else if(!crew) {
          report.setFlag('crew_number', 'blank');
          reports.push(report);
          continue;
        }
      } else if(cli === 'SE' || cli === 'SESA') {

      }
    }
    Log.l("generateFlaggedReportsList(): Output is:\n", reports);
    return reports;
  }

  public itemTapped(item:Report|ReportOther, event?:any) {
    let shiftToSend = null;
    let lang = this.lang;
    Log.l("itemTapped(): Now looking for report:\n", item);
    let report = item;
    let shift:Shift;
    if(item instanceof Report) {
      let report_date = item.report_date;
      // for(let shift of this.shifts) {
      shift = this.shifts.find((a:Shift) => {
        return a.getShiftDate().format("YYYY-MM-DD") === report_date;
      });
      // });
      if(shift) {
        this.tabServ.goToPage('Report View', {mode: 'Edit', report: item, shift: shift, payroll_period: this.period});
      } else {
        Log.l(`itemTapped(): Could not find shift for report date '${report_date}'.`);
      }

    } else if(item instanceof ReportOther) {
      let report_date = item.report_date.format("YYYY-MM-DD");
      let shift = this.shifts.find((a:Shift) => {
        return a.getShiftDate().format("YYYY-MM-DD") === report_date;
      });
      if(shift) {
        this.tabServ.goToPage('Report View', {mode: 'Edit', other: item, shift: shift, payroll_period: this.period});
      } else {
        Log.l(`itemTapped(): Could not find shift for ReportOther date '${report_date}'.`);
      }
    } else {
      Log.w(`itemTapped(): Can't view report, not a Report or ReportOther:\n`, item);
    }

    // Log.l("itemTapped(): Got shift to send:\n", shift);
    //   if(item['type'] && item['type'] !== 'Work Report') {
    //     this.tabServ.goToPage('Report', {mode: 'Edit', reportOther: report, shift: shift, payroll_period: this.period, type: item['type']});
    //   } else if(item instanceof Report) {
    //     this.tabServ.goToPage('Report', {mode: 'Edit', workOrder: report, shift: shift, payroll_period: this.period});
    //   } else {
    //     this.alert.showAlert(lang['error'] + " PEBCAK-002", lang['error_report_not_found']);
    //   }
    // } else {
    //   this.alert.showAlert(lang['error'], lang['error_report_not_found']);
    // }
  }

  public addNewReportForShift(shift: Shift) {
    Log.l("addNewReportForShift(): Got shift to send:\n", shift);
    this.tabServ.goToPage('Report', { mode: 'Add', shift: shift, payroll_period: this.period });
  }


  public async deleteWorkOrder(event:Event, report:Report, shift:Shift) {
    let lang = this.lang;
    let spinnerID;
    try {
      Log.l("deleteWorkOrder() clicked ... with event:\n", event);
      let db = this.prefs.getDB();
      this.audio.play('deletereport');
      let confirm = await this.alert.showConfirm(lang['confirm'], lang['delete_report']);
      if(confirm) {
        spinnerID = await this.alert.showSpinnerPromise(lang['spinner_deleting_report']);
        Log.l("deleteWorkOrder(): User confirmed deletion, deleting...");
        let wo:Report = report;
        let res = await this.db.deleteDoc(db.reports, wo);
        Log.l("deleteWorkOrder(): Success:\n", res);
        let tmpReport = wo;
        let reports = this.ud.getReportList();
        let i = reports.indexOf(wo);
        Log.l("Going to delete work order %d in the list.", i);
        if (i > -1) {
          tmpReport = reports.splice(i, 1)[0];
        }
        shift.removeShiftReport(tmpReport);
        this.ud.removeReport(tmpReport);
        let syncRes = await this.server.syncToServer(db.reports, db.reports);
        Log.l(`deleteWorkOrder(): Synchronized local '${db.reports}' to remote.`)
        Log.l("deleteWorkOrder(): Success:\n", res);
        let tmpReport2 = report;
        Log.l(`deleteWorkOrder(): Successfully deleted report '${report._id}' from server.`);
        Log.l(`deleteWorkOrder(): About to delete report '${report._id}' from shift '${shift.getShiftSerial()}'...\n`, report);
        shift.removeShiftReport(tmpReport2);
        let out = await this.alert.hideSpinnerPromise(spinnerID);
      } else {
        Log.l("User canceled deletion.");
      }
    } catch(err) {
      let out = await this.alert.hideSpinnerPromise(spinnerID);
      Log.l("deleteWorkOrder(): Error!");
      Log.e(err);
      out = await this.alert.showAlert(lang['error'], lang['error_deleting_report_message']);
    }
  }

  public async deleteOtherReport(event:Event, other:ReportOther, shift:Shift) {
    Log.l("deleteOtherReport() clicked ... with event:\n", event);
    let lang = this.lang;
    let spinnerID;
    try {
      let db = this.prefs.getDB();
      this.audio.play('deleteotherreport');
      let confirm = await this.alert.showConfirm(lang['confirm'], lang['delete_report']);
      if(confirm) {
        spinnerID = await this.alert.showSpinnerPromise(lang['spinner_deleting_report']);
        Log.l("deleteOtherReport(): User confirmed deletion, deleting...");
        // let ro: ReportOther = other.clone();
        let ro:ReportOther = other;
        let tmpOther:ReportOther = other;
        let res:any = await this.db.deleteDoc(db.reports_other, ro);
        Log.l("deleteWorkOrder(): Success:\n", res);
        tmpOther = ro;
        let reports = this.ud.getReportOtherList();
        let i = reports.indexOf(ro);
        Log.l("Going to delete work order %d in the list.", i);
        if (i > -1) {
          tmpOther = reports.splice(i, 1)[0];
        }
        shift.removeOtherReport(tmpOther)
        this.ud.removeOtherReport(tmpOther);
        res = await this.server.syncToServer(db.reports_other, db.reports_other);
        // let ro:ReportOther = other;
        Log.l(`deleteWorkOrder(): Synchronized local '${db.reports_other}' to remote.`)
        // return this.server.deleteDoc(db.reports, ro);
        Log.l("deleteOtherReport(): Successfully deleted from server:\n", res);
        Log.l(`deleteOtherReport(): About to delete report '${other._id}' from shift '${shift.getShiftSerial()}'...\n`, other);
        shift.removeOtherReport(tmpOther);
        // this.ud.removeOtherReport(tmpOther);
        let out = await this.alert.hideSpinnerPromise(spinnerID);
      } else {
        Log.l("User canceled deletion.");
      }
    } catch(err) {
      let out = await this.alert.hideSpinnerPromise(spinnerID);
      Log.l("deleteOtherReport(): Error!");
      Log.e(err);
      out = await this.alert.showAlert(lang['error'], lang['error_deleting_report_message']);
    }
  }

  public doRefresh(event?:any) {
    Log.l("Refreshing!");
    let denominator = 0;
    return 5/0;
  }

}
