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
import { PREFS                                                  } from '../../config/config.strings'   ;
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
  numChars     : Array<string> = STRINGS.NUMCHARS ;
  public static PREFS : any              = new PREFS();
  constructor( public navCtrl: NavController      , public navParams  : NavParams         ,
               public db : DBSrvcs                , public alert      : AlertService      ,
               private auth: AuthSrvcs            , public loadingCtrl: LoadingController ,
               public server: SrvrSrvcs           , public ud         : UserData          ,
               public translate: TranslateService , public tabs       : TabsComponent     ,
               public zone: NgZone) {
    window["reporthistory"] = this;
  }

  ngOnInit() {
    Log.l("ReportHistory: ngOnInit called...");
  }

  ionViewDidEnter() {
    Log.l("ReportHistory: ionViewDidEnter called...");
    Log.l("ReportHistory: pulling reports...");
    let lang = this.translate.instant('spinner_retrieving_reports');
    this.alert.showSpinner(lang['spinner_retrieving_reports']);
    this.shifts = this.ud.getPeriodShifts();
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
      this.shifts = this.ud.getPeriodShifts();
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
      this.alert.showAlert("ERROR", "Could not connect to server. Please try again later.");
    });
  }

  itemTapped(event, item) {
    this.tabs.goToPage('WorkOrder', {mode: 'Edit', workOrder: item})
  }

  deleteWorkOrder(event, item) {
    Log.l("deleteWorkOrder() clicked ...");
    this.alert.showConfirm('CONFIRM', 'Delete this work order?').then((res) => {
      if(res) {
        Log.l("deleteWorkOrder(): User confirmed deletion, deleting...");
        let i = this.reports.indexOf(item);
        this.server.deleteDoc(PREFS.DB.reports, item).then((res) => {
          Log.l("deleteWorkOrder(): Success:\n", res);
          this.reports.splice(i, 1);
        }).catch((err) => {
          Log.l("deleteWorkOrder(): Error!");
          Log.e(err);
        });
      } else {
        Log.l("User canceled deletion.");
      }
    }).catch((err) => {
      Log.l("deleteWorkOrder(): Error!");
      Log.e(err);
    });
  }
}
