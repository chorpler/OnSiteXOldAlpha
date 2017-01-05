import { Component, OnInit               } from '@angular/core'                                ;
import { NavController, NavParams        } from 'ionic-angular'                                ;
import { Assignment                      } from '../../config/config.interface.techassignment' ;
import { Assignments                     } from '../../config/config.constants.assignments'    ;
import { CLNTCMPNY, LOCPRIMRY            } from '../../config/config.constants.class'          ;
import { LOCSCNDRY, USERCLASS, PYRLCLASS } from '../../config/config.constants.class'          ;
import { ReportClass                   } from '../../config/config.interface.user.report.class';
import { AuthTestUser } from '../../providers/auth-test-user';
import { OSXU } from '../../config/user.config.user';


@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})

export class SettingsPage implements OnInit {
  title    : string    = 'Settings'; 

  onSiteUsr : OSXU      ; 
  data      : Array<any>; 
  company   : string    ; 
  loc1      : string    ; 
  loc2      : string    ; 
  techClass : string    ; 
  technician: string    ; 
  hrsClass  : string    ; 


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

}
