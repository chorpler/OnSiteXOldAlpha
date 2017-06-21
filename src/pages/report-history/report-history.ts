import { Component, OnInit, ChangeDetectionStrategy, NgZone     } from '@angular/core'                 ;
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular'                 ;
import { DBSrvcs                                                } from '../../providers/db-srvcs'      ;
import { AuthSrvcs                                              } from '../../providers/auth-srvcs'    ;
import { SrvrSrvcs                                              } from '../../providers/srvr-srvcs'    ;
import { UserData                                               } from '../../providers/user-data'     ;
import { AlertService                                           } from '../../providers/alerts'        ;
import { Log, isMoment                                          } from '../../config/config.functions' ;
import { WorkOrder                                              } from '../../domain/workorder'        ;
import { Shift                                                  } from '../../domain/shift'            ;
import { Preferences                                            } from '../../providers/preferences'   ;
import { TranslateService                                       } from '@ngx-translate/core'           ;
import { TabsComponent                                          } from '../../components/tabs/tabs'    ;
import { OrderBy                                                } from '../../pipes/pipes'             ;
import moment from 'moment';
import { STRINGS                                                } from '../../config/config.strings'   ;


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
  public reports      : Array<WorkOrder>                                                                ;
  public shifts       : Array<Shift>                                                                    ;
  public filtReports  : any                                                                             ;
  public filterKeys   : Array<string>                                                                   ;
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
               public zone     : NgZone,
  ) {
    window["reporthistory"] = this;
  }

  ngOnInit() {
    Log.l("ReportHistory: ngOnInit called...");
  }

  ionViewDidEnter() {
    Log.l("ReportHistory: ionViewDidEnter called...");
    Log.l("ReportHistory: pulling reports...");
    if(this.navParams.get('shift') !== undefined) { this.shiftToUse = this.navParams.get('shift');}
    let lang = this.translate.instant(['spinner_retrieving_reports', 'error', 'error_server_connect_message']);
    this.alert.showSpinner(lang['spinner_retrieving_reports']);
    if(this.shiftToUse !== null) {
      Log.l("ReportHistory: Showing only shift:\n", this.shiftToUse);
      this.shifts = [this.shiftToUse];
    } else {
      Log.l("ReportHistory: Showing all shifts.");
      this.shifts = this.ud.getPeriodShifts();
    }
    this.filterKeys = [];
    for(let shift of this.shifts) {
      let date = shift.getStartTime().format("YYYY-MM-DD");
      this.filterKeys.push(date);
    }
    // this.reports = this.ud.getWorkOrderList();
    // this.pageReady = true;
    let u = this.ud.getUsername();
    let sortReports = function(a,b) {
      let startA = a['time_start'];
      let startB = b['time_start'];
      if (isMoment(a) && isMoment(b)) {
        let val = moment(a).isBefore(moment(b)) ? -1 : moment(a).isAfter(moment(b)) ? 1 : 0;
        return val;
      } else {
        return 0;
      }
    }
    this.server.getReportsForTech(u).then((res) => {
      Log.l("ReportHistory: Got report list:\n", res);
      let unsortedReports = res;
      this.reports = unsortedReports.sort(sortReports);
      if (this.shiftToUse !== null) {
        Log.l("ReportHistory: Showing only shift:\n", this.shiftToUse);
        this.shifts = [this.shiftToUse];
      } else {
        Log.l("ReportHistory: Showing all shifts.");
        this.shifts = this.ud.getPeriodShifts();
      }
      this.filtReports = {};
      for(let shift of this.shifts) {
        let date = shift.getStartTime().format("YYYY-MM-DD");
        this.filterKeys.push(date);
        let serial = shift.getShiftSerial();
        let oneReportSet = this.ud.getWorkOrdersForShift(serial);
        this.filtReports[date] = oneReportSet;
      }
      Log.l("ReportHistory: created date-sorted report list:\n", this.filtReports);
      this.alert.hideSpinner();
      this.zone.run(() => { this.pageReady = true; });
    }).catch((err) => {
      Log.l("ReportHistory: Error getting report list.");
      Log.e(err);
      this.alert.hideSpinner();
      this.alert.showAlert(lang['error'], lang['error_server_connect_message']);
    });
  }

  itemTapped(event, item) {
    this.tabs.goToPage('Report', {mode: 'Edit', workOrder: item})
  }

  deleteWorkOrder(event, item) {
    Log.l("deleteWorkOrder() clicked ...");
    let lang = this.translate.instant(['confirm', 'delete_report', 'spinner_deleting_report', 'error', 'error_deleting_report_message']);
    this.alert.showConfirm(lang['confirm'], lang['delete_report']).then((res) => {
      if (res) {
        this.alert.showSpinner(lang['spinner_deleting_report']);
        Log.l("deleteWorkOrder(): User confirmed deletion, deleting...");
        let wo = item.clone();
        // let woList = this.ud.getWorkOrderList();
        let woList = this.reports;
        let i = woList.indexOf(item);
        this.server.deleteDoc(this.prefs.DB.reports, wo).then((res) => {
          Log.l("deleteWorkOrder(): Success:\n", res);
          // this.items.splice(i, 1);
          woList.splice(i, 1);
          // if (this.mode === 'Add') {
          //   this.alert.hideSpinner();
          //   this.tabs.goToPage('OnSiteHome');
          // } else {
          //   this.alert.hideSpinner();
          //   this.tabs.goToPage('ReportHistory');
          // }
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

  addNewReportForShift(shift:Shift) {
    // this.alert.showAlert("Sorry", "This is in progress.");
    this.tabs.goToPage('Report', {mode: 'Add', shift: shift});
  }


}
