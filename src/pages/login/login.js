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
import { IonicPage, NavController, NavParams } from 'ionic-angular';
// import { LoginErrorPopover                } from './login-error-popover'      ;
// import { Settings                         } from '../settings/settings'       ;
import { AuthSrvcs } from '../../providers/auth-srvcs';
/**
 * Generated class for the Login page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
var Login = (function () {
    // constructor(public navCtrl: NavController, public navParams: NavParams, public popoverCtrl: PopoverController, private auth: AuthSrvcs) {
    function Login(navCtrl, navParams, auth) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.auth = auth;
        this.loginError = false;
        // constructor(public navCtrl: NavController, public navParams: NavParams, private settings: Settings, private auth: AuthSrvcs) {
    }
    Login.prototype.ionViewDidLoad = function () {
        console.log('Login: ionViewDidLoad fired.');
    };
    Login.prototype.loginAttempt = function () {
        var _this = this;
        console.log("Login: Now attempting login:");
        this.auth.setUser(this.username);
        this.auth.setPassword(this.password);
        console.log("About to call auth.login()");
        this.auth.login().then(function (res) {
            console.log("Login succeeded.");
            console.log(res);
            _this.navCtrl.push('Report Settings');
        }).catch(function (err) {
            console.log("Login error.");
            console.log(err);
            _this.loginError = true;
        });
    };
    return Login;
}());
Login = __decorate([
    IonicPage({ name: 'Login' }),
    Component({
        selector: 'page-login',
        templateUrl: 'login.html',
    }),
    __metadata("design:paramtypes", [NavController, NavParams, AuthSrvcs])
], Login);
export { Login };
//# sourceMappingURL=login.js.map