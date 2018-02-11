import { NgModule                    } from '@angular/core'               ;
import { CommonModule                } from '@angular/common'             ;
import { IonicPageModule             } from 'ionic-angular'               ;
import { ShiftViewPage               } from './shift-view'                ;
import { TranslateModule             } from '@ngx-translate/core'         ;
import { ElasticTextDirectiveModule  } from 'directives/elastic-textarea' ;
import { ChartStackedComponentModule } from 'components/chart-stacked'    ;

@NgModule({
  declarations: [
    ShiftViewPage,
  ],
  imports: [
    CommonModule,
    IonicPageModule.forChild(ShiftViewPage),
    TranslateModule.forChild(),
    ElasticTextDirectiveModule,
    ChartStackedComponentModule,
  ],
  exports: [
    ShiftViewPage,
    // TabsComponentModule,
  ]
})
export class ShiftViewPageModule {}
