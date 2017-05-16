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
import { IonicPage, NavController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { AuthSrvcs } from '../../providers/auth-srvcs';
var HomePage = (function () {
    function HomePage(navCtrl, plt, authServices) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.plt = plt;
        this.authServices = authServices;
        this.userLoggedIn = false;
        this.showPage = false;
        // isFirstItem: string = '';
        this.title = 'OnSite Home';
        console.log(this.plt.platforms());
        this.authServices.isFirstLogin().then(function (firstLogin) {
            if (firstLogin) {
                _this.userLoggedIn = false;
            }
            else {
                _this.userLoggedIn = true;
            }
            _this.showPage = true;
        });
    }
    HomePage.prototype.onNewWorkOrder = function () { this.navCtrl.push('Work Order Form', { mode: 'New' }); };
    HomePage.prototype.onLogin = function () { this.navCtrl.push('Login'); };
    // onNewJobForm() {this.navCtrl.push('Work Order', {mode: 'New'});}
    HomePage.prototype.onSettings = function () { this.navCtrl.push('Report Settings'); };
    HomePage.prototype.isFirstItem = function () {
        if (this.userLoggedIn) {
            return 'logged-in';
        }
        else {
            return '';
        }
    };
    return HomePage;
}());
HomePage = __decorate([
    IonicPage({ name: 'OnSiteHome' }),
    Component({
        selector: 'page-home',
        templateUrl: 'home.html'
    }),
    __metadata("design:paramtypes", [NavController, Platform, AuthSrvcs])
], HomePage);
export { HomePage };
// 'Work Order Form' 
//# sourceMappingURL=home.js.map