import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HrsSummaryPage } from './hrs-summary';
import { TabsComponentModule } from '../../components/tabs/tabs.module';

@NgModule({
  declarations: [
    HrsSummaryPage,
  ],
  imports: [
    IonicPageModule.forChild(HrsSummaryPage),
    TabsComponentModule,
  ],
  exports: [
    HrsSummaryPage,
    TabsComponentModule,
  ]
})
export class HrsSummaryPageModule {}
