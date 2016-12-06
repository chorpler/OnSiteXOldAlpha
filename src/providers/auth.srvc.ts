import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { OnSiteXUser } from '../models/onsitexuser.class';


@Injectable()
export class AuthSrvc {

  constructor(public http: Http, public onSiteUser: OnSiteXUser) {
    console.log('Hello AuthSrvc Provider');
  }

  signup(this.onSiteUser) { };

}
// /src/providers/auth.srvc.ts
