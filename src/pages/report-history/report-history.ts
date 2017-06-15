import { Component, OnInit                                      } from '@angular/core'                 ;
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular'                 ;
import { DBSrvcs                                                } from '../../providers/db-srvcs'      ;
import { AuthSrvcs                                              } from '../../providers/auth-srvcs'    ;
import { SrvrSrvcs                                              } from '../../providers/srvr-srvcs'    ;
import { UserData                                               } from '../../providers/user-data'     ;
import { AlertService                                           } from '../../providers/alerts'        ;
import { Log, CONSOLE                                           } from '../../config/config.functions' ;
import { WorkOrder                                              } from '../../domain/workorder'        ;
import { Shift                                                  } from '../../domain/shift'            ;
import { PREFS                                              } from '../../config/config.strings'   ;
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment';


@IonicPage({ name    : 'ReportHistory'                                          })
@Component({ selector: 'page-report-history', templateUrl: 'report-history.html' })


export class ReportHistory implements OnInit {
  public title: string = 'Reports';

  public pageReady    : boolean                              = false                                    ;
  public selectedItem : any                                                                             ;
  // public items        : Array<{title: string, note: string}> = new Array<{title:string, note:string}>() ;
  public items        : Array<{title: string, note: string}> = new Array<{title:string, note:string}>() ;
  public reports      : Array<WorkOrder> = [];
  public data         : any                                  = []                                       ;
  public loading      : any                                                                             ;
  public moment       : any;
  constructor( public navCtrl : NavController , public navParams  : NavParams         ,
               public db : DBSrvcs       , public alert      : AlertService      ,
               private auth   : AuthSrvcs     , public loadingCtrl: LoadingController ,
               public server    : SrvrSrvcs     , public ud         : UserData,
               public translate: TranslateService          ) {
    this.moment = moment;
    window["reporthistory"] = this;
  }

  ngOnInit() {
    Log.l("ReportHistory: pulling reports...");
    this.reports = this.ud.getWorkOrderList();
    // this.items = this.ud.getWorkOrderList();
    this.pageReady = true;
    let u = this.ud.getUsername();
    this.alert.showSpinner("Retrieving reports...");
    this.server.getReportsForTech(u).then((res) => {
      Log.l("ReportHistory: Got report list:\n", res);
      this.reports = res;
      this.alert.hideSpinner();
      this.pageReady = true;
    }).catch((err) => {
      Log.l("ReportHistory: Error getting report list.");
      Log.e(err);
      this.alert.hideSpinner();
      this.alert.showAlert("ERROR", "Could not connect to server. Please try again later.");
    });
    // this.server.getReports(u).then(res => {
    //   Log.l("ReportHistory: Got report list:\n",res);
    //   this.data = res;
    //   this.items = [];
    //   for(let i = this.data.length - 1; i >= 0; i--) { this.items.push(this.data[i]); }
    //   this.selectedItem = this.navParams.get('item');
    //   Log.l("ReportHistory: pulled data:\n", this.items);
    //   this.hideSpinner();
    //   this.pageReady = true;
    // }).catch((err) => {
    //   Log.l("Error while getting reports from server.");
    //   Log.l(err);
    //   this.hideSpinner();
    //   this.pageReady = true;
    // });
  }

  goBack() {
    Log.l("Home button tapped.");
    this.navCtrl.setRoot('OnSiteHome');
  }

  itemTapped(event, item) {
    // this.navCtrl.setRoot('Report Edit', { item: item });
    // this.navCtrl.setRoot('WorkOrder', { mode: 'Edit', workOrder: item });
    this.navCtrl.push('WorkOrder', {mode: 'Edit', workOrder: item})
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
