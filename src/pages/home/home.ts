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

  loginData: any;
  username: string = "unknown";
  server: any;
  userLoggedIn:boolean;
  title: string = 'OnSite Home';

  constructor( public navCtrl: NavController, public modalCtrl: ModalController,
               public authService: AuthSrvcs, public navParams: NavParams        ) { }

  presentLoginModal() {
    let loginPage = this.modalCtrl.create('Login', {user: '', pass: ''}, { cssClass: 'login-modal'});
    loginPage.onDidDismiss(data => {
      Log.l("Got back:\n", data);
      this.loginData = data;
      if(this.loginData !== undefined && this.loginData !== null && this.loginData.user && this.loginData.pass) {
        console.log("Login Modal succeeded, now opening user modal.");
        this.userLoggedIn = true;
        this.presentUserModal();
      } else {
        console.log("Login Modal did not succeed.");

      }
      // this.onSubmit();
    })
    loginPage.present();
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
  }

}
