import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the Messages page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html'
})
export class Messages {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello Messages Page');
  }

}
