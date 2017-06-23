import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core' ;
import { STRINGS } from '../../config/config.strings'   ;
import { Pipe, PipeTransform } from '@angular/core' ;


@IonicPage({
  name: 'Messages'
})
@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html',
})

export class MessagesPage {

  title: string = "Messages from Tino";

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MessagesPage');
  }

}
