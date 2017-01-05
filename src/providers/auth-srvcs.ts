import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';

/*
  Generated class for the AuthSrvcs provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AuthSrvcs {

  constructor(public http: Http) {
    console.log('Hello AuthSrvcs Provider');
  }

  login(username: string, password: string) { }

}
