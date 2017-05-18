import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditReportPage } from './edit-report';

@NgModule({
  declarations: [
    EditReportPage,
  ],
  imports: [
    IonicPageModule.forChild(EditReportPage),
  ],
  exports: [
    EditReportPage
  ]
})
export class EditReportPageModule {}
