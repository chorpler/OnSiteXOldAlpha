import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PopoverController } from 'ionic-angular';
// import { LoginErrorPopover } from './login-error-popover';
import { Settings } from '../settings/settings';
import { AuthSrvcs } from '../../providers/auth-srvcs';

/**
 * Generated class for the Login page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage({name: 'Login'})
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class Login {
	private username: string;
	private password: string;
	public loginError: boolean = false;

  // constructor(public navCtrl: NavController, public navParams: NavParams, public popoverCtrl: PopoverController, private auth: AuthSrvcs) {
  constructor(public navCtrl: NavController, public navParams: NavParams, private auth: AuthSrvcs) {
  // constructor(public navCtrl: NavController, public navParams: NavParams, private settings: Settings, private auth: AuthSrvcs) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Login');
  }

  loginAttempt() {
  	this.auth.setUser(this.username);
  	this.auth.setPassword(this.password);
  	console.log("About to call auth.login()");
  	this.auth.login().then((res) => {
  		console.log("Login succeeded.");
  		console.log(res);
  		this.navCtrl.push('Report Settings');
  	}).catch((err) => {
  		console.log("Login error.");
  		console.log(err);
  		this.loginError = true;
  	});
  }

  // showPopover() {
  // 	let popover = this.popoverCtrl.create(LoginErrorPopover);
  // 	popover.present();
  // }

}
