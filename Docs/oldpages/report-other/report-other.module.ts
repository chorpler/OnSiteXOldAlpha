import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReportOtherPage } from './report-other';

@NgModule({
  declarations: [
    ReportOtherPage,
  ],
  imports: [
    IonicPageModule.forChild(ReportOtherPage),
  ],
  exports: [
    ReportOtherPage
  ]
})
export class ReportOtherPageModule {}
