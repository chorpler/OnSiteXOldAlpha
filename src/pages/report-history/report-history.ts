import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DBSrvcs } from '../../providers/db-srvcs';


@IonicPage({ name    : 'Reports'                                                 })
@Component({ selector: 'page-report-history', templateUrl: 'report-history.html' })


export class ReportHistoryPage implements OnInit {
  public title: string = 'Reports';

  selectedItem: any;
  items: Array<{title: string, note: string}>;
  data: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public dbSrvcs: DBSrvcs ) { }

  ngOnInit() {
    this.dbSrvcs.allDoc().then(res => (this.data = res));
    this.items = [];
    for(let i = this.data.length - 1; i >= 0; i--) { this.items[i] = { title: this.data[i].rprtDate, note: this.data[i].uNum }; }
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = this.navParams.get('item');
  }
  itemTapped(event, item) { this.navCtrl.push('Report Edit', {  item: item }); }

}
