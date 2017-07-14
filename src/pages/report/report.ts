import { Component, OnInit, ViewChild, NgZone                  } from '@angular/core'                     ;
import { FormsModule, ReactiveFormsModule                      } from "@angular/forms"                    ;
import { FormBuilder, FormGroup, FormControl, Validators       } from "@angular/forms"                    ;
import { IonicPage, NavController, NavParams                   } from 'ionic-angular'                     ;
import { LoadingController, PopoverController, ModalController } from 'ionic-angular'                     ;
import { DBSrvcs                                               } from '../../providers/db-srvcs'          ;
import { SrvrSrvcs                                             } from '../../providers/srvr-srvcs'        ;
import { AuthSrvcs                                             } from '../../providers/auth-srvcs'        ;
import { AlertService                                          } from '../../providers/alerts'            ;
import { SmartAudio                                            } from '../../providers/smart-audio'       ;
import { Log, moment, Moment, isMoment                         } from '../../config/config.functions'     ;
import { PayrollPeriod                                         } from '../../domain/payroll-period'       ;
import { Shift                                                 } from '../../domain/shift'                ;
import { WorkOrder                                             } from '../../domain/workorder'            ;
import { Employee                                              } from '../../domain/employee'             ;
import { ReportOther                                           } from '../../domain/reportother'          ;
import { Status                                                } from '../../providers/status'            ;
import { Jobsite                                               } from '../../domain/jobsite'              ;
import { UserData                                              } from '../../providers/user-data'         ;
import { sprintf                                               } from 'sprintf-js'                        ;
import { STRINGS                                               } from '../../config/config.strings'       ;
import { Preferences                                           } from '../../providers/preferences'       ;
import { TabsComponent                                         } from '../../components/tabs/tabs'        ;
import { TranslateService                                      } from '@ngx-translate/core'               ;
import 'rxjs/add/operator/debounceTime'                                                                   ;

export const focusDelay = 500;

@IonicPage({
  name: 'Report'
})
@Component({
  selector: 'page-report',
  templateUrl: 'report.html'
})

export class ReportPage implements OnInit {
  @ViewChild('unitNumberInput') unitNumberInput;
  @ViewChild('workOrderNumberInput') workOrderNumberInput;

  title                     : string           = 'Work Report'              ;
  lang                      : any                                           ;
  static PREFS              : any              = new Preferences()          ;
  prefs                     : any              = ReportPage.PREFS           ;
  setDate                   : Date             = new Date()                 ;
  year                      : number           = this.setDate.getFullYear() ;
  mode                      : string           = 'Add'                      ;
  type                      : any                                           ;
  formValues                : any                                           ;
  workOrderForm             : FormGroup                                     ;
  workOrder                 : any                                           ;
  workOrderReport           : any                                           ;
  reportOther               : ReportOther      = null                       ;
  repairHrs                 : any                                           ;
  profile                   : any              = {}                         ;
  tmpReportData             : any                                           ;
  techProfile               : any                                           ;
  tech                      : any                                           ;
  docID                     : string                                        ;
  idDate                    : string                                        ;
  idTime                    : string                                        ;
  payrollPeriods            : Array<PayrollPeriod>                          ;
  shifts                    : Array<Shift>                                  ;
  period                    : PayrollPeriod                                 ;
  selectedShift             : Shift                                         ;
  sites                     : Array<Jobsite>                                ;
  currentDay                : any                                           ;
  shiftsStart               : any                                           ;
  shifter                   : any                                           ;
  repairTime                : any                                           ;
  thisWorkOrderContribution : number           = 0                          ;
  shiftTotalHours           : any              = 0                          ;
  payrollPeriodHours        : any              = 0                          ;
  currentRepairHours        : number           = 0                          ;
  currentOtherHours         : number           = 0                          ;
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
  _type                     : any                                           ;
  _training_type            : any                                           ;
  _training_time            : any                                           ;
  _travel_location          : any                                           ;
  _time                     : any                                           ;
  _unit_number              : any                                           ;
  _work_order_number        : any                                           ;
  userdata                  : any                                           ;
  shiftDateOptions          : any                                           ;
  dataReady                 : boolean          = false                      ;
  techWorkOrders            : Array<WorkOrder> = []                         ;
  selectedShiftText         : string           = ""                         ;
  workOrderList             : any                                           ;
  filteredWOList            : any                                           ;
  // selReportType             : Array<any>       = REPORTTYPEI18N             ;
  // selTrainingType           : Array<any>       = TRAININGTYPEI18N           ;
  // selTravelLocation         : Array<any>       = JOBSITESI18N               ;
  selReportType             : Array<any>                                    ;
  selTrainingType           : Array<any>                                    ;
  selTravelLocation         : Array<any>                                    ;
  training_type             : any              = null                       ;
  travel_location           : any              = null                       ;
  allDay                    : boolean          = false                      ;
  _allDay                   : any                                           ;
  previousEndTime           : any                                           ;
  oldType                   : any                                           ;

  constructor(
    public navCtrl      : NavController,
    public navParams    : NavParams,
    private db          : DBSrvcs,
    public server       : SrvrSrvcs,
    public loadingCtrl  : LoadingController,
    public alert        : AlertService,
    public audio        : SmartAudio,
    public modal        : ModalController,
    public zone         : NgZone,
    public tabs         : TabsComponent,
    public ud           : UserData,
    public translate    : TranslateService,
  ) {
    this.shifter        = Shift             ;
    this.userdata       = UserData          ;
    let w = window;
    w["workorder"] = w["onsitereport"] = this              ;
  }

  ionViewDidLoad() { console.log('ionViewDidLoad ReportPage'); }

  ngOnInit() {
    Log.l("Report.ngOnInit(): navParams are:\n", this.navParams);
    if (this.navParams.get('mode') !== undefined) { this.mode = this.navParams.get('mode'); }
    if (this.navParams.get('type') !== undefined) { this.type = this.navParams.get('type'); }
    if (this.navParams.get('shift') !== undefined) { this.shiftToUse = this.selectedShift = this.navParams.get('shift'); }
    if (this.navParams.get('payroll_period') !== undefined) { this.period = this.navParams.get('payroll_period'); }
    if (this.navParams.get('workOrder') !== undefined) {
      this.workOrder = this.navParams.get('workOrder');
    } else {
      // this.workOrder = new WorkOrder();
    }
    if (this.navParams.get('reportOther') !== undefined) {
      this.reportOther = this.navParams.get('reportOther');
    } else {
      // this.reportOther = new ReportOther();
    }
    if(this.shiftToUse !== null) {
      this.selectedShift = this.shiftToUse;
    }
    let mode = this.mode.toLowerCase();
    let translations = [
      mode,
      'error',
      'report',
      'confirm',
      'warning',
      'delete_report',
      'spinner_saving_report',
      'hb_unit_number_length',
      'spinner_deleting_report',
      'report_submit_error_title',
      'report_submit_error_message',
      'hb_work_order_number_length',
      'error_saving_report_message',
      'standby_hb_duncan_wrong_location',
      'attempt_to_change_existing_report_type',
      'duplicate_standby_report',
      'standby_report_xor_work_report_existing_standby',
      'standby_report_xor_work_report_existing_work_report',
    ];
    this.lang = this.translate.instant(translations);
    let lang = this.lang;
    let titleAdjective = lang[mode];
    let titleNoun = lang['report'];

    this.title = `${titleAdjective} ${titleNoun}`;

    this.initializeUIData();
    for(let type of this.selReportType) {
      if(this.type === type.value) {
        this.type = type;
      }
    }
    this.shifts = [];
    this.db.getTechProfile().then((res) => {
      Log.l(`ReportPage: Success getting tech profile! Result:\n`, res);
      this.techProfile = new Employee();
      this.techProfile.readFromDoc(res);
      this.tech = this.techProfile;
      // if (this.mode === 'Add' || this.mode === 'Añadir') {
        // let now = moment();
        // this.workOrder = new WorkOrder();
        // this.workOrder.timestampM  = now.format();
        // this.workOrder.timestamp   = now.toExcel();
      // }
      this.setupShifts();
      if (this.mode === 'Add' || !this.workOrder || !this.workOrder.first_name) {
        this.workOrder = this.createFreshReport();
      }
      if (!this.reportOther || !this.reportOther.first_name) {
        this.reportOther = this.createFreshOtherReport();
      }
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

      this.initializeForm();
      this.initializeFormListeners();
      this.dataReady = true;
    }).catch((err) => {
      Log.l(`ReportPage: Error getting tech profile!`);
      Log.e(err);
    });
  }

  public initializeUIData() {
    this.chooseHours = [
      { "name": "Hours", "options": [], "header": "H", "headerWidth": "20px", "columnWidth": "72px" },
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
    this.selReportType = this.ud.getData('report_types');
    this.selTrainingType = this.ud.getData('training_types');
    let sites = [], siteSelect = [];
    this.sites = this.ud.getData('sites');
    let siteList = this.ud.getData('sites');
    for(let site of siteList) {
      let name = site.getSiteSelectName();
      let hours = site.travel_time;
      let oneSite = {name: name, value: name, hours: hours};
      siteSelect.push(oneSite);
      // sites.push(site);
    }
    this.selTravelLocation = siteSelect;
    // this.sites = sites;
    this.type = this.selReportType[0];
  }

  public initializeFormListeners() {
    let lang                = this.lang                                       ;
    this._type              = this.workOrderForm.get('type')             ;
    this._training_type     = this.workOrderForm.get('training_type')    ;
    this._travel_location   = this.workOrderForm.get('travel_location')  ;
    this._time              = this.workOrderForm.get('time')             ;
    this._endTime           = this.workOrderForm.get('endTime')          ;
    this._repairHours       = this.workOrderForm.get('repair_time')      ;
    this._selected_shift    = this.workOrderForm.get('selected_shift')   ;
    this._notes             = this.workOrderForm.get('notes')            ;
    this._unit_number       = this.workOrderForm.get('unit_number')      ;
    this._work_order_number = this.workOrderForm.get('work_order_number');
    this._allDay            = this.workOrderForm.get('allDay')           ;

    // this._type            = this.workOrderForm.controls['type']            ;
    // this._training_type   = this.workOrderForm.controls['training_type']   ;
    // this._travel_location = this.workOrderForm.controls['travel_location'] ;
    // this._time            = this.workOrderForm.controls['time']            ;
    // this._endTime         = this.workOrderForm.controls['endTime']         ;
    // this._repairHours     = this.workOrderForm.controls['repair_time']     ;
    // this._selected_shift  = this.workOrderForm.controls['selected_shift']  ;
    // this._notes           = this.workOrderForm.controls['notes']           ;
    // this._unit_number     = this.workOrderForm.controls['unit_number']     ;
    // this._work_order_number = this.workOrderForm.controls['work_order_number'];
    // this._allDay          = this.workOrderForm.controls['allDay']          ;

    this._type.valueChanges.subscribe((value:any) => {
      Log.l("Field 'type' fired valueChanges for:\n", value);
      // setTimeout(() => {
      // let oldType = this.selReportType[this.selReportType.indexOf(value)];
      this.oldType = this.selReportType[0];
      // this.type   = value;
      // let oldVal  = oldType.value;
      let ro      = this.reportOther;
      let error   = false;
      // this._time.enable(true);
      if (value.name === 'training') {
        ro.training_type = "Safety";
        ro.time = 2;
        ro.type = value.value;
        this._training_type.setValue(this.selTrainingType[0]);
        this.training_type = this.selTrainingType[0];
        this._time.setValue(2);
        this.type = value;
      } else if (value.name === 'travel') {
        ro.travel_location = "BE MDL MNSHOP";
        ro.time = 6;
        ro.type = value.value;
        this.travel_location = this.selTravelLocation[0];
        this._travel_location.setValue(this.selTravelLocation[0]);
        this._time.setValue(6);
        this.type = value;
      } else if (value.name === 'sick') {
        ro.time = 8;
        this._time.setValue(8);
        ro.type = value.value;
        if(this.allDay) {
          this._time.disable(true);
        } else {
          this._time.enable(true);
        }
        this.type = value;
      } else if (value.name === 'vacation') {
        ro.time = 8;
        this._time.setValue(8);
        ro.type = value.value;
        this.type = value;
      } else if (value.name === 'holiday') {
        ro.time = 8;
        this._time.setValue(8);
        ro.type = value.value;
        this.type = value;
      } else if (value.name === 'standby') {
        let shift = this.selectedShift;
        let status = shift.getShiftReportsStatus(true).code;
        let hours  = shift.getNormalHours();
        if(status.indexOf("B") > -1 || status.indexOf("S") > -1) {
          Log.w("User attempted to create duplicate standby report.");
          let warnIcon = "<span class='alert-with-icon'><span class='alert-icon'>&#xf434;</span></span>";
          let warningText = sprintf(lang['duplicate_standby_report'], warnIcon);
          // this.type = oldType;
          // this._type.setValue(oldType);
          // this.alert.showAlert(lang['error'], warningText);
          // this.alert.showAlert(lang['error'], warningText).then(res => {
            // this.type = oldType;
            // setTimeout(() => {
              // this._type.setValue(oldType);
              // error = true;
            // this.zone.run(() => { this._type.setValue(this.oldType); });
            // }, 500);
          // });
          this._type.setValue(this.selReportType[0]);
          setTimeout(() => { this.alert.showAlert(lang['error'], warningText); });
        } else if(hours >   0) {
          Log.w("User attempted to create a standby report in the same shift as an existing work report.");
          let warnIcon = "<span class='alert-with-icon'><span class='alert-icon'>&#xf434;</span></span>";
          let warningText = sprintf(lang['standby_report_xor_work_report_existing_work_report'], warnIcon);
          // this.type = oldType;
          // this._type.setValue(oldType);
          // this.alert.showAlert(lang['error'], warningText);
          // });
          // this.alert.showAlert(lang['error'], warningText).then(res => {
            // this.type = oldType;
            // this._type.setValue(oldType);
            // setTimeout(() => {
              // this._type.setValue(oldType);
              // this.zone.run(() => {this._type.setValue(this.oldType);});
              // error = true;
            // }, 500);
          // });
          this._type.setValue(this.selReportType[0]);
          setTimeout(() => { this.alert.showAlert(lang['error'], warningText); });
        } else {
          ro.time = 8;
          this._time.setValue(8);
          ro.type = value.value;
          this.type = value;
        }
      } else if (value.name === 'standby_hb_duncan') {
        let status = this.selectedShift.getShiftReportsStatus(true).code;
        let i = status.indexOf("B");
        let j = status.indexOf("S");
        if(this.techProfile.location !== "DUNCAN") {
          Log.w("User attempted to create Standby: HB Duncan report without being set to Duncan location.");
          let strIcon = "<span class='alert-icon'>&#xf419;</span>";
          let warnText = sprintf(lang['standby_hb_duncan_wrong_location'], strIcon)
          let warnFont = sprintf("<span class='alert-with-icon'>%s</span>", warnText);
          // this.alert.showAlert(lang['error'], warnFont);
          // this._type.setValue(oldType);
          // this.type = oldType;
          // this._type.setValue(oldType);
          // this.alert.showAlert(lang['error'], warnFont);
          // this.alert.showAlert(lang['error'], warnFont).then(res => {
          //   Log.l("Resetting form.type to:\n", this.selReportType[0])
          //   this._type.setValue(this.selReportType[0]);
          // });
          this._type.setValue(this.selReportType[0]);
          setTimeout(() => { this.alert.showAlert(lang['error'], warnFont); });
        } else if(i > -1 || j > -1) {
          Log.w("User attempted to create duplicate standby report.");
          let warnIcon = "<span class='alert-with-icon'><span class='alert-icon'>&#xf434;</span></span>";
          let warningText = sprintf(lang['duplicate_standby_report'], warnIcon);
          // this._type.setValue(oldType);
          // this.alert.showAlert(lang['error'], warningText);
          // this.type = oldType;
          // this._type.setValue(this.oldType);
          // this.alert.showAlert(lang['error'], warningText);
          // this.alert.showAlert(lang['error'], warningText).then(res => {
            // setTimeout(() => {
              // this._type.setValue(this.oldType);
            // }, 500);
            // this.zone.run(() => { this._type.setValue(this.oldType); });
          this._type.setValue(this.selReportType[0]);
          setTimeout(() => { this.alert.showAlert(lang['error'], warningText); });
          // });
        } else if(this.selectedShift.getNormalHours() > 0) {
          Log.w("User attempted to create a standby report in the same shift as an existing work report.");
          let warnIcon = "<span class='alert-with-icon'><span class='alert-icon'>&#xf434;</span></span>";
          let warningText = sprintf(lang['standby_report_xor_work_report_existing_work_report'], warnIcon);
          // this.type = oldType;
          // this._type.setValue(oldType);
          // this.alert.showAlert(lang['error'], warningText);
          // this.alert.showAlert(lang['error'], warningText).then(res => {
            // setTimeout(() => {
              // this._type.setValue(oldType);
            // }, 500);
            // this.zone.run(() => { this._type.setValue(this.oldType); });
          // });
          this._type.setValue(this.selReportType[0]);
          setTimeout(() => { this.alert.showAlert(lang['error'], warningText); });
        } else {
          ro.time = 8;
          this._time.setValue(8);
          ro.type = value.value;
          this.type = value;
        }
      } else if(value.name === 'work_report') {
        Log.l("type.valueChange(): This seems proper.");
        this.type = value;
        // ro.type = value.value;
      } else {
        Log.l("type.valueChange(): GETTING TO THIS BRANCH SHOULD NOT BE POSSIBLE! Type is:\n", value);
      }
    });
    this._training_type.valueChanges.subscribe((value: any) => {
      let ro = this.reportOther;
      this.training_type = value;
      ro.training_type = value.value;
      let time = value.hours;
      ro.time = time;
      this._time.setValue(time);
    });
    this._travel_location.valueChanges.subscribe((value: any) => {
      let ro = this.reportOther;
      this.travel_location = value;
      ro.travel_location = value.value;
      let time = value.hours;
      ro.time = time;
      this._time.setValue(time);
    });
    this._time.valueChanges.subscribe((value: any) => {
      let ro = this.reportOther;
      ro.time = !isNaN(Number(value)) ? Number(value) : 0;
      this.currentOtherHours = ro.time;
    });
    this._allDay.valueChanges.subscribe((value: any) => {
      Log.l("_allDay value changed to:\n", value);
      this.allDay = value;
      if(this.allDay) {
        this._time.disable(true);
      } else {
        this._time.enable(true);
      }
    });
    this._repairHours.valueChanges.subscribe((hours: any) => {
      Log.l("workOrderForm: valueChanges fired for repair_hours: ", hours);
      let wo = this.workOrder;
      let oldHours = this.workOrderForm.value.repair_hours;
      let oldType = this.type;
      let shift = this.selectedShift;
      let status = shift.getShiftReportsStatus(true).code;
      if (status.indexOf("B") > -1 || status.indexOf("S") > -1) {
        Log.w("User attempted to add work order when standby report already exists for shift..");
        let warnIcon = "<span class='alert-with-icon'><span class='alert-icon'>&#xf434;</span></span>";
        let warningText = sprintf(lang['standby_report_xor_work_report_existing_standby_report'], warnIcon);
        this.alert.showAlert(lang['error'], warningText).then(res => {
          this._repairHours.setValue(oldHours);
        });
      } else {
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
      }
    });
    this._selected_shift.valueChanges.subscribe((shift: any) => {
      Log.l("workOrderForm: valueChanges fired for selected_shift:\n", shift);
      let ss                       = shift                                                   ;
      this.updateActiveShiftWorkOrders(shift);
      let report_date              = moment(shift.getStartTime())                            ;
      let woHoursSoFar             = shift.getShiftHours()                                   ;
      let woStart                  = moment(shift.getStartTime()).add(woHoursSoFar, 'hours') ;
      this.workOrder.setStartTime(woStart);
      let reportDateString         = report_date.format("YYYY-MM-DD")                        ;
      this.reportOther.report_date = report_date                                             ;
      this.workOrder.report_date   = reportDateString                                        ;
      this.selectedShift           = shift                                                   ;

      this.workOrderForm.controls.report_date.setValue(report_date.format("YYYY-MM-DD"));
    });

    this._notes.valueChanges.debounceTime(400).subscribe((value:any) => {
      Log.l("workOrderForm: valueChanges fired for _notes:\n", value);
      let wo    = this.workOrder ;
      wo.notes  = value          ;
    });

    this._unit_number.valueChanges.debounceTime(400).subscribe((value:any) => {
      Log.l("workOrderForm: valueChanges fired for _unit_number:\n", value);
      let wo          = this.workOrder ;
      wo.unit_number  = value          ;
    });

    this._work_order_number.valueChanges.debounceTime(400).subscribe((value:any) => {
      Log.l("workOrderForm: valueChanges fired for _work_order_number:\n", value);
      let wo                = this.workOrder ;
      wo.work_order_number  = value          ;
    });

    // this.workOrderForm.valueChanges.debounceTime(500).subscribe((value: any) => {
    //   Log.l("workOrderForm: valueChanges fired for:\n", value);
    //   // let type = value.
    //   let notes  = value.notes;
    //   let unit   = value.unit_number;
    //   let woNum  = value.work_order_number;
    //   let fields = [['notes', 'notes'], ['work_order_number', 'work_order_number'], ['unit_number', 'unit_number']];
    //   let len    = fields.length;
    //   let type   = value.type ? value.type : this.type;
    //   if(type.name === 'work_report') {
    //     for (let i = 0; i < len; i++) {
    //       let key1 = fields[i][0];
    //       let key2 = fields[i][1];
    //       if (value[key1] !== null && value[key1] !== undefined) {
    //         if(this.workOrder[key2] !== undefined) {
    //           this.workOrder[key2] = value[key1];
    //         }
    //       }
    //     }
    //     Log.l("workOrderForm: overall valueChanges, ended up with work report:\n", this.workOrder);
    //   } else {
    //     let fields = [['notes', 'notes'], ['selected_shift', 'shift'], ['travel_time', 'travel_time']];
    //     let len = fields.length;
    //     for(let i = 0; i < len; i++) {
    //       let key1 = fields[i][0];
    //       let key2 = fields[i][1];
    //       if(this.reportOther[key2] !== undefined) {
    //         this.reportOther[key2] = value[key1];
    //       }
    //     }
    //     // if (type.name === 'training') {
    //       // this.reportOther.training_type = value.training_type.value;
    //     // }
    //     // this.reportOther.type = type.value;
    //     Log.l("workOrderForm: overall valueChanges, ended up with ReportOther:\n", this.reportOther);
    //   }

    // });
  }

  private initializeForm() {
    let wo = this.workOrder;
    let ro = this.reportOther;
    let ts, rprtDate;
    if (this.mode === 'Add' || this.mode === 'Añadir') {
      rprtDate = moment(this.selectedShift.getStartTime());
      ts = moment().format();
    } else {
      rprtDate = moment(wo.rprtDate);
    }
    // ts = moment().format();
    this.currentRepairHours = wo.getRepairHours();
    let crh = Number(ro.getTotalHours());
    this.currentOtherHours  = !isNaN(crh) ? crh : 0;
    let typeDisabled = this.mode === 'Edit' ? true : false;
    this.workOrderForm = new FormGroup({
      'selected_shift'    : new FormControl(this.selectedShift                , Validators.required) ,
      'repair_time'       : new FormControl(wo.getRepairHoursString()         , Validators.required) ,
      'unit_number'       : new FormControl(wo.unit_number                    , Validators.required) ,
      'work_order_number' : new FormControl(wo.work_order_number              , Validators.required) ,
      'notes'             : new FormControl(wo.notes                          , Validators.required) ,
      'report_date'       : new FormControl(rprtDate.format("YYYY-MM-DD")     , Validators.required) ,
      // 'timestamp'         : new FormControl({ value: ts, disabled: true }     , Validators.required) ,
      'type'              : new FormControl(this.type                         , Validators.required) ,
      'training_type'     : new FormControl(null                              , Validators.required) ,
      'travel_location'   : new FormControl(null                              , Validators.required) ,
      'time'              : new FormControl(this.currentOtherHours) ,
      'allDay'            : new FormControl(this.allDay) ,
      // 'sickTime'          : new FormControl(8) ,
      // 'vacation'          : new FormControl(8                                 , Validators.required) ,
      // 'Standby_HB_DCN'    : new FormControl("S"                               , Validators.required) ,
      // 'Standby'           : new FormControl(0                                 , Validators.required) ,
    });
  }

  public updateActiveShiftWorkOrders(shift: Shift) {
    let ss = shift;
    let oldShift = this.selectedShift;
    let shift_time = moment(ss.start_time);
    let shift_serial = ss.getShiftSerial();
    let payroll_period = ss.getPayrollPeriod();
    this.workOrder.shift_serial = shift_serial;
    this.workOrder.payroll_period = payroll_period;
    this.reportOther.shift_serial = shift_serial;
    this.reportOther.payroll_period = payroll_period;
    Log.l("workOrderForm: setting shift_serial to: ", shift_serial);
    // let shiftHours = this.techProfile.shiftLength;

    // let shiftStartsAt = this.techProfile.shiftStartTime;
    this.shiftHoursColor = this.getShiftHoursStatus(ss);
    this.selectedShift = shift;
    if(this.type === 'work_report') {
      oldShift.removeShiftReport(this.workOrder);
      shift.addShiftReport(this.workOrder);
    } else {
      oldShift.removeOtherReport(this.reportOther);
      shift.addOtherReport(this.reportOther);
    }
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

    let p = this.ud.getPayrollPeriods();
    if(!p) {
      this.tabs.goToPage('OnSiteHome');
    } else {
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
      }
      //  else {
        // let woShiftSerial = this.workOrder.shift_serial;
        // for (let shift of this.shifts) {
        //   if (shift.getShiftSerial() === woShiftSerial) {
        //     this.selectedShift = shift;
        //     Log.l("EditWorkOrder: setting active shift to:\n", shift);
        //     break;
        //   }
        // }
        // this.selectedShift =
      // }
    }
  }

  public checkShiftChange(event:any, shift:Shift) {
    let oldShift = this.selectedShift;
    if(this.mode === 'Edit') {

    } else {

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
    let total = 0;
    if (ss !== undefined && ss !== null) {
      let status = shift.getShiftReportsStatus();
      if(this.mode === 'Add') {
        total = shift.getNormalHours() + this.currentRepairHours;
      } else {
        total = shift.getNormalHours();
      }
      // let target = Number(this.techProfile.shiftLength);
      let target = shift.getShiftLength();
      // Log.l(`getShiftHoursStatus(): total = ${total}, target = ${target}.`);
      if(isNaN(target)) {
        if(total) {
          return 'green';
        } else if(status.status) {
          return 'green';
        } else {
          return 'darkred';
        }
      } else if (total < target) {
        return 'darkred';
      } else if(total > target) {
        return 'red';
      } else if(total === target) {
        return 'green';
      } else {
        return 'mediumaquamarine';
      }
    } else {
      return 'black';
    }
  }

  public async showPossibleError(type) {
    let lang         = this.lang                                                          ;
    let form         = this.workOrderForm.getRawValue()                                   ;
    let unitLen      = form.unit_number       ? String(form.unit_number).length       : 0 ;
    let woLen        = form.work_order_number ? String(form.work_order_number).length : 0 ;
    let result       = null                                                               ;
    let warning_text = ""                                                                 ;

    Log.l("showPossibleError(): Checking unit length and work order number length:");
    Log.l(form.unit_number);
    Log.l(form.work_order_number);

    if(type === 'unit') {
      warning_text = sprintf(lang['hb_unit_number_length'], unitLen);
      result = await this.alert.showConfirmYesNo(lang['warning'], warning_text);
      return result;
    } else if(type === 'wo') {
      warning_text = sprintf(lang['hb_work_order_number_length'], woLen);
      result = await this.alert.showConfirmYesNo(lang['warning'], warning_text);
      return result;
    } else if(type === 'standby_hb_duncan') {
      warning_text = lang['standby_hb_duncan_wrong_location'];
      result = await this.alert.showConfirmYesNo(lang['warning'], warning_text);
      return result;
    } else if(type === 'date_mismatch') {
      // warning_text = lang['standby_hb_duncan_wrong_location'];
      warning_text = sprintf("The report date (%s) does not match the shift start date (%s).", this.workOrder.report_date, this.workOrder.getStartTime().format("YYYY-MM-DD"));
      result = await this.alert.showAlert("ERROR", warning_text);
      return true;
    } else {
      return new Error("showPossibleError() called without proper type!");
    }
  }

  public async checkForUserMistakes() {
    let lang    = this.lang                                                          ;
    let form    = this.workOrderForm.getRawValue()                                   ;
    let type    = form.type                                                          ;
    let unitLen = form.unit_number       ? String(form.unit_number).length       : 0 ;
    let woLen   = form.work_order_number ? String(form.work_order_number).length : 0 ;

    Log.l("checkForUserMistakes(): Checking unit length and work order number length:");
    Log.l(form.unit_number);
    Log.l(form.work_order_number);

    try {
      if (type === null || type === undefined || type.name === 'work_report') {
        if (form.repair_time === "00:00") {
          this.audio.play('funny');
          this.alert.showAlert(lang['report_submit_error_title'], lang['report_submit_error_message']);
          return false;
        }
        if (this.tech.getClient() === 'HALLIBURTON' || this.tech.getClient() === 'HB') {
          if(unitLen !== 8) {
            let response = await this.showPossibleError('unit');
            if(response) {
              // this.unitNumberInput.setFocus();
              setTimeout(() => {
                // this.zone.run(() => { this.unitNumberInput.setFocus(); });
                this.unitNumberInput.setFocus();
              }, focusDelay);
              return false;
            }
          }
          if(woLen !== 9) {
            let response = await this.showPossibleError('wo');
            if(response) {
              // this.workOrderNumberInput.setFocus();
              setTimeout(() => {
                // this.zone.run(() => { this.workOrderNumberInput.setFocus(); });
                this.workOrderNumberInput.setFocus();
              }, focusDelay);
              return false;
            }
          }
        }
      } else if(type === "standby_hb_duncan" && this.techProfile.location !== "DUNCAN") {
        // let response = await this.showPossibleError('unit');
        Log.l("checkForUserMistakes(): User tried to set standby_hb_duncan type but is not set to HB Duncan location.");
        this.alert.showAlert(lang['error'], lang['standby_hb_duncan_wrong_location']);
        return false;
        // if (response) {
        //   // this.unitNumberInput.setFocus();
        //   setTimeout(() => {
        //     // this.zone.run(() => { this.unitNumberInput.setFocus(); });
        //     this.unitNumberInput.setFocus();
        //   }, focusDelay);
        //   return false;
        // }
      }
      return true;
    } catch(err) {
      Log.l("checkForUserMistakes(): Caught error:");
      Log.e(err);
      throw new Error(err);
    }
  }

  public checkInput() {
    return new Promise((resolve,reject) => {
      this.formValues = this.workOrderForm.getRawValue();
      this.checkForUserMistakes().then(res => {
        if(res) {
          resolve(res);
        } else {
          reject(res);
        }
      }).catch(err => {
        reject(err);
      });
    });
  }

  onSubmit() {
    let form = this.workOrderForm.getRawValue();
    let type = form.type;
    let lang = this.lang;
    this.checkInput().then(res => {
      if (type === null || type === undefined || type.name === 'work_report') {
        this.processWO();
      } else {
        this.processAlternateWO();
      }
    }).catch(err => {
      Log.l("onSubmit(): Caught error:");
      Log.e(err);
    });
  }

  genReportID() {
    let now = moment();
    // let idDateTime = now.format("dddDDMMMYYYYHHmmss");
    let idDateTime = now.format("YYYY-MM-DD_HH-mm-ss_ZZ_ddd");
    let docID = this.techProfile.avatarName + '_' + idDateTime;
    Log.l("genReportID(): Generated ID:\n", docID);
    return docID;
  }

  convertFormToWorkOrder() {
    let sWO = this.workOrderForm.getRawValue();
    let wo = this.workOrder;
  }

  processWO() {
    let data = this.workOrderForm.getRawValue();
    let lang = this.lang;
    // if(!data.repair_hours) {
    //   this.alert.showAlert(lang['report_submit_error_title'], lang['report_submit_error_message']);
    // } else {
    this.alert.showSpinner(lang['spinner_saving_report']);
    let tempWO = this.createReport();
    let newWO = new WorkOrder();
    newWO.readFromDoc(tempWO);
    if (this.mode === 'Add' || this.mode === 'Añadir') {
      this.db.addDoc(this.prefs.DB.reports, tempWO).then((res) => {
        Log.l("processWO(): Successfully saved work order to local database. Now synchronizing to remote.\n", res);
        return this.db.syncSquaredToServer(this.prefs.DB.reports);
      }).then((res) => {
        Log.l("processWO(): Successfully synchronized work order to remote.");
        this.alert.hideSpinner();
        // this.tabs.goToPage('OnSiteHome');
        this.previousEndTime = moment(newWO.time_start);
        if(this.prefs.USER.stayInReports) {
          this.createFreshReport();
          this.initializeForm();
          this.initializeFormListeners();
          this.selectedShift.addShiftReport(newWO);
        } else {
          this.tabs.goToPage('ReportHistory');
        }
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
    let lang = this.lang;
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
      if(this.prefs.USER.stayInReports) {
        this.type = this.selReportType[0];
        this.createFreshReport();
        this.initializeForm();
        this.initializeFormListeners();
      } else {
        this.tabs.goToPage('ReportHistory');
      }
      // if(this.mode === 'Add') {
      //   this.tabs.goToPage('OnSiteHome');
      // } else {
      //   this.tabs.goToPage('ReportHistory');
      // }
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

  createFreshReport() {
    let tech  = this.techProfile     ;
    let now   = moment()             ;
    let shift = this.selectedShift   ;
    let date  = shift.getStartTime() ;
    // if(this.workOrderForm.value.type === 'work_report') {
    let start = shift.getStartTime();
    let hours = shift.getNormalHours();
    let end = this.previousEndTime;
    let shiftLatest = moment(start).add(hours, 'hours');
    let wo            = new WorkOrder()                                  ;
    wo.timestampM     = now                                              ;
    wo.timestamp      = now.toExcel()                                    ;
    wo.first_name     = tech.firstName                                   ;
    wo.last_name      = tech.lastName                                    ;
    wo.time_start     = end ? moment(end) : shiftLatest                  ;
    wo.username       = tech.avatarName                                  ;
    wo.client         = tech.client                                      ;
    wo.location       = tech.location                                    ;
    wo.location_2     = tech.loc2nd                                      ;
    wo.location_id    = tech.locID                                       ;
    wo.payroll_period = shift.getPayrollPeriod()                         ;
    wo.shift_serial   = shift.getShiftSerial()                           ;
    wo.report_date    = moment(date).startOf('day').format("YYYY-MM-DD") ;
    wo.technician     = tech.getTechnician                               ;
    this.workOrder    = wo                                               ;
    return wo;
  }

  createFreshOtherReport() {
    let tech          = this.techProfile            ;
    let now           = moment()                    ;
    let shift         = this.selectedShift          ;
    let date          = shift.getStartTime()        ;
    let ro            = new ReportOther()           ;
    ro.timestampM     = now.format()                ;
    ro.timestamp      = now.toExcel()               ;
    ro.first_name     = tech.firstName              ;
    ro.last_name      = tech.lastName               ;
    ro.username       = tech.avatarName             ;
    ro.client         = tech.client                 ;
    ro.location       = tech.location               ;
    ro.location_2     = tech.loc2nd                 ;
    ro.location_id    = tech.locID                  ;
    ro.payroll_period = shift.getPayrollPeriod()    ;
    ro.shift_serial   = shift.getShiftSerial()      ;
    ro.report_date    = moment(date).startOf('day') ;
    this.reportOther  = ro                          ;

    return ro;
  }

  public populateWorkOrder():WorkOrder {
    return this.workOrder;
  }

  createReport() {
    // Log.l("ReportPage: createReport(): Now creating report...");
    let partialReport = this.workOrderForm.getRawValue();
    Log.l("ReportPage: createReport(): Now creating report from form and workOrder...\n", partialReport);
    Log.l(this.workOrder);
    // let ts = moment(partialReport.timeStamp);
    let ts;
    if(this.workOrder && this.workOrder.timestamp) {
      let ts2 = this.workOrder.timestamp;
      if(ts2 && isMoment(ts2)) {
        ts = moment(ts2);
      } else if(ts2 && typeof ts2 === 'number') {
        ts = moment().fromExcel(ts2);
      } else if(ts2 && typeof ts2 === 'string') {
        ts = moment(ts2);
      }
    } else {
      ts = moment();
      this.workOrder.timestampM = moment(ts);
      this.workOrder.timestamp  = moment(ts).toExcel();
    }
    let wo = this.workOrder;
    Log.l("createReport(): timestamp moment is now:\n", ts);
    // let XLDate = moment([1900, 0, 1]);
    // let xlStamp = ts.diff(XLDate, 'days', true) + 2;
    let xlStamp = ts.toExcel();
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
    return this.workOrder.serialize(this.techProfile);
  }

  deleteReport(event, type) {
    if(type && type.name && type.name !== 'work_report') {
      this.deleteOtherReport(event);
    } else {
      this.deleteWorkOrder(event);
    }
  }

  checkPageMode(event:any) {
    Log.l("checkPageMode(): Called with event:\n", event);
    let lang = this.lang;
    if(this.mode==='Edit') {
      Log.l("checkPageMode(): User trying to change type of an existing report. Not allowed.");
      this.alert.showAlert(lang['error'], lang['attempt_to_change_existing_report_type']);
    }
  }

  deleteWorkOrder(event) {
    Log.l("deleteWorkOrder() clicked ...");
    let lang = this.lang;
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

  deleteOtherReport(event) {
    Log.l("deleteOtherReport() clicked ...");
    let other = this.reportOther.clone();
    let lang = this.lang;
    this.audio.play('deleteotherreport');
    this.alert.showConfirm(lang['confirm'], lang['delete_report']).then((res) => {
      if (res) {
        this.alert.showSpinner(lang['spinner_deleting_report']);
        Log.l("deleteOtherReport(): User confirmed deletion, deleting...");
        let shift = this.selectedShift;
        let others = shift.getShiftOtherReports();
        let ro:ReportOther = other.clone();
        let reportDate = ro.report_date.format("YYYY-MM-DD");
        this.server.deleteDoc(this.prefs.DB.reports_other, other).then((res) => {
          Log.l("deleteOtherReport(): Success:\n", res);
          // this.items.splice(i, 1);
          let i = others.indexOf(other);
          others.splice(i, 1);
          // i = this.filtReports[reportDate].indexOf(other);
          // this.filtReports[reportDate].splice(i, 1);
          this.alert.hideSpinner();
          this.tabs.goToPage('ReportHistory', { report_deleted: this.reportOther });
        }).catch((err) => {
          this.alert.hideSpinner();
          Log.l("deleteOtherReport(): Error!");
          Log.e(err);
          this.alert.showAlert(lang['error'], lang['error_deleting_report_message']);
        });
      } else {
        Log.l("User canceled deletion.");
      }
    }).catch((err) => {
      this.alert.hideSpinner();
      Log.l("deleteOtherReport(): Error!");
      Log.e(err);
      this.alert.showAlert(lang['error'], lang['error_deleting_report_message']);
    });

  }

}

