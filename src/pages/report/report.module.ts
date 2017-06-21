import { Http                             } from '@angular/http';
import { NgModule                         } from '@angular/core';
import { IonicPageModule                  } from 'ionic-angular';
import { ReportPage                       } from './report';
import { MultiPickerModule                } from 'ion-multi-picker';
import { TabsComponentModule              } from '../../components/tabs/tabs.module'
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader              } from '@ngx-translate/http-loader';
import { createTranslateLoader            } from '../../config/customTranslateLoader';

@NgModule({
  declarations: [
    ReportPage
  ],
  imports: [
    IonicPageModule.forChild(ReportPage),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
      }
    }),
    MultiPickerModule,
    TabsComponentModule,
  ],
  exports: [
    ReportPage,
    TabsComponentModule,
  ]
})
export class ReportPageModule { }
