import { NgModule         } from '@angular/core'; 
import { IonicPageModule  } from 'ionic-angular'; 
import { ReportHistory    } from './report-history';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    ReportHistory,
  ],
  imports: [
    IonicPageModule.forChild(ReportHistory),
    TranslateModule.forChild(),
  ],
  exports: [
    ReportHistory
  ]
})
export class ReportHistoryModule {}
