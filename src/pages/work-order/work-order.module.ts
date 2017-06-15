import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WorkOrderPage } from './work-order';
import { MultiPickerModule } from 'ion-multi-picker';
import { TranslateModule } from '@ngx-translate/core';
import { TabsComponentModule } from '../../components/tabs/tabs.module'


@NgModule({
  declarations: [
    WorkOrderPage
  ],
  imports: [
    IonicPageModule.forChild(WorkOrderPage),
    TranslateModule.forChild(),
    MultiPickerModule,
    TabsComponentModule,
  ],
  exports: [
    WorkOrderPage,
    TabsComponentModule,
  ]
})
export class WorkOrderModule {}
