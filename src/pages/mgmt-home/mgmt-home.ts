import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the MgmtHome page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-mgmt-home',
  templateUrl: 'mgmt-home.html'
})
export class MgmtHome {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello MgmtHome Page');
  }

}
