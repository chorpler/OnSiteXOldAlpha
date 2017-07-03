import { Component, OnInit, ViewChild, NgZone                  } from '@angular/core'                     ;
import { FormsModule, ReactiveFormsModule                      } from "@angular/forms"                    ;
import { FormBuilder, FormGroup, FormControl, Validators       } from "@angular/forms"                    ;
import { IonicPage, NavController, NavParams                   } from 'ionic-angular'                     ;
import { LoadingController, PopoverController, ModalController } from 'ionic-angular'                     ;
import { DBSrvcs                                               } from '../../providers/db-srvcs'          ;
import { SrvrSrvcs                                             } from '../../providers/srvr-srvcs'        ;
import { AuthSrvcs                                             } from '../../providers/auth-srvcs'        ;
import { TimeSrvc                                              } from '../../providers/time-parse-srvc'   ;
import { ReportBuildSrvc                                       } from '../../providers/report-build-srvc' ;
import { AlertService                                          } from '../../providers/alerts'            ;
import { Log                                                   } from '../../config/config.functions'     ;
import { PayrollPeriod                                         } from '../../domain/payroll-period'       ;
import { Shift                                                 } from '../../domain/shift'                ;
import { WorkOrder                                             } from '../../domain/workorder'            ;
import { Status                                                } from '../../providers/status'            ;
import { UserData                                              } from '../../providers/user-data'         ;
import { sprintf                                               } from 'sprintf-js'                        ;
import { STRINGS                                               } from '../../config/config.strings'       ;
import { Preferences                                           } from '../../providers/preferences'       ;
import { TabsComponent                                         } from '../../components/tabs/tabs'        ;
import { TranslateService                                      } from '@ngx-translate/core'               ;
import { REPORTTYPE, TRAININGTYPE, JOBSITES                    } from '../../config/report.object'        ;
import * as moment from 'moment'                                                                          ;
import 'rxjs/add/operator/debounceTime'                                                                   ;


@IonicPage({
  name: 'Report'
})
@Component({
  selector: 'page-report',
  templateUrl: 'report.html'
})

export class ReportPage implements OnInit {
  title                     : string           = 'Work Report'              ;
  static PREFS              : any              = new Preferences()          ;
  prefs                     : any              = ReportPage.PREFS           ;
  setDate                   : Date             = new Date()                 ;
  year                      : number           = this.setDate.getFullYear() ;
  mode                      : string           = 'Add'                      ;
  workOrderForm             : FormGroup                                     ;
  workOrder                 : any                                           ;
  workOrderReport           : any                                           ;
  repairHrs                 : any                                           ;
  profile                   : any              = {}                         ;
  tmpReportData             : any                                           ;
  techProfile               : any                                           ;
  docID                     : string                                        ;
  idDate                    : string                                        ;
  idTime                    : string                                        ;
  payrollPeriods            : Array<PayrollPeriod>                          ;
  shifts                    : Array<Shift>                                  ;
  period                    : PayrollPeriod                                 ;
  selectedShift             : Shift                                         ;
  currentDay                : any                                           ;
  shiftsStart               : any                                           ;
  shifter                   : any                                           ;
  repairTime                : any                                           ;
  thisWorkOrderContribution : number           = 0                          ;
  shiftTotalHours           : any              = 0                          ;
  payrollPeriodHours        : any              = 0                          ;
  currentRepairHours        : number           = 0                          ;
  shiftHoursColor           : string           = "black"                    ;
  shiftToUse                : Shift            = null                       ;
  shiftSavedHours           : number           = 0                          ;
  rprtDate                  : any                                           ;
  timeStarts                : any                                           ;
  reportDate                : any                                           ;
  startTime                 : any                                           ;
  timeEnds                  : any                                           ;
  syncError                 : boolean          = false                      ;
  chooseHours               : any                                           ;
  chooseMins                : any                                           ;
  loading                   : any              = {}                         ;
  _startDate                : any                                           ;
  _startTime                : any                                           ;
  _endTime                  : any                                           ;
  _repairHours              : any                                           ;
  _shift                    : any                                           ;
  _selected_shift           : any                                           ;
  _notes                    : any                                           ;
  userdata                  : any                                           ;
  shiftDateOptions          : any                                           ;
  dataReady                 : boolean          = false                      ;
  techWorkOrders            : Array<WorkOrder> = []                         ;
  shiftDateInputDisabled    : boolean          = true                       ;
  shiftDateInput2Disabled   : boolean          = false                      ;
  selectedShiftText         : string           = ""                         ;
  workOrderList             : any                                           ;
  filteredWOList            : any                                           ;
  selReportType             : string[] = REPORTTYPE                         ;
  type                      : string                                        ;
  _type                     : any                                           ;
  selTrainingType           : string[] = TRAININGTYPE                       ;
  trngType                  : string = ""                                   ;
  _trngType                 : any                                           ;
  _training_time            : any                                           ;
  selTrvlLoc                : string[] = JOBSITES                           ;
  _trvlLoc                  : any                                           ;
  trvlLoc                   : string = ""                                   ;
  _trvlTime                 : any                                           ;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private db: DBSrvcs,
    public server: SrvrSrvcs,
    private timeSrvc: TimeSrvc,
    public reportBuilder: ReportBuildSrvc,
    public loadingCtrl: LoadingController,
    public alert: AlertService,
    public modal: ModalController,
    public zone: NgZone,
    public tabs: TabsComponent,
    public ud: UserData,
    public translate: TranslateService) {
    this.shifter = Shift;
    this.userdata = UserData;
    window["workorder"] = this;
  }

  ionViewDidLoad() { console.log('ionViewDidLoad ReportPage'); }

  ngOnInit() {
    Log.l("Report.ngOnInit(): navParams are:\n", this.navParams);
    if (this.navParams.get('mode') !== undefined) { this.mode = this.navParams.get('mode'); }
    if (this.navParams.get('workOrder') !== undefined) { this.workOrder = this.navParams.get('workOrder'); }
    if (this.navParams.get('shift') !== undefined) { this.shiftToUse = this.navParams.get('shift'); }
    if (this.navParams.get('payroll_period') !== undefined) { this.period = this.navParams.get('payroll_period'); }
    if(this.shiftToUse !== null) {
      this.selectedShift = this.shiftToUse;
    }
    let mode = this.mode.toLowerCase();
    let titleStrings = this.translate.instant([mode, 'report']);
    let titleAdjective = titleStrings[mode];
    let titleNoun = titleStrings['report'];
    this.title = `${titleAdjective} ${titleNoun}`;

    this.chooseHours = [
      { "name": "Hours", "options": [], "header": "H", "headerWidth": "20px", "columnWidth": "72px"},
      { "name": "Minutes", "options": [], "header": "M", "headerWidth": "20px", "columnWidth": "72px" }
    ]

    for (let i = 0; i < 100; i++) {
      let j = sprintf("%02d", i);
      let o1 = { 'text': j, 'value': j };
      this.chooseHours[0].options.push(o1);
    }
    let o1 = { 'text': '00', 'value': '00' };
    this.chooseHours[1].options.push({ 'text': '00', 'value': '00' });
    this.chooseHours[1].options.push({ 'text': '30', 'value': '30' });

    this.shifts = [];
    this.db.getTechProfile().then((res) => {
      Log.l(`ReportPage: Success getting tech profile! Result:\n`, res);
      this.techProfile = res;
      if (this.mode === 'Add') {
        this.workOrder = new WorkOrder();
      }
      this.setupShifts();
      this.updateActiveShiftWorkOrders(this.selectedShift);
      if (this.mode === 'Add') {
        let startTime = moment(this.selectedShift.start_time);
        let addTime = this.selectedShift.getShiftHours();
        let newStartTime = moment(startTime).add(addTime, 'hours');
        Log.l("ReportPage: Now setting work order start time. Start Time = %s, adding %f hours, gives:\n", startTime.format(), addTime, newStartTime);
        this.workOrder.setStartTime(newStartTime);
      } else {

      }
      this.thisWorkOrderContribution = this.workOrder.getRepairHours() || 0;
      this.initializeForm();
      this._type          = this.workOrderForm.controls['type'          ] ;
      this._trngType      = this.workOrderForm.controls['trnType'       ] ;
      this._training_time = this.workOrderForm.controls['training_time' ] ;
      this._trvlLoc       = this.workOrderForm.controls['trvlLoc'       ] ;
      this._trvlTime      = this.workOrderForm.controls['trvlTime'      ] ;

      this._endTime = this.workOrderForm.controls.endTime;
      this._repairHours = this.workOrderForm.controls.repair_time;
      this._selected_shift = this.workOrderForm.controls.selected_shift;
      this._notes = this.workOrderForm.controls.notes;

      this._type.valueChanges.subscribe((value: any) => { this.type = value; });
      this._trngType.valueChanges.subscribe((value: any) => {
        this.trngType = value;
        let time =  value === 'SAFETY'         ? 2  :
                    value === 'PEC'            ? 8  :
                    value === 'FORKLIFT'       ? 3  :
                    value === 'OVERHEAD CRANE' ? 10 : 0;
        this._training_time.setValue(time);
      });
      this._trvlLoc.valueChanges.subscribe((value: any) => {
        this.trvlLoc = value;
        let trvl =  value === 'BE MDL MNSHOP'         ? 6  :
                    value === 'HB FORT LUPTON MNSHOP' ? 20 :
                    value === 'HB ART PMPSHP'         ? 8  :
                    value === 'HB BRN E-TECH'         ? 8  :
                    value === 'HB BRN MNSHOP'         ? 8  :
                    value === 'HB BRN PMPSHP'         ? 0  :
                    value === 'HB DCN MNSHOP'         ? 8  :
                    value === 'HB DCN PMPSHP'         ? 8  :
                    value === 'HB ODS E-TECH'         ? 6  :
                    value === 'HB ODS MNSHOP'         ? 0  :
                    value === 'HB RSP MNSHOP'         ? 18 :
                    value === 'HB SAN MNSHOP'         ? 0  :
                    value === 'KN MHL MNSHOP'         ? 0  :
                    value === 'KN ODS MNSHOP'         ? 0  :
                    value === 'KN SHN MNSHOP'         ? 8  :
                    value === 'KN SPR E-TECH'         ? 6  :
                    value === 'KN SPR MNSHOP'         ? 6  :
                    value === 'SE WES MNSHOP'         ? 0  : 0;
        this._trvlTime.setValue(trvl);
      });
      this._training_time.valueChanges.subscribe((value: any) => { this.workOrder.training_time = value; });
      this.workOrderForm.valueChanges.debounceTime(500).subscribe((value: any) => {
        Log.l("workOrderForm: valueChanges fired for:\n", value);
        let notes = value.notes;
        let unit = value.uNum;
        let woNum = value.woNum;
        let fields = [['notes', 'notes'], ['wONum', 'work_order_number'], ['uNum', 'unit_number']];
        let len = fields.length;
        for (let i = 0; i < len; i++) {
          let key1 = fields[i][0];
          let key2 = fields[i][1];
          if (value[key1] !== null && value[key1] !== undefined) {
            this.workOrder[key2] = value[key1];
          }
        }
        Log.l("workOrderForm: overall valueChanges, ended up with work order:\n", this.workOrder);
      });
      this._repairHours.valueChanges.subscribe((hours: any) => {
        Log.l("workOrderForm: valueChanges fired for repair_hours: ", hours);
        let dur1 = hours.split(":");
        let hrs = Number(dur1[0]);
        let min = Number(dur1[1]);
        let iDur = hrs + (min / 60);
        this.currentRepairHours = iDur;
        let total = this.selectedShift.getNormalHours() + this.currentRepairHours - this.thisWorkOrderContribution;
        Log.l("ReportForm: currentRepairHours changed to %s:%s, value %f, so total is now %f", hrs, min, iDur, total);
        this.workOrder.setRepairHours(iDur);
        if (this.selectedShift !== undefined && this.selectedShift !== null) {
          this.shiftHoursColor = this.getShiftHoursStatus(this.selectedShift);
        } else {
          this.shiftHoursColor = this.getShiftHoursStatus(this.shifts[0]);
        }
      })
      this._selected_shift.valueChanges.subscribe((shift: any) => {
        Log.l("workOrderForm: valueChanges fired for selected_shift:\n", shift);
        let ss = shift;
        this.updateActiveShiftWorkOrders(shift);
        let rprtDate = moment(shift.getStartTime());
        let woHoursSoFar = shift.getShiftHours();
        let woStart = moment(shift.getStartTime()).add(woHoursSoFar, 'hours');
        this.workOrder.setStartTime(woStart);

        this.workOrderForm.controls.rprtDate.setValue(rprtDate.format("YYYY-MM-DD"));
      });
      this.shiftSavedHours = this.selectedShift.getNormalHours();
      this.dataReady = true;
    }).catch((err) => {
      Log.l(`ReportPage: Error getting tech profile!`);
      Log.e(err);
    });
  }

  private initializeForm() {
    let wo = this.workOrder;
    let ts, rprtDate;
    if (this.mode == 'Add') {
      rprtDate = moment(this.selectedShift.getStartTime());
      ts = moment().format();
    } else {
      rprtDate = moment(wo.rprtDate);
    }
    ts = moment().format();
    this.currentRepairHours = wo.getRepairHours();
    this.workOrderForm = new FormGroup({
      'selected_shift' : new FormControl(this.selectedShift                , Validators.required) ,
      'repair_time'    : new FormControl(wo.getRepairHoursString()         , Validators.required) ,
      'uNum'           : new FormControl(wo.unit_number                    , Validators.required) ,
      'wONum'          : new FormControl(wo.work_order_number              , Validators.required) ,
      'notes'          : new FormControl(wo.notes                          , Validators.required) ,
      'rprtDate'       : new FormControl(rprtDate.format("YYYY-MM-DD")     , Validators.required) ,
      'timeStamp'      : new FormControl({ value: ts, disabled: true }     , Validators.required) ,
      'type'           : new FormControl(wo.type                           , Validators.required) ,
      'trnType'        : new FormControl(wo.trnType                        , Validators.required) ,
      'training_time'  : new FormControl( 2                                , Validators.required) ,
      'trvlLoc'        : new FormControl( wo.trvlLoc                       , Validators.required) ,
      'trvlTime'       : new FormControl( 6                                , Validators.required) ,
    });
  }

  public updateActiveShiftWorkOrders(shift: Shift) {
    let ss = shift;
    let shift_time = moment(ss.start_time);
    let shift_serial = ss.getShiftSerial();
    let payroll_period = ss.getPayrollPeriod();
    this.workOrder.shift_serial = shift_serial;
    this.workOrder.payroll_period = payroll_period;
    Log.l("workOrderForm: setting shift_serial to: ", shift_serial);
    let shiftHours = this.techProfile.shiftLength;
    let shiftStartsAt = this.techProfile.shiftStartTime;
    this.shiftHoursColor = this.getShiftHoursStatus(ss);
    this.selectedShift = shift;
  }

  public setupWorkOrderList() {
    let tmpWOL = new Array<WorkOrder>();
    if (this.ud.woArrayInitialized) {
      tmpWOL = this.ud.getWorkOrderList();
    }
    this.workOrderList = tmpWOL;
    Log.l("setupWorkOrderList(): Got work order list:\n", tmpWOL);
  }

  setupShifts() {
    let endDay = 2;

    this.payrollPeriods = this.ud.getPayrollPeriods();
    if(this.period) {
      for(let pp of this.payrollPeriods) {
        if(this.period === pp) {
          this.shifts = pp.getPayrollShifts();
        }
      }
    } else {
      this.period = this.payrollPeriods[0];
      this.shifts = this.period.getPayrollShifts();
    }
    if (this.mode === 'Add') {
      if(this.shiftToUse !== null) {
        this.selectedShift = this.shiftToUse;
      } else {
        this.selectedShift = this.shifts[0];
      }
    } else {
      let woShiftSerial = this.workOrder.shift_serial;
      for (let shift of this.shifts) {
        if (shift.getShiftSerial() === woShiftSerial) {
          this.selectedShift = shift;
          Log.l("EditWorkOrder: setting active shift to:\n", shift);
          break;
        }
      }
    }
  }

  public showFancySelect() {
    Log.l("showFancySelect(): Called!");
    let options = [];
    let fancySelectModal = this.modal.create('Fancy Select', { title: "Select Shift", shifts: this.period.shifts, periods: this.payrollPeriods }, { cssClass: 'fancy-select-modal' });
    fancySelectModal.onDidDismiss(data => {
      Log.l("ReportPage: Returned from fancy select, got back:\n", data);
      if (data !== null) {
        this.selectedShift = data;
        this.selectedShiftText = this.selectedShift.toString(this.translate);
        this.workOrderForm.controls['selected_shift'].setValue(this.selectedShift);
      }
    });
    fancySelectModal.present();
  }

  getTotalHoursForShift(shift: Shift) {
    let ss = shift;
    let savedHours = ss.getNormalHours();
    return savedHours;
  }

  getNumberClass(i) {
    let shift = this.shifts[i];
    let shiftColor = shift.getShiftColor();
    Log.l(`getNumberClass(): Shift color is: '${shiftColor}'`);
    return shift.getShiftColor();
  }

  getShiftHoursStatus(shift: Shift) {
    let ss = shift;
    if (ss !== undefined && ss !== null) {
      let total = this.shiftSavedHours + this.currentRepairHours - this.thisWorkOrderContribution;
      let target = Number(this.techProfile.shiftLength);
      Log.l(`getShiftHoursStatus(): total = ${total}, target = ${target}.`);
      if (total < target) {
        return 'darkred';
      } else if(total > target) {
        return 'red';
      } else {
        return 'green';
      }
    } else {
      return 'black'
    }
  }

  onSubmit() {
    this.processWO();
  }

  genReportID() {
    let now = moment();
    let idDateTime = now.format("dddDDMMMYYYYHHmmss");
    let docID = this.techProfile.avatarName + '_' + idDateTime;
    Log.l("genReportID(): Generated ID:\n", docID);
    return docID;
  }

  convertFormToWorkOrder() {
    let sWO = this.workOrderForm.getRawValue();
    let wo = this.workOrder;

  }

  processWO() {
    let workOrderData = this.workOrderForm.getRawValue();
    this.alert.showSpinner("Saving report...");
    let tempWO = this.createReport();
    if (this.mode === 'Add') {
      this.db.addDoc(this.prefs.DB.reports, tempWO).then((res) => {
        Log.l("processWO(): Successfully saved work order to local database. Now synchronizing to remote.\n", res);
        return this.db.syncSquaredToServer(this.prefs.DB.reports);
      }).then((res) => {
        Log.l("processWO(): Successfully synchronized work order to remote.");
        this.alert.hideSpinner();
        this.tabs.goToPage('OnSiteHome');
      }).catch((err) => {
        Log.l("processWO(): Error saving work order to local database.");
        Log.e(err);
        this.alert.hideSpinner();
        this.alert.showAlert('ERROR', 'Error saving work report. Please try again later.');
      });
    } else {
      tempWO._rev = this.workOrder._rev;
      Log.l("processWO(): In Edit mode, now trying to save report:\n", tempWO);
      this.db.updateDoc(this.prefs.DB.reports, tempWO).then((res) => {
        Log.l("processWO(): Successfully saved work order to local database. Now synchronizing to remote.\n", res);
        return this.db.syncSquaredToServer(this.prefs.DB.reports);
      }).then((res) => {
        Log.l("processWO(): Successfully synchronized work order to remote.");
        this.alert.hideSpinner();
        this.tabs.goToPage('ReportHistory');
      }).catch((err) => {
        Log.l("processWO(): Error saving work order to local database.");
        Log.e(err);
        this.alert.hideSpinner();
        this.alert.showAlert('ERROR', 'Error saving work report. Please try again later.');
      });
    }
  }

  cancel() {
    Log.l("ReportPage: User canceled work order.");
    if (this.mode === 'Add') {
      this.tabs.goToPage('OnSiteHome');
    } else {
      this.tabs.goToPage('ReportHistory');
    }
  }

  createReport() {
    Log.l("ReportPage: createReport(): Now creating report...");
    let partialReport = this.workOrderForm.getRawValue();
    let ts = moment(partialReport.timeStamp);
    let wo = this.workOrder;
    Log.l("createReport(): timestamp moment is now:\n", ts);
    let XLDate = moment([1900, 0, 1]);
    let xlStamp = ts.diff(XLDate, 'days', true) + 2;
    partialReport.timeStamp = xlStamp;
    console.log("processWO() has initial partialReport:");
    console.log(partialReport);
    let newReport: any = {};
    let newID = this.genReportID();
    if (this.mode !== 'Add') {
      newID = wo._id;
    }
    if (this.mode === 'Edit') {
      newReport._rev = wo._rev;
    }
    newReport._id            = newID                           ;
    newReport.timeStarts     = wo.time_start.format()          ;
    newReport.timeEnds       = wo.time_end.format()            ;
    newReport.repairHrs      = wo.repair_hours                 ;
    newReport.shiftSerial    = wo.shift_serial                 ;
    newReport.payrollPeriod  = wo.payroll_period               ;
    newReport.uNum           = partialReport.uNum              ;
    newReport.wONum          = partialReport.wONum             ;
    newReport.notes          = partialReport.notes             ;
    newReport.rprtDate       = partialReport.rprtDate          ;
    newReport.timeStamp      = partialReport.timeStamp         ;
    newReport.training_time  = partialReport.training_time     ;
    newReport.lastName       = this.techProfile.lastName       ;
    newReport.firstName      = this.techProfile.firstName      ;
    newReport.client         = this.techProfile.client         ;
    newReport.location       = this.techProfile.location       ;
    newReport.locID          = this.techProfile.locID          ;
    newReport.loc2nd         = this.techProfile.loc2nd         ;
    newReport.shift          = this.techProfile.shift          ;
    newReport.shiftLength    = this.techProfile.shiftLength    ;
    newReport.shiftStartTime = this.techProfile.shiftStartTime ;
    newReport.technician     = this.techProfile.technician     ;
    newReport.username       = this.techProfile.avatarName     ;
    this.workOrderReport     = newReport                       ;
    return newReport;
  }

  deleteWorkOrder(event, item) {
    Log.l("deleteWorkOrder() clicked ...");
    let lang = this.translate.instant(['confirm', 'delete_report', 'spinner_deleting_report', 'error', 'error_deleting_report_message']);
    this.alert.showConfirm(lang['confirm'], lang['delete_report']).then((res) => {
      if (res) {
        this.alert.showSpinner(lang['spinner_deleting_report']);
        Log.l("deleteWorkOrder(): User confirmed deletion, deleting...");
        let wo = this.workOrder.clone();
        let reports = this.ud.getWorkOrderList();
        let i = reports.indexOf(this.workOrder);
        this.server.deleteDoc(this.prefs.DB.reports, wo).then((res) => {
          Log.l("deleteWorkOrder(): Success:\n", res);
          Log.l("Going to delete work order %d in the list.", i);
          reports.splice(i, 1);
          if (this.mode === 'Add') {
            this.alert.hideSpinner();
            this.tabs.goToPage('OnSiteHome');
          } else {
            this.alert.hideSpinner();
            this.tabs.goToPage('ReportHistory', {report_deleted: this.workOrder});
          }
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

}

