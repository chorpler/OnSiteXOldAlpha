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
import moment from 'moment';


@IonicPage({ name    : 'ReportHistory'                                          })
@Component({ selector: 'page-report-history', templateUrl: 'report-history.html' })


export class ReportHistory implements OnInit {
  public title: string = 'Reports';

  public pageReady    : boolean                              = false                                    ;
  public selectedItem : any                                                                             ;
  public items        : Array<{title: string, note: string}> = new Array<{title:string, note:string}>() ;
  public data         : any                                  = []                                       ;
  public loading      : any                                                                             ;
  public moment       : any;
  constructor( public navCtrl : NavController , public navParams  : NavParams         ,
               public dbSrvcs : DBSrvcs       , public alert      : AlertService      ,
               private auth   : AuthSrvcs     , public loadingCtrl: LoadingController ,
               public srvr    : SrvrSrvcs     , public ud         : UserData          ) {
    this.moment = moment;
    window["reporthistory"] = this;
  }

  ngOnInit() {
    let u = this.auth.getUser();
    Log.l("ReportHistory: pulling reports...");
    this.items = this.ud.getWorkOrderList();
    this.pageReady = true;
    // this.srvr.getReports(u).then(res => {
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

  showSpinner(text: string) {
    this.loading = this.loadingCtrl.create({
      content: `<ion-spinner name="bubbles">${text}</ion-spinner>`,
      showBackdrop: false,
      spinner: 'bubbles'
    });

    this.loading.present().catch(() => {});
  }

  hideSpinner() {
    setTimeout(() => {
      this.loading.dismiss().catch((reason: any) => {
        Log.l('WorkOrder: loading.dismiss() error:\n', reason);
        this.loading.dismissAll();
      });
    });
  }

  itemTapped(event, item) {
    // this.navCtrl.setRoot('Report Edit', { item: item });
    this.navCtrl.setRoot('WorkOrder', { mode: 'Edit', workOrder: item });
  }

  deleteWorkOrder(event, item) {
    Log.l("deleteWorkOrder() clicked ...");
    this.alert.showConfirm('CONFIRM', 'Delete this work order?').then((res) => {
      if(res) {
        Log.l("deleteWorkOrder(): User confirmed deletion, deleting...");
        let i = this.items.indexOf(item);
        this.srvr.deleteDoc('reports', item).then((res) => {
          Log.l("deleteWorkOrder(): Success:\n", res);
          this.items.splice(i, 1);
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
