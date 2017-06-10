import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
// import { NumericModule } from 'ionic2-numericpicker';
// import { DatePickerModule } from 'datepicker-ionic2';
import { WorkOrderPage } from './work-order';
// import { Component, Input, forwardRef } from '@angular/core';
// import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TimeDurationPickerModule } from 'angular2-time-duration-picker';

@NgModule({
  declarations: [
    WorkOrderPage
  ],
  imports: [
    IonicPageModule.forChild(WorkOrderPage),
    // NumericModule
    TimeDurationPickerModule
  ],
  // providers: [
  //   {
  //     provide: NG_VALUE_ACCESSOR,
  //     useExisting: forwardRef(() => MultiInput),
  //     multi: true
  //   }
  // ],
  exports: [
    WorkOrderPage  ]
})
export class WorkOrderModule {}
