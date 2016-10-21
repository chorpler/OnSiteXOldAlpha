import { NgModule              } from   '@angular/core'        ;
import { IonicApp, IonicModule } from   'ionic-angular'        ;
import { MyApp                 } from './app.component'        ;
import { Page1                 } from '../pages/page1/page1'   ;
import { Page2                 } from '../pages/page2/page2'   ;
import {   AcctSettings        } from '../pages/acct-settings/acct-settings';
import {   CalView             } from '../pages/cal-view/cal-view';
import {   Home                } from '../pages/home/home';
import {   Messages            } from '../pages/messages/messages';
import {   MgmtHome            } from '../pages/mgmt-home/mgmt-home';
import {   OnsiteLogin         } from '../pages/onsite-login/onsite-login';
import {   Statistics          } from '../pages/statistics/statistics';
import {   TechHome            } from '../pages/tech-home/tech-home';
import {   TechReport          } from '../pages/tech-report/tech-report';
import {   ToprReport          } from '../pages/topr-report/topr-report';


@NgModule({
  declarations: [
    MyApp,
    Page1,
    Page2,
    AcctSettings,
    CalView,
    Home,
    Messages,
    MgmtHome,
    OnsiteLogin,
    Statistics,
    TechHome,
    TechReport,
    ToprReport
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Page1,
    Page2,
    AcctSettings,
    CalView,
    Home,
    Messages,
    MgmtHome,
    OnsiteLogin,
    Statistics,
    TechHome,
    TechReport,
    ToprReport
  ],
  providers: []
})
export class AppModule { }
