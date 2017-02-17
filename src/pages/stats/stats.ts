import { Component                } from                      '@angular/core';
import { NavController, NavParams } from                      'ionic-angular';
import { Reports                  } from               '../../config/reports';
import { DbBulkuploadSrvc         } from '../../providers/db-bulkupload-srvc';


@Component({
  selector: 'page-stats',
  templateUrl: 'stats.html'
})

export class StatsPage {
  title: string = 'Stats';

  docs: Object[]  = Reports;

  constructor(public navCtrl: NavController, public navParams: NavParams, public addReports: DbBulkuploadSrvc) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StatsPage');
  }
  post_DB() { this.addReports.postDbDocs(this.docs); }

}
