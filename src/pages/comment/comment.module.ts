import { NgModule                         } from '@angular/core'                      ;
import { Http                             } from '@angular/http'                      ;
import { IonicPageModule                  } from 'ionic-angular'                      ;
import { CommentPage                      } from './comment'                          ;
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'                ;
import { TranslateHttpLoader              } from '@ngx-translate/http-loader'         ;
import { createTranslateLoader            } from '../../config/customTranslateLoader' ;

@NgModule({
  declarations: [
    CommentPage,
  ],
  imports: [
    IonicPageModule.forChild(CommentPage),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
      },
    }),
  ],
  exports: [
    CommentPage
  ]
})
export class CommentPageModule {}
