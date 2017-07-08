import { Component, OnInit, ChangeDetectionStrategy, NgZone     } from '@angular/core'                 ;
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular'                 ;
import { DBSrvcs                                                } from '../../providers/db-srvcs'      ;
import { AuthSrvcs                                              } from '../../providers/auth-srvcs'    ;
import { SrvrSrvcs                                              } from '../../providers/srvr-srvcs'    ;
import { UserData                                               } from '../../providers/user-data'     ;
import { AlertService                                           } from '../../providers/alerts'        ;
import { Log, isMoment, moment, Moment                          } from '../../config/config.functions' ;
import { WorkOrder                                              } from '../../domain/workorder'        ;
import { ReportOther                                            } from '../../domain/reportother'      ;
import { Shift                                                  } from '../../domain/shift'            ;
import { PayrollPeriod                                          } from '../../domain/payroll-period'   ;
import { Preferences                                            } from '../../providers/preferences'   ;
import { TranslateService                                       } from '@ngx-translate/core'           ;
import { TabsComponent                                          } from '../../components/tabs/tabs'    ;
import { OrderBy                                                } from '../../pipes/pipes'             ;
// import * as moment from 'moment';
import { STRINGS                                                } from '../../config/config.strings'   ;
import { SmartAudio                                             } from '../../providers/smart-audio'   ;

export const _sortReports = function(a,b) {
  let startA = a['time_start'];
  let startB = b['time_start'];
  if (isMoment(a) && isMoment(b)) {
    return moment(a).isBefore(moment(b)) ? -1 : moment(a).isAfter(moment(b)) ? 1 : 0;
  } else {
    return 0;
  }
};

export const _sortOtherReports = function(a,b) {
  let dateA = a['report_date'];
  let dateB = b['report_date'];
  return dateA < dateB ? -1 : dateA > dateB ? 1 : 0;
  // if (isMoment(a) && isMoment(b)) {
  //   return moment(a).isBefore(moment(b)) ? -1 : moment(a).isAfter(moment(b)) ? 1 : 0;
  // } else {
  //   return 0;
  // }
};


@IonicPage({ name    : 'ReportHistory'                                           })
@Component({ selector: 'page-report-history',
templateUrl: 'report-history.html',
// changeDetection: ChangeDetectionStrategy.OnPush })
})
export class ReportHistory implements OnInit {
  public title: string = 'Reports';
  public pageReady    : boolean          = false                                                        ;
  public selectedItem : any                                                                             ;
  public items        : Array<{title: string, note: string}> = new Array<{title:string, note:string}>() ;
  public reports      : Array<WorkOrder> = []                                                           ;
  public otherReports : Array<ReportOther> = []
  public shifts       : Array<Shift> = []                                                               ;
  public periods      : Array<PayrollPeriod> = []                                                       ;
  public period       : PayrollPeriod = null                                                            ;
  public filtReports  : any = {}                                                                        ;
  public filterKeys   : Array<string>                                                                   ;
  public filtOther    : any = {}                                                                        ;
  public data         : any                                                                             ;
  public loading      : any                                                                             ;
  public static PREFS : any              = new Preferences()                                            ;
  public prefs        : any              = ReportHistory.PREFS;
  public shiftToUse   : Shift            = null;
  numChars     : Array<string> = STRINGS.NUMCHARS ;
  constructor( public navCtrl  : NavController    , public navParams  : NavParams         ,
               public db       : DBSrvcs          , public alert      : AlertService      ,
               private auth    : AuthSrvcs        , public loadingCtrl: LoadingController ,
               public server   : SrvrSrvcs        , public ud         : UserData          ,
               public translate: TranslateService , public tabs       : TabsComponent     ,
               public zone     : NgZone           , public audio      : SmartAudio        ,
  ) {
    window["onsitereporthistory"] = this;
  }

  ngOnInit() {
    Log.l("ReportHistory: ngOnInit called...");
  }

  ionViewDidLoad() {
    Log.l("ReportHistory: ionViewDidEnter called...");
    window["onsitereporthistory"] = this;
    this.pageReady   = false ;
    this.reports     = []    ;
    this.filterKeys  = []    ;
    this.filtReports = { }   ;
    if(this.navParams.get('shift') !== undefined) { this.shiftToUse = this.navParams.get('shift');}
    if (this.navParams.get('payroll_period') !== undefined) { this.period = this.navParams.get('payroll_period');}
    this.periods = this.ud.getPayrollPeriods();
    let lang = this.translate.instant(['spinner_retrieving_reports', 'spinner_retrieving_reports_other', 'error', 'error_server_connect_message']);
    this.alert.showSpinner(lang['spinner_retrieving_reports']);
    if(this.shiftToUse !== null) {
      Log.l("ReportHistory: Showing only shift:\n", this.shiftToUse);
      this.shifts = [this.shiftToUse];
    } else {
      Log.l("ReportHistory: Showing all shifts.");
      this.periods = this.ud.getPayrollPeriods();
      this.period = this.periods[0];
      this.shifts = [];
      Log.l("ReportHistory: Got payroll periods:\n", this.periods);
      for(let period of this.periods) {
        let periodShifts = period.getPayrollShifts();
        for(let shift of periodShifts) {
          this.shifts.push(shift);
        }
      }
      Log.l("ReportHistory: Ended up with all shifts:\n", this.shifts);
    }
    let u = this.ud.getUsername();
    Log.l("ReportHistory: pulling reports...");
    this.server.getReportsForTech(u).then((res) => {
      let unsortedReports = res;
      // this.ud.setWorkOrderList(res);
      this.reports = unsortedReports.sort(_sortReports);
      Log.l("ReportHistory: created date-sorted report list:\n", this.reports);
      this.alert.hideSpinner();
      this.alert.showSpinner(lang['spinner_retrieving_reports_other']);
      return this.server.getReportsOtherForTech(u);
    }).then(res => {
      Log.l("ReportHistory: pulled ReportOther for tech:\n", res);
      this.filtReports = {};
      this.filterKeys = [];
      let reportOthers = res.sort(_sortOtherReports);
      this.otherReports = reportOthers;
      for(let shift of this.shifts) {
        let date = shift.getStartTime().format("YYYY-MM-DD");
        this.filterKeys.push(date);
        let serial = shift.getShiftSerial();
        let oneReportSet = shift.getShiftReports();
        // this.filtReports[date] = oneReportSet;
        this.filtReports[date] = [];
        for (let report of oneReportSet) {
          this.filtReports[date].push(report);
        }
        for(let other of reportOthers) {
          if(other.report_date.format("YYYY-MM-DD") === date) {
            this.filtReports[date].push(other);
          }
        }
      }
      this.alert.hideSpinner();
      this.pageReady = true;
    }).catch(err => {
      Log.l("ReportHistory: Error fetching reports!");
      Log.e(err);
      let lang = ['error_fetching_reports_title', 'error_fetching_reports_message'];
      this.alert.showAlert(lang['error_fetching_reports_title'], lang['error_fetching_reports_message']);
    });
  }

  itemTapped(event, item) {
    let shiftToSend = null;
    Log.l("itemTapped(): Now looking for report:\n", item);
    outerloop:
    for(let shift of this.shifts) {
      let reports = shift.getShiftReports();
      let others  = shift.getShiftOtherReports();
      for(let report of reports) {
        if(report._id === item._id) {
          Log.l(`itemTapped(): Found work report in shift:\n`, shift);
          shiftToSend = shift;
          break outerloop;
        }
      }
      for(let other of others) {
        if(other._id === item._id) {
          Log.l(`itemTapped(): Found ReportOther in shift:\n`, shift);
          shiftToSend = shift;
          break outerloop;
        }
      }
    }
    if(shiftToSend) {
      if(item['type']) {
        this.tabs.goToPage('Report', {mode: 'Edit', reportOther: item, shift: shiftToSend, payroll_period: this.period, type: item['type']});
      } else {
        this.tabs.goToPage('Report', {mode: 'Edit', workOrder: item, shift: shiftToSend, payroll_period: this.period});
      }
    } else {
      this.alert.showAlert("ERROR", "Report not found in any shifts.");
    }
  }

  deleteWorkOrder(event, item) {
    Log.l("deleteWorkOrder() clicked ...");
    let lang = this.translate.instant(['confirm', 'delete_report', 'spinner_deleting_report', 'error', 'error_deleting_report_message']);
    this.audio.play('deletereport');
    this.alert.showConfirm(lang['confirm'], lang['delete_report']).then((res) => {
      if (res) {
        this.alert.showSpinner(lang['spinner_deleting_report']);
        Log.l("deleteWorkOrder(): User confirmed deletion, deleting...");
        let wo:WorkOrder = item.clone();
        let reportDate = wo.report_date;
        this.server.deleteDoc(this.prefs.DB.reports, wo).then((res) => {
          Log.l("deleteWorkOrder(): Success:\n", res);
          // this.items.splice(i, 1);
          let i = this.reports.indexOf(item);
          this.reports.splice(i, 1);
          i = this.filtReports[reportDate].indexOf(item);
          this.filtReports[reportDate].splice(i, 1);
          this.alert.hideSpinner();
        }).catch((err) => {
          this.alert.hideSpinner();
          Log.l("deleteWorkOrder(): Error!");
          Log.e(err);
          this.alert.showAlert(lang['error'], lang['error_deleting_report_message']);
        });
      } else {
        Log.l("User canceled deletion.");
      }
    }).catch((err) => {
      this.alert.hideSpinner();
      Log.l("deleteWorkOrder(): Error!");
      Log.e(err);
      this.alert.showAlert(lang['error'], lang['error_deleting_report_message']);
    });
  }

  deleteOtherReport(event, other) {
    Log.l("deleteOtherReport() clicked ...");
    let lang = this.translate.instant(['confirm', 'delete_report', 'spinner_deleting_report', 'error', 'error_deleting_report_message']);
    this.audio.play('deleteotherreport');
    this.alert.showConfirm(lang['confirm'], lang['delete_report']).then((res) => {
      if (res) {
        this.alert.showSpinner(lang['spinner_deleting_report']);
        Log.l("deleteOtherReport(): User confirmed deletion, deleting...");
        let ro: ReportOther = other.clone();
        let reportDate = ro.report_date.format("YYYY-MM-DD");
        this.server.deleteDoc(this.prefs.DB.reports_other, ro).then((res) => {
          Log.l("deleteOtherReport(): Success:\n", res);
          // this.items.splice(i, 1);
          let i = this.reports.indexOf(other);
          this.reports.splice(i, 1);
          i = this.filtReports[reportDate].indexOf(other);
          this.filtReports[reportDate].splice(i, 1);
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

  addNewReportForShift(shift:Shift) {
    // this.alert.showAlert("Sorry", "This is in progress.");
    this.tabs.goToPage('Report', {mode: 'Add', shift: shift});
  }


}
