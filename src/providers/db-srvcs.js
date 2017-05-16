var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
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
var DBSrvcs = (function () {
    function DBSrvcs(http, zone) {
        this.http = http;
        this.zone = zone;
        this.PouchDB = require("pouchdb");
        this.PouchDB.plugin(require('pouchdb-upsert'));
        this.PouchDB.plugin(require('pouchdb-authentication'));
        window["PouchDB"] = this.PouchDB; // Dev: reveals PouchDB to PouchDB Inspector
        this.db = new this.PouchDB('reports');
        // this.username = 'sesatech';
        // this.password = 'sesatech';
        // this.remote    = 'http://martiancouch.hplx.net/reports' ;
        // this.remote = 'http://192.168.0.140:5984/reports';
        this.remote = 'http://162.243.157.16/reports';
        var options = {
            live: true,
            retry: true,
            continuous: true,
            auth: {
                username: this.username,
                password: this.password
            }
        };
        // this.db.sync(this.remote, options);
    }
    // -------------- DBSrvcs METHODS------------------------
    DBSrvcs.prototype.addDoc = function (doc) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            console.log("Adding document...");
            console.log(doc);
            if (typeof doc._id === 'undefined') {
                doc._id = 'INVALID_DOC';
            }
            _this.getDoc(doc._id).then(function (result) {
                // console.log("adding document");
                // this.db.put(doc);
                console.log("Cannot add document " + doc._id + ", document already exists.");
                console.log(result);
                reject('Doc exists');
            }).catch(function (error) {
                console.log("addDoc(): Could not get document " + doc._id + ", hopefully it does not exist...");
                if (error.status == '404') {
                    _this.db.put(doc).then(function (res) {
                        console.log("addDoc(): Successfully added document.");
                        console.log(res);
                        resolve(res);
                    }).catch(function (err) {
                        console.log("addDoc(): Failed while trying to add document (after 404 error in get)");
                        console.error(err);
                        reject(err);
                    });
                }
                else {
                    console.log("addDoc(): Some other error occurred.");
                    console.error(error);
                    reject(error);
                }
            });
            // .catch((error) => {
            //   if (error.status = '409') { console.log("Document already exists."); }
            // })
            // })
        });
    };
    DBSrvcs.prototype.getDoc = function (docID) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.db.get(docID).then(function (result) {
                console.log("Got document " + docID);
                resolve(result);
            }).catch(function (error) {
                console.log("Error in DBSrvcs.getDoc()!");
                console.error(error);
                reject(error);
            });
        });
    };
    DBSrvcs.prototype.checkLocalDoc = function (docID) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.db.get(docID).then(function (result) {
                console.log("Local doc " + docID + " exists");
                resolve(true);
            }).catch(function (error) {
                console.log("Local doc " + docID + " does not exist");
                resolve(false);
                // if (error.status = '404') { 
                //   let doc = { _id: docID };
                //   this.addDoc(doc);
                // }
                // else { console.log(error); }
                // reject(error);
            });
        });
    };
    DBSrvcs.prototype.addLocalDoc = function (newDoc) {
        var _this = this;
        // return new Promise((resolve,reject) => {
        console.log("Attempting to add local document...");
        // if (typeof doc._id === 'undefined') { doc._id = 'INVALID_DOC'; };
        // if( typeof doc._rev === 'undefined' ) { doc._rev = '0-1' };
        // this.getDoc(doc._id).then((result) => {
        console.log("Local document to add:");
        console.log(newDoc);
        return new Promise(function (resolve, reject) {
            _this.db.get(newDoc._id).then(function (res1) {
                console.log("Now removing existing local document " + newDoc._id);
                return new Promise(function (resolveRemove, rejectRemove) {
                    var strID = res1._id;
                    var strRev = res1._rev;
                    _this.db.remove(strID, strRev).then(function (res2) {
                        console.log("Successfully deleted local doc " + newDoc._id + ", need to add new copy");
                        resolveRemove(res2);
                    }).catch(function (errRemove) {
                        console.log("Error while removing local doc " + newDoc._id + ".");
                        console.log(newDoc);
                        rejectRemove(errRemove);
                    });
                });
            }).then(function () {
                if (typeof newDoc._rev == 'string') {
                    delete newDoc._rev;
                }
                console.log("Now adding fresh copy of local document " + newDoc._id);
                return _this.db.put(newDoc);
            }).then(function (success) {
                console.log("Successfully deleted and re-saved local document " + newDoc._id);
                resolve(success);
            }).catch(function (err) {
                console.log("Local document " + newDoc._id + " does not exist, saving...");
                if (typeof newDoc._rev == 'string') {
                    delete newDoc._rev;
                }
                _this.db.put(newDoc).then(function (final) {
                    console.log("Local document " + newDoc._id + " was newly saved successfully");
                    resolve(final);
                }).catch(function (err) {
                    console.log("Error while saving new copy of local doc " + newDoc._id + "!");
                    console.warn(err);
                    // reject(err);
                    resolve(null);
                });
            });
        });
        // console.log(`adding local document ${doc._id}`);
        // return this.db.put(doc);
        // this.db.put(doc);
        // console.log(`Cannot add document ${doc._id}, document already exists.`);
        // }).catch((error) => {
        // console.log(`Error getting document ${doc._id}`);
        // if(error.status == '404') {
        // this.db.put(doc)
        // }
        // })
        // .catch((error) => {
        //   if (error.status = '409') { console.log("Document already exists."); }
        // })
        // })
    };
    DBSrvcs.prototype.deleteLocalDoc = function (doc) {
        var _this = this;
        console.log("Attempting to delete local document...");
        return new Promise(function (resolve, reject) {
            _this.db.remove(doc).then(function (res) {
                console.log("Successfully deleted local doc " + doc._id);
                resolve(true);
            }).catch(function (err) {
                console.log("Error while deleting local doc " + doc._id);
                console.log(doc);
                console.error(err);
                resolve(false);
                // reject(err);
            });
        });
    };
    DBSrvcs.prototype.saveTechProfile = function (doc) {
        var _this = this;
        console.log("Attempting to save local techProfile...");
        // let updateFunction = (original) => {}
        doc._id = '_local/techProfile';
        return new Promise(function (resolve, reject) {
            _this.getTechProfile().then(function (res) {
                console.log("saveTechProfile(): About to process old and new:");
                console.log(res);
                console.log(doc);
                // let oldTechProfile = res;
                // let profileChanges = doc;
                var strID = res['_id'];
                var strRev = res['_rev'];
                var newProfileDoc = __assign({}, res, doc, { "_id": strID, "_rev": strRev });
                console.log("saveTechProfile(): Merged profile is:");
                console.log(newProfileDoc);
                console.log("saveTechProfile(): now attempting save...");
                return _this.addLocalDoc(newProfileDoc);
            }).then(function (res) {
                console.log("saveTechProfile(): Saved updated techProfile");
                resolve(res);
            }).catch(function (err) {
                console.log("saveTechProfile(): Error merging or saving profile!");
                console.error(err);
                reject(err);
            });
        });
    };
    DBSrvcs.prototype.getTechProfile = function () {
        var _this = this;
        var documentID = "_local/techProfile";
        return new Promise(function (resolve, reject) {
            return _this.checkLocalDoc(documentID).then(function (res) {
                console.log("techProfile exists, reading it in...");
                return _this.getDoc(documentID);
            }).then(function (res) {
                console.log("techProfile read successfully:");
                console.log(res);
                resolve(res);
                // this.techProfile = res;
            }).catch(function (err) {
                console.log("techProfile not found, user not logged in.");
                console.error(err);
                reject(err);
            });
        });
    };
    DBSrvcs.prototype.purgeLocalTempReport = function () {
        var tmpID = '_local/tmpReport';
    };
    DBSrvcs.prototype.allDoc = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.db.allDocs({ include_docs: true })
                .then(function (result) {
                _this.data = [];
                var docs = result.rows.map(function (row) {
                    _this.data.push(row.doc);
                    resolve(_this.data);
                });
                _this.db.changes({ live: true, since: 'now', include_docs: true })
                    .on('change', function (change) { _this.hndlChange(change); });
            })
                .catch(function (error) { console.log(error); });
        });
    };
    DBSrvcs.prototype.hndlChange = function (change) {
        var _this = this;
        this.zone.run(function () {
            var changedDoc = null;
            var changedIndex = null;
            _this.data.forEach(function (doc, index) {
                if (doc._id === change.id) {
                    changedDoc = doc;
                    changedIndex = index;
                }
            });
            if (change.deleted) {
                _this.data.splice(changedIndex, 1);
            }
            else {
                if (changedDoc) {
                    _this.data[changedIndex] = change.doc;
                }
                else {
                    _this.data.push(change.doc);
                }
            }
        });
    };
    return DBSrvcs;
}()); // Close exported Class: DBSrvcs
DBSrvcs = __decorate([
    Injectable()
    /**
     * @class DBSrvcs
     *        methods [ addDoc, getDoc, allDoc, hndlChange ]
     */
    ,
    __metadata("design:paramtypes", [Http, NgZone])
], DBSrvcs);
export { DBSrvcs };
//# sourceMappingURL=db-srvcs.js.map