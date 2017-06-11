import { Component, OnInit, NgZone              } from '@angular/core';
import { Platform, IonicPage, NavParams         } from 'ionic-angular';
import { NavController, ToastController         } from 'ionic-angular';
import { ModalController                        } from 'ionic-angular';
import { Log } from '../../config/config.functions';
import { AuthSrvcs } from '../../providers/auth-srvcs' ;


@IonicPage({name: 'OnSiteHome'})
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  loginData    : any                                                               ;
  username     : string        = "unknown"                                         ;
  server       : any                                                               ;
  userLoggedIn : boolean                                                           ;
  title        : string        = 'OnSite Home'                                     ;
  numChars     : Array<string> = ["⓵", "⓶", "⓷", "⓸", "⓹", "⓺", "⓻", "⓼", "⓽"] ;
  shftOne      : string                                                            ;
  shftTwo      : string                                                            ;
  shftThree    : string                                                            ;
  shftFour     : string                                                            ;
  shftFive     : string                                                            ;
  shftSix      : string                                                            ;
  shftSeven    : string                                                            ;
  chkBxBool    : boolean                                                           ;
  chkBx        : string                                                            ;
  shftHrs: number;
  hrsSubmitted: number;

  constructor( public navCtrl: NavController, public modalCtrl: ModalController,
               public authService: AuthSrvcs, public navParams: NavParams ) {

                this.shftOne   = this.numChars[0];
                this.shftTwo   = this.numChars[1];
                this.shftThree = this.numChars[2];
                this.shftFour  = this.numChars[3];
                this.shftFive  = this.numChars[4];
                this.shftSix   = this.numChars[5];
                this.shftSeven = this.numChars[6];
                }

  presentLoginModal() {
    let loginPage = this.modalCtrl.create('Login', {user: '', pass: ''}, { cssClass: 'login-modal'});
    loginPage.onDidDismiss(data => {
      Log.l("Got back:\n", data);
      this.loginData = data;
      if( this.loginData !== undefined && this.loginData !== null && this.loginData.user && this.loginData.pass ) {
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
