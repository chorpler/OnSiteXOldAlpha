import { NgModule             } from '@angular/core'                       ;
import { IonicPageModule      } from 'ionic-angular'                       ;
import { ReportHistory        } from './report-history'                    ;
import { TranslateModule      } from '@ngx-translate/core'                 ;
import { TabsComponentModule  } from '../../components/tabs/tabs.module'   ;
import { ClockComponentModule } from '../../components/clock/clock.module' ;

@NgModule({
  declarations: [
    ReportHistory,
  ],
  imports: [
    IonicPageModule.forChild(ReportHistory),
    TranslateModule.forChild(),
    TabsComponentModule,
    ClockComponentModule,
  ],
  exports: [
    ReportHistory,
    TabsComponentModule,
  ]
})
export class ReportHistoryModule {}
