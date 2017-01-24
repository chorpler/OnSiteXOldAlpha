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
import { OpenReportsPage     } from '../pages/reports/open-reports';
import { ViewCalendarPage    } from '../pages/view-calendar/view-calendar';
import { UploadReportsPage   } from '../pages/upload-reports/upload-reports';
import { MsgsPage            } from '../pages/msgs/msgs'         ;
import { ShiftPage           } from '../pages/shift/shift'       ;
import { AppInfoPage         } from '../pages/app-info/app-info' ;
import { AuthSrvcs           } from '../providers/auth-srvcs'    ;
import { DBSrvcs             } from '../providers/db-srvcs'      ;
import { TimeSrvc            } from '../providers/time-parse-srvc';




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
 * 
 * @ionic: Add pages to declarations[] and entryComponents[]
 */

@NgModule({
declarations    : [ SettingsPage, LoginPage,
                    HomePage, StatsPage,
                    ReportsPage,  MsgsPage,
                    ShiftPage, AppInfoPage,
                    OnSiteX, OpenReportsPage,
                    ViewCalendarPage, 
                    UploadReportsPage             ],

entryComponents : [ SettingsPage, LoginPage,
                    HomePage, StatsPage,
                    ReportsPage, MsgsPage,
                    ShiftPage, AppInfoPage,
                    OpenReportsPage,
                    ViewCalendarPage, 
                    UploadReportsPage             ],

imports         : [ IonicModule.forRoot(OnSiteX),
                    BrowserModule, FormsModule,
                    ReactiveFormsModule,
                    HttpModule                    ],

exports         : [                               ],

providers       : [ AuthSrvcs, DBSrvcs, TimeSrvc,
                   {
                     provide: ErrorHandler,
                     useClass : IonicErrorHandler
                    }                             ],

schemas         : [                               ],

bootstrap       : [ IonicApp                      ]

})

export class AppModule {}
