import { Component, OnInit, OnDestroy, NgZone,                } from '@angular/core'             ;
import { AfterViewInit,                                       } from '@angular/core'             ;
import { Pipe, PipeTransform                                  } from '@angular/core'             ;
import { DomSanitizer                                         } from '@angular/platform-browser' ;
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular'             ;
import { TranslateService                                     } from '@ngx-translate/core'       ;
import { Log, isMoment, moment, Moment                        } from 'domain/onsitexdomain'            ;
import { DBService                                            } from 'providers/db-service'      ;
import { ServerService                                        } from 'providers/server-service'  ;
import { UserData                                             } from 'providers/user-data'       ;
import { SafePipe                                             } from 'pipes/safe'                ;
import { Message                                              } from 'domain/onsitexdomain'            ;
import { MessageService                                       } from 'providers/message-service' ;
import { TabsService                                          } from 'providers/tabs-service'    ;
import { Pages                                                } from 'domain/onsitexdomain'            ;

export const _msgSort = (a, b) => {
  let timeA = moment(a.date);
  let timeB = moment(b.date);
  return timeA.isAfter(timeB) ? -1 : timeA.isBefore(timeB) ? 1 : 0;
}

@IonicPage({
  name: 'Message List'
})
@Component({
  selector: 'page-message-list',
  templateUrl: 'message-list.html',
})
export class MessageListPage implements OnInit,OnDestroy,AfterViewInit {
  public lang     : any                    ;
  public language : string = "en"          ;
  public messages : Array<Message> = []    ;
  public message  : Message        = null  ;
  public msgModal : any            = null  ;
  public pageReady: boolean        = false ;

  constructor(
    public navCtrl   : NavController    ,
    public navParams : NavParams        ,
    public zone      : NgZone           ,
    public translate : TranslateService ,
    public db        : DBService          ,
    public server    : ServerService        ,
    public msg       : MessageService   ,
    // public tabs      : TabsComponent    ,
    public tabServ   : TabsService      ,
    public modalCtrl : ModalController  ,
    public ud        : UserData         ,
  ) {
    window["onsitemessages"] = this;
  }

  ngOnInit() {
    Log.l("MessageListPage: ngOnInit() fired");
  }

  ngOnDestroy() {
    Log.l("MessageListPage: ngOnDestroy() fired");
  }

  ngAfterViewInit() {
    Log.l("MessageListPage: ngAfterViewInit() fired");
    this.tabServ.setPageLoaded(Pages.MessageList);
  }

  ionViewDidLoad() {
    Log.l('ionViewDidLoad MessageListPage');
    this.language = this.translate.currentLang || "en";
    this.messages = this.ud.getMessages();
    this.messages.sort(_msgSort);
    this.purgeOldMessages();
    Log.l("MessageListPage.ionViewDidLoad(): Final messages array is:\n", this.messages);
    this.pageReady = true;
  }

  public retrieveMessages() {
    return new Promise((resolve,reject) => {
      this.msg.getMessages().then(res => {
        Log.l("MessageListPage: got new messages:\n", res);
        Log.l("MessageListPage.ionViewDidLoad(): Final messages array is:\n", this.messages);
        this.pageReady = true;
      }).catch(err => {
        Log.l("MessageListPage: Error fetching messages from server.");
        Log.e(err);
      });
    });
  }

  public purgeOldMessages() {
    let now = moment();
    for(let message of this.messages) {
      if(message.isExpired()) {
        let i = this.messages.indexOf(message);
        this.messages.splice(i, 1);
      }
    }
  }

  showMessage(message:Message) {
    this.msgModal = this.modalCtrl.create('Message', {message: message}, {cssClass: 'message-modal'});
    this.msgModal.onDidDismiss((data) => {
      Log.l("showMessage(): Message modal dismissed. Any data back? Let's see:\n", data);
    });
    this.msgModal.present();
  }

  changedMessage(message:Message) {
    Log.l("changedMessage(): Message changed to:\n", message);
  }

  closeMessages() {
    Log.l("closeMessages(): User clicked close messages.");
    this.tabServ.goToPage('OnSiteHome');
  }



}
