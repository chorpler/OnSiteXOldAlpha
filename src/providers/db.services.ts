import { Injectable           } from '@angular/core'                  ;
import { Http                 } from '@angular/http'                  ;
import 'rxjs/add/operator/map'                                        ;
import * as OnSiteXDB           from 'pouchdb'                        ;
// import { IDSUFFIX             } from '../config/user.config.constants';
import { WorkOrder            } from '../config/wo.config.constants'  ;



/*
  Generated class for the DbServices provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class DbServices {

  public LOCALREPORT = new OnSiteXDB('OnSiteXWOR');
  public LOCALUSRDB  = new OnSiteXDB('OnSiteXUSR');

  constructor(public http: Http) { console.log('Hello DbServices Provider'); }


}
