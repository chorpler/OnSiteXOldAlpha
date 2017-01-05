import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the UserMgmtHomePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-user-mgmt-home-page',
  templateUrl: 'user.mgmt.home.page.html'
})
export class UserMgmtHomePage {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello UserMgmtHomePage Page');
  }

}
