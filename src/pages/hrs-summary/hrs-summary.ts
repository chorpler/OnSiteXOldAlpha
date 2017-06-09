import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage({name: 'Summary'})
@Component({
  selector: 'page-hrs-summary',
  templateUrl: 'hrs-summary.html',
})

export class HrsSummaryPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) { }

  ionViewDidLoad() { console.log('ionViewDidLoad HrsSummaryPage'); }

  goHome() {this.navCtrl.setRoot('OnSiteHome')}

}
