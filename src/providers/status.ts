import { Injectable } from '@angular/core';
// import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import * as moment from 'moment';
// import { DBSrvcs } from '../../providers/db-srvcs';
// import { AuthSrvcs } from '../../providers/auth-srvcs';
// import { AlertService } from '../../providers/alerts';
import { Log } from '../config/config.functions';
// import { Shift } from '../../domain/shift';

/*
  Generated class for the StatusProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Status {
  public static userLoggedIn:boolean = false;
  public static networkOnline:boolean = true;
  public static geolocationUp:boolean = false;

  constructor() {
    Log.l('Hello StatusProvider Provider');
  }

}
