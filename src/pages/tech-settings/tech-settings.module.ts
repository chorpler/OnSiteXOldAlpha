import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TechSettingsPage } from './tech-settings';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    TechSettingsPage,
  ],
  imports: [
    IonicPageModule.forChild(TechSettingsPage),
    TranslateModule.forChild(),
  ],
  exports: [
    TechSettingsPage
  ]
})
export class TechSettingsPageModule {}
