import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AddUsersSrvc } from '../../providers/add.dbusers.service';
import { usersDocs    } from '../../test/test.user.batch';


@Component({
  selector: 'page-stats',
  templateUrl: 'stats.html'
})
export class StatsPage {
  title: string = 'Stats';

  docs: Object[]  = usersDocs;

  constructor(public navCtrl: NavController, public navParams: NavParams, public postDB: AddUsersSrvc) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StatsPage');
  }
  post_DB() { this.postDB.postDbDocs(this.docs); }
}
