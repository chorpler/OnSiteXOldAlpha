import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IonicPage, NavController, NavParams, LoadingController, PopoverController, ModalController } from 'ionic-angular';
import 'rxjs/add/operator/debounceTime';
import { DBSrvcs } from '../../providers/db-srvcs';
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
import { SafePipe } from '../../pipes/safe';
import { TabsComponent } from '../../components/tabs/tabs';

@IonicPage({ name: 'WorkOrder' })
@Component({
  selector: 'page-work-order',
  templateUrl: 'work-order.html'
})

export class WorkOrderPage implements OnInit {
  title: string = 'Work Report';
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
  public shiftTotalHours:any = 0;
  public payrollPeriodHours:any = 0;
  public currentRepairHours:number = 0;
  public shiftHoursColor:string = "black";

  rprtDate: any = moment();
  timeStarts: any = moment();
  reportDate: any = moment();
  startTime: any = moment();
  timeEnds: any;
  syncError: boolean = false;
  chooseHours: any;
  chooseMins : any;
  db: any = {};
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
  // public selectedShiftText:string = "None a'tall";
  public selectedShiftText:string = "";
  public workOrderList:any;
  public filteredWOList:any;
  // , private dbSrvcs: DBSrvcs

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private dbSrvcs: DBSrvcs,
    private timeSrvc: TimeSrvc,
    public reportBuilder: ReportBuildSrvc,
    public loadingCtrl: LoadingController,
    public alert: AlertService,
    public modal: ModalController,
    public zone:NgZone,
    public tabs:TabsComponent,
    public ud:UserData)
  {
    this.db = this.dbSrvcs;
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
      // this.controlValueAccessor = {}
      this.techProfile = res;
      if(this.mode === 'Add') {
        this.workOrder = new WorkOrder();
      }
      this.setupShifts();
      this.setupWorkOrderList();
      this.initializeForm();
      this.updateActiveShiftWorkOrders(this.shifts[0]);

      this._startDate = this.workOrderForm.controls.rprtDate;
      this._startTime = this.workOrderForm.controls.timeStarts;
      this._endTime = this.workOrderForm.controls.endTime;
      this._repairHours = this.workOrderForm.controls.repair_time;
      this._selected_shift = this.workOrderForm.controls.selected_shift;
      this._notes = this.workOrderForm.controls.notes;
      this._startDate = this.workOrderForm.controls.rprtDate;
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
        Log.l("workOrderForm: overall valueChanges, ended up with work ordder:\n", this.workOrder);
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
        // this.getTotalHoursForShift(ss);
        // let shift_time = moment(ss.start_time);
        // let shift_serial = ss.getShiftSerial();
        // this.workOrder.shift_serial = shift_serial;
        // Log.l("workOrderForm: setting shift_serial to: ", shift_serial);
        // let shiftHours = this.techProfile.shiftLength;
        // let shiftStartsAt = this.techProfile.shiftStartTime;
        // this.shiftHoursColor = this.getShiftHoursStatus();
      });
      this.dataReady = true;
    }).catch((err) => {
      Log.l(`WorkOrderPage: Error getting tech profile!`);
      Log.e(err);
    });


    // this._startDate.valueChanges.subscribe((value: any) => {
    //   Log.l("valueChanged for _locID:\n", value);
    //   this.locIDChanged(this._locID.value);
    // });
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
  }

  public setupWorkOrderList() {
    let tmpWOL = new Array<WorkOrder>();
    if(this.ud.woArrayInitialized) {
      tmpWOL = this.ud.getWorkOrderList();
    }
    this.workOrderList = tmpWOL;
    Log.l("setupWorkOrderList(): Got work order list:\n", tmpWOL);
  }

  /**
   * Sets up shifts for the past week.
   *                                   now.add(x, 'days')
   * today | Shift | Day num | Wed | Thu | Fri | Sat | Sun | Mon | Tue |
   * ====================================================================
   * Wed   |  1    |  3      |  0  | -6  | -5  | -4  | -3  | -2  | -1  |
   * Thu   |  2    |  4      | -1  |  0  | -6  | -5  | -4  | -3  | -2  |
   * Fri   |  3    |  5      | -2  | -1  |  0  | -6  | -5  | -4  | -3  |
   * Sat   |  4    |  6      | -3  | -2  | -1  |  0  | -6  | -5  | -4  |
   * Sun   |  5    |  7      | -4  | -3  | -2  | -1  |  0  | -6  | -5  |
   * Mon   |  6    |  1      | -5  | -4  | -3  | -2  | -1  |  0  | -6  |
   * Tue   |  7    |  2      | -6  | -5  | -4  | -3  | -2  | -1  |  0  |
   * Conclusion: get current day number. Subtract 3. Unshift to array.
   * Loop 7 times, subtracting one additional day per time.
   * @method setupShifts
   */
  setupShifts() {
    let endDay = 2;
    let now = moment();
    for (let i = 0; i < 7; i++) {
      let tmpDay = moment(now).subtract(i, 'days');
      let shift_day = tmpDay.startOf('day');
      let tmpStart = this.techProfile.shiftStartTime;
      let shift_start_time = moment(shift_day).add(tmpStart, 'hours');
      // let shiftStartDay = moment(now).subtract(i, 'days');
      let client = this.techProfile.client || "SITENAME";
      let thisShift = new Shift(client, null, 'AM', shift_start_time, 8);
      thisShift.updateShiftWeek();
      thisShift.updateShiftNumber();
      thisShift.getExcelDates();
      this.shifts.push(thisShift);
      Log.l(`Now adding day ${i}: ${moment(shift_day).format()}`);
    }
    if(this.mode === 'Add') {
      this.selectedShift = this.shifts[0];
    } else {
      let woShiftSerial = this.workOrder.shift_serial;
      for(let shift of this.shifts) {
        if(shift.getShiftSerial() === woShiftSerial) {
          this.selectedShift = shift;
          break;
        }
      }
    }
    this.selectedShiftText = this.selectedShift.toString();
    // let startTime = moment(this.shifts[0].shift_time);
    // let shift = this.shifts[0];
    // let shiftStartDay = moment(this.selectedShift.start_time);
    if(this.mode === 'Add') {
      this.workOrder.setStartTime(moment(this.selectedShift.start_time));
    }
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

  private initializeForm() {
    let wo = this.workOrder;
    let rprtDate = moment(this.shifts[0].getStartTime());
    let ts = wo.timestamp || moment().format();
    this.workOrderForm = new FormGroup({
      // 'timeStarts': new FormControl(this.startTime.format("HH:00"), Validators.required),
      // 'timeEnds': new FormControl(null, Validators.required),
      'selected_shift': new FormControl(this.shifts[0], Validators.required),
      'repair_time': new FormControl(wo.getRepairHoursString(), Validators.required),
      'uNum': new FormControl(wo.unit_number, Validators.required),
      'wONum': new FormControl(wo.work_order_number, Validators.required),
      'notes': new FormControl(wo.notes, Validators.required),
      'rprtDate': new FormControl(rprtDate.format("YYYY-MM-DD"), Validators.required),
      'timeStamp': new FormControl({ value: ts, disabled: true }, Validators.required)
      // 'timeStamp': new FormControl({ value: moment().format(), disabled: true }, Validators.required)
    });
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
    // let shift_num = shift.updateShiftNumber();
    // let shift_week = moment(shift.getShiftWeek());
    // let shift_day  = moment(shift.shift_time);
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
    // this.workOrder._id = docID;
    Log.l("genReportID(): Generated ID:\n", docID);
    return docID;
  }

  convertFormToWorkOrder() {
    let sWO = this.workOrderForm.getRawValue();
    let wo = this.workOrder;

  }

  processWO() {
    let workOrderData = this.workOrderForm.getRawValue();
    this.alert.showSpinner("Saving...");

    // return new Promise((resolve, reject) => {
    let tempWO = this.createReport();
    if(this.mode === 'Add') {
      this.dbSrvcs.addDoc(tempWO).then((res) => {
        Log.l("processWO(): Successfully saved work order to local database. Now synchronizing to remote.\n", res);
        return this.db.syncSquaredToServer('reports');
      }).then((res) => {
        Log.l("processWO(): Successfully synchronized work order to remote.");
        this.alert.hideSpinner();
        // setTimeout(() => { this.navCtrl.setRoot('OnSiteHome'); });
        setTimeout(() => { this.tabs.goHome() });
      }).catch((err) => {
        Log.l("processWO(): Error saving work order to local database.");
        Log.e(err);
        this.alert.hideSpinner();
        // reject(err);
      });
    } else {
      this.dbSrvcs.updateDoc(tempWO).then((res) => {
        Log.l("processWO(): Successfully saved work order to local database. Now synchronizing to remote.\n", res);
        return this.db.syncSquaredToServer('reports');
      }).then((res) => {
        Log.l("processWO(): Successfully synchronized work order to remote.");
        this.alert.hideSpinner();
        // setTimeout(() => { this.navCtrl.setRoot('OnSiteHome'); });
        setTimeout(() => { this.tabs.goHome() });
      }).catch((err) => {
        Log.l("processWO(): Error saving work order to local database.");
        Log.e(err);
        this.alert.hideSpinner();
        // reject(err);
      });
    }
  }

  cancel() {
    Log.l("WorkOrderPage: User canceled work order.");
    // setTimeout(() => { this.tabs.goHome() });
    this.tabs.goHome();
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
    // if(wo._rev !== undefined && wo._rev !== null && wo._rev !== '') {
    //   newReport._rev = wo._rev;
    // }
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
}

