import { Injectable, NgZone } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import * as PouchDB2 from 'pouchdb';
import * as PouchDBAuth from 'pouchdb-authentication';
import { NativeStorage } from 'ionic-native';
import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage';
import { DBSrvcs } from '../providers/db-srvcs';

@Injectable()
export class AuthSrvcs {

  data: any;
  username: any;
  password: any;
  remote: any;
  options: any;
  docId: string;
  PouchDB: any;
  profileDoc: any;
  settingsDoc: any;
  couchUser: any;
  userProfile: any = {};




  constructor(public http: Http, public zone: NgZone, private db: DBSrvcs) {
    this.PouchDB = require("pouchdb");
    this.PouchDB.plugin(require('pouchdb-authentication'));
    window["PouchDB"] = this.PouchDB; // Dev setting to reveal PouchDB to PouchDB Inspector
    // this.userDb       = new PouchDB('notusers')                 ;
    this.username = 'sesatech';
    this.password = 'sesatech';
    // this.remote       = 'http://martiancouch.hplx.net/_users' ;
    this.remote = 'http://192.168.0.140:5984/_users';
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

  ionViewDidLoad() { }

  setUser(user1: string) {
    this.username = user1;
    console.log(`setUser set user to ${this.username}`);
  }

  setPassword(pass1: string) {
    this.password = pass1;
    console.log(`setPassword set password to ${this.password}`);
  }

  login() {
    // console.log(this.docId);
    let pouchOpts = { skipSetup: true };
    let ajaxOpts = { ajax: { headers: { Authorization: 'Basic ' + window.btoa(this.username + ':' + this.password) } } };
    var db = new this.PouchDB(this.remote, pouchOpts);
    console.log("Now making login attempt...");
    return new Promise((resolve, reject) => {
      return db.login(this.username, this.password, ajaxOpts).then(() => {
        console.log("Login complete");
        return db.getSession();
      }).then((session) => {
        console.log("Got session.");
        console.log(session);
        console.log("Now attempting getUser()...");
        let dbUser = session.userCtx.name;
        return db.getUser(dbUser);
      }).then((user) => {
        this.couchUser = user;
        this.userProfile.firstName      = this.couchUser.firstName      ;
        this.userProfile.lastName       = this.couchUser.lastName       ;
        this.userProfile.avatarName     = this.couchUser.avatarName     ;
        this.userProfile.client         = this.couchUser.client         ;
        this.userProfile.location       = this.couchUser.location       ;
        this.userProfile.locID          = this.couchUser.locID          ;
        this.userProfile.loc2nd         = this.couchUser.loc2nd         ;
        this.userProfile.shift          = this.couchUser.shift          ;
        this.userProfile.shiftLength    = this.couchUser.shiftLength    ;
        this.userProfile.shiftStartTime = this.couchUser.shiftStartTime ;
        this.userProfile.updated        = true                          ;
        this.userProfile._id            = this.profileDoc               ;

        console.log("Got user");
        console.log(user);
        // let tmpProfile = {id: this.userDb, firstName: user.firstName, lastName: user.lastName, client: user.client, location: user.location, locID: user.locID, loc2nd: user.loc2nd, shift: user.shift, shiftLength: user.shiftLength, shiftStartTime: user.shiftStartTime};
        return this.db.addDoc(this.userProfile);
      }).then((res) => {
        resolve(res);
        // }).then((docs) => {
        //   console.log(docs);
      }).catch((error) => {
        console.log("Error during PouchDB login/getUser");
        console.error(error);
        reject(error);
      });
    });
  };

} // Close exported Class: AuthSrvcs