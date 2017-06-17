import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IonicPage, NavController, NavParams, LoadingController, PopoverController, ModalController } from 'ionic-angular';
import 'rxjs/add/operator/debounceTime';
import { DBSrvcs } from '../../providers/db-srvcs';
import { SrvrSrvcs } from '../../providers/srvr-srvcs';
import { AuthSrvcs } from '../../providers/auth-srvcs';
import { TimeSrvc } from '../../providers/time-parse-srvc';
import { ReportBuildSrvc } from '../../providers/report-build-srvc';
import { AlertService } from '../../providers/alerts';
import { Log } from '../../config/config.functions';
import { Shift } from '../../domain/shift';
import { WorkOrder } from '../../domain/workorder';
import { Status } from '../../providers/status';
import { UserData } from '../../providers/user-data';
import moment from 'moment';
import { sprintf } from 'sprintf-js';
import { MultiPickerModule } from 'ion-multi-picker';
import { FancySelectComponent } from '../../components/fancy-select/fancy-select';
import { PREFS, STRINGS                     } from '../../config/config.strings'          ;
import { TabsComponent } from '../../components/tabs/tabs';
import { TranslateService } from '@ngx-translate/core';

@IonicPage({ name: 'WorkOrder' })
@Component({
  selector: 'page-work-order',
  templateUrl: 'work-order.html'
})

export class WorkOrderPage implements OnInit {
  title: string = 'Work Report';
  static PREFS:any = new PREFS();
  prefs:any = WorkOrderPage.PREFS;

  setDate: Date = new Date();
  year: number = this.setDate.getFullYear();
  mode: string = 'Add';
  workOrderForm: FormGroup;
  workOrder: any;
  workOrderReport: any;
  repairHrs: any;
  profile: any = {};
  tmpReportData: any;
  techProfile:any;
  docID: string;
  idDate: string;
  idTime: string;
  shifts: Array<Shift>;
  selectedShift: Shift;
  currentDay: any;
  shiftsStart: any;
  shifter: any;
  repairTime: any;
  public thisWorkOrderContribution:number = 0;
  public shiftTotalHours:any = 0;
  public payrollPeriodHours:any = 0;
  public currentRepairHours:number = 0;
  public shiftHoursColor:string = "black";

  rprtDate: any;
  timeStarts: any;
  reportDate: any;
  startTime: any;
  timeEnds: any;
  syncError: boolean = false;
  chooseHours: any;
  chooseMins : any;
  loading: any = {};
  _startDate: any;
  _startTime: any;
  _endTime: any;
  _repairHours: any;
  _shift: any;
  _selected_shift: any;
  _notes: any;

  public userdata:any;
  public shiftDateOptions:any;

  controlValueAccessor: any;
  public dataReady: boolean = false;

  public techWorkOrders:Array<WorkOrder> = [];

  public shiftDateInputDisabled:boolean = true;
  public shiftDateInput2Disabled:boolean = false;
  public selectedShiftText:string = "";
  public workOrderList:any;
  public filteredWOList:any;

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
    public zone:NgZone,
    public tabs:TabsComponent,
    public ud:UserData,
    public translate:TranslateService)
  {
    this.shifter = Shift;
    this.userdata = UserData;
    window["workorder"] = this;
  }

  ionViewDidLoad() { console.log('ionViewDidLoad WorkOrder'); }

  ngOnInit() {
    if (this.navParams.get('mode') !== undefined) { this.mode = this.navParams.get('mode'); }
    if(this.navParams.get('workOrder') !== undefined) { this.workOrder = this.navParams.get('workOrder'); }
    this.title = `${this.mode} Work Order`;

    this.chooseHours = [
      {"name": "Hours", "options": [] },
      {"name": "Minutes", "options": [] }
    ]

    for(let i = 0; i < 100; i++) {
      let j = sprintf("%02d", i);
      let o1 = {'text': j, 'value': j};
      this.chooseHours[0].options.push(o1);
    }
    let o1 = {'text': '00', 'value': '00'};
    this.chooseHours[1].options.push({'text': '00', 'value': '00'});
    this.chooseHours[1].options.push({'text': '30', 'value': '30'});

    this.shifts = [];
    this.db.getTechProfile().then((res) => {
      Log.l(`WorkOrderPage: Success getting tech profile! Result:\n`, res);
      this.techProfile = res;
      if(this.mode === 'Add') {
        this.workOrder = new WorkOrder();
      }
      this.setupShifts();
      this.setupWorkOrderList();
      this.updateActiveShiftWorkOrders(this.selectedShift);
      if(this.mode === 'Add') {
        let startTime = moment(this.selectedShift.start_time);
        let addTime = this.selectedShift.getShiftHours();
        let newStartTime = moment(startTime).add(addTime, 'hours');
        Log.l("WorkOrderPage: Now setting work order start time. Start Time = %s, adding %f hours, gives:\n", startTime.format(), addTime, newStartTime);
        this.workOrder.setStartTime(newStartTime);
      }
      this.thisWorkOrderContribution = this.workOrder.repair_hours || 0;
      this.initializeForm();

      this._endTime = this.workOrderForm.controls.endTime;
      this._repairHours = this.workOrderForm.controls.repair_time;
      this._selected_shift = this.workOrderForm.controls.selected_shift;
      this._notes = this.workOrderForm.controls.notes;
      this.workOrderForm.valueChanges.debounceTime(500).subscribe((value: any) => {
        Log.l("workOrderForm: valueChanges fired for:\n", value);
        let notes = value.notes;
        let unit = value.uNum;
        let woNum = value.woNum;
        let fields = [['notes', 'notes'], ['wONum','work_order_number'],['uNum', 'unit_number']];
        let len = fields.length;
        for(let i = 0; i < len; i++) {
          let key1 = fields[i][0];
          let key2 = fields[i][1];
          if(value[key1] !== null && value[key1] !== undefined) {
            this.workOrder[key2] = value[key1];
          }
        }
        Log.l("workOrderForm: overall valueChanges, ended up with work order:\n", this.workOrder);
      });
      this._repairHours.valueChanges.subscribe((hours:any) => {
        Log.l("workOrderForm: valueChanges fired for repair_hours: ", hours);
        let dur1 = hours.split(":");
        let hrs = Number(dur1[0]);
        let min = Number(dur1[1]);
        let iDur = hrs + (min / 60);
        this.currentRepairHours = iDur;
        this.workOrder.setRepairHours(iDur);
        if(this.selectedShift !== undefined && this.selectedShift !== null) {
          this.shiftHoursColor = this.getShiftHoursStatus(this.selectedShift);
        } else {
          this.shiftHoursColor = this.getShiftHoursStatus(this.shifts[0]);
        }
      })
      this._selected_shift.valueChanges.subscribe((shift:any) => {
        Log.l("workOrderForm: valueChanges fired for selected_shift:\n", shift);
        let ss = shift;
        this.updateActiveShiftWorkOrders(shift);
        let rprtDate = moment(shift.getStartTime());
        let woHoursSoFar = shift.getShiftHours();
        let woStart = moment(shift.getStartTime()).add(woHoursSoFar, 'hours');
        this.workOrder.setStartTime(woStart);

        this.workOrderForm.controls.rprtDate.setValue(rprtDate.format("YYYY-MM-DD"));
      });
      this.dataReady = true;
    }).catch((err) => {
      Log.l(`WorkOrderPage: Error getting tech profile!`);
      Log.e(err);
    });
  }

  private initializeForm() {
    let wo = this.workOrder;
    let ts, rprtDate;
    if(this.mode == 'Add') {
      rprtDate = moment(this.selectedShift.getStartTime());
      ts = moment().format();
    } else {
      rprtDate = moment(wo.rprtDate);
    }
    ts = moment().format();
    this.currentRepairHours = wo.getRepairHours();
    this.workOrderForm = new FormGroup({
      // 'selected_shift': new FormControl(this.shifts[0], Validators.required),
      'selected_shift': new FormControl(this.selectedShift, Validators.required),
      'repair_time': new FormControl(wo.getRepairHoursString(), Validators.required),
      'uNum': new FormControl(wo.unit_number, Validators.required),
      'wONum': new FormControl(wo.work_order_number, Validators.required),
      'notes': new FormControl(wo.notes, Validators.required),
      'rprtDate': new FormControl(rprtDate.format("YYYY-MM-DD"), Validators.required),
      'timeStamp': new FormControl({ value: ts, disabled: true }, Validators.required)
    });
  }

  public updateActiveShiftWorkOrders(shift:Shift) {
    let ss = shift;
    this.getTotalHoursForShift(ss);
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
    if(this.ud.woArrayInitialized) {
      tmpWOL = this.ud.getWorkOrderList();
    }
    this.workOrderList = tmpWOL;
    Log.l("setupWorkOrderList(): Got work order list:\n", tmpWOL);
  }

  setupShifts() {
    let endDay = 2;
    let now = moment();
    for (let i = 0; i < STRINGS.NUMBER_OF_SHIFTS; i++) {
      let tmpDay = moment(now).subtract(i, 'days');
      let shift_day = tmpDay.startOf('day');
      let tmpStart = this.techProfile.shiftStartTime;
      let shift_start_time = moment(shift_day).add(tmpStart, 'hours');
      let shift_length = this.techProfile.shiftLength;
      let client = this.techProfile.client || "SITENAME";
      let thisShift = new Shift(client, null, 'AM', shift_start_time, 8);
      thisShift.updateShiftWeek();
      thisShift.updateShiftNumber();
      thisShift.getExcelDates();
      this.shifts.push(thisShift);
    }
    if(this.mode === 'Add') {
      this.selectedShift = this.shifts[0];
    } else {
      let woShiftSerial = this.workOrder.shift_serial;
      for(let shift of this.shifts) {
        if(shift.getShiftSerial() === woShiftSerial) {
          this.selectedShift = shift;
          Log.l("EditWorkOrder: setting active shift to:\n", shift);
          break;
        }
      }
    }
    this.selectedShiftText = this.selectedShift.toString();
  }

  public showFancySelect() {
    Log.l("showFancySelect(): Called!");
    let options = [];
    let selectData = {options: options};
    for(let shift of this.shifts) {
      let option = {shift: shift};
      options.push(option);
    }
    selectData.options = options;
    Log.l("showFancySelect(): About to create modal, selectData is:\n", selectData);
    let fancySelectModal = this.modal.create('Fancy Select', { title: "Select Shift", selectData: selectData}, { cssClass: 'fancy-select-modal'});
    fancySelectModal.onDidDismiss(data => {
      Log.l("WorkOrderPage: Returned from fancy select, got back:\n", data);
      if(data != null) {
        this.selectedShift = data;
        this.selectedShiftText = this.selectedShift.toString();
        this.workOrderForm.controls['selected_shift'].setValue(this.selectedShift);
      }
    });
    fancySelectModal.present();
  }

  getTotalHoursForShift(shift:Shift) {
    let ss = shift;
    if (ss === undefined || ss === null ) {
      Log.l("getTotalHoursForShift(): no selected shift somehow.");
    } else {
      let shiftID = shift.getShiftSerial();
      this.workOrder.shift_serial = shiftID;
      Log.l("getTotalHoursForShift(): set work order shift_serial to:\n", shiftID);
      let filteredList = this.ud.getWorkOrdersForShift(shiftID);
      this.filteredWOList = filteredList;
      Log.l("getTotalHoursForShift(): Ended up with filtered work order list:\n", filteredList);
      let totalHours = 0;
      for(let wo of filteredList) {
        totalHours += Number(wo['repair_hours']);
      }
      ss.shift_hours = totalHours;
      Log.l(`getTotalHoursForShift(): Total hours for shift '${shiftID}' are ${totalHours}.`);
    }

  }

  getNumberClass(i) {
    let shift = this.shifts[i];
    let shiftColor = shift.getShiftColor();
    Log.l(`getNumberClass(): Shift color is: '${shiftColor}'`);
    return shift.getShiftColor();
  }

  getShiftHoursStatus(shift:Shift) {
    let ss = shift;
    if(ss !== undefined && ss !== null) {
      let subtotal = Number(ss.getShiftHours());
      let newhours = Number(this.workOrder.getRepairHours());
      let target = Number(this.techProfile.shiftLength);
      let total = subtotal + newhours;
      Log.l(`getShiftHoursStatus(): total = ${total}, target = ${target}.`);
      if(total === target) {
        return 'green';
      } else {
        return 'red';
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
    if(this.mode === 'Add') {
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
        // setTimeout(() => { this.tabs.goToPage('History') });
        // this.tabs.goToPage('History');
      }).catch((err) => {
        Log.l("processWO(): Error saving work order to local database.");
        Log.e(err);
        this.alert.hideSpinner();
        this.alert.showAlert('ERROR', 'Error saving work report. Please try again later.');
      });
    }
  }

  cancel() {
    Log.l("WorkOrderPage: User canceled work order.");
    // setTimeout(() => { this.tabs.goHome() });
    if(this.mode === 'Add') {
      this.tabs.goToPage('OnSiteHome');
    } else {
      this.tabs.goToPage('ReportHistory');
    }
  }

  createReport() {
    Log.l("WorkOrderPage: createReport(): Now creating report...");
    let partialReport = this.workOrderForm.getRawValue();
    let ts = moment(partialReport.timeStamp);
    let wo = this.workOrder;
    Log.l("createReport(): timestamp moment is now:\n", ts);
    let XLDate = moment([1900, 0, 1]);
    let xlStamp = ts.diff(XLDate, 'days', true) + 2;
    // workOrderData.timeStamp = moment(workOrderData.timeStamp).format;
    partialReport.timeStamp = xlStamp;
    // this.calcEndTime(workOrderData);
    console.log("processWO() has initial partialReport:");
    console.log(partialReport);
    let newReport:any = {};
    let newID = this.genReportID();
    if(this.mode !== 'Add') {
      newID = wo._id;
    }
    if(this.mode === 'Edit') {
      newReport._rev = wo._rev;
    }
    newReport._id            = newID                             ;
    newReport.timeStarts     = wo.time_start.format()            ;
    newReport.timeEnds       = wo.time_end.format()              ;
    newReport.repairHrs      = wo.repair_hours                   ;
    newReport.shiftSerial    = wo.shift_serial                   ;
    newReport.payrollPeriod  = wo.payroll_period                 ;
    newReport.uNum           = partialReport.uNum                ;
    newReport.wONum          = partialReport.wONum               ;
    newReport.notes          = partialReport.notes               ;
    newReport.rprtDate       = partialReport.rprtDate            ;
    newReport.timeStamp      = partialReport.timeStamp           ;
    newReport.lastName       = this.techProfile.lastName         ;
    newReport.firstName      = this.techProfile.firstName        ;
    newReport.client         = this.techProfile.client           ;
    newReport.location       = this.techProfile.location         ;
    newReport.locID          = this.techProfile.locID            ;
    newReport.loc2nd         = this.techProfile.loc2nd           ;
    newReport.shift          = this.techProfile.shift            ;
    newReport.shiftLength    = this.techProfile.shiftLength      ;
    newReport.shiftStartTime = this.techProfile.shiftStartTime   ;
    newReport.technician     = this.techProfile.technician       ;
    newReport.username       = this.techProfile.avatarName       ;
    this.workOrderReport = newReport;
    return newReport;
  }

  deleteWorkOrder(event, item) {
    Log.l("deleteWorkOrder() clicked ...");
    this.alert.showConfirm('CONFIRM', 'Delete this work report?').then((res) => {
      if(res) {
        this.alert.showSpinner('Deleting work report...');
        Log.l("deleteWorkOrder(): User confirmed deletion, deleting...");
        let wo = this.workOrder.clone();
        let woList = this.ud.getWorkOrderList();
        let i = woList.indexOf(this.workOrder);
        this.server.deleteDoc(this.prefs.DB.reports, wo).then((res) => {
          Log.l("deleteWorkOrder(): Success:\n", res);
          // this.items.splice(i, 1);
          woList.splice(i, 1);
          if(this.mode === 'Add') {
            this.alert.hideSpinner();
            this.tabs.goToPage('OnSiteHome');
          } else {
            this.alert.hideSpinner();
            this.tabs.goToPage('ReportHistory');
          }
        }).catch((err) => {
          this.alert.hideSpinner();
          Log.l("deleteWorkOrder(): Error!");
          Log.e(err);
          this.alert.showAlert('ERROR', 'Error deleting work report. Please try again later.');
        });
      } else {
        Log.l("User canceled deletion.");
      }
    }).catch((err) => {
      this.alert.hideSpinner();
      Log.l("deleteWorkOrder(): Error!");
      Log.e(err);
      this.alert.showAlert('ERROR', 'Error deleting work report. Please try again later.');
    });
  }



}

