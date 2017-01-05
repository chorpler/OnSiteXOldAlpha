import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the AcctSettingsPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-acct-settings-page',
  templateUrl: 'acct.settings.page.html'
})
export class AcctSettingsPage {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello AcctSettingsPage Page');
  }

}
