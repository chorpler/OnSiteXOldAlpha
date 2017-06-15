import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WorkOrderPage } from './work-order';
import { MultiPickerModule } from 'ion-multi-picker';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    WorkOrderPage
  ],
  imports: [
    IonicPageModule.forChild(WorkOrderPage),
    TranslateModule.forChild(),
    MultiPickerModule,
  ],
  exports: [
    WorkOrderPage  ]
})
export class WorkOrderModule {}
