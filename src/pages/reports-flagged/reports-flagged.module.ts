import { NgModule                         } from '@angular/core'                 ;
import { HttpClient                       } from '@angular/common/http'          ;
import { IonicPageModule                  } from 'ionic-angular'                 ;
import { ReportsFlaggedPage               } from './reports-flagged'             ;
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'           ;
import { TranslateHttpLoader              } from '@ngx-translate/http-loader'    ;
import { createTranslateLoader            } from 'config/customTranslateLoader'  ;

@NgModule({
  declarations: [
    ReportsFlaggedPage,
  ],
  imports: [
    IonicPageModule.forChild(ReportsFlaggedPage),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient],
      }
    }),
    // TabsComponentModule,
    // ClockComponentModule,
  ],
  exports: [
    ReportsFlaggedPage,
    // TabsComponentModule,
  ]
})
export class ReportsFlaggedPageModule {}
