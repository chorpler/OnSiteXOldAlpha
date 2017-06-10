import { NgModule       } from '@angular/core';
import { IonicPageModule} from 'ionic-angular';
import { EditReport     } from './edit-report';

@NgModule({
  declarations: [
    EditReport,
  ],
  imports: [
    IonicPageModule.forChild(EditReport),
  ],
  exports: [
    EditReport
  ]
})
export class EditReportModule {}
