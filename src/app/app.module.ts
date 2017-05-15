import { BrowserModule                           } from '@angular/platform-browser'  ; 
import { HttpModule                               } from '@angular/http'
import { ErrorHandler , NgModule                 } from '@angular/core'              ; 
import { IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular'              ; 
import { SplashScreen                            } from '@ionic-native/splash-screen'; 
import { StatusBar                               } from '@ionic-native/status-bar'   ; 

import { MyApp                                   } from './app.component.ts'            ;
import { ProfileSettings                         } from '../providers/profile-settings.ts';
import { AuthSrvcs                               } from '../providers/auth-srvcs';
import { DBSrvcs                                 } from '../providers/db-srvcs';


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
                      {provide: ErrorHandler, useClass: IonicErrorHandler},
                      ProfileSettings,
                      AuthSrvcs,
                      DBSrvcs
                                                                            ]
})

export class AppModule {}
