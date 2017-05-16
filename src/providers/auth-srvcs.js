var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, NgZone } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { SecureStorage } from '@ionic-native/secure-storage';
import { DBSrvcs } from '../providers/db-srvcs';
var AuthSrvcs = (function () {
    function AuthSrvcs(http, zone, db, secureStorage) {
        this.http = http;
        this.zone = zone;
        this.db = db;
        this.secureStorage = secureStorage;
        this.userProfile = {};
        this.remoteDB = {};
        this.PouchDB = require("pouchdb");
        this.PouchDB.plugin(require('pouchdb-authentication'));
        window["PouchDB"] = this.PouchDB; // Dev setting to reveal PouchDB to PouchDB Inspector
        // this.userDb       = new PouchDB('notusers')                 ;
        // this.username = 'sesatech';
        // this.password = 'sesatech';
        // this.remote       = 'http://martiancouch.hplx.net/_users' ;
        // this.remote = 'https://192.168.0.140:5984/_users';
        this.remote = 'http://162.243.157.16/reports/';
        this.profileDoc = '_local/techProfile';
        // this.remote       = 'http://192.168.0.140/notusers' ;
        // this.docId        = 'org.couchdb.user:testUser005'          ;
        this.options = {
            live: true,
            retry: true,
            continuous: false,
            auth: { username: this.username, password: this.password }
        };
        // this.userDb.sync(this.remote, this.options);
    }
    // -------------- AuthSrvcs METHODS------------------------
    AuthSrvcs.prototype.ionViewDidLoad = function () { };
    AuthSrvcs.prototype.setUser = function (user1) {
        this.username = user1;
        console.log("setUser set user to " + this.username);
    };
    AuthSrvcs.prototype.setPassword = function (pass1) {
        this.password = pass1;
        console.log("setPassword set password to " + this.password);
    };
    AuthSrvcs.prototype.login = function () {
        var _this = this;
        // console.log(this.docId);
        console.log("AuthSrvcs.login() now starting");
        var pouchOpts = { skipSetup: true };
        var ajaxOpts = { ajax: { headers: { Authorization: 'Basic ' + window.btoa(this.username + ':' + this.password) } } };
        this.remoteDB = new this.PouchDB(this.remote, pouchOpts);
        console.log("Now making login attempt, options:");
        console.log(ajaxOpts);
        return new Promise(function (resolve, reject) {
            return _this.remoteDB.login(_this.username, _this.password, ajaxOpts).then(function (res) {
                console.log("Login complete");
                console.log(res);
                return _this.remoteDB.getSession();
            }).then(function (session) {
                console.log("Got session.");
                console.log(session);
                console.log("Now attempting getUser()...");
                var dbUser = session.userCtx.name;
                return _this.remoteDB.getUser(dbUser);
            }).then(function (user) {
                _this.couchUser = user;
                _this.userProfile.firstName = _this.couchUser.firstName;
                _this.userProfile.lastName = _this.couchUser.lastName;
                _this.userProfile.avatarName = _this.couchUser.avatarName;
                _this.userProfile.client = _this.couchUser.client;
                _this.userProfile.location = _this.couchUser.location;
                _this.userProfile.locID = _this.couchUser.locID;
                _this.userProfile.loc2nd = _this.couchUser.loc2nd;
                _this.userProfile.shift = _this.couchUser.shift;
                _this.userProfile.shiftLength = _this.couchUser.shiftLength;
                _this.userProfile.shiftStartTime = _this.couchUser.shiftStartTime;
                _this.userProfile.updated = true;
                _this.userProfile._id = _this.profileDoc;
                console.log("Got user");
                console.log(user);
                // let tmpProfile = {id: this.userDb, firstName: user.firstName, lastName: user.lastName, client: user.client, location: user.location, locID: user.locID, loc2nd: user.loc2nd, shift: user.shift, shiftLength: user.shiftLength, shiftStartTime: user.shiftStartTime};
                return _this.db.addLocalDoc(_this.userProfile);
            }).then(function (res) {
                console.log("userProfile added! Finished!");
                resolve(res);
                // }).then((docs) => {
                //   console.log(docs);
            }).catch(function (error) {
                console.log("Error during PouchDB login/getUser");
                console.error(error);
                reject(error);
            });
        });
    };
    AuthSrvcs.prototype.saveCredentials = function () {
        var _this = this;
        console.log("Saving credentials...");
        return new Promise(function (resolve, reject) {
            _this.secureStorage.create('OnSiteX').then(function (storage) {
                var userLogin = { username: _this.username, password: _this.password };
                return storage.set('userLogin', JSON.stringify(userLogin));
            }).then(function (res) {
                console.log("Credentials saved in secure storage!");
                console.log(res);
                resolve(res);
                // }).then(res2) {}
            }).catch(function (err) {
                console.log("Error saving credentials in secure storage!");
                console.warn(err);
                reject(err);
            });
        });
    };
    AuthSrvcs.prototype.getCredentials = function () {
        var _this = this;
        console.log("Retrieving credentials...");
        return new Promise(function (resolve, reject) {
            _this.secureStorage.create('OnSiteX').then(function (storage) {
                // let userLogin = {username: this.username, password: this.password};
                return storage.get('userLogin');
            }).then(function (res) {
                console.log("Credentials retrieved from secure storage!");
                console.log(res);
                var userInfo = JSON.parse(res);
                _this.setUser(userInfo.username);
                _this.setPassword(userInfo.password);
                resolve(userInfo);
                // }).then(res2) {}
            }).catch(function (err) {
                console.log("Error getting credentials from secure storage!");
                console.warn(err);
                reject(err);
            });
        });
    };
    AuthSrvcs.prototype.isFirstLogin = function () {
        var _this = this;
        console.log("Checking to see if this is first login...");
        return new Promise(function (resolve, reject) {
            _this.db.getTechProfile().then(function (res) {
                console.log("This is not first login, techProfile exists.");
                resolve(false);
            }).catch(function (err) {
                /* Error getting tech profile or user is not logged in */
                console.log("This may be first login, techProfile does not exist.");
                resolve(true);
            });
        });
    };
    AuthSrvcs.prototype.isUserLoggedIn = function () {
        var _this = this;
        console.log("Checking to see if user is logged in...");
        return new Promise(function (resolve, reject) {
            _this.db.getTechProfile().then(function (res) {
                console.log("This is not the first login.");
            }).catch(function (err) {
                /* Error getting tech profile or user is not logged in */
            });
        });
    };
    return AuthSrvcs;
}()); // Close exported Class: AuthSrvcs
AuthSrvcs = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Http, NgZone, DBSrvcs, SecureStorage])
], AuthSrvcs);
export { AuthSrvcs };
//# sourceMappingURL=auth-srvcs.js.map