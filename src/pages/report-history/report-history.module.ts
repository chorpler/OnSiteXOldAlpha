import { NgModule                         } from '@angular/core'                 ;
import { HttpClient                       } from '@angular/common/http'          ;
import { IonicPageModule                  } from 'ionic-angular'                 ;
import { ReportHistory                    } from './report-history'              ;
import { TabsComponentModule              } from 'components/tabs/tabs.module'   ;
import { ClockComponentModule             } from 'components/clock/clock.module' ;
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'           ;
import { TranslateHttpLoader              } from '@ngx-translate/http-loader'    ;
import { createTranslateLoader            } from 'config/customTranslateLoader'  ;

@NgModule({
  declarations: [
    ReportHistory,
  ],
  imports: [
    IonicPageModule.forChild(ReportHistory),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient],
      }
    }),
    TabsComponentModule,
    ClockComponentModule,
  ],
  exports: [
    ReportHistory,
    TabsComponentModule,
  ]
})
export class ReportHistoryModule {}
