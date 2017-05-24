import { NgModule         } from '@angular/core'; 
import { IonicPageModule  } from 'ionic-angular'; 
import { ReportHistory    } from './report-history';

@NgModule({
  declarations: [
    ReportHistory,
  ],
  imports: [
    IonicPageModule.forChild(ReportHistory),
  ],
  exports: [
    ReportHistory
  ]
})
export class ReportHistoryModule {}
