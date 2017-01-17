/*------------------Angular2, Ionic2 Modules:-------------------*/
import { BrowserModule       } from '@angular/platform-browser'  ;
import { FormsModule         } from '@angular/forms'             ;
import { ReactiveFormsModule } from '@angular/forms'             ;
import { HttpModule          } from '@angular/http'              ;
import { NgModule            } from '@angular/core'              ;
import { ErrorHandler        } from '@angular/core'              ;
import { IonicApp            } from 'ionic-angular'              ;
import { IonicModule         } from 'ionic-angular'              ;
import { IonicErrorHandler   } from 'ionic-angular'              ;

/*------------------OnSiteX Modules-----------------------------*/
import { OnSiteX             } from './app.component'            ;
import { SettingsPage        } from '../pages/settings/settings' ;
import { LoginPage           } from '../pages/login/login'       ;
import { HomePage            } from '../pages/home/home'         ;
import { StatsPage           } from '../pages/stats/stats'       ;
import { ReportsPage         } from '../pages/reports/reports'   ;
import { MsgsPage            } from '../pages/msgs/msgs'         ;
import { ShiftPage           } from '../pages/shift/shift'       ;
import { AppInfoPage         } from '../pages/app-info/app-info' ;
import { AuthSrvcs           } from '../providers/auth-srvcs'    ;
import { DBSrvcs             } from '../providers/db-srvcs'      ;
import { TimeSrvc            } from '../'



/**
 * @interface NgModule:
 *  id              :                        string
 *  declarations    :                       any [ ]
 *  entryComponents :                       any [ ]
 *  imports         : ModuleWithProviders | any [ ]
 *  exports         :                       any [ ]
 *  providers       :                  Provider [ ]
 *  schemas         :  SchemaMetadata [ ] | any [ ]
 *  bootstrap       :                       any [ ]
 */

@NgModule({
declarations    : [ SettingsPage, LoginPage,
                    HomePage, StatsPage,
                    ReportsPage,  MsgsPage,
                    ShiftPage, AppInfoPage,
                    OnSiteX                       ],

entryComponents : [ SettingsPage, LoginPage,
                    HomePage, StatsPage,
                    ReportsPage, MsgsPage,
                    ShiftPage, AppInfoPage        ],

imports         : [ IonicModule.forRoot(OnSiteX),
                    BrowserModule, FormsModule,
                    ReactiveFormsModule,
                    HttpModule                    ],

exports         : [                               ],

providers       : [ AuthSrvcs, DBSrvcs,
                   {
                     provide: ErrorHandler,
                     useClass : IonicErrorHandler
                    }                             ],

schemas         : [                               ],

bootstrap       : [ IonicApp                      ]

})

export class AppModule {}
