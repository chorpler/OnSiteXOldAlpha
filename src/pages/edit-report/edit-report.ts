import { Component, OnInit, ViewChild                                            } from '@angular/core'                     ;
import { FormGroup, FormControl, Validators                                      } from "@angular/forms"                    ;
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular'                     ;
import { DBSrvcs                                                                 } from '../../providers/db-srvcs'          ;
import { AuthSrvcs                                                               } from '../../providers/auth-srvcs'        ;
import { TimeSrvc                                                                } from '../../providers/time-parse-srvc'   ;
import { ReportBuildSrvc                                                         } from '../../providers/report-build-srvc' ;
import * as moment                                                                 from 'moment'                            ;
import { Log, CONSOLE                                                            } from '../../config/config.functions'     ;

@IonicPage({ name    : 'Report Edit'                                       })
@Component({ selector: 'page-edit-report', templateUrl: 'edit-report.html' })

export class EditReportPage implements OnInit {
  title         : string      = 'Report Edit'          ;
  syncError     : boolean     = false                  ;
  workOrderForm : FormGroup                            ;
  workOrder     : any         = {}                     ;
  mode          : string      = 'Edit'                 ;
  setDate       : Date        = new Date()             ;
  loading       : any         = {}                     ;


  constructor(public navCtrl: NavController, public navParams: NavParams, private dbSrvcs: DBSrvcs, private timeSrvc: TimeSrvc, public reportBuilder:ReportBuildSrvc, public loadingCtrl: LoadingController, private alertCtrl: AlertController) {
  	window['editreport'] = this;
  }

  ngOnInit() {
    if (this.navParams.get('mode') !== undefined) { this.mode = this.navParams.get('mode'); }
    this.workOrder = this.navParams.get('item');
    this.initializeForm();
  }

  ionViewDidLoad() { console.log('ionViewDidLoad EditReportPage'); }

  initializeForm() {
    this.workOrderForm = new FormGroup({
      'timeStarts': new FormControl(this.workOrder.startTime, Validators.required),
      'timeEnds'  : new FormControl(this.workOrder.timeEnds, Validators.required),
      'repairHrs' : new FormControl(this.workOrder.repairHrs, Validators.required),
      'uNum'      : new FormControl(this.workOrder.uNum, Validators.required),
      'wONum'     : new FormControl(this.workOrder.wONum, Validators.required),
      'notes'     : new FormControl(this.workOrder.notes, Validators.required),
      'rprtDate'  : new FormControl(this.workOrder.rprtDate, Validators.required),
      'timeStamp' : new FormControl({ value: this.workOrder.timeStamp, disabled: true}, Validators.required)
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
	  			{text: 'OK', handler: () => {Log.l("OK clicked."); resolve(true);}}
	  		]
	  	});
	  	alert.present();
	  });
  }

  updateWorkOrder() {
  	const WO = this.workOrderForm.getRawValue();
  	Log.l("updateWorkOrder(): Form is:\n",WO);
  	this.workOrder.timeStarts = WO.timeStarts ;
  	this.workOrder.timeEnds   = WO.timeEnds   ;
  	this.workOrder.repairHrs  = WO.repairHrs  ;
  	this.workOrder.uNum       = WO.uNum       ;
  	this.workOrder.wONum      = WO.wONum      ;
  	this.workOrder.notes      = WO.notes      ;
  	this.workOrder.rprtDate   = WO.rprtDate   ;
  	this.workOrder.timeStamp  = WO.timeStamp  ;
  	Log.l("updateWorkOrder(): Updated Work Order is:\n", this.workOrder);
  }

  deleteWorkOrder() {
  	Log.l("deleteWorkOrder() clicked ...");
  	this.showConfirm('CONFIRM', 'Delete this work order?').then((res) => {
  		Log.l("deleteWorkOrder(): Success:\n", res);
  		if(res) {
  			Log.l("deleteWorkOrder(): User confirmed deletion, deleting...");
		  	this.dbSrvcs.deleteDoc(this.workOrder).then((res) => {
		  		Log.l("deleteWorkOrder(): Success:\n", res);
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
  	this.dbSrvcs.updateReport(this.workOrder).then((res) => {
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
