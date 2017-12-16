import { Component, OnInit, ChangeDetectionStrategy, NgZone,                 } from '@angular/core'           ;
import { OnDestroy, AfterViewInit,                                           } from '@angular/core'           ;
import { IonicPage, NavController, NavParams, LoadingController, ItemSliding } from 'ionic-angular'           ;
import { DBSrvcs                                                             } from 'providers/db-srvcs'      ;
import { AuthSrvcs                                                           } from 'providers/auth-srvcs'    ;
import { SrvrSrvcs                                                           } from 'providers/srvr-srvcs'    ;
import { UserData                                                            } from 'providers/user-data'     ;
import { AlertService                                                        } from 'providers/alerts'        ;
import { Log, isMoment, moment, Moment                                       } from 'config/config.functions' ;
import { Report, ReportOther, Shift, PayrollPeriod, Employee, Jobsite        } from 'domain/domain-classes'   ;
import { Preferences                                                         } from 'providers/preferences'   ;
import { TranslateService                                                    } from '@ngx-translate/core'     ;
import { SmartAudio                                                          } from 'providers/smart-audio'   ;
import { TabsService                                                         } from 'providers/tabs-service'  ;
import { Pages                                                               } from 'config/config.types'     ;

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
    public db          : DBSrvcs           ,
    public alert       : AlertService      ,
    private auth       : AuthSrvcs         ,
    public loadingCtrl : LoadingController ,
    public server      : SrvrSrvcs         ,
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
    // this.allReports  = this.ud.getData('reports');
    this.allReports  = []    ;
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
    this.generateShifts();
    this.generateFlaggedReportsList();
    // this.alert.showSpinner(lang['spinner_retrieving_reports']);
    this.pageReady = true;
  }

  public generateShifts() {
    Log.l(`generateShifts(): Generating shifts for `)
    // this.periods = this.ud.getPayrollPeriods() || [];
    this.periods = this.ud.createPayrollPeriods(this.tech);
    this.period = this.periods[0];
    this.shifts = [];
    this.reports = [];
    this.allReports = [];
    Log.l("ReportHistory: Got payroll periods:\n", this.periods);
    for(let period of this.periods) {
      let periodShifts = period.getPayrollShifts();
      for(let shift of periodShifts) {
        this.shifts.push(shift);
        let reports = shift.getShiftReports();
        for(let report of reports) {
          this.allReports.push(report);
        }
      }
    }
    return this.allReports;
  }

  public generateFlaggedReportsList() {
    let allReports:Report[] = this.allReports;
    let reports:Report[] = [];
    for(let report of allReports) {
      let wo = report.work_order_number.trim();
      let cli = report.client.trim().toUpperCase();
      if(report.flagged === true) {
        reports.push(report);
        continue;
      } else if(cli === 'HB' || cli === "HALLIBURTON") {
        if(!wo) {
          report.flagged = true;
          reports.push(report);
          continue;
        } else {
          let wonumber = Number(wo);
          if(!isNaN(wonumber)) {
            if(wonumber < 1000000 || wonumber > 9999999999) {
              report.flagged = true;
              reports.push(report);
              continue;
            }
          }
          let unit = report.unit_number.trim();
          if(!unit) {
            report.flagged = true;
            reports.push(report);
            continue;
          }
        }
      } else if(cli === 'KN' || cli === 'KEANE') {
        if(!wo) {
          report.flagged = true;
          reports.push(report);
          continue;
        }
      } else if(cli === 'SE' || cli === 'SESA') {

      }
    }
    Log.l("generateFlaggedReportsList(): Output is:\n", reports);
    this.reports = reports;
    return this.reports;
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

  // public deleteWorkOrder(event:Event, report:Report, shift:Shift) {
  //   Log.l("deleteWorkOrder() clicked ... with event:\n", event);
  //   let lang = this.lang;
  //   let db = this.prefs.getDB();
  //   this.audio.play('deletereport');
  //   this.alert.showConfirm(lang['confirm'], lang['delete_report']).then((res) => {
  //     if (res) {
  //       this.alert.showSpinner(lang['spinner_deleting_report']);
  //       Log.l("deleteWorkOrder(): User confirmed deletion, deleting...");
  //       let wo:Report = report;
  //       this.db.deleteDoc(db.reports, wo).then((res) => {
  //         Log.l("deleteWorkOrder(): Success:\n", res);
  //         let tmpReport = wo;
  //         let reports = this.ud.getWorkOrderList();
  //         let i = reports.indexOf(wo);
  //         Log.l("Going to delete work order %d in the list.", i);
  //         if (i > -1) {
  //           tmpReport = reports.splice(i, 1)[0];
  //         }
  //         shift.removeShiftReport(tmpReport);
  //         this.ud.removeReport(tmpReport);
  //         return this.server.syncToServer(db.reports, db.reports);
  //       }).then(res => {
  //         Log.l(`deleteWorkOrder(): Synchronized local '${db.reports}' to remote.`)
  //         // return this.server.deleteDoc(db.reports, wo);
  //         // .then((res) => {
  //       // }).then(res => {
  //         Log.l("deleteWorkOrder(): Success:\n", res);
  //         // this.items.splice(i, 1);
  //         // let i = this.reports.indexOf(report);
  //         let tmpReport = report;
  //         // if(i > -1) {
  //           // tmpReport = this.reports.splice(i, 1)[0];
  //         // }
  //         // i = this.filtReports[reportDate].indexOf(item);
  //         // let tmpReport = this.filtReports[reportDate].splice(i, 1)[0];
  //         Log.l(`deleteWorkOrder(): Successfully deleted report '${report._id}' from server.`);
  //         Log.l(`deleteWorkOrder(): About to delete report '${report._id}' from shift '${shift.getShiftSerial()}'...\n`, report);
  //         shift.removeShiftReport(tmpReport);
  //         // this.ud.removeReport(tmpReport);
  //         this.alert.hideSpinner();
  //       }).catch((err) => {
  //         this.alert.hideSpinner();
  //         Log.l("deleteWorkOrder(): Error!");
  //         Log.e(err);
  //         this.alert.showAlert(lang['error'], lang['error_deleting_report_message']);
  //       });
  //     } else {
  //       Log.l("User canceled deletion.");
  //     }
  //   }).catch((err) => {
  //     this.alert.hideSpinner();
  //     Log.l("deleteWorkOrder(): Error!");
  //     Log.e(err);
  //     this.alert.showAlert(lang['error'], lang['error_deleting_report_message']);
  //   });
  // }

  public async deleteWorkOrder(event:Event, report:Report, shift:Shift) {
    let lang = this.lang;
    try {
      Log.l("deleteWorkOrder() clicked ... with event:\n", event);
      let db = this.prefs.getDB();
      this.audio.play('deletereport');
      let confirm = await this.alert.showConfirm(lang['confirm'], lang['delete_report']);
      if(confirm) {
        this.alert.showSpinner(lang['spinner_deleting_report']);
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
        this.alert.hideSpinner();
      } else {
        Log.l("User canceled deletion.");
      }
    } catch(err) {
      this.alert.hideSpinner();
      Log.l("deleteWorkOrder(): Error!");
      Log.e(err);
      this.alert.showAlert(lang['error'], lang['error_deleting_report_message']);
    }
  }

  public deleteOtherReport(event:Event, other:ReportOther, shift:Shift) {
    Log.l("deleteOtherReport() clicked ... with event:\n", event);
    let lang = this.lang;
    let db = this.prefs.getDB();
    this.audio.play('deleteotherreport');
    this.alert.showConfirm(lang['confirm'], lang['delete_report']).then((res) => {
      if (res) {
        this.alert.showSpinner(lang['spinner_deleting_report']);
        Log.l("deleteOtherReport(): User confirmed deletion, deleting...");
        // let ro: ReportOther = other.clone();
        let ro:ReportOther = other;
        let tmpOther = other;
        this.db.deleteDoc(db.reports_other, ro).then((res) => {
          Log.l("deleteWorkOrder(): Success:\n", res);
          let tmpOther = ro;
          let reports = this.ud.getReportOtherList();
          let i = reports.indexOf(ro);
          Log.l("Going to delete work order %d in the list.", i);
          if (i > -1) {
            tmpOther = reports.splice(i, 1)[0];
          }
          shift.removeOtherReport(tmpOther)
          this.ud.removeOtherReport(tmpOther);
          return this.server.syncToServer(db.reports_other, db.reports_other);
        }).then(res => {
          // let ro:ReportOther = other;
          Log.l(`deleteWorkOrder(): Synchronized local '${db.reports_other}' to remote.`)
          // return this.server.deleteDoc(db.reports, ro);
        // }).then(res => {
        // let reportDate = ro.report_date.format("YYYY-MM-DD");
        // this.server.deleteDoc(db.reports_other, ro).then((res) => {
          Log.l("deleteOtherReport(): Successfully deleted from server:\n", res);
        //   // this.items.splice(i, 1);
        //   // let i = this.otherReports.indexOf(other);
        //   // if(i > -1) {
        //   //   tmpOther = this.otherReports.splice(i, 1)[0];
        //   // }
        //   // i = this.filtReports[reportDate].indexOf(other);
        //   // this.filtReports[reportDate].splice(i, 1);
        //   // let tmpReport = this.filtReports[reportDate].splice(i, 1)[0];
          Log.l(`deleteOtherReport(): About to delete report '${other._id}' from shift '${shift.getShiftSerial()}'...\n`, other);
          shift.removeOtherReport(tmpOther);
          // this.ud.removeOtherReport(tmpOther);
          this.alert.hideSpinner();
        }).catch((err) => {
          this.alert.hideSpinner();
          Log.l("deleteOtherReport(): Error!");
          Log.e(err);
          this.alert.showAlert(lang['error'], lang['error_deleting_report_message']);
        });
      } else {
        Log.l("User canceled deletion.");
      }
    }).catch((err) => {
      this.alert.hideSpinner();
      Log.l("deleteOtherReport(): Error!");
      Log.e(err);
      this.alert.showAlert(lang['error'], lang['error_deleting_report_message']);
    });
  }

  public doRefresh(event?:any) {
    Log.l("Refreshing!");
  }

}
