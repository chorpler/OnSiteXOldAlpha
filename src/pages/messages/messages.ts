import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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
  name: 'Messages'
})
@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html',
})

export class MessagesPage implements OnInit {

  title: string = "Messages from Tino";
  public messages:Array<Message> = [];
  public message:Message = null;
  public pageReady:boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public db:DBSrvcs, public server:SrvrSrvcs, public msg:MessageService, public tabs:TabsComponent) {
    window["onsitemessages"] = this;
  }

  ionViewDidLoad() {
    Log.l('ionViewDidLoad MessagesPage');
    this.server.fetchNewMessages().then(res => {
      Log.l("MessagesPage: got new message:\n", res);
      this.messages = res;
      this.message = this.messages[0];
      this.pageReady = true;
    }).catch(err => {
      Log.l("MessagesPage: Error fetching messages from server.");
      Log.e(err);
    });
  }

  ngOnInit() {
    Log.l("MessagesPage: ngOnInit() fired");
  }

  changedMessage(message:Message) {
    Log.l("changedMessage(): Message changed to:\n", message);
  }

  closeMessages() {
    Log.l("closeMessages(): User clicked close messages.");
    this.tabs.goToPage('OnSiteHome');
  }



}
