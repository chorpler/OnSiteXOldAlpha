import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the TechToprReport page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-tech-topr-report',
  templateUrl: 'tech.topr.report.html'
})
export class TechToprReport {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello TechToprReport Page');
  }

}
