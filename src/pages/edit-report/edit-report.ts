import { Component, OnInit, ViewChild                                            } from '@angular/core'                     ;
import { FormGroup, FormControl, Validators                                      } from "@angular/forms"                    ;
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular'                     ;
import { DBSrvcs                                                                 } from '../../providers/db-srvcs'          ;
import { SrvrSrvcs                                                               } from '../../providers/srvr-srvcs'        ;
import { AuthSrvcs                                                               } from '../../providers/auth-srvcs'        ;
import { UserData                                                                } from '../../providers/user-data'         ;
import { WorkOrder                                                               } from '../../domain/workorder'            ;
import { Shift                                                                   } from '../../domain/shift'                ;
import { TimeSrvc                                                                } from '../../providers/time-parse-srvc'   ;
import { ReportBuildSrvc                                                         } from '../../providers/report-build-srvc' ;
import * as moment                                                                 from 'moment'                            ;
import { Log                                                                     } from '../../config/config.functions'     ;
import { PREFS                                                               } from '../../config/config.strings'       ;
import { TabsComponent                                                           } from '../../components/tabs/tabs'        ;

@IonicPage({ name    : 'Report Edit'                                       })
@Component({ selector: 'page-edit-report', templateUrl: 'edit-report.html' })

export class EditReport implements OnInit {
  title         : string      = 'Report Edit'          ;
  syncError     : boolean     = false                  ;
  workOrderForm : FormGroup                            ;
  workOrder     : WorkOrder                            ;
  mode          : string      = 'Edit'                 ;
  setDate       : Date        = new Date()             ;
  loading       : any         = {}                     ;


  constructor(public navCtrl          : NavController,
              public navParams        : NavParams,
              private dbSrvcs         : DBSrvcs,
              private srvr            : SrvrSrvcs,
              private timeSrvc        : TimeSrvc,
              public reportBuilder    : ReportBuildSrvc,
              public loadingCtrl      : LoadingController,
              private alertCtrl       : AlertController,
              public tabs             : TabsComponent )  { window['editreport'] = this; }

  ngOnInit() {
    if (this.navParams.get('mode') !== undefined) { this.mode = this.navParams.get('mode'); }
    this.workOrder = this.navParams.get('item');
    let h = this.workOrder.repair_hours;
    this.initializeForm();
  }

  ionViewDidLoad() { console.log('ionViewDidLoad EditReportPage'); }

  // goBack() {
  //   Log.l("Home button tapped.");
  //   this.navCtrl.setRoot('OnSiteHome');
  // }

  initializeForm() {
    this.workOrderForm = new FormGroup({
      'timeStarts': new FormControl(this.workOrder.time_start, Validators.required),
      'timeEnds'  : new FormControl(this.workOrder.time_end, Validators.required),
      'repairHrs' : new FormControl(this.workOrder.repair_hours, Validators.required),
      'uNum'      : new FormControl(this.workOrder.unit_number, Validators.required),
      'wONum'     : new FormControl(this.workOrder.work_order_number, Validators.required),
      'notes'     : new FormControl(this.workOrder.notes, Validators.required),
      'rprtDate'  : new FormControl(this.workOrder.report_date, Validators.required),
      'timeStamp' : new FormControl({ value: this.workOrder.timestamp, disabled: true}, Validators.required)
    });
  }

  showSpinner(text: string) {
    this.loading = this.loadingCtrl.create({
      content: text,
      showBackdrop: false,
    });

    this.loading.present().catch(() => {});
  }

  hideSpinner() {
    setTimeout(() => {
      this.loading.dismiss().catch((reason: any) => {
        Log.l('EditReport: loading.dismiss() error:\n', reason);
        this.loading.dismissAll();
      });
    });
  }

  showConfirm(title: string, text: string) {
    return new Promise((resolve,reject) => {
      let alert = this.alertCtrl.create({
        title: title,
        message: text,
        buttons: [
          {text: 'Cancel', handler: () => {Log.l("Cancel clicked."); resolve(false);}},
          {text: 'OK'    , handler: () => {Log.l("OK clicked."    ); resolve(true );}}
        ]
      });
      alert.present();
    });
  }

  updateWorkOrder() {
    const WO = this.workOrderForm.getRawValue();
    Log.l("updateWorkOrder(): Form is:\n",WO);
    this.workOrder.time_start        = WO.time_start       ; 
    this.workOrder.time_end          = WO.time_end         ; 
    this.workOrder.repair_hours      = WO.repair_hours     ; 
    this.workOrder.unit_number       = WO.unit_number      ; 
    this.workOrder.work_order_number = WO.work_order_number; 
    this.workOrder.notes             = WO.notes            ; 
    this.workOrder.report_date       = WO.report_date      ; 
    this.workOrder.timestamp         = WO.timestamp        ; 
    Log.l("updateWorkOrder(): About to call calcEndTime()");

    // this.timeSrvc.calcEndTime(this.workOrder);
    Log.l("updateWorkOrder(): Updated Work Order is:\n", this.workOrder);
  }

  deleteWorkOrder() {
    Log.l("deleteWorkOrder() clicked ...");
    this.showConfirm('CONFIRM', 'Delete this work order?').then((res) => {
      Log.l("deleteWorkOrder(): Success:\n", res);
      if(res) {
        Log.l("deleteWorkOrder(): User confirmed deletion, deleting...");
        this.srvr.deleteDoc(PREFS.DB.reports, this.workOrder).then((res) => {
          Log.l("deleteWorkOrder(): Success:\n", res);
          this.tabs.goHome();
          setTimeout(() => {this.navCtrl.setRoot('OnSiteHome')});
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

  onSubmit() {
    this.updateWorkOrder();
    Log.l("Edited Report submitting...\n", this.workOrder);
    this.showSpinner("Saving...");
    this.srvr.updateDoc(this.workOrder).then((res) => {
      Log.l("Successfully submitted updated report.");
      this.hideSpinner();
      setTimeout(() => {this.navCtrl.setRoot('OnSiteHome');});
    }).catch((err) => {
      Log.l("Error saving updated report.");
      this.hideSpinner();
      /* Display error */
      Log.e(err);
    });
  }

}
