import { NgModule }          from '@angular/core';
import { IonicPageModule }   from 'ionic-angular';
import { ReportPage }        from './report';
import { MultiPickerModule } from 'ion-multi-picker';
import { TranslateModule } from '@ngx-translate/core';
import { TabsComponentModule } from '../../components/tabs/tabs.module'


@NgModule({
  declarations: [
    ReportPage
  ],
  imports: [
    IonicPageModule.forChild(ReportPage),
    TranslateModule.forChild(),
    MultiPickerModule,
    TabsComponentModule,
  ],
  exports: [
    ReportPage,
    TabsComponentModule,
  ]
})
export class WorkOrderModule { }
