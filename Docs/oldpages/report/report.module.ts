// import { PipesModule         } from 'pipes/pipes.module';
import { NgModule            } from '@angular/core'               ;
import { CommonModule        } from '@angular/common'             ;
import { IonicPageModule     } from 'ionic-angular'               ;
import { ReportPage          } from './report'                    ;
import { MultiPickerModule   } from 'components/ion-multi-picker' ;
import { TranslateModule     } from '@ngx-translate/core'         ;
// import { TabsComponentModule } from 'components/tabs/tabs.module' ;

@NgModule({
  declarations: [
    ReportPage,
  ],
  imports: [
    // TabsComponentModule,
    // PipesModule,
    CommonModule,
    IonicPageModule.forChild(ReportPage),
    TranslateModule.forChild(),
    MultiPickerModule,
  ],
  exports: [
    ReportPage,
    // TabsComponentModule,
  ]
})
export class ReportPageModule {}
