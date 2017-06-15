import { NgModule } from '@angular/core';
import { HomePage } from './home';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { TabsComponentModule } from '../../components/tabs/tabs.module'

@NgModule({
  declarations: [HomePage],
  imports: [
    IonicPageModule.forChild(HomePage),
    TranslateModule.forChild(),
    TabsComponentModule,
  ],
  entryComponents: [
    HomePage
  ],
  exports: [
    HomePage,
    TabsComponentModule,
   ]
})
export class HomePageModule { } 