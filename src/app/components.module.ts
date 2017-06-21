import { ErrorHandler , NgModule } from '@angular/core'                             ;
import { HomePageModule      } from '../pages/home/home.module'                     ;
import { LoginModule         } from '../pages/login/login.module'                   ;
import { SettingsModule      } from '../pages/settings/settings.module'             ;
import { ReportModule        } from '../pages/report/report.module'                 ;
import { ReportHistoryModule } from '../pages/report-history/report-history.module' ;
import { EditReportModule    } from '../pages/edit-report/edit-report.module'       ;
import { DeveloperPageModule } from '../pages/developer/developer.module'           ;

@NgModule({
  declarations   : [
  ],

  imports        : [
    HomePageModule,
    LoginModule,
    SettingsModule,
    ReportModule,
    ReportHistoryModule,
    EditReportModule,
    DeveloperPageModule
],

  exports        : [
    HomePageModule,
    LoginModule,
    SettingsModule,
    ReportModule,
    ReportHistoryModule,
    EditReportModule,
    DeveloperPageModule
],

  providers      : []
})

export class ComponentsModule {}
