import { Component, OnInit               } from '@angular/core'                                ;
import { NavController, NavParams        } from 'ionic-angular'                                ;
import { Assignment                      } from '../../config/config.interface.techassignment' ;
import { Assignments                     } from '../../config/config.constants.assignments'    ;
import { CLNTCMPNY, LOCPRIMRY            } from '../../config/config.constants.class'          ;
import { LOCSCNDRY, USERCLASS, PYRLCLASS } from '../../config/config.constants.class'          ;
import { ReportClass                   } from '../../config/config.interface.user.report.class';
import { AuthTestUser } from '../../providers/auth-test-user';
import { OSXU } from '../../config/user.config.user';
import { RMNTH, RWKD, RMNTHD, RYR, RHR } from '../../config/config.date.object.onsite';
import { RMN, RSC, RTM, ROFFST, RTZS   } from '../../config/config.date.object.onsite';


@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})

export class SettingsPage implements OnInit {
  title     : string    = 'Settings'; 

  onSiteUsr : OSXU      ; 
  data      : Array<any>; 
  company   : string    ; 
  loc1      : string    ; 
  loc2      : string    ; 
  techClass : string    ; 
  technician: string    ; 
  hrsClass  : string    ; 
  date      : any       ; 
  _arrD     : Array<any>= []; 
  dstr      : string    ;
  month     : any;
  weekDay   : any;
  mDay      : any;
  year      : any;
  hours     : any;
  min       : any;
  sec       : any;
  time      : any;
  gmtOffSet : any;
  tmZoneStr : any;


  constructor( public navCtrl: NavController, public navParams: NavParams, public _testUserSrvc: AuthTestUser) { }

   /**
   * @ionViewDidLoad()
   * @returns: void
   * @event: NavController Lifecycle events ionViewDidLoad
   * @description: Runs when the page has loaded. 
   *   This event only happens once per page being created. 
   *   If a page leaves but is cached, 
   *     then this event will not fire again on a subsequent viewing. 
   *   The ionViewDidLoad event is good place to put your setup code for the page.
   */
  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }
 
 ngOnInit() {
    this.getTestUser();
    this.dateStuff();
  }

  getTestUser() {
    this._testUserSrvc.getTestUser()
      .then(data => this.data = data)
      .then(() => this.retUserData(this.data));
  }

  retUserData(data) {
    console.log(this.data);
    console.log(this.data[0]);
    this.onSiteUsr  = this.data[ 0 ]; 
    this.technician = this.onSiteUsr.lastName + ', ' + this.onSiteUsr.firstName; 
    this.loc1       = this.onSiteUsr.loc1        ; 
    this.loc2       = this.onSiteUsr.loc2        ; 
    this.company    = this.onSiteUsr.clntCmpny   ; 
    this.techClass  = this.onSiteUsr.userClass   ; 
    this.hrsClass   = this.onSiteUsr.pyrlClass   ;
  } 
  dateStuff() {
    this.date = Date(); this.date; this.dstr = this.date.toString();
    let prsMonth     = RMNTH.exec(  this.dstr ); this.month     = prsMonth[     0 ];
    let prsWeekday   = RWKD.exec(   this.dstr ); this.weekDay   = prsWeekday[   0 ];
    let prsMday      = RMNTHD.exec( this.dstr ); this.mDay      = prsMday[      0 ];
    let prsYear      = RYR.exec(    this.dstr ); this.year      = prsYear[      0 ];
    let prsHours     = RHR.exec(    this.dstr ); this.hours     = prsHours[     0 ];
    let prsMin       = RMN.exec(    this.dstr ); this.min       = prsMin[       0 ];
    let prsSec       = RSC.exec(    this.dstr ); this.sec       = prsSec[       0 ];
    let prsTime      = RTM.exec(    this.dstr ); this.time      = prsTime[      0 ];
    let prsGmtoffset = ROFFST.exec( this.dstr ); this.gmtOffSet = prsGmtoffset[ 0 ];
    let prsTmzonestr = RTZS.exec(   this.dstr ); this.tmZoneStr = prsTmzonestr[ 0 ];
  }
}

