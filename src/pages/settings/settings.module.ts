import { NgModule                         } from '@angular/core'                                           ;
import { IonicPageModule                  } from 'ionic-angular'                                           ;
import { HttpClient                       } from '@angular/common/http'                                    ;
import { Settings                         } from './settings'                                              ;
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'                                     ;
import { TranslateHttpLoader              } from '@ngx-translate/http-loader'                              ;
import { createTranslateLoader            } from 'config/customTranslateLoader'                            ;
import { TabsComponentModule              } from 'components/tabs/tabs.module'                             ;
import { ClockComponentModule             } from 'components/clock/clock.module'                           ;
import { IonDigitKeyboard                 } from 'components/ion-digit-keyboard/ion-digit-keyboard.module' ;

@NgModule({
  declarations: [
    Settings,
  ],
  imports: [
    IonicPageModule.forChild(Settings),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient],
      }
    }),
    TabsComponentModule,
    ClockComponentModule,
    IonDigitKeyboard,
  ],
  exports: [
    Settings,
    TabsComponentModule,
  ]
})
export class SettingsModule {}
