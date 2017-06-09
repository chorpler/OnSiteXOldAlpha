import { Component                } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { NavParams, Platform      } from 'ionic-angular';


@IonicPage({name: 'Summary'})
@Component({
  selector: 'page-hrs-summary',
  templateUrl: 'hrs-summary.html',
})

export class HrsSummaryPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform) { }

  ionViewDidLoad() { console.log('ionViewDidLoad HrsSummaryPage'); }

  goHome() {this.navCtrl.setRoot('OnSiteHome');}

  terminateApp() { this.platform.exitApp(); }

}
