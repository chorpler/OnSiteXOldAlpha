import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthSrvcs } from '../../providers/auth-srvcs'
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
	public username: string;
	public password: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private auth: AuthSrvcs) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Login');
  }

  loginAttempt() {
  	this.auth.setUser(this.username);
  	this.auth.setPassword(this.password);
  	this.auth.login();
  }

}
