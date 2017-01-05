import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import 'rxjs/add/operator/map';


@Injectable()
export class AuthSrvc {

  constructor() {
    console.log('Hello AuthSrvc Provider');
  } 
}
// /src/providers/auth.srvc.ts
