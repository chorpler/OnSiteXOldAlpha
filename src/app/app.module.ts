import 'intl';
import 'intl/locale-data/jsonp/en';
import { BrowserModule                                           } from '@angular/platform-browser'            ;
import { HttpModule                                              } from '@angular/http'                        ;
import { ErrorHandler , NgModule                                 } from '@angular/core'                        ;
import { IonicApp, IonicErrorHandler, IonicModule, NavController } from 'ionic-angular'                        ;
import { IonicPageModule                                         } from 'ionic-angular'                        ;
import { LoadingController, AlertController                      } from 'ionic-angular'                        ;
import { SplashScreen                                            } from '@ionic-native/splash-screen'          ;
import { StatusBar                                               } from '@ionic-native/status-bar'             ;
import { IonicStorageModule                                      } from '@ionic/storage'                       ;
import { SecureStorage, SecureStorageObject                      } from '@ionic-native/secure-storage'         ;
import { OnSiteApp                                               } from './app.component.ts'                   ;
import { ProfileSettings                                         } from '../providers/profile-settings.ts'     ;
import * as PouchDB                                                from 'pouchdb'                              ;
import * as moment                                                 from 'moment'                               ;
import { AuthSrvcs                                               } from '../providers/auth-srvcs'              ;
import { DBSrvcs                                                 } from '../providers/db-srvcs'                ;
import { TimeSrvc                                                } from '../providers/time-parse-srvc'         ;
import { ReportBuildSrvc                                         } from '../providers/report-build-srvc'       ;
import { UserData                                                } from '../providers/user-data'               ;
import { SrvrSrvcs                                               } from '../providers/srvr-srvcs'              ;
import { DbBulkuploadSrvc                                        } from '../providers/db-bulkupload-srvc'      ;
import { NetworkStatus                                           } from '../providers/network-status'          ;
import { Geofence                                                } from '@ionic-native/geofence'               ;
import { BackgroundGeolocation, BackgroundGeolocationConfig      } from '@ionic-native/background-geolocation' ;
import { BackgroundGeolocationResponse                           } from '@ionic-native/background-geolocation' ;
import { Network                                                 } from '@ionic-native/network'                ;
import { Push, PushObject, PushOptions                           } from '@ionic-native/push'                   ;
import { LocalNotifications                                      } from '@ionic-native/local-notifications'    ;
import { UniqueDeviceID                                          } from '@ionic-native/unique-device-id'       ;
import { Log                                                     } from '../config/config.functions'           ;
import { AlertService                                            } from '../providers/alerts'                  ;
import { GeolocService                                           } from '../providers/geoloc-service'          ;
import { Status                                                  } from '../providers/status'                  ;
import { StatusProvider                                          } from '../providers/status/status'           ;
import { MultiPickerModule                                       } from 'ion-multi-picker'                     ;
import { Ion3TimeDurationPicker                                  } from '../components/ion3-time-duration-picker/ion3-time-duration-picker';

@NgModule({
  declarations   : [
                      OnSiteApp,
                   ],
  entryComponents: [  OnSiteApp                      ],

  bootstrap      : [  IonicApp                       ],

  imports        : [
                      BrowserModule,
                      HttpModule,
                      IonicStorageModule.forRoot({
                        name: '__onsitestorage',
                        driverOrder: ['localstorage'  ]
                      }),
                      IonicModule.forRoot(OnSiteApp),
                      MultiPickerModule
                      // NumericModule,
                      // DatePickerModule
                                                       ],

  providers      : [
                      StatusBar,
                      SplashScreen,
                      SecureStorage,
                      NavController,
                      LoadingController,
                      AlertController,
                      AlertService,
                      {
                        provide: ErrorHandler,
                        useClass: IonicErrorHandler
                      },
                      ProfileSettings,
                      AuthSrvcs,
                      DBSrvcs,
                      TimeSrvc,
                      ReportBuildSrvc,
                      UserData,
                      SrvrSrvcs,
                      DbBulkuploadSrvc,
                      NetworkStatus,
                      Geofence,
                      BackgroundGeolocation,
                      Network,
                      Push,
                      LocalNotifications,
                      GeolocService,
                      Status
                                                      ]
})

export class AppModule {}
