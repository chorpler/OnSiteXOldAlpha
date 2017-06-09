import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TechSettingsPage } from './tech-settings';

@NgModule({
  declarations: [
    TechSettingsPage,
  ],
  imports: [
    IonicPageModule.forChild(TechSettingsPage),
  ],
  exports: [
    TechSettingsPage
  ]
})
export class TechSettingsPageModule {}
