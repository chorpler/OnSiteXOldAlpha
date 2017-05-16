import { BrowserModule                           } from '@angular/platform-browser'        ;
import { HttpModule                              } from '@angular/http'                    ;
import { ErrorHandler , NgModule                 } from '@angular/core'                    ;
import { IonicApp, IonicErrorHandler, IonicModule, NavController } from 'ionic-angular'    ;
import { SplashScreen                            } from '@ionic-native/splash-screen'      ;
import { StatusBar                               } from '@ionic-native/status-bar'         ;
import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage';

import { MyApp                                   } from './app.component.ts'               ;
import { ProfileSettings                         } from '../providers/profile-settings.ts' ;
import * as PouchDB                                from 'pouchdb'                          ;
import { AuthSrvcs                               } from '../providers/auth-srvcs'          ;
import { DBSrvcs                                 } from '../providers/db-srvcs'            ;
import { TimeSrvc                                } from '../providers/time-parse-srvc'     ;
import { ReportBuildSrvc                         } from '../providers/report-build-srvc'   ;


@NgModule({
  declarations   : [ MyApp                                                  ], 

  entryComponents: [ MyApp                                                  ], 

  bootstrap      : [ IonicApp                                               ], 
  
  imports        : [
                      BrowserModule,
                      HttpModule,
                      IonicModule.forRoot(MyApp)
                                                                            ],

  providers      : [
                      StatusBar,
                      SplashScreen,
                      SecureStorage,
                      NavController,
                      {provide: ErrorHandler, useClass: IonicErrorHandler},
                      ProfileSettings,
                      AuthSrvcs,
                      DBSrvcs,
                      TimeSrvc,
                      ReportBuildSrvc
                                                                            ]
})

export class AppModule {}
