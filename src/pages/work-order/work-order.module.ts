import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WorkOrder } from './work-order';

@NgModule({
  declarations: [
    WorkOrder,
  ],
  imports: [
    IonicPageModule.forChild(WorkOrder),
  ],
  exports: [
    WorkOrder
  ]
})
export class WorkOrderModule {}
