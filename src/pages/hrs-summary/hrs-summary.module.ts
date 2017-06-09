import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HrsSummaryPage } from './hrs-summary';

@NgModule({
  declarations: [
    HrsSummaryPage,
  ],
  imports: [
    IonicPageModule.forChild(HrsSummaryPage),
  ],
  exports: [
    HrsSummaryPage
  ]
})
export class HrsSummaryPageModule {}
