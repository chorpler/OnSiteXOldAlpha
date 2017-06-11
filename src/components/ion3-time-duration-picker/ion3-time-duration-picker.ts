import { Component, Input, Output, ViewChild, ElementRef, forwardRef, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor } from '@angular/forms';

import { FormValidators } from '../../form-validators/form-validators';

import { Platform } from 'ionic-angular';
import { DatePicker } from 'ionic-native';
import { Log } from '../../config/config.functions';
import * as moment from 'moment';
import { sprintf } from 'sprintf-js';

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => Ion3TimeDurationPicker),
  multi: true
};

declare var durationPicker: any;

/**
 * Generated class for the Ion3TimeDurationPickerComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'ion3-time-duration-picker',
  templateUrl: 'ion3-time-duration-picker.html',
    providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class Ion3TimeDurationPicker {
  private readonly COMPONENT_TAG = "Ion3TimeDurationPickerTag";

  //The internal data model
  public timeData: any = {"hours": 0, "minutes": 0, "seconds": 0};

  public pickerType = null;
  public _labelForI3DTP: any;
  public displayFormatForIon3TimeDuration: string;
  public ionTimeDurationShort: string;
  public ionTimeDurationLong: string;

  @Input() submitAttempt;
  @Input() control;
  @Input() set labelForI3DTP(value: any) {
    this._labelForI3DTP = value;
    Log.l("labelForI3DTP : " + value);
  }
  @Output() onChange: EventEmitter<any> = new EventEmitter();


  //Set touched on ionChange
  onTouched() {
    Log.l(this.COMPONENT_TAG + " onTouched() starts");
    this.control._touched = true;
  }

  //From ControlValueAccessor interface
  writeValue(value: any) {
    Log.l(this.COMPONENT_TAG + " writeValue(" + value + ") starts");
    // if (value !== undefined || value !== null) {
    if(value !== undefined && value !== null) {
      this.timeData.hours = value['hours'] || 0;
      this.timeData.minutes = value['minutes'] || 0;
      this.timeData.seconds = value['seconds'] || 0;
    }
    // if(value !== undefined && value !== null && typeof value == 'object' && value.hours !== undefined && value.minutes !== undefined)
    //   this.
      // this.dateValue = (new moment(value)).format('YYYY-MM-DD');
    // }
    Log.l(`${this.COMPONENT_TAG}: writeValue() called on \$\{value\} and returning this.timeData:\n`);
    Log.l(value);
    Log.l(this.timeData);
      // this.COMPONENT_TAG + " writeValue(" + value + ")\nthis.timeData " + this.dateValue);
  }

  getHourString(value:any) {
    let hourToDisplay:any, hrs:number = 0, h:any;
    if(value !== undefined && value !== null) {
      hrs = value['hours'] || 0;
      hrs = Number(hrs);
    }
    h = sprintf("%02d", hrs);
    hourToDisplay = h;
    return hourToDisplay;
  }

  getMinutesString(value:any) {
    let minutesToDisplay:any, min:number = 0, m:any;
    if(value !== undefined && value !== null) {
      min = value['minutes'] || 0;
      min = Number(min);
    }
    m = sprintf("%02d", min);
    minutesToDisplay = m;
    return minutesToDisplay;
  }

  getSecondsString(value:any) {
    let secondsToDisplay:any, sec:number = 0, s:any;
    if(value !== undefined && value !== null) {
      sec = value['seconds'] || 0;
      sec = Number(sec);
    }
    s = sprintf("%02d", sec);
    secondsToDisplay = s;
    return secondsToDisplay;
  }

  getDurationString(value:any) {
    let timeToDisplay: any, hrs: number = 0, min: number = 0, sec: number = 0, h: any, m: any, s: any;
    if (value !== undefined && value !== null) {
      hrs = value['hours'] || 0;
      hrs = Number(hrs);
      min = value['minutes'] || 0;
      min = Number(min);
      sec = value['seconds'] || 0;
      min = Number(sec);
    }
    h = sprintf("%02d", hrs);
    m = sprintf("%02d", min);
    s = sprintf("%02d", sec);
    timeToDisplay = `${h}:${m}:${s}`;
    return timeToDisplay;
  }

  displayTimeAccordingToSettings(value:any) {
    return this.getDurationString(value);
  }

  updateDuration(event:any) {
    Log.l(`${this.COMPONENT_TAG} updateDuration() starting`);
    Log.i(event);
    let durationToSetOn = this.getDurationString(event);
    this.onTouched();
    this.onChange.next(durationToSetOn);
  }

  updateHour(event:any) {
    Log.l(`${this.COMPONENT_TAG} updateHour() starting`);
    Log.i(event);
    let hourToSetOn = this.getHourString(event);
    this.onTouched();
    this.onChange.next(hourToSetOn);
  }

  updateMinute(event:any) {
    Log.l(`${this.COMPONENT_TAG} updateMinute() starting`);
    Log.i(event);
    let minuteToSetOn = this.getMinutesString(event);
    this.onTouched();
    this.onChange.next(minuteToSetOn);
  }

  //From ControlValueAccessor interface
  registerOnChange(fn: any) {
    Log.l(this.COMPONENT_TAG + " registerOnChange() starts");
    Log.l(fn);
    this.onChange.subscribe(fn);
  }

  //From ControlValueAccessor interface
  registerOnTouched(fn: any) { //leave it empty
  }


  // get the element with the # on it
  @ViewChild("ion3TimeDurationPicker") ion3TimeDurationPicker: ElementRef;
  // @ViewChild("ionDatePicker") ionDatePicker: ElementRef;

  // constructor(public platform: Platform, public trans: TranslationService) {
  constructor(public platform: Platform) {
    Log.l(this.COMPONENT_TAG + " constructor() starts, 'this' is:");
    Log.i(this);
    // this.displayFormatForIon3TimeDuration = moment.localeData(this.trans.getCurrentLang())._longDateFormat['LL'];
    // this.ionTimeDurationShort = moment.localeData(this.trans.getCurrentLang()).monthsShort();
    // this.ionTimeDurationLong = moment.localeData(this.trans.getCurrentLang()).months();

    this.setFieldWhenPlatformReady();
  }

  private setFieldWhenPlatformReady = () => {
    this.platform.ready().then(() => {
      if (this.platform.is('android')) {
        this.pickerType = "android";
      } else if (this.platform.is('ios')) {
        this.pickerType = "ios";
        // ios case: NOT DONE YET
      } else if (this.platform.is('core')) {
        this.pickerType = "core";
      }
    }
    );
  }

  public hourInputManagement = () => {
    Log.l(`${this.COMPONENT_TAG} hourInputManagement() starting`);

  }

  // public dateInputManagement = () => {
  //   Log.l(this.COMPONENT_TAG + " dateInputManagement() starts");
  //   let dateToUseOnOpening = (moment(this.dateValue, 'YYYY-MM-DD').isValid()) ? new Date(moment(this.dateValue, 'YYYY-MM-DD')) : new Date();

  //   Log.i(dateToUseOnOpening);

  //   let options = {
  //     date: dateToUseOnOpening,
  //     mode: 'date',
  //     androidTheme: datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT
  //   };

  //   DatePicker.show(options).then(
  //     (date) => {
  //       let lang = this.trans.getCurrentLang();

  //       this.writeValue(new moment(date));
  //       this.updateDate(new moment(date));
  //     }).catch((error) => { // Android only
  //     });
  // }

}

  // text: string;

  // constructor() {
  //   Log.l('Hello Ion3TimeDurationPickerComponent Component');
  //   this.text = 'Hello World';
  // }

// }
