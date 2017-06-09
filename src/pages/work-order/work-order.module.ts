import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NumericModule } from 'ionic2-numericpicker';
import { DatePickerModule } from 'datepicker-ionic2';
import { WorkOrder } from './work-order';

@NgModule({
  declarations: [
    WorkOrder,
  ],
  imports: [
    IonicPageModule.forChild(WorkOrder),
    // NumericModule
  ],
  exports: [
    WorkOrder
  ]
})
export class WorkOrderModule {}
