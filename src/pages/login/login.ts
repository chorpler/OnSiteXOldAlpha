import { Component, OnInit                                                       } from '@angular/core'                  ;
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular'                  ;
import { PopoverController                                                       } from 'ionic-angular'                  ;
import { FormGroup, FormControl, Validators                                      } from "@angular/forms"                 ;
import { AuthSrvcs                                                               } from '../../providers/auth-srvcs'     ;
import { SrvrSrvcs                                                               } from '../../providers/srvr-srvcs'     ;
import { DBSrvcs                                                                 } from '../../providers/db-srvcs'       ;
import { AlertService                                                          } from '../../providers/alerts'         ;
import { NetworkStatus                                                           } from '../../providers/network-status' ;
import { Log, CONSOLE                                                            } from '../../config/config.functions'  ;

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
export class Login implements OnInit {
	public title          : string  = "OnSite Login"       ;
	private username      : string                         ;
	private password      : string                         ;
	public loginError     : boolean = false                ;
	public localURL       : string  = "_local/techProfile" ;
	public loading        : any     = {}                   ;
	public networkGood    : boolean = true                 ;
	private LoginForm     : FormGroup                      ;
	private formUser      : any                            ;
	private formPass      : any                            ;
	private submitAttempt : boolean = false                ;

	constructor(public navCtrl: NavController,
		public navParams: NavParams,
		private auth: AuthSrvcs,
		private srvr: SrvrSrvcs,
		private db: DBSrvcs,
		private loadingCtrl: LoadingController, 
		private network: NetworkStatus, 
		private alerter: AlertService
	) {
		window['loginscreen'] = this;
	}

	ionViewDidLoad() {
		Log.l('Login: ionViewDidLoad fired.');
	}

	ngOnInit() {
		Log.l("Starting login page...");
		this.initializeForm();
		if(NetworkStatus.isConnected()) {
		} else {
			this.alerter.showAlert('OFFLINE', "There is no Internet connection. Login will not work right now.");
		}
	}

  private initializeForm() {
    this.LoginForm = new FormGroup({
      'formUser': new FormControl(null, Validators.required),
      'formPass': new FormControl(null, Validators.required)
    });
  }

  showSpinner(text: string) {
		this.loading = this.loadingCtrl.create({
			content: text,
			showBackdrop: false,
		});

		this.loading.present().catch(() => {});
	}

	hideSpinner() {
		setTimeout(() => {
			this.loading.dismiss().catch((reason: any) => {
				Log.l('EditReport: loading.dismiss() error:\n', reason);
				this.loading.dismissAll();
			});
		});
	}

	onSubmit() {
		this.submitAttempt = true;
		this.loginClicked();
	}

	loginClicked() {
		let tmpUserData = this.LoginForm.value;
		this.username = tmpUserData.formUser;
		this.password = tmpUserData.formPass;
		if(NetworkStatus.isConnected()) {
			this.showSpinner('Logging in...');
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
				this.hideSpinner();
				setTimeout(() => {this.navCtrl.push('Report Settings');});
			}).catch((err) => {
				Log.l("loginAttempt(): Error validating and saving user info.");
				Log.l(err);
				this.loginError = true;
				this.hideSpinner();
			});
		} else {
			this.alerter.showAlert('OFFLINE', "There is no Internet connection. Can't log in right now.");
		}
	}

	// showPopover() {
	// 	let popover = this.popoverCtrl.create(LoginErrorPopover);
	// 	popover.present();
	// }

}
