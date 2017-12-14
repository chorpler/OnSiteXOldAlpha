import { NgModule            } from '@angular/core'       ;
import { IonicPageModule     } from 'ionic-angular'       ;
import { TechSettingsPage    } from './tech-settings'     ;
import { TranslateModule     } from '@ngx-translate/core' ;
// import { TabsComponentModule } from 'components/tabs/tabs.module'


@NgModule({
  declarations: [
    TechSettingsPage,
  ],
  imports: [
    IonicPageModule.forChild(TechSettingsPage),
    TranslateModule.forChild(),
    // TabsComponentModule,
  ],
  exports: [
    TechSettingsPage,
    // TabsComponentModule,
  ]
})
export class TechSettingsPageModule {}
