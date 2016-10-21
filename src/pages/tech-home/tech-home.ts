import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the TechHome page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-tech-home',
  templateUrl: 'tech-home.html'
})
export class TechHome {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello TechHome Page');
  }

}
