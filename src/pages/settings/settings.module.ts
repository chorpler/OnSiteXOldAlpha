import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Settings } from './settings';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    Settings,
  ],
  imports: [
    IonicPageModule.forChild(Settings),
    TranslateModule.forChild(),
  ],
  exports: [
    Settings
  ]
})
export class SettingsModule {}
