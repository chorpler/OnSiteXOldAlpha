webpackJsonp([3],{

/***/ 340:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__home__ = __webpack_require__(461);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(114);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HomePageModule", function() { return HomePageModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var HomePageModule = (function () {
    function HomePageModule() {
    }
    return HomePageModule;
}());
HomePageModule = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["a" /* NgModule */])({
        declarations: [__WEBPACK_IMPORTED_MODULE_1__home__["a" /* HomePage */]],
        imports: [
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["e" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_1__home__["a" /* HomePage */])
        ],
        entryComponents: [
            __WEBPACK_IMPORTED_MODULE_1__home__["a" /* HomePage */]
        ]
    })
], HomePageModule);

//# sourceMappingURL=home.module.js.map

/***/ }),

/***/ 461:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(114);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_auth_srvcs__ = __webpack_require__(258);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__config_config_functions__ = __webpack_require__(467);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomePage; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





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
    HomePage.prototype.logoutOfApp = function () {
        var _this = this;
        __WEBPACK_IMPORTED_MODULE_3__config_config_functions__["a" /* Log */].l("User clicked logout button.");
        this.authServices.logout().then(function (res) {
            __WEBPACK_IMPORTED_MODULE_3__config_config_functions__["a" /* Log */].l("Done logging out.");
            _this.userLoggedIn = false;
        });
    };
    return HomePage;
}());
HomePage = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* IonicPage */])({ name: 'OnSiteHome' }),
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_2" /* Component */])({
        selector: 'page-home',template:/*ion-inline-start:"C:\code\OnSiteX\src\pages\home\home.html"*/'<ion-header>\n\n  <ion-navbar>\n\n    <ion-title>\n\n      {{title}}\n\n    </ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content padding *ngIf="showPage" class="header-exists">\n\n  <button ion-button block color="secondary" *ngIf="!userLoggedIn" (click)="onLogin()"> Login </button>\n\n  <button ion-button block color="secondary" *ngIf="userLoggedIn" (click)="onSettings()"> Settings </button>\n\n  <button ion-button block color="secondary" *ngIf="userLoggedIn" (click)="onNewWorkOrder()"> New WorkOrder </button>\n\n  <button ion-button block color="secondary" *ngIf="userLoggedIn" (click)="logoutOfApp()"> Logout </button>\n\n</ion-content>\n\n<!--\n\n  (click)="onNewWorkOrder()"\n\n  (click)="navigateTo(\'WorkOrder\')"\n\n    onNewWorkOrder() {this.navCtrl.push(\'Work Order Form\', {mode: \'New\'});}\n\n  onLogin() {this.navCtrl.push(\'Login\');}\n\n  onNewJobForm() {this.navCtrl.push(\'Work Order\', {mode: \'New\'});}\n\n  onSettings() {this.navCtrl.push(\'Report Settings\');}\n\n  <button ion-button block color="secondary" (click)="onNewJobForm()"> New WorkOrder Long </button>\n\n-->\n\n'/*ion-inline-end:"C:\code\OnSiteX\src\pages\home\home.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["c" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* Platform */], __WEBPACK_IMPORTED_MODULE_2__providers_auth_srvcs__["a" /* AuthSrvcs */]])
], HomePage);

// 'Work Order Form' 
//# sourceMappingURL=home.js.map

/***/ })

});
//# sourceMappingURL=3.main.js.map