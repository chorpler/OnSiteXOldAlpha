import { Injectable                    } from '@angular/core'        ;
import { HttpClient                    } from '@angular/common/http' ;
import { Log, isMoment, moment, Moment } from 'domain/onsitexdomain'       ;
import { ServerService                 } from './server-service'     ;
import { DBService                     } from './db-service'         ;
import { AlertService                  } from './alerts'             ;
import { Message                       } from 'domain/onsitexdomain'       ;
import { UserData                      } from 'providers/user-data'  ;

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

  constructor(public db: DBService, public server:ServerService, public alert:AlertService, public ud:UserData) {
    Log.l('Hello MessageService Provider');
    window["onsitemessageservice"] = this;
  }

  public async getMessages(offline?:boolean):Promise<Array<Message>> {
    try {
      let messages:Array<Message> = new Array<Message>();
      if(offline) {
        messages = await this.db.fetchNewMessages();
        let badgeCount = 0;
        this.messages = messages;
        this.ud.setMessages(messages);
        MessageService.messageInfo.new_messages = this.getNewMessageCount();
        return messages;
      } else {
        messages = await this.server.fetchNewMessages();
        let badgeCount = 0;
        this.messages = messages;
        this.ud.setMessages(messages);
        MessageService.messageInfo.new_messages = this.getNewMessageCount();
        return messages;
      }
    } catch(err) {
      Log.l("getMessages(): Error fetching new messages.");
      Log.e(err);
      throw new Error(err);
    }
  }

  // public getMessages(offline?:boolean):Promise<Array<Message>> {
  //   return new Promise((resolve,reject) => {
  //     let messages = new Array<Message>();
  //     this.server.fetchNewMessages().then(res => {
  //       let messages = res;
  //       let badgeCount = 0;
  //       this.messages = messages;
  //       this.ud.setMessages(messages);
  //       MessageService.messageInfo.new_messages = this.getNewMessageCount();
  //       resolve(messages);
  //     }).catch(err => {
  //       Log.l("getMessages(): Error fetching new messages.");
  //       Log.e(err);
  //       reject(err);
  //     });
  //   });
  // }

  public static getNewMessageCount():number {
    let badges = 0;
    let msgs = MessageService.messages || [];
    let messages = msgs.filter(a => {
      return !a['read'];
    })
    MessageService.messageInfo.new_messages = messages.length;
    return MessageService.messageInfo.new_messages;
  }

  public getNewMessageCount():number {
    return MessageService.getNewMessageCount();
  }
}
