import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular'                     ;
import { DBSrvcs } from '../../providers/db-srvcs';
import { AuthSrvcs                           } from '../../providers/auth-srvcs'    ;
import { SrvrSrvcs                           } from '../../providers/srvr-srvcs'    ;
import { Log, CONSOLE                        } from '../../config/config.functions' ;


@IonicPage({ name    : 'Reports'                                                 })
@Component({ selector: 'page-report-history', templateUrl: 'report-history.html' })


export class ReportHistoryPage implements OnInit {
  public title: string = 'Reports';

  public selectedItem : any                                  ;
  public items        : Array<{title: string, note: string}> ;
  public data         : any = []                             ;
  public loading      : any                                  ;

  constructor(public navCtrl: NavController, public navParams: NavParams, public dbSrvcs: DBSrvcs, public srvr: SrvrSrvcs, private auth: AuthSrvcs, public loadingCtrl: LoadingController) {
    window["reporthistory"] = this;
  }

  ngOnInit() {
    let u = this.auth.getUser();
    // let p = this.auth.getPass();
    Log.l("ReportHistory: pulling reports...");
    this.showSpinner('Retrieving reports...');
    this.srvr.getReports(u).then(res => {
      Log.l("ReportHistory: Got report list:\n",res);
      this.data = res;
      this.items = [];
      // for(let i = this.data.length - 1; i >= 0; i--) { this.items[i] = { title: this.data[i].rprtDate, note: this.data[i].uNum }; }
      for(let i = this.data.length - 1; i >= 0; i--) { this.items.push(this.data[i]); }
      // If we navigated to this page, we will have an item available as a nav param
      this.selectedItem = this.navParams.get('item');
      Log.l("ReportHistory: pulled data:\n", this.items);
      this.hideSpinner();
    }).catch((err) => {
      Log.l("Error while getting reports from server.");
      Log.l(err);
      this.hideSpinner();
    });
  }_

  showSpinner(text: string) {
    this.loading = this.loadingCtrl.create({
      content: `<ion-spinner name="bubbles">${text}</ion-spinner>`,
      showBackdrop: false,
      spinner: 'bubbles'
      // dismissOnPageChange: true
    });

    // this.loading.onDidDismiss(() => {
    //   Log.l("Spinner dismissed.");
    // })

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

  itemTapped(event, item) { this.navCtrl.push('Report Edit', {  item: item }); }

}
