// Framework Modules:

import { BrowserModule       } from '@angular/platform-browser'  ;
import { FormsModule         } from '@angular/forms'             ;
import { ReactiveFormsModule } from '@angular/forms'             ;
import { HttpModule          } from '@angular/http'              ;
import { NgModule            } from '@angular/core'              ;
import { ErrorHandler        } from '@angular/core'              ;
import { IonicApp            } from 'ionic-angular'              ;
import { IonicModule         } from 'ionic-angular'              ;
import { IonicErrorHandler   } from 'ionic-angular'              ;
import { InMemoryWebApiModule } from 'angular-in-memory-web-api' ;
import { InMemoryDataService }  from '../providers/in-memory-data-service';

// OnSiteX Modules
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
import { UtilSrvcs           } from '../providers/util-srvcs'    ;
import { AuthTestUser        } from '../providers/auth-test-user';
import { AddUsersSrvc        } from '../providers/add.dbusers.service';


/**
 * interface NgModule {
 *    declarations    : Array<Type<any>|any [ ]>
 *    entryComponents : Array<Type<any>|any [ ]>
 *    imports         : Array<Type<any>|ModuleWithProviders|any [ ]>
 *    exports         : Array<Type<any>|any [ ]>
 *    providers       : Provider [ ]
 *    schemas         : Array<SchemaMetadata|any [ ]> id : string
 *    bootstrap       : Array<Type<any>|any [ ]>
 * }
 */

@NgModule({
  declarations: [ SettingsPage,
                  LoginPage,
                  HomePage,
                  StatsPage,
                  ReportsPage,
                  MsgsPage,
                  ShiftPage,
                  AppInfoPage,
                  OnSiteX],

entryComponents: [ SettingsPage,
                   LoginPage,
                   HomePage,
                   StatsPage,
                   ReportsPage,
                   MsgsPage,
                   ShiftPage,
                   AppInfoPage],

imports:         [ IonicModule.forRoot(OnSiteX),
                   InMemoryWebApiModule.forRoot(InMemoryDataService),
                   BrowserModule,
                   FormsModule,
                   ReactiveFormsModule,
                   HttpModule    ],

exports:         [             ],

providers:       [ AuthSrvcs,
                   DBSrvcs,
                   UtilSrvcs,
                  { provide: ErrorHandler,
                  useClass: IonicErrorHandler },
                  AuthTestUser,
                  AddUsersSrvc ],

schemas:         [             ],

bootstrap:       [ IonicApp    ]

})
export class AppModule {}
