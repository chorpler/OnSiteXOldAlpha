import { NgModule                         } from   '@angular/core'                     ;
import { IonicApp, IonicModule            } from   'ionic-angular'                     ;
import { BrowserModule                    } from   '@angular/platform-browser'         ;
import { FormsModule, ReactiveFormsModule } from   '@angular/forms'                    ;
import { HttpModule                       } from   '@angular/http'                     ;

import { OnSiteX                          } from './app.component'                     ;
import { OnSiteXUser                      } from '../pages/onsite-user/onsite-user'    ;
import { AcctSettings                     } from '../pages/acct-settings/acct-settings';
import { CalView                          } from '../pages/cal-view/cal-view'          ;
import { Messages                         } from '../pages/messages/messages'          ;
import { MgmtHome                         } from '../pages/mgmt-home/mgmt-home'        ;
import { OnsiteLogin                      } from '../pages/onsite-login/onsite-login'  ;
import { Statistics                       } from '../pages/statistics/statistics'      ;
import { TechHome                         } from '../pages/tech-home/tech-home'        ;
import { TechReport                       } from '../pages/tech-report/tech-report'    ;
import { ToprReport                       } from '../pages/topr-report/topr-report'    ;
import { AuthService                      } from '../providers/auth.service'           ;
import { DbService                        } from '../providers/db.service'             ;

@NgModule({
  declarations: [
    OnSiteX,
    OnSiteXUser,
    AcctSettings,
    CalView,
    Messages,
    MgmtHome,
    OnsiteLogin,
    Statistics,
    TechHome,
    TechReport,
    ToprReport
  ],
  imports: [
    IonicModule.forRoot(OnSiteX),
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule
  ],
  entryComponents: [
    OnSiteX,
    OnSiteXUser,
    AcctSettings,
    CalView,
    Messages,
    MgmtHome,
    OnsiteLogin,
    Statistics,
    TechHome,
    TechReport,
    ToprReport
  ],
  providers: [ AuthService, DbService ],
  bootstrap: [IonicApp]
})
export class AppModule { }
