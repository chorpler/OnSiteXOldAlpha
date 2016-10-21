import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the OnsiteLogin page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-onsite-login',
  templateUrl: 'onsite-login.html'
})
export class OnsiteLogin {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello OnsiteLogin Page');
  }

}
