import { Component, OnInit, ViewChild, NgZone                  } from '@angular/core'                     ;
import { FormsModule, ReactiveFormsModule                      } from "@angular/forms"                    ;
import { FormBuilder, FormGroup, FormControl, Validators       } from "@angular/forms"                    ;
import { IonicPage, NavController, NavParams                   } from 'ionic-angular'                     ;
import { LoadingController, PopoverController, ModalController } from 'ionic-angular'                     ;
import { DBSrvcs                                               } from '../../providers/db-srvcs'          ;
import { SrvrSrvcs                                             } from '../../providers/srvr-srvcs'        ;
import { AuthSrvcs                                             } from '../../providers/auth-srvcs'        ;
import { AlertService                                          } from '../../providers/alerts'            ;
import { Log, moment, Moment                                   } from '../../config/config.functions'     ;
import { PayrollPeriod                                         } from '../../domain/payroll-period'       ;
import { Shift                                                 } from '../../domain/shift'                ;
import { WorkOrder                                             } from '../../domain/workorder'            ;
import { Employee                                              } from '../../domain/employee'             ;
import { ReportOther                                           } from '../../domain/reportother'          ;
import { Status                                                } from '../../providers/status'            ;
import { UserData                                              } from '../../providers/user-data'         ;
import { sprintf                                               } from 'sprintf-js'                        ;
import { STRINGS                                               } from '../../config/config.strings'       ;
import { Preferences                                           } from '../../providers/preferences'       ;
import { TabsComponent                                         } from '../../components/tabs/tabs'        ;
import { TranslateService                                      } from '@ngx-translate/core'               ;
import { REPORTTYPEI18N, TRAININGTYPEI18N, JOBSITESI18N        } from '../../config/report.object'        ;
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
  type                      : any = REPORTTYPEI18N[0]                       ;
  workOrderForm             : FormGroup                                     ;
  workOrder                 : any                                           ;
  workOrderReport           : any                                           ;
  reportOther               : ReportOther      = null                       ;
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
  _type                     : any                                           ;
  _training_type            : any                                           ;
  _training_time            : any                                           ;
  _travel_location          : any                                           ;
  _time                     : any                                           ;
  userdata                  : any                                           ;
  shiftDateOptions          : any                                           ;
  dataReady                 : boolean          = false                      ;
  techWorkOrders            : Array<WorkOrder> = []                         ;
  shiftDateInputDisabled    : boolean          = true                       ;
  shiftDateInput2Disabled   : boolean          = false                      ;
  selectedShiftText         : string           = ""                         ;
  workOrderList             : any                                           ;
  filteredWOList            : any                                           ;
  selReportType             : Array<any> = REPORTTYPEI18N                   ;
  selTrainingType           : Array<any> = TRAININGTYPEI18N                 ;
  training_type             : any = null                                    ;
  selTravelLocation         : Array<any> = JOBSITESI18N                     ;
  travel_location           : any = null                                    ;

  constructor(
    public navCtrl      : NavController,
    public navParams    : NavParams,
    private db          : DBSrvcs,
    public server       : SrvrSrvcs,
    public loadingCtrl  : LoadingController,
    public alert        : AlertService,
    public modal        : ModalController,
    public zone         : NgZone,
    public tabs         : TabsComponent,
    public ud           : UserData,
    public translate    : TranslateService,
  ) {
    this.shifter        = Shift             ;
    this.userdata       = UserData          ;
    window["workorder"] = this              ;
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
      this.techProfile = new Employee();
      this.techProfile.readFromDoc(res);
      if (this.mode === 'Add' || this.mode === 'Añadir') {
        this.workOrder = new WorkOrder();
      }
      this.setupShifts();
      this.updateActiveShiftWorkOrders(this.selectedShift);
      if (this.mode === 'Add' || this.mode === 'Añadir') {
        let startTime = moment(this.selectedShift.start_time);
        let addTime = this.selectedShift.getShiftHours();
        let newStartTime = moment(startTime).add(addTime, 'hours');
        Log.l("ReportPage: Now setting work order start time. Start Time = %s, adding %f hours, gives:\n", startTime.format(), addTime, newStartTime);
        this.workOrder.setStartTime(newStartTime);
      } else {

      }
      this.thisWorkOrderContribution = this.workOrder.getRepairHours() || 0;

      if (this.navParams.get('reportOther') !== undefined) {
        this.reportOther = this.navParams.get('reportOther');
      } else {
        this.reportOther = new ReportOther();
        let ro = this.reportOther;
        let tech = this.techProfile;
        let now = moment();
        let shift = this.selectedShift;
        ro.timestamp      = now.format()                          ;
        ro.timestampX     = now.toExcel()                         ;
        ro.first_name     = tech.firstName                        ;
        ro.last_name      = tech.lastName                         ;
        ro.username       = tech.avatarName                       ;
        ro.client         = tech.client                           ;
        ro.location       = tech.location                         ;
        ro.location_2     = tech.loc2nd                           ;
        ro.location_id    = tech.locID                            ;
        ro.payroll_period = shift.getPayrollPeriod()              ;
        ro.shift_serial   = shift.getShiftSerial()                ;
        let date          = shift.getStartTime()                  ;
        ro.report_date    = moment(date).startOf('day')           ;
      }

      this.initializeForm();
      this._type            = this.workOrderForm.controls['type'           ] ;
      this._training_type   = this.workOrderForm.controls['training_type'  ] ;
      this._training_time   = this.workOrderForm.controls['training_time'  ] ;
      this._travel_location = this.workOrderForm.controls['travel_location'] ;
      this._time            = this.workOrderForm.controls['time'           ] ;
      this._endTime         = this.workOrderForm.controls['endTime'        ] ;
      this._repairHours     = this.workOrderForm.controls['repair_time'    ] ;
      this._selected_shift  = this.workOrderForm.controls['selected_shift' ] ;
      this._notes           = this.workOrderForm.controls['notes'          ] ;

      this._type.valueChanges.subscribe((value: any) => {
        this.type = value;
        let ro = this.reportOther;
        if(value.name !== 'work_report') {
          ro.type = value.value;
        }
        if(value.name === 'training') {
          ro.training_type = "Safety";
          ro.time = 2;
          this._training_type.setValue(TRAININGTYPEI18N[0]);
          this.training_type = TRAININGTYPEI18N[0];
          this._time.setValue(2);
        } else if(value.name === 'travel') {
          ro.travel_location = "BE MDL MNSHOP";
          ro.time     = 6;
          this.travel_location = JOBSITESI18N[0];
          this._travel_location.setValue(JOBSITESI18N[0]);
          this._time.setValue(6);
        }
       });
      this._training_type.valueChanges.subscribe((value: any) => {
        let ro = this.reportOther;
        this.training_type = value;
        ro.training_type   = value.value;
        let time = value.hours;
        ro.time = time;
        this._time.setValue(time);
      });
      this._travel_location.valueChanges.subscribe((value: any) => {
        let ro = this.reportOther;
        this.travel_location = value;
        ro.travel_location   = value.value;
        let time = value.hours;
        ro.time = time;
        this._time.setValue(time);
      });
      this._time.valueChanges.subscribe((value: any) => { this.reportOther.time = value; });
      this.workOrderForm.valueChanges.debounceTime(500).subscribe((value: any) => {
        Log.l("workOrderForm: valueChanges fired for:\n", value);
        let notes = value.notes;
        let unit = value.unit_number;
        let woNum = value.work_order_number;
        let fields = [['notes', 'notes'], ['work_order_number', 'work_order_number'], ['unit_number', 'unit_number']];
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
        this.reportOther.report_date = rprtDate;

        this.workOrderForm.controls.report_date.setValue(rprtDate.format("YYYY-MM-DD"));
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
    if (this.mode === 'Add' || this.mode === 'Añadir') {
      rprtDate = moment(this.selectedShift.getStartTime());
      ts = moment().format();
    } else {
      rprtDate = moment(wo.report_date);
    }
    ts = moment().format();
    this.currentRepairHours = wo.getRepairHours();
    this.workOrderForm = new FormGroup({
      'selected_shift'    : new FormControl(this.selectedShift                , Validators.required) ,
      'repair_time'       : new FormControl(wo.getRepairHoursString()         , Validators.required) ,
      'unit_number'       : new FormControl(wo.unit_number                    , Validators.required) ,
      'work_order_number' : new FormControl(wo.work_order_number              , Validators.required) ,
      'notes'             : new FormControl(wo.notes                          , Validators.required) ,
      'report_date'       : new FormControl(rprtDate.format("YYYY-MM-DD")     , Validators.required) ,
      'timestamp'         : new FormControl({ value: ts, disabled: true }     , Validators.required) ,
      'type'              : new FormControl(this.type                         , Validators.required) ,
      'training_type'     : new FormControl(null                              , Validators.required) ,
      'travel_location'   : new FormControl(null                              , Validators.required) ,
      'time'              : new FormControl(null                              , Validators.required) ,
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
    if (this.mode === 'Add' || this.mode === 'Añadir') {
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
      // Log.l(`getShiftHoursStatus(): total = ${total}, target = ${target}.`);
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
    let form = this.workOrderForm.getRawValue();
    let type = form.type;
    if(type === null || type === undefined || type === 'Work Order') {
      this.processWO();
    } else {
      this.processAlternateWO();
    }
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
    let lang = this.translate.instant(['spinner_saving_report', 'error', 'error_saving_report_message']);
    this.alert.showSpinner(lang['spinner_saving_report']);
    let tempWO = this.createReport();
    if (this.mode === 'Add' || this.mode === 'Añadir') {
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
        this.alert.showAlert(lang['error'], lang['error_saving_report_message']);
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
        this.alert.showAlert(lang['error'], lang['error_saving_report_message']);
      });
    }
  }

  processAlternateWO() {
    let lang = this.translate.instant(['spinner_saving_report', 'error', 'error_saving_report_message']);
    this.alert.showSpinner(lang['spinner_saving_report']);
    let doc = this.workOrderForm.getRawValue();
    // let newReport = new ReportOther().readFromDoc(doc);
    let newReport = this.reportOther;
    Log.l("processAlternateWO(): Read new ReportOther:\n", newReport);
    let newDoc = newReport.serialize(this.techProfile);
    Log.l("processAlternateWO(): Serialized ReportOther to:\n", newDoc);
    this.db.saveReportOther(newDoc).then(res => {
      Log.l("processAltnerateWO(): Done saving ReportOther!");
      this.alert.hideSpinner();
      if(this.mode === 'Add') {
        this.tabs.goToPage('OnSiteHome');
      } else {
        this.tabs.goToPage('ReportHistory');
      }
    }).catch(err => {
      Log.l("processAlternateWO(): Error saving ReportOther!");
      Log.e(err);
      this.alert.showAlert(lang['error'], lang['error_saving_report_message']);
    });
  }

  cancel() {
    Log.l("ReportPage: User canceled work order.");
    if (this.mode === 'Add' || this.mode === 'Añadir') {
      this.tabs.goToPage('OnSiteHome');
    } else {
      this.tabs.goToPage('ReportHistory');
    }
  }

  createReport() {
    Log.l("ReportPage: createReport(): Now creating report...");
    let doc = this.workOrderForm.getRawValue();
    for(let propName in doc) {
      let property = doc[propName];
      this.workOrder[propName] = property;
    }
    return this.workOrder.serialize(this.techProfile);
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
          if (this.mode === 'Add' || this.mode === 'Añadir') {
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

