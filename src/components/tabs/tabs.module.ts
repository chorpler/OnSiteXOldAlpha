import { NgModule,                        } from '@angular/core'                 ;
import { CommonModule                     } from '@angular/common'               ;
import { FormsModule                      } from '@angular/forms'                ;
import { HttpClient                       } from '@angular/common/http'          ;
import { IonicPageModule                  } from 'ionic-angular'                 ;
import { TabsComponent                    } from './tabs'                        ;
import { ClockComponentModule             } from 'components/clock/clock.module' ;
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'           ;
import { TranslateHttpLoader              } from '@ngx-translate/http-loader'    ;
import { createTranslateLoader            } from 'config/customTranslateLoader'  ;

@NgModule({
  declarations: [
    TabsComponent,
  ],
  imports: [
    IonicPageModule.forChild(TabsComponent),
    CommonModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient],
      }
    }),
    ClockComponentModule,
  ],
  exports: [
    TabsComponent,
  ]
})
export class TabsComponentModule {}
