import 'rxjs/add/operator/debounceTime'                                                             ;
import { sprintf                                               } from 'sprintf-js'                  ;
import { Component, OnInit, ViewChild, NgZone, OnDestroy,      } from '@angular/core'               ;
import { AfterViewInit, ElementRef,                            } from '@angular/core'               ;
import { FormsModule, ReactiveFormsModule                      } from "@angular/forms"              ;
import { FormBuilder, FormGroup, FormControl, Validators       } from "@angular/forms"              ;
import { IonicPage, NavController, NavParams                   } from 'ionic-angular'               ;
import { LoadingController, PopoverController, ModalController } from 'ionic-angular'               ;
import { DBService                                             } from 'providers/db-service'        ;
import { ServerService                                         } from 'providers/server-service'    ;
import { AuthSrvcs                                             } from 'providers/auth-srvcs'        ;
import { AlertService                                          } from 'providers/alerts'            ;
import { SmartAudio                                            } from 'providers/smart-audio'       ;
import { Log, moment, Moment, isMoment                         } from 'onsitex-domain'              ;
import { SESAClient, SESALocation, SESALocID, CLL              } from 'onsitex-domain'              ;
import { PayrollPeriod                                         } from 'onsitex-domain'              ;
import { Shift                                                 } from 'onsitex-domain'              ;
import { Report                                                } from 'onsitex-domain'              ;
import { Employee                                              } from 'onsitex-domain'              ;
import { ReportOther                                           } from 'onsitex-domain'              ;
import { Jobsite                                               } from 'onsitex-domain'              ;
import { UserData                                              } from 'providers/user-data'         ;
import { Preferences                                           } from 'providers/preferences'       ;
import { TranslateService                                      } from '@ngx-translate/core'         ;
import { TabsService                                           } from 'providers/tabs-service'      ;
import { Pages, SVGIcons, SelectString,                        } from 'onsitex-domain'              ;
import { MultiPicker                                           } from 'components/ion-multi-picker' ;

export const focusDelay = 500;
export const _matchCLL = (a:CLL, b:string):boolean => {
  let cA1 = a.name.toUpperCase();
  let cA2 = a.fullName.toUpperCase();
  let cB = b.toUpperCase();
  return cA1 === cB || cA2 === cB;
}
export const _cmp = (a:CLL|string, b:CLL|string):boolean => {
  // if(a === undefined || b === undefined || a['fullName'] === undefined || b['fullName'] === undefined) {
  //   return false;
  // } else {
  //   return a['fullName'].toUpperCase() === b['fullName'].toUpperCase();
  // }
  if(typeof a === 'object') {
    if(typeof b === 'object') {
      /* Both objects */
      return _matchCLL(a, b.name);
    } else {
      /* a is object, b is string */
      return _matchCLL(a, b);
    }
  } else {
    if(typeof b === 'object') {
      /* b is object, a is string */
      return _matchCLL(b, a);
    }
  }
  /* a and b are both strings */
  if(a.toUpperCase() === b.toUpperCase()) {
    return true;
  } else {
    return false;
  }
};

@IonicPage({ name: 'Report View' })
@Component({
  selector: 'page-report-view',
  templateUrl: 'report-view.html'
})
export class ReportViewPage implements OnInit,OnDestroy,AfterViewInit {
  // @ViewChild('unitNumberInput') unitNumberInput:ElementRef;
  // @ViewChild('woNumberInput') reportNumberInput:ElementRef;
  // @ViewChild('reportNotes') reportNotes:ElementRef;
  @ViewChild('unitNumberInput') unitNumberInput:any;
  @ViewChild('woNumberInput') woNumberInput:any;
  @ViewChild('reportNotes') reportNotes:any;
  @ViewChild('durationPicker') durationPicker:MultiPicker;
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
  public payrollPeriods            : Array<PayrollPeriod> = []                     ;
  public shift                     : Shift                                         ;
  public shifts                    : Array<Shift>         = []                     ;
  public allShifts                 : Array<Shift>         = []                     ;
  public period                    : PayrollPeriod                                 ;
  public selectedShift             : Shift                                         ;
  public sites                     : Array<Jobsite>      = []                      ;
  public site                      : Jobsite                                       ;
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
  public userdata                  : any                                           ;
  public shiftDateOptions          : any                                           ;
  public dataReady                 : boolean          = false                      ;
  public techWorkOrders            : Array<Report> = []                            ;
  public selectedShiftText         : string           = ""                         ;
  public workOrderList             : any                                           ;
  public filteredWOList            : any                                           ;
  public selReportType             : Array<any>          = []                      ;
  public selTrainingType           : Array<any>          = []                      ;
  public selTravelLocation         : Array<any>          = []                      ;
  public training_type             : any              = null                       ;
  public travel_location           : any              = null                       ;
  public allDay                    : boolean          = false                      ;
  public _allDay                   : any                                           ;
  public previousEndTime           : any                                           ;
  public oldType                   : any                                           ;
  public oldHours                  : string           = "00:00"                    ;
  public crew_numbers              : Array<string>    = []                         ;
  public show_crew_number          : boolean          = false                      ;
  public appropriate_other_time    : number           = 0                          ;
  public currentReport             : Report|ReportOther                            ;
  public report_date_error         : boolean          = false                      ;
  public report_date_other         : string           = ""                         ;

  constructor(
    public navCtrl      : NavController,
    public navParams    : NavParams,
    private db          : DBService,
    public server       : ServerService,
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
    this.allShifts = this.ud.getAllShifts();
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
      'empty_notes',
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
      this.techProfile = Employee.deserialize(res);
      this.tech = this.techProfile;
      // if (this.mode === 'Add' || this.mode === 'Añadir') {
        // let now = moment();
        // this.report = new Report();
        // this.report.timestampM  = now.format();
        // this.report.timestamp   = now.toExcel();
      // }
      this.setupShifts();
      let tech:Employee = this.tech;
      let site:Jobsite = this.ud.findEmployeeSite(tech);
      this.site = site;
      if(this.mode === 'Add' || !this.report || !this.report.first_name) {
        this.report = this.createFreshReport();
      }
      if(this.mode === 'Add' || !this.other || !this.other.first_name) {
        this.other = this.createFreshOtherReport();
      }

      // this.updateActiveShiftWorkOrders(this.selectedShift);
      if(this.mode === 'Add' || this.mode === 'Añadir') {
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
      this.getCrewNumbers();
      if(this.mode === 'Add') {
        this.site = site;
      } else {
        // if(this.currentReport instanceof Report) {
        if(this.type && this.type.name && this.type.name === 'work_report') {
          this.currentReport = this.report;
          let cli:string = this.report.client;
          let loc:string = this.report.location;
          let lid:string = this.report.location_id;
          let site:Jobsite = this.sites.find((a:Jobsite) => {
            return _matchCLL(a.client, cli) && _matchCLL(a.location, loc) && _matchCLL(a.locID, lid);
          });
          if(site) {
            this.site = site;
          } else {
            Log.w(`ReportPage: could not find work report's matching site for '${cli}', '${loc}', '${lid}'`);
          }
        } else if(this.type && this.type.name) {
          this.currentReport = this.other;
          let cli:string = this.other.client;
          let loc:string = this.other.location;
          let lid:string = this.other.location_id;
          let site:Jobsite = this.sites.find((a:Jobsite) => {
            return _matchCLL(a.client, cli) && _matchCLL(a.location, loc) && _matchCLL(a.locID, lid);
          });
          if(site) {
            this.site = site;
          } else {
            Log.w(`ReportPage: could not find ReportOther's matching site for '${cli}', '${loc}', '${lid}'`);
          }
        } else {
          Log.w(`ReportPage: active display is neither a Report or ReportOther!`);
        }
      }
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
    this.sites = this.ud.getData('sites').filter((a:Jobsite) => {
      return a.client && a.client.name && a.client.name !== 'AA' && a.client.name !== 'XX';
    });
    let sites = this.sites;
    for(let site of sites) {
      // if(site && site.client && site.client.name && site.client.name !== 'AA' && site.client.name !== 'XX') {
        let name = site.getSiteSelectName();
        let hrs = Number(site.travel_time);
        let hours = !isNaN(hrs) ? hrs : 0;
        let oneSite = {name: name, value: name, hours: hours};
        siteSelect.push(oneSite);
      // }
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
      this.report_date_other = this.other.report_date.format("YYYY-MM-DD");
    }
  }

  public getCrewNumbers() {
    let crew_numbers:Array<string> = [];
    for(let i = 1; i < 30; i++) {
      let crewnum = i + "";
      crew_numbers.push(crewnum);
    }
    this.crew_numbers = crew_numbers;
    return crew_numbers;
  }

  public initializeFormListeners() {

  }

  public updateCrewNumber(evt?:any) {
    Log.l("updateCrewNumber(): Event is:\n", evt);
  }

  public updateType(value:SelectString, event?:any) {
    Log.l("Field 'type' updated for:\n", value);
    let lang = this.lang;
    this.oldType = this.selReportType[0];
    let other   = this.other;
    let error   = false;
    // this._time.enable(true);
    if (value.name === 'training') {
      this.currentReport = other;
      other.training_type = "Safety";
      other.time = 2;
      other.type = value.value;
      this.training_type = this.selTrainingType[0];
      this.type = value;
      this.updateTrainingType(this.training_type);
    } else if (value.name === 'travel') {
      this.currentReport = other;
      other.travel_location = "BE MDL MNSHOP";
      other.time = 6;
      other.type = value.value;
      this.travel_location = this.selTravelLocation[0];
      this.type = value;
      this.updateTravelLocation(this.travel_location);
    } else if (value.name === 'sick') {
      this.currentReport = other;
      other.time = 8;
      other.type = value.value;
      if(this.allDay) {
        this.disableTime = true;
      } else {
        this.disableTime = false;
      }
      this.type = value;
    } else if (value.name === 'vacation') {
      this.currentReport = other;
      other.time = 8;
      other.type = value.value;
      this.type = value;
    } else if (value.name === 'holiday') {
      this.currentReport = other;
      other.time = 8;
      other.type = value.value;
      this.type = value;
    } else if (value.name === 'standby') {
      this.currentReport = other;
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
        other.type = value.value;
        this.type = value;
      }
    } else if (value.name === 'standby_hb_duncan') {
      this.currentReport = other;
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
              this.other.type = value.value;
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
        other.type = value.value;
        this.type = value;
      }
    } else if(value.name === 'work_report') {
      this.currentReport = this.report;
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
    Log.l("updateTrainingType(): Updating training type to:\n", value);
    let other = this.other;
    this.training_type = value;
    other.training_type = value.name;
    let time = value.hours;
    other.time = time;
    this.appropriate_other_time = time;
  }

  public updateTravelLocation(value:{name:string,fullName:string,hours:number|string}) {
    Log.l("updateTravelLocation(): Updating travel location to:\n", value);
    let other = this.other;
    let hrs = Number(value.hours);
    this.travel_location = value;
    other.travel_location = value.name;
    let time = hrs;
    other.time = time;
    this.appropriate_other_time = time;
  }

  public updateTime(hrs:string|number) {
    Log.l(`updatTime(): Updating time to ${hrs}`);
    let other = this.other;
    let hours = !isNaN(Number(hrs)) ? Number(hrs) : 0
    other.time = hours;
    if(this.appropriate_other_time !== other.time) {
      other.setFlag('time', 'nonstandard_time');
    } else {
      other.unsetFlag('time');
    }
    this.currentOtherHours = hours;
  };

  public updateOtherDate(report_date:string, event?:any) {
    Log.l("updateOtherDate(): Event is:\n", event);
    let date:Moment = moment(report_date, "YYYY-MM-DD");
    let other:ReportOther = this.other;
    if(isMoment(date)) {
      other.report_date = date;
    } else {
      this.report_date_error = true;
    }
  }

  public updateOtherDateKeyup(report_date:string, event:KeyboardEvent) {
    Log.l("updateOtherDateKeyup(): KeyboardEvent is:\n", event);
    if(event.key === 'Enter') {
      event.preventDefault();
      this.updateOtherDate(report_date, event);
    } else if(event.key === 'Tab') {

    } else {

    }
  }

  public hoursStringToNumber(hours:string) {
    let dur1 = hours.split(":");
    let hrs = Number(dur1[0]);
    let min = Number(dur1[1]);
    let iDur = hrs + (min / 60);
    return iDur;
  }

  public getSiteFromInfo(client:SESAClient, location:SESALocation, locID:SESALocID) {
    let lang = this.lang;
    let sites = this.sites;
    let unassigned:Jobsite = sites.find((a:Jobsite) => {
      return a.site_number === 1;
    });
    let site:Jobsite = sites.find((a:Jobsite) => {
      return _cmp(a.client, client) && _cmp(a.location, location) && _cmp(a.locID, locID);
    });
    // let site = sites.filter((obj, pos, arr) => { return _cmp(this.client, obj['client']) })
    //                 .filter((obj, pos, arr) => { return _cmp(this.location, obj['location']) })
    //                 .filter((obj, pos, arr) => { return _cmp(this.locID, obj['locID']) });
    Log.l("getSiteFromInfo(): Site narrowed down to:\n", site);
    if(site) {
      this.site = site;
      return site;
    } else {
      this.site = unassigned;
      return unassigned;
    }
  }

  private initializeForm() {
    if(this.type && this.type.name && this.type.name !== 'work_report') {
      this.currentReport = this.other;
    } else {
      this.currentReport = this.report;
    }
  }

  public loadReport(report:Report) {
    this.currentRepairHoursString = this.report.getRepairHoursString();
    this.currentRepairHours = this.report.getRepairHours();
  }

  public loadReportOther(other:ReportOther) {
    this.currentOtherHoursString = this.other.getHoursString();
    this.currentOtherHours = this.other.getHoursNumeric();
  }

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
    }
  }

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

    if(type === 'notes') {
      warning_text = sprintf(lang['empty_notes']);
      result = await this.alert.showConfirmYesNo(lang['warning'], warning_text);
      return result;
    } else if(type === 'unit') {
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
    let lang = this.lang;
    let shouldContinue:boolean = true;
    // let form = this.workOrderForm.getRawValue();
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
          setTimeout(() => {
            this.durationPicker.open();
          }, 50);
          return false;
        }
        if(!(typeof report.notes === 'string' && report.notes.length > 0)) {
          let response = await this.showPossibleError('notes');
          if(!response) {
            setTimeout(() => {
              // this.zone.run(() => { this.unitNumberInput.setFocus(); });
              this.reportNotes.setFocus();
            }, focusDelay);
            return false;
          } else {
            report.setFlag('notes', 'zero_length_notes');
          }
        }
        if(cli === 'HB' || cli === 'HALLIBURTON') {
          if(unitLen < 8 || unitLen > 9) {
            let response = await this.showPossibleError('unit');
            if(!response) {
              // this.unitNumberInput.setFocus();
              setTimeout(() => {
                // this.zone.run(() => { this.unitNumberInput.setFocus(); });
                this.unitNumberInput.setFocus();
              }, focusDelay);
              return false;
            } else {
              report.setFlag('unit_number', 'nonstandard_length');
            }
          }
          if(woLen < 9 || woLen > 10) {
            let response = await this.showPossibleError('wo');
            if(!response) {
              // this.workOrderNumberInput.setFocus();
              setTimeout(() => {
                // this.zone.run(() => { this.workOrderNumberInput.setFocus(); });
                this.woNumberInput.setFocus();
              }, focusDelay);
              return false;
            } else {
              report.setFlag('work_order_number', 'nonstandard_length');
            }
          }
        // } else {
        }
        return true;
      } else {
        let other:ReportOther = this.other;
        let cli:string = other.client.toUpperCase().trim();
        let loc:string = other.location.toUpperCase().trim();
        let lid:string = other.location_id.toUpperCase().trim();
        if(this.type.name === "standby_hb_duncan" && loc !== "DUNCAN" && loc !== "DCN") {
          Log.l("checkForUserMistakes(): User tried to set standby_hb_duncan type but is not set to HB Duncan location.");
          let response = await this.showPossibleError('standby_hb_duncan');
          // this.alert.showAlert(lang['error'], lang['standby_hb_duncan_wrong_location']);
          if(!response) {
            return false;
          }
        }
        return true;
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
        Log.l(`checkInput(): all user input is apparently valid!`);
        return validate;
      } else {
        // throw new Error("Input check did not complete successfully.");
        Log.l(`checkInput(): Some user input is invalid!`);
        return false;
      }
    } catch(err) {
      Log.l(`checkInput(): Input check not completed successfully.`);
      Log.e(err);
      throw err;
    }
  }

  public async onSubmit(event?:any) {
    let lang = this.lang;
    try {
      let type = this.type;
      let lang = this.lang;
      let isValid = await this.checkInput();
      if(isValid) {
        if (type.name === 'work_report') {
          let res = await this.processReport();
          return res;
        } else {
          let res = this.processReportOther();
          return res;
        }
      }
    } catch(err) {
      Log.l(`onSubmit(): Error during submission.`);
      Log.e(err);
      let title = lang['error'];
      let txt = lang['error_saving_report_message'];
      let msg = sprintf("%s<br>\n<br>\n%s", txt, err.message);
      this.alert.showAlert(title, msg);
    }
  }

  public async processReport() {
    let lang = this.lang;
    try {
      this.alert.showSpinner(lang['spinner_saving_report']);
      // let tempWO:Report = this.report.clone();
      // let newWO:Report  = tempWO.clone();
      // newWO.readFromDoc(tempWO);
      if (this.mode === 'Add' || this.mode === 'Añadir') {
        let res = await this.db.saveReport(this.report);
        Log.l("processReport(): Successfully saved work order to local database. Now synchronizing to remote.\n", res);
        res = await this.db.syncSquaredToServer(this.prefs.DB.reports);
        Log.l("processReport(): Successfully synchronized work order to remote.");
        this.alert.hideSpinner();
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
        return res;
      } else {
        // tempWO._rev = this.report._rev;
        Log.l("processReport(): In Edit mode, now trying to save report:\n", this.report);
        let res = await this.db.saveReport(this.report);
        Log.l("processReport(): Successfully saved work order to local database. Now synchronizing to remote.\n", res);
        res = await this.db.syncSquaredToServer(this.prefs.DB.reports);
        Log.l("processReport(): Successfully synchronized work order to remote.");
        this.alert.hideSpinner();
        // this.ud.addNewReport(newWO);
        // this.ud.updateShifts();
        this.currentRepairHours = 0;
        this.currentRepairHoursString = "00:00";
        this.tabServ.goToPage('ReportHistory');
        return res;
      }
    } catch(err) {
      Log.l(`processReport(): Error during processing of report '${this.report._id}'`);
      Log.e(err);
      this.alert.hideSpinner();
      this.alert.showAlert(lang['alert'], lang['unable_to_sync_message']);
      // throw new Error(err);
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
    let tech:Employee = this.tech                   ;
    let site:Jobsite  = this.site                   ;
    let now   = moment()             ;
    let shift = this.selectedShift   ;
    let date  = shift.getStartTime() ;
    // if(this.workOrderForm.value.type === 'work_report') {
    let start = shift.getStartTime();
    let hours = shift.getNormalHours();
    // let end = this.previousEndTime;
    let shiftLatest       = shift.getNextReportStartTime()                   ;
    let report            = new Report()                                     ;
    report.setSite(site);
    report._id            = report.genReportID(tech)                         ;
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
    report.technician     = tech.getTechName()                               ;
    this.report           = report                                           ;

    return this.report;
  }

  public createFreshOtherReport() {
    let tech:Employee = this.tech                   ;
    let site:Jobsite  = this.site                   ;
    let now           = moment()                    ;
    let shift         = this.selectedShift          ;
    let date          = shift.getStartTime()        ;
    let other         = new ReportOther()           ;
    other.setSite(site);
    other._id            = other.genReportID(tech)     ;
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
    this.other           = other                       ;
    // shift.addOtherReport(this.other);
    return this.other;
  }

  public populateWorkOrder():Report {
    return this.report;
  }

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
    Log.l("toggleFlag(): Current Report is:\n", this.currentReport);
    if(!this.currentReport.flagged) {
      this.currentReport.setFlag('manual', 'manually_flagged');
    } else {
      this.currentReport.unsetFlag('manual');
    }
  }

  public addFlag(event?:any) {
    Log.l("addFlag(): Adding a manual flag");
    this.currentReport.setFlag('manual', 'manually_flagged');
  }

  public removeFlag(event?:any) {
    Log.l("removeFlag(): Removing a manual flag");
    this.currentReport.unsetFlag('manual');
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
        let reports = this.ud.getReportList();
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

