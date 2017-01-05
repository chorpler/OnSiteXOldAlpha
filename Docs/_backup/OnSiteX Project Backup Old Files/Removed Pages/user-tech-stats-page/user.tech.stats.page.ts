import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the UserTechStatsPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-user-tech-stats-page',
  templateUrl: 'user.tech.stats.page.html'
})
export class UserTechStatsPage {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello UserTechStatsPage Page');
  }

}
