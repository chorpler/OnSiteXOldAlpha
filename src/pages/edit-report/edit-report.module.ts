import { NgModule       } from '@angular/core';
import { IonicPageModule} from 'ionic-angular';
import { EditReport     } from './edit-report';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    EditReport,
  ],
  imports: [
    IonicPageModule.forChild(EditReport),
    TranslateModule.forChild(),
  ],
  exports: [
    EditReport
  ]
})
export class EditReportModule {}
