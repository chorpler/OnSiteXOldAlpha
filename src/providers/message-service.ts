import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Log, isMoment, date2xl, xl2date, xl2datetime } from '../config/config.functions';
import { SrvrSrvcs } from './srvr-srvcs';
import { DBSrvcs } from './db-srvcs';
import { AlertService } from './alerts';
import { Message } from '../domain/message';
import * as moment from 'moment';

/*
  Generated class for the MessagesProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class MessageService {

  constructor(public db: DBSrvcs, public server:SrvrSrvcs, public alert:AlertService) {
    Log.l('Hello MessageService Provider');
    window["onsitemessageservice"] = this;
  }

  public getNewMessages() {
    let messages = new Array<Message>();

  }




}
