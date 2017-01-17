import { Component                       } from '@angular/core';
import { NavController, NavParams        } from 'ionic-angular';

@Component({
  selector: 'page-shift',
  templateUrl: 'shift.html'
})

export class ShiftPage {
  title      : string  = 'Shift'    ;
  userName   : string  = "Joe Tech" ;
  today      : number  = Date.now() ;
  shiftHrs   : number  = 12         ;
  lunch      : Boolean = false      ;
  company    : string  = 'clntCmpny';
  loc1       : string  = 'locPrimry';
  loc2       : string  = 'locScndry';
  techClass  : string  = 'userClass';
  hrsClass   : string  = 'pyrlClass';

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShiftPage');
  }
}
