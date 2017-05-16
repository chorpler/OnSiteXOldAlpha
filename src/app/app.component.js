var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { Platform, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
var MyApp = (function () {
    function MyApp(platform, navCtrl, statusBar, splashScreen) {
        var _this = this;
        this.rootPage = 'OnSiteHome';
        this.pouchOptions = {};
        platform.ready().then(function () {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            splashScreen.hide();
            _this.pouchOptions = { adapter: 'websql', auto_compaction: true };
            window["PouchDB"] = require("pouchdb");
            window["PouchDB"].plugin(require('pouchdb-upsert'));
            window["PouchDB"].plugin(require('pouchdb-authentication'));
            // this.PouchDB = require('pouchdb');
            _this.PouchDB = window["PouchDB"].defaults(_this.pouchOptions);
            window["PouchDB"] = window["PouchDB"].defaults(_this.pouchOptions);
            _this.PouchDB.debug.enable('pouchdb:api');
            // this.PouchDB.debug.disable('pouchdb:api');
            // window["PouchDB"] = this.PouchDB; // Dev: reveals PouchDB to PouchDB Inspector
            console.log("App done starting, now moving to Home...");
            navCtrl.push('OnSiteHome');
        });
    }
    return MyApp;
}());
MyApp = __decorate([
    Component({
        templateUrl: 'app.html'
    }),
    __metadata("design:paramtypes", [Platform, NavController, StatusBar, SplashScreen])
], MyApp);
export { MyApp };
//# sourceMappingURL=app.component.js.map