import { Component, Input, Output, ViewChild, ElementRef, forwardRef, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor } from '@angular/forms';

import { FormValidators } from '../../form-validators/form-validators';

import { Platform } from 'ionic-angular';
import { DatePicker } from 'ionic-native';
import { TranslationService } from '../../services/translation/translation';
import moment from 'moment';

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

  text: string;

  constructor() {
    console.log('Hello Ion3TimeDurationPickerComponent Component');
    this.text = 'Hello World';
  }

}
