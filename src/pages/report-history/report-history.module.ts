import { NgModule         } from '@angular/core'; 
import { IonicPageModule  } from 'ionic-angular'; 
import { ReportHistoryPage} from './report-history';

@NgModule({
  declarations: [
    ReportHistoryPage,
  ],
  imports: [
    IonicPageModule.forChild(ReportHistoryPage),
  ],
  exports: [
    ReportHistoryPage
  ]
})
export class ReportHistoryPageModule {}
