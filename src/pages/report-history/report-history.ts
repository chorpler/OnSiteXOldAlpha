import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage({ name    : 'Reports'                                                 })
@Component({ selector: 'page-report-history', templateUrl: 'report-history.html' })


export class ReportHistoryPage {
  public title: string = 'Reports';

  selectedItem: any;
  items: Array<{title: string, note: string}>;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');

    this.items = [];
  }

  itemTapped(event, item) { this.navCtrl.push('Report Edit', {  item: item }); }

}
