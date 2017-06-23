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

  public static messages:Array<Message> = [];
  public static messageInfo:any = {new_messages: 0};
  public messages:any    = MessageService.messages;
  public messageInfo:any = MessageService.messageInfo;

  constructor(public db: DBSrvcs, public server:SrvrSrvcs, public alert:AlertService) {
    Log.l('Hello MessageService Provider');
    window["onsitemessageservice"] = this;
  }

  public getMessages() {
    return new Promise((resolve,reject) => {
      let messages = new Array<Message>();
      this.server.fetchNewMessages().then(res => {
        let messages = res;
        let badgeCount = 0;
        let _orderBy = function (a, b) {
          let timeA = moment(a.date);
          let timeB = moment(b.date);
          return timeA.isAfter(timeB) ? -1 : timeA.isBefore(timeB) ? 1 : 0;
        }
        messages.sort(_orderBy);
        Log.l("getMessages(): Sorted array is:\n", messages);
        MessageService.messageInfo.new_messages = 0;
        for(let message of messages) {
          if(message['read'] === undefined || message['read'] === false) {
            MessageService.messageInfo.new_messages++;
          }
        }
        this.messages = messages;
        resolve(messages)
      }).catch(err => {
        Log.l("getMessages(): Error fetching new messages.");
        Log.e(err);
        reject(err);
      });
    });
  }

  public getNewMessageCount() {
    let badgeCount = 0;
    for (let message of this.messages) {
      if (!message.read) {
        badgeCount++;
      }
    }
    MessageService.messageInfo.new_messages = badgeCount;
    return badgeCount;
  }
}
