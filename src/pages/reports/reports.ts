import { Component                } from '@angular/core'                 ;
import { NavController, NavParams } from 'ionic-angular'                 ;
import { FormBuilder, FormGroup   } from '@angular/forms'                ;
import { Validators, FormControl  } from '@angular/forms'                ;
import { Observable               } from "rxjs/Rx"                       ;

@Component({
  selector: 'page-reports',
  templateUrl: 'reports.html',
  styles: [ ".ng-invalid { background: rgba(255 150, 80, 0.5) }" ]
})

export class ReportsPage {

  items: any;
  date = new Date();
  newDoc: {};

  constructor(public navCtrl: NavController){  }

  ionViewDidLoad(){ }
 



}