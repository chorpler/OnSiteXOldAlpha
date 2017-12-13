import {Component                } from '@angular/core'         ;
import {IonicPage, NavController } from 'ionic-angular'         ;
import {NavParams, Platform      } from 'ionic-angular'         ;
import { TabsComponent           } from '../../components/tabs/tabs' ;

@IonicPage( {name:'Summary'})
@Component( {
  selector:'page-hrs-summary',
  templateUrl:'hrs-summary.html',
})

export class HrsSummaryPage {

  constructor(
    public navCtrl   : NavController ,
    public navParams : NavParams     ,
    public platform  : Platform      ,
    // public tabs      : TabsComponent ,
  ) {
    window['hourssummary'] = this;
  }

  ionViewDidLoad() {console.log('ionViewDidLoad HrsSummaryPage'); }

  goHome() {
    this.tabs.goToPage('OnSiteHome');
  }

  terminateApp() {this.platform.exitApp(); }

}
