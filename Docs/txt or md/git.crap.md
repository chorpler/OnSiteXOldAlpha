@@ -283,7 +283,7 @@ export class Shift {
      bonusHours = 3 + (countsForBonusHours - 11);
    }
    shiftTotal += bonusHours;
    Log.l("getTotalPayrollHoursForShift(): For shift %s, %d reports, %f hours, %f hours eligible, so bonus hours = %f.\nShift total: %f hours.", this.getShiftSerial(), this.shift_reports.length, shiftTotal, countsForBonusHours, bonusHours, shiftTotal);
    // Log.l("getTotalPayrollHoursForShift(): For shift %s, %d reports, %f hours, %f hours eligible, so bonus hours = %f.\nShift total: %f hours.", this.getShiftSerial(), this.shift_reports.length, shiftTotal, countsForBonusHours, bonusHours, shiftTotal);
    return shiftTotal;
  }

@@ -305,7 +305,7 @@ export class Shift {
      payrollWeek = translate.instant('payroll_week');
    }
    strOut = `${start} (${payrollWeek} ${weekStart})`;
    Log.l('Shift.toString() should output:\n', strOut);
    // Log.l('Shift.toString() should output:\n', strOut);
    return strOut;
  }

---

@@ -1,208 +0,0 @@
import * as moment from 'moment';
import { Log, isMoment } from '../config/config.functions';
import { sprintf } from 'sprintf-js';

export class WorkOrder {
  public type             : string;
  public training_time    : number;
  public time_start       : any;
  public time_end         : any;
  public repair_hours     : any;
  public unit_number      : any;
  public work_order_number: any;
  public notes            : any;
  public report_date      : any;
  public last_name        : any;
  public first_name       : any;
  public shift            : any;
  public client           : any;
  public location         : any;
  public location_id      : any;
  public location_2       : any;
  public shift_time       : any;
  public shift_length     : any;
  public shift_start_time : any;
  public technician       : any;
  public timestamp        : any;
  public username         : any;
  public shift_serial     : any;
  public payroll_period   : any;
  public _id              : any;
  public _rev             : any;

  constructor(start?: any, end?: any, hours?: any, unit?: any, wo?: any, nts?: any, date?: any, last?: any, first?: any, shift?: any, client?: any, loc?: any, locid?: any, loc2?: any, shiftTime?: any, shiftLength?: any, shiftStartTime?: any, tech?: any, timestamp?: any, user?: any) {
    this.type              = ""                    ;
    this.training_time     = null                  ;
    this.time_start        = start          || null;
    this.time_end          = end            || null;
    this.repair_hours      = hours          || null;
    this.unit_number       = unit           || null;
    this.work_order_number = wo             || null;
    this.notes             = nts            || null;
    this.report_date       = date           || null;
    this.last_name         = last           || null;
    this.first_name        = first          || null;
    this.shift             = shift          || null;
    this.client            = client         || null;
    this.location          = loc            || null;
    this.location_id       = locid          || null;
    this.location_2        = loc2           || null;
    this.shift_serial      = null                  ;
    this.shift_time        = shiftTime      || null;
    this.shift_length      = shiftLength    || null;
    this.shift_start_time  = shiftStartTime || null;
    this.technician        = tech           || null;
    this.timestamp         = timestamp      || null;
    this.username          = user           || null;
    this.shift_serial      = null                  ;
    this.payroll_period    = null                  ;
    this._id               = null                  ;
    this._rev              = null                  ;
  }

  public readFromDoc(doc:any) {
    let fields = [
      ["_id"           , "_id"              ],
      ["_rev"          , "_rev"             ],
      ["type"          , "type"             ],
      ["timeStarts"    , "time_start"       ],
      ["training_time" , "training_time"    ],
      ["timeEnds"      , "time_end"         ],
      ["repairHrs"     , "repair_hours"     ],
      ["uNum"          , "unit_number"      ],
      ["wONum"         , "work_order_number"],
      ["notes"         , "notes"            ],
      ["rprtDate"      , "report_date"      ],
      ["lastName"      , "last_name"        ],
      ["firstName"     , "first_name"       ],
      ["client"        , "client"           ],
      ["location"      , "location"         ],
      ["locID"         , "location_id"      ],
      ["loc2nd"        , "location_2"       ],
      ["shift"         , "shift_time"       ],
      ["shiftLength"   , "shift_length"     ],
      ["shiftStartTime", "shift_start_time" ],
      ["shiftSerial"   , "shift_serial"     ],
      ["payrollPeriod" , "payroll_period"   ],
      ["technician"    , "technician"       ],
      ["timeStamp"     , "timestamp"        ],
      ["username"      , "username"         ]
    ];
    let len = fields.length;
    for(let i = 0; i < len; i++) {
      let docKey  = fields[i][0];
      let thisKey = fields[i][1];
      this[thisKey] = doc[docKey];
    }
    this.time_start = moment(this.time_start);
    this.time_end   = moment(this.time_end);
  }

  public getRepairHours() {
    let val = this.repair_hours || 0;
    return val;
  }

  public getRepairHoursString() {
    let hours = this.getRepairHours();
    let h = parseInt(hours);
    let m = (hours - h) * 60;
    let out = sprintf("%02d:%02d", h, m);
    return out;
  }

  public setStartTime(time:any) {
    if (isMoment(time) || moment.isDate(time)) {
      this.time_start = moment(time);
      this.checkTimeCalculations(0);
    } else {
      Log.l("WorkOrder.setStartTime(): Needs a date/moment, was given this:\n", time);
    }
  }

  public setEndTime(time:any) {
    if (isMoment(time) || moment.isDate(time)) {
      this.time_end = moment(time);
      this.checkTimeCalculations(1);
    } else {
      Log.l("WorkOrder.setEndTime(): Needs a date/moment, was given this:\n", time);
    }
  }

  public setRepairHours(duration:any) {
    if(moment.isDuration(duration)) {
      this.repair_hours = duration.asHours();
      this.checkTimeCalculations(2);
    } else if(typeof duration === 'number') {
      this.repair_hours = duration;
      this.checkTimeCalculations(2);
    } else {
      Log.l("WorkOrder.setRepairHours(): Need a duration or number, was given this:\n", duration);
    }
  }

  public adjustEndTime() {
    let start = this.time_start;
    let time = this.repair_hours;
    let end = this.time_end;
    // Log.l("adjustEndTime(): Now adjusting end time of work report. time_start, repair_hours, and time_end are:\n", start, time, end);
    if(typeof time !== 'number') {
      if(moment.isDuration(time)) {
        time = time.asHours();
      }
    }
    if(start !== null && isMoment(start) && typeof time === 'number') {
      let newEnd = moment(start).add(time, 'hours');
      if(end.isSame(newEnd)) {
        Log.l("adjustEndTime(): No need, end time is already correct.");
      } else {
        Log.l("adjustEndTime(): Adjusting end time to:\n", newEnd);
        this.time_end = newEnd;
      }
    } else {
      Log.l("adjustEndTime(): Can't adjust end time, time_start is not a valid moment or repair_hours is not a number:\n", start, time);
    }
  }

  public checkTimeCalculations(mode:number) {
    let start = this.time_start;
    let end = this.time_end;
    let time = this.repair_hours;
    let flag = false;
    if(isMoment(start) && isMoment(end) && start !== null && end !== null && typeof time === 'number') {
      let check = moment(start).add(time, 'hours');
      if (!check.isSame(end)) {
        Log.e("WO.checkTimeCalculations(): Start time plus repair hours does not equal end time!");
        Log.e("Start: %s\nEnd: %s\nHours: %s", start.format(), end.format(), time);
        this.adjustEndTime();
      }
    } else if(isMoment(start) && typeof time === 'number') {
      let end = moment(start).add(time, 'hours');
      this.time_end = end;
    } else if(isMoment(end) && typeof time === 'number') {
      let start = moment(end).subtract(time, 'hours');
      this.time_start = start;
    } else if(isMoment(start) && isMoment(end)) {
      let hours = moment(end).diff(start, 'hours', true);
      this.repair_hours = hours;
    } else {
      Log.w("WO.checkTimeCalculations(): Start or end times are not moments, or repair hours is not a number/duration!\nStart: %s\nEnd: %s\nHours: %s", start, end, time);
    }
  }

  public clone() {
    let newWO = new WorkOrder();
    let keys = Object.keys(this);
    for(let key of keys) {
      if(moment.isMoment(this[key])) {
        newWO[key] = moment(this[key]);
      } else if(typeof this[key] === 'object') {
        newWO[key] = Object.assign({}, this[key]);
      } else {
        newWO[key] = this[key];
      }
    }
    return newWO;
  }

}

---

@@ -6,7 +6,6 @@
-->
<ion-header>
  <ion-navbar>
    <!-- <ion-title>{{'report_title' | translate}}</ion-title> -->
    <ion-title>{{title}}</ion-title>
    <ion-buttons end>
      <button ion-button icon-only (click)="deleteWorkOrder(workOrder)" *ngIf="mode=='Edit'">
@@ -21,11 +20,11 @@
    <div class="work-order-payroll-hours-header">
      <span class="shift-hours-header" [ngClass]="getShiftHoursStatus(selectedShift)" *ngIf="workOrderForm && workOrderForm.value && workOrderForm.value.selected_shift">
        <span class="shift-label">{{'shift' | translate}}</span> #<span class="shift-number">{{selectedShift.updateShiftNumber()}}</span>
      <span class="shift-label">{{'hours' | translate}}</span>:
      <span class="shift-hours" *ngIf="mode==='Add'">{{shiftSavedHours+currentRepairHours}}</span>
      <span class="shift-hours" *ngIf="mode==='Edit'">{{shiftSavedHours+currentRepairHours-thisWorkOrderContribution}}</span>
      <span class="shift-label">{{'of' | translate}}</span>
      <span class="shift-hours">{{techProfile.shiftLength}}</span>
        <span class="shift-label">{{'hours' | translate}}</span>:
        <span class="shift-hours" *ngIf="mode==='Add'">{{shiftSavedHours+currentRepairHours}}</span>
        <span class="shift-hours" *ngIf="mode==='Edit'">{{shiftSavedHours+currentRepairHours-thisWorkOrderContribution}}</span>
        <span class="shift-label">{{'of' | translate}}</span>
        <span class="shift-hours">{{techProfile.shiftLength}}</span>
      </span>
    </div>
    <form [formGroup]="workOrderForm" (ngSubmit)="onSubmit()" *ngIf="dataReady">
@@ -44,21 +43,21 @@
      </ion-list>
      <ion-list *ngIf="type==='Travel'">
        <ion-item>
          <ion-label> Travel </ion-label>
          <ion-select formControlName='trvlLoc'>
            <ion-option *ngFor='let trvlLoc of selTrvlLoc' [value]='trvlLoc'>{{trvlLoc}}</ion-option>
          <ion-label>Travel</ion-label>
          <ion-select formControlName='travel_location'>
            <ion-option *ngFor='let travel_location of selTravelLocation' [value]='travel_location'>{{travel_location}}</ion-option>
          </ion-select>
        </ion-item>
        <ion-item>
          <ion-label>Travel Hours</ion-label>
          <ion-input formControlName='trvlTime'>{{trvlTime}} hrs </ion-input>
          <ion-input formControlName='travel_time'>{{travel_time}} hrs </ion-input>
        </ion-item>
      </ion-list>
      <ion-list *ngIf="type==='Training'">
        <ion-item>
          <ion-label>Training</ion-label>
          <ion-select formControlName='trnType'>
            <ion-option *ngFor='let trngType of selTrainingType' [value]='trngType'>{{trngType}}</ion-option>
          <ion-select formControlName='training_type'>
              <ion-option *ngFor='let training_type of selTrainingType' [value]='training_type'>{{training_type}}</ion-option>
          </ion-select>
        </ion-item>
        <ion-item>
@@ -74,11 +73,11 @@
        </ion-item>
        <ion-item>
          <ion-label floating>{{'unit_number' | translate}}</ion-label>
          <ion-input type='text' formControlName='uNum'></ion-input>
          <ion-input type='text' formControlName='unit_number'></ion-input>
        </ion-item>
        <ion-item>
          <ion-label floating>{{'work_order_number' | translate}}</ion-label>
          <ion-input type='text' formControlName='wONum'></ion-input>
          <ion-input type='text' formControlName='work_order_number'></ion-input>
        </ion-item>
        <ion-item>
          <ion-label floating>{{'job_notes' | translate}}</ion-label>
---
@@ -6,13 +6,12 @@ import { LoadingController, PopoverController, ModalController } from 'ionic-ang
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
import { ReportOther                                           } from '../../domain/reportother'          ;
import { Status                                                } from '../../providers/status'            ;
import { UserData                                              } from '../../providers/user-data'         ;
import { sprintf                                               } from 'sprintf-js'                        ;
@@ -43,6 +42,7 @@ export class ReportPage implements OnInit {
  workOrderForm             : FormGroup                                     ;
  workOrder                 : any                                           ;
  workOrderReport           : any                                           ;
  reportOther               : ReportOther      = null                       ;
  repairHrs                 : any                                           ;
  profile                   : any              = {}                         ;
  tmpReportData             : any                                           ;
@@ -65,7 +65,6 @@ export class ReportPage implements OnInit {
  shiftHoursColor           : string           = "black"                    ;
  shiftToUse                : Shift            = null                       ;
  shiftSavedHours           : number           = 0                          ;
  rprtDate                  : any                                           ;
  timeStarts                : any                                           ;
  reportDate                : any                                           ;
  startTime                 : any                                           ;
@@ -94,32 +93,31 @@ export class ReportPage implements OnInit {
  type                      : string                                        ;
  _type                     : any                                           ;
  selTrainingType           : string[] = TRAININGTYPE                       ;
  trngType                  : string = ""                                   ;
  _trngType                 : any                                           ;
  training_type             : string = ""                                   ;
  _training_type            : any                                           ;
  _training_time            : any                                           ;
  selTrvlLoc                : string[] = JOBSITES                           ;
  _trvlLoc                  : any                                           ;
  trvlLoc                   : string = ""                                   ;
  _trvlTime                 : any                                           ;
  selTravelLocation         : string[] = JOBSITES                           ;
  _travel_location          : any                                           ;
  travel_location           : string = ""                                   ;
  _travel_time              : any                                           ;


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
@@ -128,6 +126,7 @@ export class ReportPage implements OnInit {
    Log.l("Report.ngOnInit(): navParams are:\n", this.navParams);
    if (this.navParams.get('mode') !== undefined) { this.mode = this.navParams.get('mode'); }
    if (this.navParams.get('workOrder') !== undefined) { this.workOrder = this.navParams.get('workOrder'); }
    if (this.navParams.get('reportOther') !== undefined) { this.workOrder = this.navParams.get('reportOther'); }
    if (this.navParams.get('shift') !== undefined) { this.shiftToUse = this.navParams.get('shift'); }
    if (this.navParams.get('payroll_period') !== undefined) { this.period = this.navParams.get('payroll_period'); }
    if(this.shiftToUse !== null) {
@@ -173,28 +172,27 @@ export class ReportPage implements OnInit {
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
      this._type            = this.workOrderForm.controls['type'          ] ;
      this._training_type   = this.workOrderForm.controls['training_type' ] ;
      this._training_time   = this.workOrderForm.controls['training_time' ] ;
      this._travel_location = this.workOrderForm.controls['trvlLoc'       ] ;
      this._travel_time     = this.workOrderForm.controls['trvlTime'      ] ;
      this._endTime         = this.workOrderForm.controls['endTime'       ] ;
      this._repairHours     = this.workOrderForm.controls['repair_time'   ] ;
      this._selected_shift  = this.workOrderForm.controls['selected_shift'] ;
      this._notes           = this.workOrderForm.controls['notes'         ] ;

      this._type.valueChanges.subscribe((value: any) => { this.type = value; });
      this._trngType.valueChanges.subscribe((value: any) => {
        this.trngType = value;
      this._training_type.valueChanges.subscribe((value: any) => {
        this.training_type = value;
        let time =  value === 'SAFETY'         ? 2  :
                    value === 'PEC'            ? 8  :
                    value === 'FORKLIFT'       ? 3  :
                    value === 'OVERHEAD CRANE' ? 10 : 0;
        this._training_time.setValue(time);
      });
      this._trvlLoc.valueChanges.subscribe((value: any) => {
        this.trvlLoc = value;
      this._travel_location.valueChanges.subscribe((value: any) => {
        this.travel_location = value;
        let trvl =  value === 'BE MDL MNSHOP'         ? 6  :
                    value === 'HB FORT LUPTON MNSHOP' ? 20 :
                    value === 'HB ART PMPSHP'         ? 8  :
@@ -213,7 +211,7 @@ export class ReportPage implements OnInit {
                    value === 'KN SPR E-TECH'         ? 6  :
                    value === 'KN SPR MNSHOP'         ? 6  :
                    value === 'SE WES MNSHOP'         ? 0  : 0;
        this._trvlTime.setValue(trvl);
        this._travel_time.setValue(trvl);
      });
      this._training_time.valueChanges.subscribe((value: any) => { this.workOrder.training_time = value; });
      this.workOrderForm.valueChanges.debounceTime(500).subscribe((value: any) => {
@@ -257,7 +255,7 @@ export class ReportPage implements OnInit {
        let woStart = moment(shift.getStartTime()).add(woHoursSoFar, 'hours');
        this.workOrder.setStartTime(woStart);

        this.workOrderForm.controls.rprtDate.setValue(rprtDate.format("YYYY-MM-DD"));
        this.workOrderForm.controls.report_date.setValue(rprtDate.format("YYYY-MM-DD"));
      });
      this.shiftSavedHours = this.selectedShift.getNormalHours();
      this.dataReady = true;
@@ -274,23 +272,23 @@ export class ReportPage implements OnInit {
      rprtDate = moment(this.selectedShift.getStartTime());
      ts = moment().format();
    } else {
      rprtDate = moment(wo.rprtDate);
      rprtDate = moment(wo.report_date);
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
      'selected_shift'    : new FormControl(this.selectedShift                , Validators.required) ,
      'repair_time'       : new FormControl(wo.getRepairHoursString()         , Validators.required) ,
      'unit_number'       : new FormControl(wo.unit_number                    , Validators.required) ,
      'work_order_number' : new FormControl(wo.work_order_number              , Validators.required) ,
      'notes'             : new FormControl(wo.notes                          , Validators.required) ,
      'report_date'       : new FormControl(rprtDate.format("YYYY-MM-DD")     , Validators.required) ,
      'timestamp'         : new FormControl({ value: ts, disabled: true }     , Validators.required) ,
      'type'              : new FormControl(wo.type                           , Validators.required) ,
      'training_type'     : new FormControl(wo.training_type                  , Validators.required) ,
      'training_time'     : new FormControl( 2                                , Validators.required) ,
      'travel_location'   : new FormControl( wo.travel_location               , Validators.required) ,
      'travel_time'       : new FormControl( 6                                , Validators.required) ,
    });
  }

@@ -382,7 +380,7 @@ export class ReportPage implements OnInit {
    if (ss !== undefined && ss !== null) {
      let total = this.shiftSavedHours + this.currentRepairHours - this.thisWorkOrderContribution;
      let target = Number(this.techProfile.shiftLength);
      Log.l(`getShiftHoursStatus(): total = ${total}, target = ${target}.`);
      // Log.l(`getShiftHoursStatus(): total = ${total}, target = ${target}.`);
      if (total < target) {
        return 'darkred';
      } else if(total > target) {
@@ -461,48 +459,12 @@ export class ReportPage implements OnInit {

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
    let doc = this.workOrderForm.getRawValue();
    for(let propName in doc) {
      let property = doc[propName];
      this.workOrder[propName] = property;
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
    return this.workOrder.serialize(this.techProfile);
  }

  deleteWorkOrder(event, item) {
---