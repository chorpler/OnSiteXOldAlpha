import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the AuthSrvc provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AuthSrvc {

  constructor(public http: Http) {
    console.log('Hello AuthSrvc Provider');
  }

}
// /src/providers/auth.srvc.ts
