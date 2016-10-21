import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the CalView page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-cal-view',
  templateUrl: 'cal-view.html'
})
export class CalView {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello CalView Page');
  }

}
