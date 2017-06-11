import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { NumericModule } from 'ionic2-numberpicker';
import * as moment from 'moment';
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
// import { DatePickerDirective } from 'datepicker-ionic2';
// import { MultiPickerModule } from 'ion-multiz`-picker';
import { TimeDurationPickerModule } from 'angular2-time-duration-picker';
import { DatePickerModule } from 'ng2-datepicker';
import {sprintf} from 'sprintf-js';

@IonicPage({ name: 'Work Order Form' })
@Component({
  selector: 'page-work-order',
  templateUrl: 'work-order.html'
})

export class WorkOrderPage implements OnInit {
  // @ViewChild('reportDate') reportDateField;
  // @ViewChild('startTime') startTimeField;
  // @ViewChild(DatePickerDirective) private datepickerDirective: DatePickerDirective;

  title: string = 'Work Report';
  setDate: Date = new Date();
  year: number = this.setDate.getFullYear();
  mode: string = 'New';
  workOrderForm: FormGroup;
  workOrder: any;
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

  controlValueAccessor: any;
  public dataReady: boolean = false;
  // , private dbSrvcs: DBSrvcs

  constructor(public navCtrl: NavController, public navParams: NavParams, private dbSrvcs: DBSrvcs, private timeSrvc: TimeSrvc, public reportBuilder: ReportBuildSrvc, public loadingCtrl: LoadingController, public alert: AlertService) {
    this.db = this.dbSrvcs;
    this.shifter = Shift;
    window["workorder"] = this;
  }

  ionViewDidLoad() { console.log('ionViewDidLoad WorkOrder'); }

  ngOnInit() {
    if (this.navParams.get('mode') !== undefined) { this.mode = this.navParams.get('mode'); }
    console.log(this.mode);
    console.log(this.setDate);
    console.log(this.year);
    console.log(this.rprtDate);

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
      Log.l(`WorkOrder: Success getting tech profile! Result:\n`, res);
      // this.controlValueAccessor = {}
      this.techProfile = res;
      this.setupShifts();
      this.initializeForm();
      this._startDate = this.workOrderForm.controls.rprtDate;
      this._startTime = this.workOrderForm.controls.timeStarts;
      this._endTime = this.workOrderForm.controls.endTime;
      this._repairHours = this.workOrderForm.controls.repairHours;
      this._shift = this.workOrderForm.controls.selected_shift;
      // this._startDate = this.workOrder.controls['rprtDate'];
      this.workOrderForm.valueChanges.debounceTime(500).subscribe((value: any) => {
        Log.l("workOrderForm: valueChanges fired for:\n", value);
        if (value.selected_shift != null) {
          let shiftHours = this.techProfile.shiftLength;
          let shiftStartsAt = this.techProfile.shiftStartTime;
          // let shiftStartDay = 
        }
      });
      this.dataReady = true;
    }).catch((err) => {
      Log.l(`WorkOrder: Error getting tech profile!`);
      Log.e(err);
    });


    // this._startDate.valueChanges.subscribe((value: any) => {
    //   Log.l("valueChanged for _locID:\n", value);
    //   this.locIDChanged(this._locID.value);
    // });
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
      // if(moment(now).day() == 3) {
      //   /* Today is Wednesday, so the shift start day will be today */

      // } else {

      // }
      let shift_day = moment(now).subtract(i, 'days');
      // let shiftStartDay = moment(now).subtract(i, 'days');
      let thisShift = new Shift('SITENAME', null, 'AM', shift_day, 8);
      thisShift.updateShiftWeek();
      this.shifts.push(thisShift);
      Log.l(`Now adding day ${i}: ${moment(shift_day).format()}`);
    }

  }

  private initializeForm() {
    this.workOrderForm = new FormGroup({
      // 'timeStarts': new FormControl(this.startTime.format("HH:00"), Validators.required),
      'selected_shift': new FormControl('', Validators.required),
      // 'timeEnds': new FormControl(null, Validators.required),
      'repair_time': new FormControl(null, Validators.required),
      'uNum': new FormControl(null, Validators.required),
      'wONum': new FormControl(null, Validators.required),
      'notes': new FormControl(null, Validators.required),
      'rprtDate': new FormControl(this.reportDate.format("YYYY-MM-DD"), Validators.required),
      'timeStamp': new FormControl({ value: Date(), disabled: true }, Validators.required)
    });
  }

  getTotalHoursForShift() {
    let shift = this.selectedShift;
    
  }

  onSubmit() {
    this.processWO();
  }

  /**
   * Calcualtes workOrderData.timeEnds given workOrderData.timeStarts
   * and workOrderData.repairHrs
   *
   * @private
   * @param {any} workOrderData
   *
   * @memberOf WorkOrder
   */
  public calcEndTime(workOrderData) {
    Log.l("Calculating end time for:\n", workOrderData);
    // const _Xdec = /(00|15|30|45)(?!\:\d{2})/;
    // const _Xhrs = /([0-9]{2})(?=:\d{2})/;

    // this.prsHrs = _Xhrs.exec(workOrderData.timeStarts);
    // this.strtHrs = parseInt(this.prsHrs[0]).toString();
    // this.prsMin = _Xdec.exec(workOrderData.timeStarts);

    // if (parseInt(this.prsMin[0]) === 0) {
    //   this.strtMin = '00';
    // }
    // else if (parseInt(this.prsMin[0]) === 15) {
    //   this.strtMin = '15';
    // }
    // else if (parseInt(this.prsMin[0]) === 30) {
    //   this.strtMin = '30';
    // }
    // else {
    //   this.strtMin = '45';
    // }

    // workOrderData.timeStarts = this.strtHrs + ':' + this.strtMin;

    // this.hrsHrs = Math.floor(workOrderData.repairHrs);
    // this.hrsMin = (workOrderData.repairHrs%1)*60;

    // if (parseInt(this.strtMin) + this.hrsMin > 60) {

    //   if (parseInt(this.strtHrs) + this.hrsHrs + 1 > 24)
    //         { this.endHrs = parseInt(this.strtHrs) + this.hrsHrs -23; this.endMin = parseInt(this.strtMin) + this.hrsMin - 60; }
    //   else  { this.endHrs = parseInt(this.strtHrs) + this.hrsHrs + 1; this.endMin = parseInt(this.strtMin) + this.hrsMin - 60; }
    // }

    // else {
    //   if (parseInt(this.strtHrs) + this.hrsHrs > 24)
    //         { this.endHrs = parseInt(this.strtHrs) + this.hrsHrs -24; this.endMin = parseInt(this.strtMin) + this.hrsMin;      }
    //   else  { this.endHrs = parseInt(this.strtHrs) + this.hrsHrs;     this.endMin = parseInt(this.strtMin) + this.hrsMin;      }
    // }

    // if( this.endHrs < 10 ) {
    //   if( this.endHrs === 0 ) { this.endHrs = '00'       }
    //   else { this.endHrs = '0' + this.endHrs.toString(); }
    // } else { this.endHrs = this.endHrs.toString();       }

    // if( this.endMin === 0 ) { this.endMin = '00';        }
    // if( this.hrsMin === 0 ) { this.hrsMin = '00';        }

    // this.timeEnds           = this.endHrs + ':' + this.endMin;
    // workOrderData.timeEnds  = this.endHrs + ':' + this.endMin;
    // workOrderData.repairHrs = this.hrsHrs + ':' + this.hrsMin;

    // console.log(this.strtHrs);
    // console.log(this.endHrs);

    // workOrderData.repairHrs = this.hrsHrs + ':' + this.hrsMin;
  }

  genReportID() {
    // this.timeSrvc.getParsedDate();
    // this.idDate = this.timeSrvc._arrD[1].toString() +
    //               this.timeSrvc._arrD[2].toString() +
    //               this.timeSrvc._arrD[0].toString() +
    //               this.timeSrvc._arrD[3].toString();
    // this.idTime = this.timeSrvc._arrD[4].toString() +
    //               this.timeSrvc._arrD[5].toString() +
    //               this.timeSrvc._arrD[6].toString();
    //   console.log( this.idDate );
    // let firstInitial = this.profile.firstName.slice(0,1);
    // let lastInitial = this.profile.lastName.slice(0,1);
    this.docID = this.profile.avatarName + '_' + this.idDate + this.idTime;
    console.log(this.docID);
  }

  processWO() {
    const workOrderData = this.workOrder.getRawValue();
    // workOrderData.timeStamp = Date();
    this.calcEndTime(workOrderData);
    console.log("processWO() has initial workOrderData:");
    console.log(workOrderData);

    this.alert.showSpinner("Saving...");

    return new Promise((resolve, reject) => {
      this.dbSrvcs.checkLocalDoc('_local/techProfile').then((docExists) => {
        if (docExists) {
          console.log("processWO(): docExists is true");
          this.dbSrvcs.getDoc('_local/techProfile').then(res => {
            this.profile = res;
            if (typeof this.profile.avatarName == 'undefined') {
              this.profile.avatarName = 'PaleRider';
            }
            delete this.profile._id;
            delete this.profile._rev;
            this.genReportID();
            if (typeof this.profile.updated == 'undefined') {
              /* This shouldn't happen as long as the user is logged in and the profile was created */
              Log.l("processWO(): Tech profile does not exist at all. This should not happen.");
              setTimeout(() => { this.navCtrl.setRoot('Tech Settings'); });
              // resolve(false);
              resolve(-1);
            } else if (typeof this.profile.updated != 'undefined' && this.profile.updated === false) {
              /* Update flag exists but is false, so tech needs to verify settings */
              Log.l("processWO(): Update flag exists in profile, but is false. Need tech to OK settings changes.");
              this.tmpReportData = workOrderData;
              this.tmpReportData._id = '_local/tmpReport';
              this.tmpReportData.docID = this.docID;
              // this.tmpReportData._rev = ;
              Log.l("processWO(): tmpReportData is: ", this.tmpReportData);
              this.dbSrvcs.addLocalDoc(this.tmpReportData).then((res) => {
                Log.l("processWO(): Created temporary work report. Now going to Settings page to OK changes.");
                Log.l(res);
                this.alert.hideSpinner();
                setTimeout(() => { this.navCtrl.setRoot('Tech Settings'); });
                // resolve(res);
                resolve(-2);
              }).catch((err) => {
                Log.l("processWO(): Error trying to save temporary work report! Can't take tech to settings page!");
                Log.w(err);
                // resolve(false);
                resolve(-3);
              });

              /* Notify user and go to Settings page */
              this.alert.hideSpinner();
              setTimeout(() => { this.navCtrl.setRoot('Tech Settings'); });
              resolve(-4);
            } else {
              /* Update flag is true, good to submit work order */
              console.log("processWO(): docExists is false");
              this.tmpReportData = workOrderData;
              this.tmpReportData.profile = this.profile;
              this.tmpReportData._id = '_local/tmpReport';
              this.tmpReportData.docID = this.docID;
              // this.tmpReportData._rev = '0-1';
              console.log("processWO(): Update flag set, tmpReportData is:");
              console.log(this.tmpReportData);

              this.dbSrvcs.addLocalDoc(this.tmpReportData).then((res) => {
                console.log("processWO(): About to generate work order");
                return this.reportBuilder.getLocalDocs();
              }).then((final) => {
                console.log("processWO(): Done generating work order.");
                return this.db.syncSquaredToServer('reports');
              }).then((final2) => {
                Log.l("processWO(): Successfully synchronized work order to CouchDB server!");
                Log.l(final2);
                this.alert.hideSpinner();
                setTimeout(() => { this.navCtrl.setRoot('OnSiteHome'); });
                // resolve(final2);
                resolve(-5);
              }).catch((err) => {
                Log.l("processWO(): Error while trying to sync work order to CouchDB server!");
                Log.w(err);
                this.syncError = true;
                // resolve(false);
                resolve(-6);
              });
            }
          }).catch((anotherError) => {
            Log.l("processWO(): Could not retrieve _local/techProfile. Please set it up again.");
            Log.w(anotherError);
            this.alert.hideSpinner();
            // resolve(false);
            setTimeout(() => { this.navCtrl.setRoot('Tech Settings'); });
            resolve(-7);
          })
        } else {
          console.error("processWO(): Tech profile does not exist. Contact developers.");
          // resolve(false);
          resolve(-8);
        }
      }).catch((outerError) => {
        Log.l("processWO(): Error checking existence of local document _local/techProfile.");
        Log.w(outerError);
        // resolve(false);
        resolve(-9);
      });
    });
  }
}

