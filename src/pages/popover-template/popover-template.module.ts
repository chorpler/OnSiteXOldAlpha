import { NgModule                         } from '@angular/core'                ;
import { HttpClient                       } from '@angular/common/http'         ;
import { IonicPageModule                  } from 'ionic-angular'                ;
import { PopoverTemplate                  } from './popover-template'           ;
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'          ;
import { TranslateHttpLoader              } from '@ngx-translate/http-loader'   ;
import { createTranslateLoader            } from 'config/customTranslateLoader' ;
import { PipesModule                      } from 'pipes/pipes.module'           ;

@NgModule({
  declarations: [
    PopoverTemplate,
  ],
  imports: [
    IonicPageModule.forChild(PopoverTemplate),
    PipesModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        // useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
  ],
  exports: [
    PopoverTemplate
  ]
})
export class PopoverTemplateModule {}
