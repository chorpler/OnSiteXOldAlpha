import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TabsComponent } from './tabs';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    TabsComponent,
  ],
  imports: [
    IonicPageModule.forChild(TabsComponent),
    TranslateModule.forChild(),
  ],
  exports: [
    TabsComponent
  ]
})
export class TabsComponentModule {}
