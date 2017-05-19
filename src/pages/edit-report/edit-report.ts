import { Component                           } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';



@IonicPage({ name    : 'Report Edit'                                       })
@Component({ selector: 'page-edit-report', templateUrl: 'edit-report.html' })


export class EditReportPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) { window['editreport'] = this; }

  ionViewDidLoad() { console.log('ionViewDidLoad EditReportPage'); }

}
