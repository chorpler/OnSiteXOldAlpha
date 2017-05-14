import { BrowserModule                           } from '@angular/platform-browser'  ; 
import { ErrorHandler , NgModule                 } from '@angular/core'              ; 
import { IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular'              ; 
import { SplashScreen                            } from '@ionic-native/splash-screen'; 
import { StatusBar                               } from '@ionic-native/status-bar'   ; 

import { MyApp                                   } from './app.component'            ;
import { ProfileSettings                         } from '../providers/profile-settings.ts';



@NgModule({
  declarations   : [ MyApp                                                  ], 

  entryComponents: [ MyApp                                                  ], 

  bootstrap      : [ IonicApp                                               ], 
  
  imports        : [
                      BrowserModule,
                      IonicModule.forRoot(MyApp)
                                                                            ],

  providers      : [
                      StatusBar,
                      SplashScreen,
                      {provide: ErrorHandler, useClass: IonicErrorHandler},
                      ProfileSettings
                                                                            ]
})

export class AppModule {}
