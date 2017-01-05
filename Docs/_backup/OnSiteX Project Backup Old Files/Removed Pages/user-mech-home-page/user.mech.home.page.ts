import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the UserMechHomePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-user-mech-home-page',
  templateUrl: 'user.mech.home.page.html'
})
export class UserMechHomePage {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello UserMechHomePage Page');
  }

}
