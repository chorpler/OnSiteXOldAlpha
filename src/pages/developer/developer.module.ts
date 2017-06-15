import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DeveloperPage } from './developer';
import { TranslateModule } from '@ngx-translate/core';
import { TabsComponentModule } from '../../components/tabs/tabs.module'


@NgModule({
  declarations: [
    DeveloperPage,
  ],
  imports: [
    IonicPageModule.forChild(DeveloperPage),
    TranslateModule.forChild(),
    TabsComponentModule,
  ],
  exports: [
    DeveloperPage,
    TabsComponentModule,
]
})
export class DeveloperPageModule {}
