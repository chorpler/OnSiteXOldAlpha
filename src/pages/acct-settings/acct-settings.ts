import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the AcctSettings page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-acct-settings',
  templateUrl: 'acct-settings.html'
})
export class AcctSettings {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello AcctSettings Page');
  }

}
