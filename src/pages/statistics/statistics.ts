import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the Statistics page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-statistics',
  templateUrl: 'statistics.html'
})
export class Statistics {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello Statistics Page');
  }

}
