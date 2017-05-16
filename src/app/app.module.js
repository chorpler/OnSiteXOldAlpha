var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, NavController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { SecureStorage } from '@ionic-native/secure-storage';
import { MyApp } from './app.component.ts';
import { ProfileSettings } from '../providers/profile-settings.ts';
import { AuthSrvcs } from '../providers/auth-srvcs';
import { DBSrvcs } from '../providers/db-srvcs';
import { TimeSrvc } from '../providers/time-parse-srvc';
import { ReportBuildSrvc } from '../providers/report-build-srvc';
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    NgModule({
        declarations: [MyApp],
        entryComponents: [MyApp],
        bootstrap: [IonicApp],
        imports: [
            BrowserModule,
            HttpModule,
            IonicModule.forRoot(MyApp)
        ],
        providers: [
            StatusBar,
            SplashScreen,
            SecureStorage,
            NavController,
            { provide: ErrorHandler, useClass: IonicErrorHandler },
            ProfileSettings,
            AuthSrvcs,
            DBSrvcs,
            TimeSrvc,
            ReportBuildSrvc
        ]
    })
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map