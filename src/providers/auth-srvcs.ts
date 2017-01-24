import { Injectable, NgZone } from '@angular/core' ;
import { Http               } from '@angular/http' ;
import 'rxjs/add/operator/map'                     ;
import * as PouchDB           from 'pouchdb'       ;
import { NativeStorage      } from 'ionic-native'  ;


@Injectable()
export class AuthSrvcs {

  data     : any    ;
  userDb   : any    ;
  username : any    ;
  password : any    ;
  remote   : any    ;
  options  : any    ;
  docId    : string ;


  constructor(public http: Http, public zone: NgZone) {

    window["PouchDB"] = PouchDB                                 ; // Dev setting to reveal PouchDB to PouchDB Inspector
    this.userDb       = new PouchDB('notusers')                 ;
    this.username     = 'Mike'                                  ;
    this.password     = 'Dorothyinkansas4life'                  ;
    // this.remote       = 'http://martiancouch.hplx.net/notusers' ;
    // this.docId        = 'org.couchdb.user:testUser005'          ;

    this.options = {
      live       : true,
      retry      : true,
      continuous : false,
      auth: { username: this.username, password: this.password }
    };

    // this.userDb.sync(this.remote, this.options);
  }

// -------------- AuthSrvcs METHODS------------------------

  ionViewDidLoad() { }

  login() {  
    // console.log(this.docId); 
  }

} // Close exported Class: AuthSrvcs