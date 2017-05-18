import { Component                           } from '@angular/core'                 ;
import { IonicPage, NavController, NavParams } from 'ionic-angular'                 ;
import { PopoverController                   } from 'ionic-angular'                 ;
// import { LoginErrorPopover                } from './login-error-popover'         ;
// import { Settings                         } from '../settings/settings'          ;
import { AuthSrvcs                           } from '../../providers/auth-srvcs'    ;
import { SrvrSrvcs                           } from '../../providers/srvr-srvcs'    ;
import { DBSrvcs                             } from '../../providers/db-srvcs'      ;
import { Log, CONSOLE                        } from '../../config/config.functions' ;

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
  public localURL: string = "_local/techProfile";

  // constructor(public navCtrl: NavController, public navParams: NavParams, public popoverCtrl: PopoverController, private auth: AuthSrvcs) {
  constructor(public navCtrl: NavController, public navParams: NavParams, private auth: AuthSrvcs, private srvr: SrvrSrvcs, private db: DBSrvcs) {
  // constructor(public navCtrl: NavController, public navParams: NavParams, private settings: Settings, private auth: AuthSrvcs) {
  }

  ionViewDidLoad() {
    Log.l('Login: ionViewDidLoad fired.');
  }

  loginClicked() {
  	Log.l("Login: Now attempting login:");
  	this.auth.setUser(this.username);
  	this.auth.setPassword(this.password);
  	Log.l("About to call auth.login()");
  	this.auth.login().then((res) => {
  		Log.l("Login succeeded.", res);
      return this.srvr.getUserData(this.username);
    }).then((res) => {
      let udoc = res;
      udoc.updated = true;
      udoc._id = this.localURL;
      return this.db.addLocalDoc(udoc);
    }).then((res) => {
      Log.l("loginAttempt(): Finished validating and saving user info.")
  		this.navCtrl.push('Report Settings');
  	}).catch((err) => {
  		Log.l("loginAttempt(): Error validating and saving user info.");
  		Log.l(err);
  		this.loginError = true;
  	});
  }

  // showPopover() {
  // 	let popover = this.popoverCtrl.create(LoginErrorPopover);
  // 	popover.present();
  // }

}
