import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WorkOrderPage } from './work-order';
// import { Component, Input, forwardRef } from '@angular/core';
// import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@NgModule({
  declarations: [
    WorkOrderPage
  ],
  imports: [
    IonicPageModule.forChild(WorkOrderPage),
  ],
  exports: [
    WorkOrderPage  ]
})
export class WorkOrderModule {}
