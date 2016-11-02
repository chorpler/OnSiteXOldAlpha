import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the DbSrvc provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class DbSrvc {

  constructor(public http: Http) {
    console.log('Hello DbSrvc Provider');
  }

}
// /src/providers/db.srvc.ts
