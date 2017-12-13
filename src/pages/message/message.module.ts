import { NgModule                         } from '@angular/core'                ;
import { IonicPageModule                  } from 'ionic-angular'                ;
import { MessagePage                      } from './message'                    ;
import { TabsComponentModule              } from 'components/tabs/tabs.module'  ;
import { HttpClient                       } from '@angular/common/http'         ;
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'          ;
import { TranslateHttpLoader              } from '@ngx-translate/http-loader'   ;
import { createTranslateLoader            } from 'config/customTranslateLoader' ;
import { PipesModule                      } from 'pipes/pipes.module'           ;

@NgModule({
  declarations: [
    MessagePage,
  ],
  imports: [
    PipesModule,
    TabsComponentModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient],
      }
    }),
    IonicPageModule.forChild(MessagePage)
  ],
  exports: [
    MessagePage,
    TabsComponentModule
  ]
})
export class MessagePageModule {}
