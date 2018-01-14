import { Injectable } from '@angular/core'        ;
import { HttpClient } from '@angular/common/http' ;


@Injectable()
export class HrsErrsDetection {
  constructor(public http: HttpClient) {
    console.log('Hello HrsErrsDetection Provider');
  }
}
