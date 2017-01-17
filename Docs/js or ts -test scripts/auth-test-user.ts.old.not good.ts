import { Injectable } from '@angular/core';
import { Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { OSXU } from '../config/user.config.user';
import { TestTmpUsrUrl } from '../config/config.constants.db.test';

@Injectable()
export class AuthTestUser {
private headers = new Headers({ 'content-type': 'application/json' });
// private header2 = new Headers({ 'authorization': 'Basic SGFjaGVybzpzZXNhMTIzNA=='})
// private _headers = [this.header1, this.header2];
// public onSiteUsr: OSXU;

  constructor( public http: Http ) {
    console.log('Hello AuthTestUser Provider');
  }
  
  getTestUser(): Promise<any> {
    return this.http.get(TestTmpUsrUrl)
               .toPromise()
               .then(response => response.json().data) // as OSXU
               .catch(this.handleError);
  }

    private handleError(error: any): Promise<any> {
    console.error('Unable to get testUser Info', error); 
    return Promise.reject(error.message || error);
  }

}
