import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Http } from '@angular/http';
import { Settings } from './settings';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { createTranslateLoader } from '../../config/customTranslateLoader';
import { TabsComponentModule } from '../../components/tabs/tabs.module';


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
        deps: [Http]
      }
    }),
    TabsComponentModule,
  ],
  exports: [
    Settings,
    TabsComponentModule,
  ]
})
export class SettingsModule {}
