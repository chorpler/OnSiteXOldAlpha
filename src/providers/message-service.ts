import 'rxjs/add/operator/map';
import { Injectable                    } from '@angular/core'              ;
import { Http                          } from '@angular/http'              ;
import { Log, isMoment, moment, Moment } from '../config/config.functions' ;
import { SrvrSrvcs                     } from './srvr-srvcs'               ;
import { DBSrvcs                       } from './db-srvcs'                 ;
import { AlertService                  } from './alerts'                   ;
import { Message                       } from '../domain/message'          ;
import { UserData                      } from '../providers/user-data'     ;

@Injectable()
export class MessageService {

  public static messages:Array<Message> = [];
  public static messageInfo:any = {new_messages: 0};
  public static unread:number = 0;
  public static get unreadMessages():number {let count = 0; for(let msg of MessageService.messages) { if(!msg.read) {count++}} return count;};
  public static set unreadMessages(value:number) {MessageService.unread = value;};
  public get messages():Array<Message> {return MessageService.messages;};
  public get messageInfo():any {return MessageService.messageInfo;};
  public set messages(value:Array<Message>) { MessageService.messages = value;};
  public set messageInfo(value:any) { MessageService.messageInfo = value;};
  public get unread():number { return MessageService.unread;};
  public set unread(value:number) {MessageService.unread = value;};
  public moment:any = moment;

  constructor(public db: DBSrvcs, public server:SrvrSrvcs, public alert:AlertService, public ud:UserData) {
    Log.l('Hello MessageService Provider');
    window["onsitemessageservice"] = this;
  }

  public getMessages():Promise<Array<Message>> {
    return new Promise((resolve,reject) => {
      let messages = new Array<Message>();
      this.server.fetchNewMessages().then(res => {
        let messages = new Array<Message>();
        let badgeCount = 0;
        let now = moment().toExcel(true);
        for (let message of res) {
          let date = message.getMessageDate().toExcel(true);
          let duration = message.getMessageDuration();
          let expires = date + duration;
          if(now <= expires) {
            messages.push(message);
          }
        }
        let _orderBy = function (a, b) {
          let timeA = moment(a.date);
          let timeB = moment(b.date);
          return timeA.isAfter(timeB) ? -1 : timeA.isBefore(timeB) ? 1 : 0;
        }
        messages.sort(_orderBy);
        Log.l("getMessages(): Sorted array is:\n", messages);
        this.messages = messages;
        this.ud.setMessages(messages);
        MessageService.messageInfo.new_messages = this.getNewMessageCount();
        resolve(messages);
      }).catch(err => {
        Log.l("getMessages(): Error fetching new messages.");
        Log.e(err);
        reject(err);
      });
    });
  }

  public static getNewMessagecount():number {
    let badges = 0;
    let msgs = MessageService.messages || [];
    for(let message of msgs) {
      if(!message.read) {
        badges++;
      }
    }
    return badges;
  }

  public getNewMessageCount():number {
    let badgeCount = 0;
    for(let message of this.messages) {
      if (!message.read) {
        badgeCount++;
      }
    }
    MessageService.messageInfo.new_messages = badgeCount;
    return badgeCount;
  }
}
