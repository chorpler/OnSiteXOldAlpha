import { NgModule          } from '@angular/core'               ;
import { CommonModule      } from '@angular/common'             ;
import { IonicPageModule   } from 'ionic-angular'               ;
import { ReportViewPage    } from './report-view'               ;
import { MultiPickerModule } from 'components/ion-multi-picker' ;
import { TranslateModule   } from '@ngx-translate/core'         ;
import { PipesModule       } from 'pipes/pipes.module'          ;

@NgModule({
  declarations: [
    ReportViewPage,
  ],
  imports: [
    CommonModule,
    IonicPageModule.forChild(ReportViewPage),
    TranslateModule.forChild(),
    MultiPickerModule,
    PipesModule,
  ],
  exports: [
    ReportViewPage,
    // TabsComponentModule,
  ]
})
export class ReportViewPageModule {}
