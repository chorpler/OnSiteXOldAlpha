import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the TechMechReport page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-tech-mech-report',
  templateUrl: 'tech.mech.report.html'
})
export class TechMechReport {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello TechMechReport Page');
  }

}
