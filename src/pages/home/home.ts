import { Component, OnInit, NgZone              } from '@angular/core';
import { Platform, IonicPage, NavParams         } from 'ionic-angular';
import { NavController, ToastController         } from 'ionic-angular';
import { ModalController                        } from 'ionic-angular';
import { Log } from '../../config/config.functions';
import { AuthSrvcs } from '../../providers/auth-srvcs' ;
import { SrvrSrvcs } from '../../providers/srvr-srvcs';
import { UserData } from '../../providers/user-data';
import { WorkOrder } from '../../domain/workorder';
import { Shift } from '../../domain/shift';
import { Employee } from '../../domain/employee';


@IonicPage({name: 'OnSiteHome'})
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {

  loginData    : any           = { user: null, pass: null }                         ;
  username     : string        = "unknown"                                          ;
  userLoggedIn : boolean                                                            ;
  title        : string        = 'OnSite Home'                                      ;
  numChars     : Array<string> = ["⓵", "⓶", "⓷", "⓸", "⓹", "⓺", "⓻", "⓼", "⓽"] ;
  shftOne      : string                                                             ;
  shftTwo      : string                                                             ;
  shftThree    : string                                                             ;
  shftFour     : string                                                             ;
  shftFive     : string                                                             ;
  shftSix      : string                                                             ;
  shftSeven    : string                                                             ;
  chkBxBool    : boolean                                                            ;
  chkBx        : string                                                             ;
  shftHrs: number;
  hrsSubmitted: number;
  public techWorkOrders:Array<WorkOrder>;

  constructor( public navCtrl: NavController,
               public modalCtrl: ModalController,
               public authService: AuthSrvcs,
               public navParams: NavParams,
               public server: SrvrSrvcs,
               public ud: UserData ) 
  {
    this.shftOne   = this.numChars[0];
    this.shftTwo   = this.numChars[1];
    this.shftThree = this.numChars[2];
    this.shftFour  = this.numChars[3];
    this.shftFive  = this.numChars[4];
    this.shftSix   = this.numChars[5];
    this.shftSeven = this.numChars[6];
    window["onsitehome"] = this;
  }

  ngOnInit() {
    Log.l("HomePage: ngOnInit() called. Checking user login status.");
    if (this.isLoggedIn()) {
      Log.l("HomePage: user logged in, fetching work orders.");
      let techid = this.loginData.user;
      this.server.getReportsForTech(techid).then((res) => {
        Log.l(`HomePage: getReportsForTech(${techid}): Success! Result:\n`, res);
        this.ud.setWorkOrderList(res);
      }).catch((err) => {
        Log.l(`HomePage: getReportsForTech(${techid}): Error!`);
        Log.e(err);
      });
    }
  }

  isAuthorized() {
    Log.l("HomePage.isAuthorized(): Checking auth status...");
    let authorized = Boolean(this.loginData !== undefined && this.loginData !== null && typeof this.loginData.user === 'string' && typeof this.loginData.pass === 'string' && this.loginData.user !== '' && this.loginData.pass !== '');
    Log.l("HomePage.isAuthorized(): Auth status is: ", authorized);
    return authorized;
  }
  
  isLoggedIn() {
    Log.l("HomePage.isLoggedIn(): Checking login status...");
    let loggedin = Boolean(this.isAuthorized() && this.userLoggedIn);
    Log.l("HomePage.isLoggedIn(): Login status: ", loggedin);
    return loggedin;
  }

  presentLoginModal() {
    let loginPage = this.modalCtrl.create('Login', {user: '', pass: ''}, { cssClass: 'login-modal'});
    loginPage.onDidDismiss(data => {
      Log.l("Got back:\n", data);
      this.loginData = data;
      if( this.isLoggedIn() ) {
        console.log("Login Modal succeeded, now opening user modal.");
        this.userLoggedIn = true;
        this.presentUserModal(); }
      else { console.log("Login Modal did not succeed."); }
    })
    loginPage.present();
  }

  chkHrs() {
    if(this.shftHrs === this.hrsSubmitted ) { this.chkBx = '☑'; this.chkBxBool = true; }
    else { this.chkBx = '☒'; this.chkBxBool = false; }
  }

  presentUserModal() {
    let TechSettings = this.modalCtrl.create('User', { mode: 'modal' });
    TechSettings.present();
  }

  ionViewDidEnter() {
    if ( this.navParams.get('userLoggedIn') !== undefined ) {
     this.userLoggedIn = this.navParams.get('userLoggedIn');
    }
    if (this.userLoggedIn === false ) { this.presentLoginModal(); }
    this.chkHrs();
  }

}
