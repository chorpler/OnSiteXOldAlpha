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
import * as PouchDB from 'pouchdb';
var DbBulkuploadSrvc = (function () {
    function DbBulkuploadSrvc(http, zone) {
        this.http = http;
        this.zone = zone;
        this.db = new PouchDB('testreports');
        this.username = 'mike';
        this.password = 'Dorothyinkansas4life';
        this.remote = 'http://martiancouch.hplx.net/testreports';
        // this.db = new PouchDB('testreports');
        // this.username = 'onsitesrvradmin';
        // this.password = 'q1G92147wS794s630Z96ZRX3IGQOI';
        // this.remote = 'http://192.168.0.140:5984/testreports';
        this.options = {
            live: true,
            retry: true,
            continuous: false,
            auth: { username: this.username, password: this.password }
        };
        this.db.sync(this.remote, this.options);
    }
    DbBulkuploadSrvc.prototype.postDbDocs = function (docs) {
        this._docs = docs;
        this.db.bulkDocs(this._docs);
    };
    return DbBulkuploadSrvc;
}());
DbBulkuploadSrvc = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Http, NgZone])
], DbBulkuploadSrvc);
export { DbBulkuploadSrvc };
//# sourceMappingURL=db-bulkupload-srvc.js.map