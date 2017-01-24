import { Component        } from '@angular/core'                   ; 
import { NavController    } from 'ionic-angular'                   ; 
import { NavParams        } from 'ionic-angular'                   ; 
import { TimeSrvc         } from '../../providers/time-parse-srvc' ; 
import { ReportsPage      } from '../reports/reports'              ; 
import { OpenReportsPage  } from '../reports/open-reports'         ; 
import { ViewCalendarPage } from '../view-calendar/view-calendar'  ; 
import { UploadReportsPage} from '../upload-reports/upload-reports'; 
import { ShiftPage        } from '../shift/shift'                  ;


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
title  : string = 'Home'; 
arrDate: any[   ]       ; 

  constructor(public navCtrl: NavController, public navParams: NavParams, public tmStuff: TimeSrvc) {}

  ionViewDidLoad() {
    this.arrDate = this.tmStuff.getParsedDate();
    console.log('ionViewDidLoad HomePage');
  }

  newReport(){
    this.navCtrl.push(ReportsPage);
  }

  openReports(){
    this.navCtrl.push(OpenReportsPage);
  }

  viewCalendar(){
    this.navCtrl.push(ViewCalendarPage);
  }

  uploadReports(){
    this.navCtrl.push(UploadReportsPage);
  }

  shiftsPage(){
    this.navCtrl.push(ShiftPage);
  }
}
