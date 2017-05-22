import 'intl';
import 'intl/locale-data/jsonp/en';
import { BrowserModule                                           } from '@angular/platform-browser'            ;
import { HttpModule                                              } from '@angular/http'                        ;
import { ErrorHandler , NgModule                                 } from '@angular/core'                        ;
import { IonicApp, IonicErrorHandler, IonicModule, NavController } from 'ionic-angular'                        ;
import { SplashScreen                                            } from '@ionic-native/splash-screen'          ;
import { StatusBar                                               } from '@ionic-native/status-bar'             ;
import { IonicStorageModule                                      } from '@ionic/storage'                       ;
import { SecureStorage, SecureStorageObject                      } from '@ionic-native/secure-storage'         ;
import { OnSiteApp                                               } from './app.component.ts'                   ;
import { ProfileSettings                                         } from '../providers/profile-settings.ts'     ;
import * as PouchDB                                                from 'pouchdb'                              ;
import { AuthSrvcs                                               } from '../providers/auth-srvcs'              ;
import { DBSrvcs                                                 } from '../providers/db-srvcs'                ;
import { TimeSrvc                                                } from '../providers/time-parse-srvc'         ;
import { ReportBuildSrvc                                         } from '../providers/report-build-srvc'       ;
import { UserData                                                } from '../providers/user-data'               ;
import { SrvrSrvcs                                               } from '../providers/srvr-srvcs'              ;
import { DbBulkuploadSrvc                                        } from '../providers/db-bulkupload-srvc'      ;
import { Geofence                                                } from '@ionic-native/geofence'               ;
import { BackgroundGeolocation, BackgroundGeolocationConfig      } from '@ionic-native/background-geolocation' ;
import { BackgroundGeolocationResponse                           } from '@ionic-native/background-geolocation' ;
import { Network                                                 } from '@ionic-native/network'                ;
import { Push, PushObject, PushOptions                           } from '@ionic-native/push'                   ;
import { LocalNotifications                                      } from '@ionic-native/local-notifications'    ;

@NgModule({
  declarations   : [ OnSiteApp                                              ], 

  entryComponents: [ OnSiteApp                                              ], 

  bootstrap      : [ IonicApp                                               ], 
  
  imports        : [
                      BrowserModule,
                      HttpModule,
                      IonicStorageModule.forRoot({
                        name: '__onsitestorage',
                        driverOrder: ['localstorage']
                      }),
                      IonicModule.forRoot(OnSiteApp)
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
                      ReportBuildSrvc,
                      UserData,
                      SrvrSrvcs,
                      DbBulkuploadSrvc,
                      Geofence,
                      BackgroundGeolocation,
                      Network,
                      Push,
                      LocalNotifications
                                                                            ]
})

export class AppModule {}
