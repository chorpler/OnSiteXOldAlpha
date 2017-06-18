import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Settings } from './settings';
import { TranslateModule } from '@ngx-translate/core';
import { TabsComponentModule } from '../../components/tabs/tabs.module';
import { AppVersion          } from '@ionic-native/app-version'            ;


@NgModule({
  declarations: [
    Settings,
  ],
  imports: [
    IonicPageModule.forChild(Settings),
    TranslateModule.forChild(),
    TabsComponentModule,
    AppVersion,
  ],
  exports: [
    Settings,
    TabsComponentModule,
  ]
})
export class SettingsModule {}
