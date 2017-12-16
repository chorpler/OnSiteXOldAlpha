import 'rxjs/add/operator/debounceTime'                                                         ;
import { sprintf                                               } from 'sprintf-js'              ;
import { Component, OnInit, ViewChild, NgZone, OnDestroy,      } from '@angular/core'           ;
import { AfterViewInit, ElementRef,                            } from '@angular/core'           ;
import { FormsModule, ReactiveFormsModule                      } from "@angular/forms"          ;
import { FormBuilder, FormGroup, FormControl, Validators       } from "@angular/forms"          ;
import { IonicPage, NavController, NavParams                   } from 'ionic-angular'           ;
import { LoadingController, PopoverController, ModalController } from 'ionic-angular'           ;
import { DBSrvcs                                               } from 'providers/db-srvcs'      ;
import { SrvrSrvcs                                             } from 'providers/srvr-srvcs'    ;
import { AuthSrvcs                                             } from 'providers/auth-srvcs'    ;
import { AlertService                                          } from 'providers/alerts'        ;
import { SmartAudio                                            } from 'providers/smart-audio'   ;
import { Log, moment, Moment, isMoment                         } from 'config/config.functions' ;
import { PayrollPeriod                                         } from 'domain/payroll-period'   ;
import { Shift                                                 } from 'domain/shift'            ;
import { Report                                                } from 'domain/report'           ;
import { Employee                                              } from 'domain/employee'         ;
import { ReportOther                                           } from 'domain/reportother'      ;
import { Jobsite                                               } from 'domain/jobsite'          ;
import { UserData                                              } from 'providers/user-data'     ;
import { Preferences                                           } from 'providers/preferences'   ;
import { TranslateService                                      } from '@ngx-translate/core'     ;
import { TabsService                                           } from 'providers/tabs-service'  ;
import { Pages, SVGIcons, SelectString,                        } from 'config/config.types'     ;

export const focusDelay = 500;

@IonicPage({ name: 'Report View' })
@Component({
  selector: 'page-report-view',
  templateUrl: 'report-view.html'
})

export class ReportViewPage implements OnInit,OnDestroy,AfterViewInit {
  @ViewChild('unitNumberInput') unitNumberInput:ElementRef;
  @ViewChild('reportNumberInput') reportNumberInput:ElementRef;
  public title                     : string           = 'Work Report'              ;
  public lang                      : any                                           ;
  public static PREFS              : any              = new Preferences()          ;
  public get prefs():any { return ReportViewPage.PREFS; };
  public SVGIcons                  : any              = SVGIcons                   ;
  public setDate                   : Date             = new Date()                 ;
  public disableTime               : boolean          = false                      ;
  public year                      : number           = this.setDate.getFullYear() ;
  public mode                      : string           = 'Add'                      ;
  public type                      : SelectString                                  ;
  public formValues                : any                                           ;
  // public workOrderForm             : FormGroup                                     ;
  public report                    : Report                                        ;
  public workOrderReport           : any                                           ;
  public other                     : ReportOther                                   ;
  public repair_time               : any                                           ;
  public profile                   : any              = {}                         ;
  public tmpReportData             : any                                           ;
  public techProfile               : any                                           ;
  public tech                      : any                                           ;
  public docID                     : string                                        ;
  public idDate                    : string                                        ;
  public idTime                    : string                                        ;
  public payrollPeriods            : Array<PayrollPeriod>                          ;
  public shifts                    : Array<Shift>                                  ;
  public period                    : PayrollPeriod                                 ;
  public selectedShift             : Shift                                         ;
  public sites                     : Array<Jobsite>                                ;
  public currentDay                : any                                           ;
  public shiftsStart               : any                                           ;
  public shifter                   : any                                           ;
  public repairTime                : any                                           ;
  public thisWorkOrderContribution : number           = 0                          ;
  public shiftTotalHours           : any              = 0                          ;
  public payrollPeriodHours        : any              = 0                          ;
  public currentRepairHours        : number           = 0                          ;
  public currentRepairHoursString  : string           = "00:00"                    ;
  public currentOtherHours         : number           = 0                          ;
  public currentOtherHoursString   : string           = "00:00"                    ;
  public shiftHoursColor           : string           = "black"                    ;
  public shiftToUse                : Shift            = null                       ;
  public shiftSavedHours           : number           = 0                          ;
  public rprtDate                  : any                                           ;
  public timeStarts                : any                                           ;
  public reportDate                : any                                           ;
  public startTime                 : any                                           ;
  public timeEnds                  : any                                           ;
  public syncError                 : boolean          = false                      ;
  public chooseHours               : any                                           ;
  public chooseMins                : any                                           ;
  public loading                   : any              = {}                         ;
  // public _startDate                : any                                           ;
  // public _startTime                : any                                           ;
  // public _endTime                  : any                                           ;
  // public _repairHours              : any                                           ;
  // public _shift                    : any                                           ;
  // public _selected_shift           : any                                           ;
  // public _notes                    : any                                           ;
  // public _type                     : any                                           ;
  // public _training_type            : any                                           ;
  // public _training_time            : any                                           ;
  // public _travel_location          : any                                           ;
  // public _time                     : any                                           ;
  // public _unit_number              : any                                           ;
  // public _work_order_number        : any                                           ;
  public userdata                  : any                                           ;
  public shiftDateOptions          : any                                           ;
  public dataReady                 : boolean          = false                      ;
  public techWorkOrders            : Array<Report> = []                         ;
  public selectedShiftText         : string           = ""                         ;
  public workOrderList             : any                                           ;
  public filteredWOList            : any                                           ;
  // public selReportType             : Array<any>       = REPORTTYPEI18N             ;
  // public selTrainingType           : Array<any>       = TRAININGTYPEI18N           ;
  // public selTravelLocation         : Array<any>       = JOBSITESI18N               ;
  public selReportType             : Array<any>                                    ;
  public selTrainingType           : Array<any>                                    ;
  public selTravelLocation         : Array<any>                                    ;
  public training_type             : any              = null                       ;
  public travel_location           : any              = null                       ;
  public allDay                    : boolean          = false                      ;
  public _allDay                   : any                                           ;
  public previousEndTime           : any                                           ;
  public oldType                   : any                                           ;
  public oldHours                  : string           = "00:00"                    ;

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
    // public tabs         : TabsComponent,
    public tabServ      : TabsService,
    public ud           : UserData,
    public translate    : TranslateService,
  ) {
    this.shifter        = Shift             ;
    this.userdata       = UserData          ;
    let w = window;
    w["workorderview"] = w["onsitereportview"] = this              ;
  }

  ngOnInit() {
    Log.l("Report.ngOnInit(): navParams are:\n", this.navParams);
    if(this.ud.isAppLoaded()) {
      this.runWhenReady();
    }
  }

  ngOnDestroy() {
    Log.l("ReportPage: ngOnDestroy() fired");
  }

  ngAfterViewInit() {
    Log.l("ReportPage: ngAfterViewInit() fired");
    this.tabServ.setPageLoaded(Pages.ReportView);
  }

  ionViewDidLoad() { Log.l('ionViewDidLoad ReportPage'); }

  public runWhenReady() {
    this.dataReady = false;
    if (this.navParams.get('mode') !== undefined) { this.mode = this.navParams.get('mode'); }
    if (this.navParams.get('type') !== undefined) { this.type = this.navParams.get('type'); }
    if (this.navParams.get('shift') !== undefined) { this.selectedShift = this.navParams.get('shift'); this.shiftToUse = this.selectedShift; }
    if (this.navParams.get('payroll_period') !== undefined) { this.period = this.navParams.get('payroll_period'); }
    if (this.navParams.get('report') !== undefined) {
      this.report = this.navParams.get('report');
      this.oldHours = this.report.getRepairHoursString();
    } else {
      // this.report = new Report();
    }
    if (this.navParams.get('other') !== undefined) {
      this.other = this.navParams.get('other');
    } else {
      // this.other = new ReportOther();
    }
    if(this.shiftToUse) {
      this.selectedShift = this.shiftToUse;
    }
    let mode = this.mode.toLowerCase();
    let translations = [
      mode,
      'alert',
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
      'unable_to_sync_message',
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
    if(this.report) {
      this.type = this.selReportType[0];
    } else if(this.other) {
      let ro = this.other;
      let typeName  = ro.type.trim().toUpperCase();
      let entry = this.selReportType.find(a => {
        let nameA = a.name.trim.toUpperCase();
        let valA = a.value.trim.toUpperCase();
        return typeName === nameA || valA === nameA;
      });
      if(entry) {
        this.type = entry;
      }
    } else {
      this.type = this.selReportType[0];
    }
    this.travel_location = this.selTravelLocation[0];
    this.training_type = this.selTrainingType[0];
    let ro = this.other;
    if(ro) {
      if(ro.type && ro.type.trim().toLowerCase() === 'training') {
        let roTrainingType = ro.training_type.trim().toUpperCase();
        let entry = this.selTrainingType.find((a:any) => {
          let aTT = a.training_type.name.trim().toUpperCase();
          let vTT = a.training_type.value.trim().toUpperCase();
          return roTrainingType === aTT || roTrainingType === vTT;
        });
        if(entry) {
          this.training_type = entry;
        }
      } else if(ro.type && ro.type.trim().toLowerCase() === 'travel') {
        let roTravelLocation = ro.travel_location.trim().toUpperCase();
        let entry = this.selTrainingType.find((a:any) => {
          let aTT = a.travel_location.name.trim().toUpperCase();
          let vTT = a.travel_location.value.trim().toUpperCase();
          return roTravelLocation === aTT || roTravelLocation === vTT;
        });
        if(entry) {
          this.travel_location = entry;
        }
      }
    }
    if (this.type && this.type.name !== 'work_report' && this.other) {
      let ro = this.other;
      let hours = ro.getHoursNumeric();
      let strHours = ro.getHoursString();
      this.currentOtherHours = hours;
      this.currentOtherHoursString = strHours;
    }

    Log.l("ReportView: Type is:\n", this.type);

    this.db.getTechProfile().then((res) => {
      Log.l(`ReportPage: Success getting tech profile! Result:\n`, res);
      this.techProfile = new Employee();
      this.techProfile.readFromDoc(res);
      this.tech = this.techProfile;
      // if (this.mode === 'Add' || this.mode === 'Añadir') {
        // let now = moment();
        // this.report = new Report();
        // this.report.timestampM  = now.format();
        // this.report.timestamp   = now.toExcel();
      // }
      this.setupShifts();
      if (this.mode === 'Add' || !this.report || !this.report.first_name) {
        this.report = this.createFreshReport();
      }
      if (this.mode === 'Add' || !this.other || !this.other.first_name) {
        this.other = this.createFreshOtherReport();
      }
      // this.updateActiveShiftWorkOrders(this.selectedShift);
      if (this.mode === 'Add' || this.mode === 'Añadir') {
        // let startTime = moment(this.selectedShift.start_time);
        // let addTime = this.selectedShift.getShiftHours();
        // let newStartTime = moment(startTime).add(addTime, 'hours');
        let shift = this.selectedShift;
        let start = shift.getNextReportStartTime();
        Log.l("ReportPage: Now setting work order start time: '%s'", start);
        this.report.report_date = shift.getShiftDate().format("YYYY-MM-DD");
        this.report.setStartTime(start);
      } else {

      }
      this.thisWorkOrderContribution = this.report.getRepairHours() || 0;

      this.initializeForm();
      this.initializeFormListeners();
      this.updateDisplay();
      this.dataReady = true;
    }).catch((err) => {
      Log.l(`ReportPage: Error getting tech profile!`);
      Log.e(err);
    });
  }

  public initializeUIData() {
    /* spinner options (ion-multi-picker and Ionic Spinner options) */
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
    let siteSelect = [];
    this.sites = this.ud.getData('sites');
    let sites = this.sites;
    for(let site of sites) {
      let name = site.getSiteSelectName();
      let hrs = Number(site.travel_time);
      let hours = !isNaN(hrs) ? hrs : 0;
      let oneSite = {name: name, value: name, hours: hours};
      siteSelect.push(oneSite);
      // sites.push(site);
    }
    this.selTravelLocation = siteSelect;
    // this.sites = sites;
    // this.type = this.type || this.selReportType[0];
  }

  public updateDisplay() {
    let type:SelectString = this.type;
    if(!type || type.name === 'work_report') {
      let report:Report = this.report;
      this.currentRepairHours = report.getRepairHours();
      this.currentRepairHoursString = report.getRepairHoursString();
    } else {
      let other:ReportOther = this.other;
      this.currentRepairHours = other.getHoursNumeric();
      this.currentRepairHoursString = other.getHoursString();
    }
  }

  public initializeFormListeners() {
    // let lang                = this.lang                                  ;
    // this._type              = this.workOrderForm.get('type')             ;
    // this._training_type     = this.workOrderForm.get('training_type')    ;
    // this._travel_location   = this.workOrderForm.get('travel_location')  ;
    // this._time              = this.workOrderForm.get('time')             ;
    // this._endTime           = this.workOrderForm.get('endTime')          ;
    // this._repairHours       = this.workOrderForm.get('repair_time')      ;
    // this._selected_shift    = this.workOrderForm.get('selected_shift')   ;
    // this._notes             = this.workOrderForm.get('notes')            ;
    // this._unit_number       = this.workOrderForm.get('unit_number')      ;
    // this._work_order_number = this.workOrderForm.get('work_order_number');
    // this._allDay            = this.workOrderForm.get('allDay')           ;

    // this._type.valueChanges.subscribe((value:any) => {
    //   Log.l("Field 'type' fired valueChanges for:\n", value);
    //   // setTimeout(() => {
    //   // let oldType = this.selReportType[this.selReportType.indexOf(value)];
    //   this.oldType = this.selReportType[0];
    //   // this.type   = value;
    //   // let oldVal  = oldType.value;
    //   let ro      = this.other;
    //   let error   = false;
    //   // this._time.enable(true);
    //   if (value.name === 'training') {
    //     ro.training_type = "Safety";
    //     ro.time = 2;
    //     ro.type = value.value;
    //     this._training_type.setValue(this.selTrainingType[0]);
    //     this.training_type = this.selTrainingType[0];
    //     this._time.setValue(2);
    //     this.type = value;
    //   } else if (value.name === 'travel') {
    //     ro.travel_location = "BE MDL MNSHOP";
    //     ro.time = 6;
    //     ro.type = value.value;
    //     this.travel_location = this.selTravelLocation[0];
    //     this._travel_location.setValue(this.selTravelLocation[0]);
    //     this._time.setValue(6);
    //     this.type = value;
    //   } else if (value.name === 'sick') {
    //     ro.time = 8;
    //     this._time.setValue(8);
    //     ro.type = value.value;
    //     if(this.allDay) {
    //       this._time.disable(true);
    //     } else {
    //       this._time.enable(true);
    //     }
    //     this.type = value;
    //   } else if (value.name === 'vacation') {
    //     ro.time = 8;
    //     this._time.setValue(8);
    //     ro.type = value.value;
    //     this.type = value;
    //   } else if (value.name === 'holiday') {
    //     ro.time = 8;
    //     this._time.setValue(8);
    //     ro.type = value.value;
    //     this.type = value;
    //   } else if (value.name === 'standby') {
    //     let shift = this.selectedShift;
    //     let status = shift.getShiftReportsStatus(true).code;
    //     let hours  = shift.getNormalHours();
    //     if(status.indexOf("B") > -1 || status.indexOf("S") > -1) {
    //       Log.w("User attempted to create duplicate standby report.");
    //       let warnIcon = "<span class='alert-with-icon'><span class='alert-icon'>&#xf434;</span></span>";
    //       let warningText = sprintf(lang['duplicate_standby_report'], warnIcon);
    //       this._type.setValue(this.selReportType[0]);
    //       setTimeout(() => { this.alert.showAlert(lang['error'], warningText); });
    //     } else if(hours > 0) {
    //       Log.w("User attempted to create a standby report in the same shift as an existing work report.");
    //       let warnIcon = "<span class='alert-with-icon'><span class='alert-icon'>&#xf434;</span></span>";
    //       let warningText = sprintf(lang['standby_report_xor_work_report_existing_work_report'], warnIcon);
    //       this._type.setValue(this.selReportType[0]);
    //       setTimeout(() => { this.alert.showAlert(lang['error'], warningText); });
    //     } else {
    //       ro.time = 8;
    //       this._time.setValue(8);
    //       ro.type = value.value;
    //       this.type = value;
    //     }
    //   } else if (value.name === 'standby_hb_duncan') {
    //     let status = this.selectedShift.getShiftReportsStatus(true).code;
    //     let i = status.indexOf("B");
    //     let j = status.indexOf("S");
    //     if(this.techProfile.location !== "DUNCAN" && this.techProfile.location !== "DCN") {
    //       Log.w("User attempted to create Standby: HB Duncan report without being set to Duncan location.");
    //       let strIcon = "<span class='alert-icon'>&#xf419;</span>";
    //       let warnText = sprintf(lang['standby_hb_duncan_wrong_location'], strIcon)
    //       let warnFont = sprintf("<span class='alert-with-icon'>%s</span>", warnText);
    //       setTimeout(() => {
    //         this.alert.showConfirmYesNo(lang['alert'], lang['standby_hb_duncan_wrong_location']).then(res => {
    //           if(res) {
    //             this.type = value;
    //             this.other.type = value.value;
    //             this.other.time = 8;
    //             this._time.setValue(8);
    //             this._type.setValue(this.selReportType[0], {emitEvent: false});
    //           } else {

    //           }
    //         });
    //       });

    //       // setTimeout(() => { this.alert.showAlert(lang['error'], warnFont); });
    //     } else if(i > -1 || j > -1) {
    //       Log.w("User attempted to create duplicate standby report.");
    //       let warnIcon = "<span class='alert-with-icon'><span class='alert-icon'>&#xf434;</span></span>";
    //       let warningText = sprintf(lang['duplicate_standby_report'], warnIcon);
    //       // this._type.setValue(oldType);
    //       // this.alert.showAlert(lang['error'], warningText);
    //       // this.type = oldType;
    //       // this._type.setValue(this.oldType);
    //       // this.alert.showAlert(lang['error'], warningText);
    //       // this.alert.showAlert(lang['error'], warningText).then(res => {
    //         // setTimeout(() => {
    //           // this._type.setValue(this.oldType);
    //         // }, 500);
    //         // this.zone.run(() => { this._type.setValue(this.oldType); });
    //       this._type.setValue(this.selReportType[0]);
    //       setTimeout(() => { this.alert.showAlert(lang['error'], warningText); });
    //       // });
    //     } else if(this.selectedShift.getNormalHours() > 0) {
    //       Log.w("User attempted to create a standby report in the same shift as an existing work report.");
    //       let warnIcon = "<span class='alert-with-icon'><span class='alert-icon'>&#xf434;</span></span>";
    //       let warningText = sprintf(lang['standby_report_xor_work_report_existing_work_report'], warnIcon);
    //       // this.type = oldType;
    //       // this._type.setValue(oldType);
    //       // this.alert.showAlert(lang['error'], warningText);
    //       // this.alert.showAlert(lang['error'], warningText).then(res => {
    //         // setTimeout(() => {
    //           // this._type.setValue(oldType);
    //         // }, 500);
    //         // this.zone.run(() => { this._type.setValue(this.oldType); });
    //       // });
    //       this._type.setValue(this.selReportType[0]);
    //       setTimeout(() => { this.alert.showAlert(lang['error'], warningText); });
    //     } else {
    //       ro.time = 8;
    //       this._time.setValue(8);
    //       ro.type = value.value;
    //       this.type = value;
    //     }
    //   } else if(value.name === 'work_report') {
    //     Log.l("type.valueChange(): This seems proper.");
    //     this.type = value;
    //     // ro.type = value.value;
    //   } else {
    //     Log.l("type.valueChange(): GETTING TO THIS BRANCH SHOULD NOT BE POSSIBLE! Type is:\n", value);
    //   }
    // });

    // this._training_type.valueChanges.subscribe((value: any) => {
    //   let ro = this.other;
    //   this.training_type = value;
    //   ro.training_type = value.value;
    //   let time = value.hours;
    //   ro.time = time;
    //   this._time.setValue(time);
    // });

    // this._travel_location.valueChanges.subscribe((value: any) => {
    //   let ro = this.other;
    //   this.travel_location = value;
    //   ro.travel_location = value.value;
    //   let time = value.hours;
    //   ro.time = time;
    //   this._time.setValue(time);
    // });

    // this._time.valueChanges.subscribe((value: any) => {
    //   let ro = this.other;
    //   let hours = !isNaN(Number(value)) ? Number(value) : 0
    //   ro.time = hours;
    //   this.currentOtherHours = hours;
    // });

    // this._allDay.valueChanges.subscribe((value: any) => {
    //   Log.l("_allDay value changed to:\n", value);
    //   this.allDay = value;
    //   if(this.allDay) {
    //     this._time.disable(true);
    //   } else {
    //     this._time.enable(true);
    //   }
    // });

    // this._repairHours.valueChanges.subscribe((hours: any) => {
    //   Log.l("workOrderForm: valueChanges fired for repair_hours: ", hours);
    //   let wo = this.report;
    //   let oldHours = this.oldHours;
    //   let oldType = this.type;
    //   let shift = this.selectedShift;
    //   let status = shift.getShiftReportsStatus(true).code;
    //   if (status.indexOf("B") > -1 || status.indexOf("S") > -1) {
    //     Log.w("User attempted to add work order when standby report already exists for shift..");
    //     let warnIcon = "<span class='alert-with-icon'><span class='alert-icon'>&#xf434;</span></span>";
    //     let warningText = sprintf(lang['standby_report_xor_work_report_existing_standby_report'], warnIcon);
    //     this.alert.showAlert(lang['error'], warningText).then(res => {
    //       this._repairHours.setValue(oldHours);
    //     });
    //   } else {
    //     let dur1 = hours.split(":");
    //     let hrs = Number(dur1[0]);
    //     let min = Number(dur1[1]);
    //     let iDur = hrs + (min / 60);
    //     this.currentRepairHours = iDur;
    //     let total = this.selectedShift.getNormalHours() + this.currentRepairHours - this.thisWorkOrderContribution;
    //     Log.l("ReportForm: currentRepairHours changed to %s, value %f, so total is now %f", sprintf("%02d:%02d", hrs, min), iDur, total);
    //     this.report.setRepairHours(iDur);
    //     if (this.selectedShift !== undefined && this.selectedShift !== null) {
    //       this.shiftHoursColor = this.getShiftHoursStatus(this.selectedShift);
    //     } else {
    //       this.shiftHoursColor = this.getShiftHoursStatus(this.shifts[0]);
    //     }
    //     this.oldHours = hours;
    //   }
    // });

    // this._selected_shift.valueChanges.subscribe((shift: any) => {
    //   Log.l("workOrderForm: valueChanges fired for selected_shift:\n", shift);
    //   let ss                       = shift                                                   ;
    //   // this.updateActiveShiftWorkOrders(shift);
    //   let report_date              = moment(shift.getStartTime())                            ;
    //   // let woHoursSoFar             = shift.getShiftHours()                                   ;
    //   // let woStart                  = moment(shift.getStartTime()).add(woHoursSoFar, 'hours') ;
    //   let woStart                  = shift.getNextReportStartTime()                          ;

    //   let reportDateString         = report_date.format("YYYY-MM-DD")                        ;
    //   this.selectedShift           = shift                                                   ;

    //   let type = this.workOrderForm.value.type;
    //   if(!type || (type && type.name && type.name === 'work_report')) {
    //     Log.l("workOrderForm: Setting work report start time to '%s' and date to '%s'", moment(woStart), reportDateString);
    //     this.report.setStartTime(moment(woStart));
    //     this.report.report_date    = reportDateString                                      ;
    //     this.report.shift_serial   = shift.getShiftSerial();
    //     this.report.payroll_period = shift.getPayrollPeriod();
    //   } else {
    //     Log.l("workOrderForm: Setting other report date to '%s'", reportDateString);
    //     this.other.report_date  = moment(report_date);
    //     this.other.shift_serial = shift.getShiftSerial();
    //     this.other.payroll_period = shift.getPayrollPeriod();
    //   }
    // });

    // this._notes.valueChanges.debounceTime(400).subscribe((value:any) => {
    //   Log.l("workOrderForm: valueChanges fired for _notes:\n", value);
    //   let wo    = this.report ;
    //   wo.notes  = value          ;
    // });

    // this._unit_number.valueChanges.debounceTime(400).subscribe((value:any) => {
    //   Log.l("workOrderForm: valueChanges fired for _unit_number:\n", value);
    //   let wo          = this.report ;
    //   wo.unit_number  = value          ;
    // });

    // this._work_order_number.valueChanges.debounceTime(400).subscribe((value:any) => {
    //   Log.l("workOrderForm: valueChanges fired for _work_order_number:\n", value);
    //   let wo                = this.report ;
    //   wo.work_order_number  = value          ;
    // });
  }

  public updateType(value:SelectString, event?:any) {
    Log.l("Field 'type' updated for:\n", value);
    let lang = this.lang;
    this.oldType = this.selReportType[0];
    let other   = this.other;
    let error   = false;
    // this._time.enable(true);
    if (value.name === 'training') {
      other.training_type = "Safety";
      other.time = 2;
      other.type = value.name;
      this.training_type = this.selTrainingType[0];
      this.type = value;
    } else if (value.name === 'travel') {
      other.travel_location = "BE MDL MNSHOP";
      other.time = 6;
      other.type = value.name;
      this.travel_location = this.selTravelLocation[0];
      this.type = value;
    } else if (value.name === 'sick') {
      other.time = 8;
      other.type = value.name;
      if(this.allDay) {
        this.disableTime = true;
      } else {
        this.disableTime = false;
      }
      this.type = value;
    } else if (value.name === 'vacation') {
      other.time = 8;
      other.type = value.name;
      this.type = value;
    } else if (value.name === 'holiday') {
      other.time = 8;
      other.type = value.name;
      this.type = value;
    } else if (value.name === 'standby') {
      let shift = this.selectedShift;
      let status = shift.getShiftReportsStatus(true).code;
      let hours  = shift.getNormalHours();
      if(status.indexOf("B") > -1 || status.indexOf("S") > -1) {
        Log.w("User attempted to create duplicate standby report.");
        let warnIcon = "<span class='alert-with-icon'><span class='alert-icon'>&#xf434;</span></span>";
        let warningText = sprintf(lang['duplicate_standby_report'], warnIcon);
        this.type = this.selReportType[0];
        setTimeout(() => { this.alert.showAlert(lang['error'], warningText); });
      } else if(hours > 0) {
        Log.w("User attempted to create a standby report in the same shift as an existing work report.");
        let warnIcon = "<span class='alert-with-icon'><span class='alert-icon'>&#xf434;</span></span>";
        let warningText = sprintf(lang['standby_report_xor_work_report_existing_work_report'], warnIcon);
        this.type = this.selReportType[0];
        setTimeout(() => { this.alert.showAlert(lang['error'], warningText); });
      } else {
        other.time = 8;
        other.type = value.name;
        this.type = value;
      }
    } else if (value.name === 'standby_hb_duncan') {
      let cli = other.client.trim().toUpperCase();
      let loc = other.location.trim().toUpperCase();
      let lid = other.location_id.trim().toUpperCase();
      let status = this.selectedShift.getShiftReportsStatus(true).code;
      let i = status.indexOf("B");
      let j = status.indexOf("S");
      if(loc !== "DUNCAN" && loc !== "DCN") {
        Log.w("User attempted to create Standby: HB Duncan report without being set to Duncan location.");
        let strIcon = "<span class='alert-icon'>&#xf419;</span>";
        let warnText = sprintf(lang['standby_hb_duncan_wrong_location'], strIcon)
        let warnFont = sprintf("<span class='alert-with-icon'>%s</span>", warnText);
        setTimeout(() => {
          this.alert.showConfirmYesNo(lang['alert'], lang['standby_hb_duncan_wrong_location']).then(res => {
            if(res) {
              this.type = value;
              this.other.type = value.name;
              this.other.time = 8;
              // this._time.setValue(8);
              // this._type.setValue(this.selReportType[0], {emitEvent: false});
            } else {
              this.type = this.selReportType[0];
            }
          });
        });

        // setTimeout(() => { this.alert.showAlert(lang['error'], warnFont); });
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
        // this._type.setValue(this.selReportType[0]);
        this.type = this.selReportType[0];
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
        this.type = this.selReportType[0];
        // this._type.setValue(this.selReportType[0]);
        setTimeout(() => { this.alert.showAlert(lang['error'], warningText); });
      } else {
        other.time = 8;
        // this._time.setValue(8);
        other.type = value.name;
        this.type = value;
      }
    } else if(value.name === 'work_report') {
      Log.l("type.valueChange(): This seems proper.");
      this.type = value;
    } else {
      Log.l("type.valueChange(): GETTING TO THIS BRANCH SHOULD NOT BE POSSIBLE! Type is:\n", value);
    }
  }

  public updateShift(shift:Shift, event?:any) {
    Log.l("updatShift(): Shift changed to:\n", shift);
    let ss                       = shift                                                   ;
    // this.updateActiveShiftWorkOrders(shift);
    let report_date              = moment(shift.getStartTime())                            ;
    // let woHoursSoFar             = shift.getShiftHours()                                   ;
    // let woStart                  = moment(shift.getStartTime()).add(woHoursSoFar, 'hours') ;
    let woStart                  = shift.getNextReportStartTime()                          ;

    let reportDateString         = report_date.format("YYYY-MM-DD")                        ;
    this.selectedShift           = shift                                                   ;

    let type = this.type;
    if(!type || (type && type.name && type.name === 'work_report')) {
      Log.l("updatShift(): Setting work report start time to '%s' and date to '%s'", moment(woStart), reportDateString);
      this.report.setStartTime(moment(woStart));
      this.report.report_date    = reportDateString                                      ;
      this.report.shift_serial   = shift.getShiftSerial();
      this.report.payroll_period = shift.getPayrollPeriod();
    } else {
      Log.l("updatShift(): Setting other report date to '%s'", reportDateString);
      this.other.report_date  = moment(report_date);
      this.other.shift_serial = shift.getShiftSerial();
      this.other.payroll_period = shift.getPayrollPeriod();
    }
  }

  public updateRepairHours(hours:string, event?:any) {
    Log.l("updateRepairHours(): repair hours set to: ", hours);
    let lang = this.lang;
    let report = this.report;
    let oldHours = this.oldHours;
    let oldType = this.type;
    let shift = this.selectedShift;
    let status = shift.getShiftReportsStatus(true).code;
    if (status.indexOf("B") > -1 || status.indexOf("S") > -1) {
      Log.w("User attempted to add work order when standby report already exists for shift..");
      let warnIcon = "<span class='alert-with-icon'><span class='alert-icon'>&#xf434;</span></span>";
      let warningText = sprintf(lang['standby_report_xor_work_report_existing_standby_report'], warnIcon);
      this.alert.showAlert(lang['error'], warningText).then(res => {
        this.currentRepairHours = this.hoursStringToNumber(hours);
      });
    } else {
      let duration:number = this.hoursStringToNumber(hours);
      this.currentRepairHoursString = hours;
      this.currentRepairHours = duration;
      let total = this.selectedShift.getNormalHours() + this.currentRepairHours - this.thisWorkOrderContribution;
      // Log.l("ReportForm: currentRepairHours changed to %s, value %f, so total is now %f", sprintf("%02d:%02d", hrs, min), iDur, total);
      this.report.setRepairHours(duration);
      if (this.selectedShift) {
        this.shiftHoursColor = this.getShiftHoursStatus(this.selectedShift);
      } else {
        this.shiftHoursColor = this.getShiftHoursStatus(this.shifts[0]);
      }
      this.oldHours = hours;
    }
  }

  public updateTrainingType(value:{name:string,fullName:string,hours:number}) {
    let other = this.other;
    this.training_type = value;
    other.training_type = value.name;
    let time = value.hours;
    other.time = time;
  }

  public updateTravelLocation(value:{name:string,fullName:string,hours:number|string}) {
    let other = this.other;
    let hrs = Number(value.hours);
    this.travel_location = value;
    other.travel_location = value.name;
    let time = hrs;
    other.time = time;
  }

  public updateTime(hrs:string|number) {
    let other = this.other;
    let hours = !isNaN(Number(hrs)) ? Number(hrs) : 0
    other.time = hours;
    this.currentOtherHours = hours;
  };

  public hoursStringToNumber(hours:string) {
    let dur1 = hours.split(":");
    let hrs = Number(dur1[0]);
    let min = Number(dur1[1]);
    let iDur = hrs + (min / 60);
    return iDur;
  }

  private initializeForm() {
    // let report = this.report;
    // let other  = this.other;
    // let ts, rprtDate;
    // if (this.mode === 'Add' || this.mode === 'Añadir' || this.mode === 'add') {
    //   rprtDate = moment(this.selectedShift.getStartTime());
    //   ts = moment().format();
    // } else {
    //   rprtDate = moment(report.report_date, "YYYY-MM-DD");
    // }
    // // ts = moment().format();
    // this.currentRepairHours = report.getRepairHours();
    // this.repair_time = this.currentRepairHours;
    // let crh = Number(other.getTotalHours());
    // this.currentOtherHours  = !isNaN(crh) ? crh : 0;
    // let typeDisabled = this.mode === 'Edit' ? true : false;
    // this.workOrderForm = new FormGroup({
    //   'selected_shift'    : new FormControl(this.selectedShift                , Validators.required) ,
    //   'repair_time'       : new FormControl(report.getRepairHoursString()         , Validators.required) ,
    //   'unit_number'       : new FormControl(report.unit_number                    , Validators.required) ,
    //   'work_order_number' : new FormControl(report.work_order_number              , Validators.required) ,
    //   'notes'             : new FormControl(report.notes                          , Validators.required) ,
    //   // 'report_date'       : new FormControl(rprtDate.format("YYYY-MM-DD")     , Validators.required) ,
    //   'type'              : new FormControl(this.type                         , Validators.required) ,
    //   'training_type'     : new FormControl(this.training_type                , Validators.required) ,
    //   'travel_location'   : new FormControl(this.travel_location              , Validators.required) ,
    //   'time'              : new FormControl(this.currentOtherHours) ,
    //   'allDay'            : new FormControl(this.allDay) ,
    // });
  }

  public loadReport(report:Report) {
    this.currentRepairHoursString = this.report.getRepairHoursString();
    this.currentRepairHours = this.report.getRepairHours();
  }

  public loadReportOther(other:ReportOther) {
    this.currentOtherHoursString = this.other.getHoursString();
    this.currentOtherHours = this.other.getHoursNumeric();
  }

  // public updateActiveShiftWorkOrders(shift: Shift) {
  //   let ss = shift;
  //   let oldShift = this.selectedShift;
  //   let shift_time = moment(ss.start_time);
  //   let shift_serial = ss.getShiftSerial();
  //   let payroll_period = ss.getPayrollPeriod();
  //   this.report.shift_serial = shift_serial;
  //   this.report.payroll_period = payroll_period;
  //   this.other.shift_serial = shift_serial;
  //   this.other.payroll_period = payroll_period;
  //   Log.l("workOrderForm: setting shift_serial to: ", shift_serial);
  //   // let shiftHours = this.techProfile.shiftLength;

  //   // let shiftStartsAt = this.techProfile.shiftStartTime;
  //   this.shiftHoursColor = this.getShiftHoursStatus(ss);
  //   this.selectedShift = shift;
  //   if(this.type === 'work_report') {
  //     oldShift.removeShiftReport(this.report);
  //     shift.addShiftReport(this.report);
  //   } else {
  //     oldShift.removeOtherReport(this.other);
  //     shift.addOtherReport(this.other);
  //   }
  // }

  // public setupWorkOrderList() {
  //   let tmpWOL = new Array<Report>();
  //   if (this.ud.woArrayInitialized) {
  //     tmpWOL = this.ud.getWorkOrderList();
  //   }
  //   this.workOrderList = tmpWOL;
  //   Log.l("setupWorkOrderList(): Got work order list:\n", tmpWOL);
  // }

  public setupShifts() {
    let endDay = 2;

    let p = this.ud.getPayrollPeriods();
    if(!p) {
      this.tabServ.goToPage('OnSiteHome');
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
        // let woShiftSerial = this.report.shift_serial;
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

  // public checkShiftChange(event:any, shift:Shift) {
  //   let oldShift = this.selectedShift;
  //   if(this.mode === 'Edit') {

  //   } else {

  //   }
  // }

  public showFancySelect(event?:any) {
    Log.l("showFancySelect(): Called!");
    let options = [];
    let shifts = [];
    let fancySelectModal = this.modal.create('Fancy Select', { title: "Select Shift", shifts: this.period.getPayrollShifts(), periods: this.payrollPeriods }, { cssClass: 'fancy-select-modal' });
    fancySelectModal.onDidDismiss(data => {
      Log.l("ReportPage: Returned from fancy select, got back:\n", data);
      if (data) {
        this.selectedShift = data;
        this.selectedShiftText = this.selectedShift.toString(this.translate);
        // this.workOrderForm.get('selected_shift').setValue(this.selectedShift);
      }
    });
    fancySelectModal.present();
  }

  public getTotalHoursForShift(shift:Shift) {
    let ss = shift;
    let savedHours = ss.getNormalHours();
    return savedHours;
  }

  public getNumberClass(i) {
    let shift = this.shifts[i];
    let shiftColor = shift.getShiftColor();
    Log.l(`getNumberClass(): Shift color is: '${shiftColor}'`);
    return shift.getShiftColor();
  }

  public getShiftHoursStatus(shift:Shift) {
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
      let target;
      let tmp1 = shift.getShiftLength();
      if(tmp1 === 'off') {
        return 'green';
      } else {
        target = tmp1;
      }
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

  public async showPossibleError(type:string) {
    let lang         = this.lang                                                          ;
    // let form         = this.workOrderForm.getRawValue()                                   ;
    // let unitLen      = form.unit_number       ? String(form.unit_number).length       : 0 ;
    // let woLen        = form.work_order_number ? String(form.work_order_number).length : 0 ;
    let unitLen = String(this.report.unit_number).length;
    let woLen   = String(this.report.work_order_number).length;
    let result       = null                                                               ;
    let warning_text = ""                                                                 ;

    Log.l(`showPossibleError(): Checking unit length ${unitLen} and work order number length ${woLen}...`);
    // Log.l(form.unit_number);
    // Log.l(form.work_order_number);

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
      warning_text = sprintf("The report date (%s) does not match the shift start date (%s).", this.report.report_date, this.report.getStartTime().format("YYYY-MM-DD"));
      result = await this.alert.showAlert("ERROR", warning_text);
      return true;
    } else {
      return new Error("showPossibleError() called without proper type!");
    }
  }

  public async checkForUserMistakes() {
    let lang    = this.lang    ;                                                      ;
    // let form    = this.workOrderForm.getRawValue()                                   ;
    try {
      if(this.type.name === 'work_report') {
        let report:Report = this.report;
        let cli:string = report.client.toUpperCase().trim();
        let loc:string = report.location.toUpperCase().trim();
        let lid:string = report.location_id.toUpperCase().trim();
        let unitLen:number = String(report.unit_number).trim().length;
        let woLen:number = String(report.work_order_number).trim().length;
        Log.l(`checkForUserMistakes(): Checking length for unit '${report.unit_number}' and WO# '${report.work_order_number}'...`);
        if(report.repair_hours == 0) {
          this.audio.play('funny');
          let out = await this.alert.showAlert(lang['report_submit_error_title'], lang['report_submit_error_message']);
          return false;
        } else if(cli === 'HB' || cli === 'HALLIBURTON') {
          if(unitLen !== 8) {
            let response = await this.showPossibleError('unit');
            if(!response) {
              // this.unitNumberInput.setFocus();
              setTimeout(() => {
                // this.zone.run(() => { this.unitNumberInput.setFocus(); });
                this.unitNumberInput.nativeElement.setFocus();
              }, focusDelay);
              return false;
            } else {
              return true;
            }
          } else if(woLen !== 9) {
            let response = await this.showPossibleError('wo');
            if(!response) {
              // this.workOrderNumberInput.setFocus();
              setTimeout(() => {
                // this.zone.run(() => { this.workOrderNumberInput.setFocus(); });
                this.reportNumberInput.nativeElement.setFocus();
              }, focusDelay);
              return false;
            } else {
              return true;
            }
          }
        } else {
          return true;
        }
      } else {
        let other:ReportOther = this.other;
        let cli:string = other.client.toUpperCase().trim();
        let loc:string = other.location.toUpperCase().trim();
        let lid:string = other.location_id.toUpperCase().trim();
        if(this.type.name === "standby_hb_duncan" && loc !== "DUNCAN" && loc !== "DCN") {
          Log.l("checkForUserMistakes(): User tried to set standby_hb_duncan type but is not set to HB Duncan location.");
          let response = await this.showPossibleError('standby_hb_duncan');
          // this.alert.showAlert(lang['error'], lang['standby_hb_duncan_wrong_location']);
          if(response) {
            return false;
          } else {
            return true;
          }
        } else {
          return true;
        }

      }
    } catch(err) {
      Log.l(`checkForUserMistakes(): Error found during check, not submitting report.`);
      Log.e(err);
      throw new Error(err);
    }
  }

  public async checkInput() {
    // return new Promise((resolve,reject) => {
      // this.formValues = this.workOrderForm.getRawValue();
    try {
      let validate = await this.checkForUserMistakes();
      if(validate) {
        return validate;
      } else {
        throw new Error("Input check did not complete successfully.");
      }
    } catch(err) {
      Log.l(`checkInput(): Input check not completed successfully.`);
      Log.e(err);
      throw err;
    }
  }

  public async onSubmit(event?:any) {
    // let form = this.workOrderForm.getRawValue();
    try {
      let type = this.type;
      let lang = this.lang;
      let isValid = await this.checkInput();
      if (type.name === 'work_report') {
        return this.processReport();
      } else {
        return this.processReportOther();
      }
    } catch(err) {
      Log.l(`onSubmit(): Error during submission.`);
      Log.e(err);
      // this.alert.
      // throw new Error(err);
    }
  }

  // genReportID() {
  //   let now = moment();
  //   // let idDateTime = now.format("dddDDMMMYYYYHHmmss");
  //   let idDateTime = now.format("YYYY-MM-DD_HH-mm-ss_ZZ_ddd");
  //   let docID = this.techProfile.avatarName + '_' + idDateTime;
  //   Log.l("genReportID(): Generated ID:\n", docID);
  //   return docID;
  // }

  // public convertFormToWorkOrder() {
  //   let sWO = this.workOrderForm.getRawValue();
  //   let wo = this.report;
  // }

  public processReport() {
    // let data = this.workOrderForm.getRawValue();
    let lang = this.lang;
    // if(!data.repair_hours) {
    //   this.alert.showAlert(lang['report_submit_error_title'], lang['report_submit_error_message']);
    // } else {
    this.alert.showSpinner(lang['spinner_saving_report']);
    // let tempWO:Report = this.report.clone();
    // let newWO:Report  = tempWO.clone();
    // newWO.readFromDoc(tempWO);
    if (this.mode === 'Add' || this.mode === 'Añadir') {
      this.db.saveReport(this.report).then((res) => {
        Log.l("processReport(): Successfully saved work order to local database. Now synchronizing to remote.\n", res);
        return this.db.syncSquaredToServer(this.prefs.DB.reports);
      }).then((res) => {
        Log.l("processReport(): Successfully synchronized work order to remote.");
        this.alert.hideSpinner();
        // this.tabs.goToPage('OnSiteHome');
        this.previousEndTime = moment(this.report.time_start);
        let shift = this.selectedShift;
        shift.addShiftReport(this.report);
        // this.ud.addNewReport(newWO);
        this.currentRepairHours = 0;
        this.currentRepairHoursString = "00:00";
        // this.ud.updateShifts();
        if(this.prefs.getStayInReports()) {
          this.tabServ.goToPage('Report View');
          // let report = this.createFreshReport();
          // this.report = report;
          // this.loadReport(report);
          // this.initializeForm();
          // this.initializeFormListeners();
        } else {
          this.tabServ.goToPage('ReportHistory');
        }
      }).catch((err) => {
        Log.l("processReport(): Error saving work order to local database.");
        Log.e(err);
        this.alert.hideSpinner();
        this.alert.showAlert(lang['alert'], lang['unable_to_sync_message']);
      });
    } else {
      // tempWO._rev = this.report._rev;
      Log.l("processReport(): In Edit mode, now trying to save report:\n", this.report);
      this.db.saveReport(this.report).then((res) => {
        Log.l("processReport(): Successfully saved work order to local database. Now synchronizing to remote.\n", res);
        return this.db.syncSquaredToServer(this.prefs.DB.reports);
      }).then((res) => {
        Log.l("processReport(): Successfully synchronized work order to remote.");
        this.alert.hideSpinner();
        // this.ud.addNewReport(newWO);
        // this.ud.updateShifts();
        this.currentRepairHours = 0;
        this.currentRepairHoursString = "00:00";
        this.tabServ.goToPage('ReportHistory');
      }).catch((err) => {
        Log.l("processReport(): Error saving work order to local database.");
        Log.e(err);
        this.alert.hideSpinner();
        this.alert.showAlert(lang['alert'], lang['unable_to_sync_message']);
      });
    }
  }

  public processReportOther() {
    let lang = this.lang;
    this.alert.showSpinner(lang['spinner_saving_report']);
    // let doc = this.workOrderForm.getRawValue();
    // let newReport = new ReportOther().readFromDoc(doc);
    let other = this.other;
    // Log.l("processReportOther(): Read new ReportOther:\n", newReport);
    // let newDoc = newReport.serialize(this.techProfile);
    // Log.l("processReportOther(): Serialized ReportOther to:\n", newDoc);
    this.db.saveReportOther(other).then(res => {
      Log.l("processReportOther(): Done saving ReportOther!");
      this.selectedShift.addOtherReport(this.other);
      // this.ud.addNewOtherReport(newReport);
      // this.ud.updateShifts();
      this.currentOtherHours = 0;
      this.alert.hideSpinner();
      if(this.prefs.USER.stayInReports) {
        this.tabServ.goToPage('Report View');
        // this.type = this.selReportType[0];
        // let other = this.createFreshOtherReport();
        // this.loadReportOther(other)
        // this.initializeForm();
        // this.initializeFormListeners();
      } else {
        this.tabServ.goToPage('ReportHistory');
      }
      // if(this.mode === 'Add') {
      //   this.tabs.goToPage('OnSiteHome');
      // } else {
      //   this.tabs.goToPage('ReportHistory');
      // }
    }).catch(err => {
      Log.l("processReportOther(): Error saving ReportOther!");
      Log.e(err);
      this.alert.showAlert(lang['alert'], lang['unable_to_sync_message']);
    });
  }

  public cancel() {
    Log.l("ReportPage: User canceled work order.");
    if (this.mode === 'Add' || this.mode === 'Añadir') {
      this.tabServ.goToPage('OnSiteHome');
    } else {
      this.tabServ.goToPage('ReportHistory');
    }
  }

  public createFreshReport() {
    let tech:Employee  = this.techProfile     ;
    let now   = moment()             ;
    let shift = this.selectedShift   ;
    let date  = shift.getStartTime() ;
    // if(this.workOrderForm.value.type === 'work_report') {
    let start = shift.getStartTime();
    let hours = shift.getNormalHours();
    // let end = this.previousEndTime;
    let shiftLatest   = shift.getNextReportStartTime()                   ;
    let report        = new Report()                                  ;
    report._id            = report.genReportID(tech)                             ;
    report.timestampM     = moment(now)                                      ;
    report.timestamp      = now.toExcel()                                    ;
    report.first_name     = tech.firstName                                   ;
    report.last_name      = tech.lastName                                    ;
    report.time_start     = shiftLatest                                      ;
    report.username       = tech.avatarName                                  ;
    report.client         = tech.client                                      ;
    report.location       = tech.location                                    ;
    report.location_id    = tech.locID                                       ;
    report.payroll_period = shift.getPayrollPeriod()                         ;
    report.shift_serial   = shift.getShiftSerial()                           ;
    report.report_date    = now.format("YYYY-MM-DD")                         ;
    this.report    = report                                                  ;

    return this.report;
  }

  public createFreshOtherReport() {
    let tech          = this.techProfile            ;
    let now           = moment()                    ;
    let shift         = this.selectedShift          ;
    let date          = shift.getStartTime()        ;
    let other         = new ReportOther()           ;
    other._id            = other.genReportID(tech)        ;
    other.timestampM     = moment(now)                 ;
    other.timestamp      = now.toExcel()               ;
    other.first_name     = tech.firstName              ;
    other.last_name      = tech.lastName               ;
    other.username       = tech.avatarName             ;
    other.client         = tech.client                 ;
    other.location       = tech.location               ;
    other.location_id    = tech.locID                  ;
    other.payroll_period = shift.getPayrollPeriod()    ;
    other.shift_serial   = shift.getShiftSerial()      ;
    other.report_date    = moment(date).startOf('day') ;
    this.other  = other                          ;
    // shift.addOtherReport(this.other);
    return this.other;
  }

  public populateWorkOrder():Report {
    return this.report;
  }

  // public createReport() {
  //   // Log.l("ReportPage: createReport(): Now creating report...");
  //   // let partialReport = this.workOrderForm.getRawValue();
  //   Log.l("ReportPage: createReport(): Now creating report from form and report...\n", partialReport);
  //   Log.l(this.report);
  //   // let ts = moment(partialReport.timeStamp);
  //   let ts;
  //   if(this.report && this.report.timestamp) {
  //     let ts2 = this.report.timestamp;
  //     if(ts2 && isMoment(ts2)) {
  //       ts = moment(ts2);
  //     } else if(ts2 && typeof ts2 === 'number') {
  //       ts = moment().fromExcel(ts2);
  //     } else if(ts2 && typeof ts2 === 'string') {
  //       ts = moment(ts2);
  //     }
  //   } else {
  //     ts = moment();
  //     this.report.timestampM = moment(ts);
  //     this.report.timestamp  = moment(ts).toExcel();
  //   }
  //   let wo = this.report;
  //   Log.l("createReport(): timestamp moment is now:\n", ts);
  //   // let XLDate = moment([1900, 0, 1]);
  //   // let xlStamp = ts.diff(XLDate, 'days', true) + 2;
  //   let xlStamp = ts.toExcel();
  //   partialReport.timeStamp = xlStamp;

  //   Log.l("processReport() has initial partialReport:");
  //   Log.l(partialReport);
  //   let newReport: any = {};
  //   let newID = this.report.genReportID(this.tech);
  //   if (this.mode !== 'Add') {
  //     newID = wo._id;
  //   }
  //   if (this.mode === 'Edit') {
  //     newReport._rev = wo._rev;
  //   }
  //   // return this.report.serialize(this.techProfile);
  //   return this.report.serialize();
  // }

  public checkPageMode(event:any) {
    Log.l("checkPageMode(): Called with event:\n", event);
    let lang = this.lang;
    if(this.mode==='Edit') {
      Log.l("checkPageMode(): User trying to change type of an existing report. Not allowed.");
      this.alert.showAlert(lang['error'], lang['attempt_to_change_existing_report_type']);
    }
  }

  public deleteReport(type:SelectString, event?:any) {
    if(type && type.name && type.name !== 'work_report' || typeof type === 'string' && type !== 'Work Report' && type !== 'work_report') {
      this.deleteOtherReport(event);
    } else {
      this.deleteWorkOrder(event);
    }
  }

  public toggleFlag(event?:any) {
    Log.l("toggleFlag(): Event is:\n", event);
    if(this.report.flagged === undefined) {
      this.report.flagged = false;
    }
    this.report.flagged = !this.report.flagged;
  }

  public syncData() {
    let lang = this.lang;
    Log.l("syncData(): Started...");
    let db = this.prefs.getDB();
    this.alert.showSpinner(lang['spinner_sending_reports_to_server']);
    this.server.syncToServer(db.reports, db.reports).then(res => {
      Log.l("syncData(): Successfully synchronized to server.");
      this.alert.hideSpinner();
      this.alert.showAlert(lang['success'], lang['manual_sync_success']);
    }).catch(err => {
      Log.l("syncData(): Error with server sync.");
      Log.e(err);
      this.alert.hideSpinner();
      this.alert.showAlert(lang['error'], lang['manual_sync_error']);
    });
  }

  public deleteWorkOrder(event?:any) {
    Log.l("deleteWorkOrder() clicked ...");
    let lang = this.lang;
    let db = this.prefs.getDB();
    let tmpReport = this.report;
    this.alert.showConfirm(lang['confirm'], lang['delete_report']).then((res) => {
      if (res) {
        this.alert.showSpinner(lang['spinner_deleting_report']);
        Log.l("deleteWorkOrder(): User confirmed deletion, deleting...");
        // let wo = this.report.clone();
        let wo = this.report;
        let reports = this.ud.getWorkOrderList();
        let i = reports.indexOf(this.report);
        this.db.deleteDoc(db.reports, wo).then((res) => {
          Log.l("deleteWorkOrder(): Success:\n", res);
          Log.l("Going to delete work order %d in the list.", i);
          let tmpReport = this.report;
          if(i > -1) {
            tmpReport = reports.splice(i, 1)[0];
          }
          this.selectedShift.removeShiftReport(tmpReport);
          this.ud.removeReport(tmpReport);
          return this.server.syncToServer(db.reports, db.reports);
        }).then(res => {
          Log.l(`deleteWorkOrder(): Synchronized local '${db.reports}' to remote.`)
          this.alert.hideSpinner();
          this.tabServ.goToPage('ReportHistory', {report_deleted: tmpReport});
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

  public deleteOtherReport(event) {
    Log.l("deleteOtherReport() clicked ...");
    let other = this.other;
    let lang = this.lang;
    let db = this.prefs.getDB();
    this.audio.play('deleteotherreport');
    this.alert.showConfirm(lang['confirm'], lang['delete_report']).then((res) => {
      if (res) {
        this.alert.showSpinner(lang['spinner_deleting_report']);
        Log.l("deleteOtherReport(): User confirmed deletion, deleting...");
        let shift = this.selectedShift;
        let others = shift.getShiftOtherReports();
        let ro:ReportOther = other.clone();
        let reportDate = ro.report_date.format("YYYY-MM-DD");
        this.db.deleteDoc(db.reports_other, other).then((res) => {
          Log.l("deleteOtherReport(): Success:\n", res);
          let tmpReport = this.other;
          let i = others.indexOf(other);
          if(i > -1) {
            tmpReport = others.splice(i, 1)[0];
          }
          this.selectedShift.removeOtherReport(tmpReport);
          // this.ud.removeOtherReport(tmpReport);
          return this.server.syncToServer(db.reports_other, db.reports_other);
        }).then(res => {
          Log.l(`deleteOtherReport(): Synchronized local '${db.reports}' to remote.`);
          this.alert.hideSpinner();
          this.tabServ.goToPage('ReportHistory', { report_deleted: this.other });
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

