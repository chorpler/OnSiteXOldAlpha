import { Component, OnInit, ViewChild                           } from '@angular/core'                     ;
import { FormGroup, FormControl, Validators                     } from "@angular/forms"                    ;
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular'                     ;
import { DBSrvcs                                                } from '../../providers/db-srvcs'          ;
import { AuthSrvcs                                              } from '../../providers/auth-srvcs'        ;
import { TimeSrvc                                               } from '../../providers/time-parse-srvc'   ;
import { ReportBuildSrvc                                        } from '../../providers/report-build-srvc' ;
import * as moment                                                from 'moment'                            ;
import { Log, CONSOLE                                           } from '../../config/config.functions'     ;

@IonicPage({ name    : 'Report Edit'                                       })
@Component({ selector: 'page-edit-report', templateUrl: 'edit-report.html' })


export class EditReportPage implements OnInit {
  title         : string      = 'Report Edit'          ;
  syncError     : boolean     = false                  ;
  workOrderForm : FormGroup                            ;
  workOrder     : any         = {}                     ;
  mode          : string      = 'Edit'                 ;
  setDate       : Date        = new Date()             ;


  constructor(public navCtrl: NavController, public navParams: NavParams, private dbSrvcs: DBSrvcs, private timeSrvc: TimeSrvc, public reportBuilder:ReportBuildSrvc, public loadingCtrl: LoadingController) {
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

  onSubmit() {
  	Log.l("Nah, it's coo', it's coo'.");
  }

}
