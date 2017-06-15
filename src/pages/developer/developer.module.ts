import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DeveloperPage } from './developer';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    DeveloperPage,
  ],
  imports: [
    IonicPageModule.forChild(DeveloperPage),
    TranslateModule.forChild(),
  ],
  exports: [
    DeveloperPage
  ]
})
export class DeveloperPageModule {}
