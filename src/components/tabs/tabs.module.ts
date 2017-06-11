import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TabsComponent } from './tabs';

@NgModule({
  declarations: [
    TabsComponent,
  ],
  imports: [
    IonicPageModule.forChild(TabsComponent),
  ],
  exports: [
    TabsComponent
  ]
})
export class TabsComponentModule {}
