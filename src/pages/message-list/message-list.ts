import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { TabsComponent } from '../../components/tabs/tabs';
import { TranslateService } from '@ngx-translate/core';
import { DBSrvcs } from '../../providers/db-srvcs';
import { SrvrSrvcs } from '../../providers/srvr-srvcs';
import { STRINGS } from '../../config/config.strings'   ;
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SafePipe } from '../../pipes/safe';
import { Message } from '../../domain/message';
import { MessageService } from '../../providers/message-service';
import { Log, isMoment, date2xl, xl2date, xl2datetime } from '../../config/config.functions';
import * as moment from 'moment';

@IonicPage({
  name: 'Message List'
})
@Component({
  selector: 'page-message-list',
  templateUrl: 'message-list.html',
})

export class MessageListPage implements OnInit {

  title: string = "Messages from Tino";
  public messages:Array<Message> = [];
  public message:Message = null;
  public msgModal:any = null;
  public pageReady:boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public db:DBSrvcs, public server:SrvrSrvcs, public msg:MessageService, public tabs:TabsComponent, public modalCtrl:ModalController) {
    window["onsitemessages"] = this;
  }

  ionViewDidLoad() {
    Log.l('ionViewDidLoad MessageListPage');
    this.server.fetchNewMessages().then(res => {
      Log.l("MessageListPage: got new messages:\n", res);
      this.messages = res;
      this.messages.sort((a,b) => {
        let timeA = moment(a.date);
        let timeB = moment(b.date);
        return timeA.isAfter(timeB) ? -1 : timeA.isBefore(timeB) ? 1 : 0;
      });
      // this.message = this.messages[0];
      Log.l("MessageListPage.ionViewDidLoad(): Final messages array is:\n", this.messages);
      this.pageReady = true;
    }).catch(err => {
      Log.l("MessageListPage: Error fetching messages from server.");
      Log.e(err);
    });
  }

  ngOnInit() {
    Log.l("MessageListPage: ngOnInit() fired");
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
    this.tabs.goToPage('OnSiteHome');
  }



}
