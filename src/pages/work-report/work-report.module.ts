import { NgModule            } from '@angular/core';
import { IonicPageModule     } from 'ionic-angular';
import { WorkReportPage      } from './work-report';
import { MultiPickerModule   } from 'ion-multi-picker';
import { TranslateModule     } from '@ngx-translate/core';
import { TabsComponentModule } from '../../components/tabs/tabs.module';

@NgModule({
  declarations: [
    WorkReportPage,
  ],
  imports: [
    IonicPageModule.forChild(WorkReportPage),
    TranslateModule.forChild(),
    TabsComponentModule,
    MultiPickerModule,
  ],
  exports: [
    WorkReportPage,
    TabsComponentModule,
  ]
})
export class WorkReportPageModule {}
