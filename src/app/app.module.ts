import 'intl'                                                                                                    ;
import 'intl/locale-data/jsonp/en'                                                                               ;
import { BrowserModule                                           } from '@angular/platform-browser'                                  ;
import { BrowserAnimationsModule                                 } from '@angular/platform-browser/animations'                       ;
import { MultiPickerModule                                       } from 'ion-multi-picker'                                           ;
import { HttpModule,Http                                         } from '@angular/http'                                              ;
import { ErrorHandler, NgModule                                  } from '@angular/core'                                              ;
import { IonicApp, IonicErrorHandler, IonicModule, NavController } from 'ionic-angular'                                              ;
import { IonicPageModule                                         } from 'ionic-angular'                                              ;
import { LoadingController, AlertController                      } from 'ionic-angular'                                              ;
import { SplashScreen                                            } from '@ionic-native/splash-screen'                                ;
import { StatusBar                                               } from '@ionic-native/status-bar'                                   ;
import { IonicStorageModule                                      } from '@ionic/storage'                                             ;
import { SecureStorage, SecureStorageObject                      } from '@ionic-native/secure-storage'                               ;
import { Geofence                                                } from '@ionic-native/geofence'                                     ;
import { BackgroundGeolocation, BackgroundGeolocationConfig      } from '@ionic-native/background-geolocation'                       ;
import { BackgroundGeolocationResponse                           } from '@ionic-native/background-geolocation'                       ;
import { Network                                                 } from '@ionic-native/network'                                      ;
import { Push, PushObject, PushOptions                           } from '@ionic-native/push'                                         ;
import { LocalNotifications                                      } from '@ionic-native/local-notifications'                          ;
import { UniqueDeviceID                                          } from '@ionic-native/unique-device-id'                             ;
import { Device                                                  } from '@ionic-native/device'                                       ;
import { AppVersion                                              } from '@ionic-native/app-version'                                  ;
import { NativeAudio                                             } from '@ionic-native/native-audio'                                 ;
import { Camera, CameraOptions                                   } from '@ionic-native/camera'                                       ;
import { OnSiteApp                                               } from './app.component.ts'                                         ;
import { ProfileSettings                                         } from '../providers/profile-settings.ts'                           ;
import { AuthSrvcs                                               } from '../providers/auth-srvcs'                                    ;
import { DBSrvcs                                                 } from '../providers/db-srvcs'                                      ;
import { TimeSrvc                                                } from '../providers/time-parse-srvc'                               ;
import { ReportBuildSrvc                                         } from '../providers/report-build-srvc'                             ;
import { UserData                                                } from '../providers/user-data'                                     ;
import { SrvrSrvcs                                               } from '../providers/srvr-srvcs'                                    ;
import { NetworkStatus                                           } from '../providers/network-status'                                ;
import { AlertService                                            } from '../providers/alerts'                                        ;
import { GeolocService                                           } from '../providers/geoloc-service'                                ;
import { PouchDBService                                          } from '../providers/pouchdb-service'                               ;
import { StorageService                                          } from '../providers/storage-service'                               ;
import { TranslateModule, TranslateLoader                        } from '@ngx-translate/core'                                        ;
import { TranslateHttpLoader                                     } from '@ngx-translate/http-loader'                                 ;
import { CustomTranslateLoaderModule                             } from '../config/customTranslateLoader.module'                     ;
import { createTranslateLoader                                   } from '../config/customTranslateLoader'                            ;
import { TabsComponent                                           } from '../components/tabs/tabs'                                    ;
import { PipesModule                                             } from '../pipes/pipes.module'                                      ;
import { Preferences                                             } from '../providers/preferences'                                   ;
import { SmartAudio                                              } from '../providers/smart-audio'                                   ;
import { MessageService                                          } from '../providers/message-service'                               ;
import { CommentService                                          } from '../providers/comment-service'                               ;
import { IonDigitKeyboard                                        } from '../components/ion-digit-keyboard/ion-digit-keyboard.module' ;
import { ClockComponentModule                                    } from '../components/clock/clock.module'                           ;

@NgModule({
  declarations   : [
                      OnSiteApp,
                   ],
  entryComponents: [  OnSiteApp                      ],

  bootstrap      : [  IonicApp                       ],

  imports        : [
                      BrowserModule,
                      // BrowserAnimationsModule,
                      IonicModule.forRoot(OnSiteApp),
                      IonicStorageModule.forRoot({
                        name: '__onsitestorage',
                        driverOrder: ['localstorage']
                      }),
                      HttpModule,
                      TranslateModule.forRoot({
                        loader: {
                          provide: TranslateLoader,
                          useFactory: (createTranslateLoader),
                          deps: [Http]
                        }
                      }),
                      // MultiPickerModule,
                      IonDigitKeyboard,
                      PipesModule,
                      ClockComponentModule,
                   ],

  providers      : [
                      StatusBar,
                      SplashScreen,
                      SecureStorage,
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
                      NetworkStatus,
                      Geofence,
                      BackgroundGeolocation,
                      Network,
                      Push,
                      LocalNotifications,
                      UniqueDeviceID,
                      Device,
                      NativeAudio,
                      Camera,
                      GeolocService,
                      PouchDBService,
                      StorageService,
                      TabsComponent,
                      AppVersion,
                      Preferences,
                      SmartAudio,
                      MessageService,
                      CommentService,
                    ]
})

export class AppModule {}
