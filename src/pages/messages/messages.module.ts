import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MessagesPage } from './messages';
import { TabsComponentModule } from '../../components/tabs/tabs.module'

@NgModule({
  declarations: [
    MessagesPage,
  ],
  imports: [
    TabsComponentModule,
    IonicPageModule.forChild(MessagesPage),
  ],
  exports: [
    MessagesPage,
    TabsComponentModule
  ]
})
export class MessagesPageModule {}
