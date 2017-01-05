import { Component                       } from '@angular/core';
import { NavController, NavParams        } from 'ionic-angular';
import { CLNTCMPNY, LOCPRIMRY            } from '../../config/config.constants.class'          ;
import { LOCSCNDRY, USERCLASS, PYRLCLASS } from '../../config/config.constants.class'          ;
import { ReportClass                     } from '../../config/config.interface.user.report.class';
import { SHIFTHRS                        } from '../../config/config.constants.shift';

@Component({
  selector: 'page-shift',
  templateUrl: 'shift.html'
})
export class ShiftPage {
  title      : string        = 'Shift'             ; 
  userName   : string        = "Joe Tech"          ; 
  today      : number        = Date.now()          ;
  shiftHrs   : number        = 12                  ; 
  lunch      : Boolean       = false               ; 
  clntCmpny  : Array<string> = CLNTCMPNY           ; 
  locPrimry  : Array<string> = LOCPRIMRY           ; 
  locScndry  : Array<string> = LOCSCNDRY           ; 
  userClass  : Array<string> = USERCLASS           ; 
  pyrlClass  : Array<string> = PYRLCLASS           ; 
  reportClass: ReportClass   ; 
  company    : string        = this.clntCmpny[  0 ]; 
  loc1       : string        = this.locPrimry[  0 ]; 
  loc2       : string        = this.locScndry[  0 ]; 
  techClass  : string        = this.userClass[  0 ]; 
  hrsClass   : string        = this.pyrlClass[  0 ];  

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShiftPage');
  }
}
