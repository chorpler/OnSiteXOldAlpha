import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import 'rxjs/add/operator/map';
import { OnSiteXUser } from '../models/onsitexuser.class';
import { Observable } from "rxjs";
import { plugin } from 'pouchdb';


@Injectable()
export class AuthSrvc {

  constructor(public pouchDB: pouchdb, public http: Http, public onSiteUser: OnSiteXUser) {
    console.log('Hello AuthSrvc Provider');
  }

  signup(onSiteUser: OnSiteXUser) { 
    let body = JSON.stringify(this.onSiteUser);
      this.http.PUT('http://192.168.0.140:5984/_user', body, {headers: headers})
          .map((response: Response) => response.json())
          .catch((error: Response) => Observable.throw(error.json()));
  };
      
}
// /src/providers/auth.srvc.ts
