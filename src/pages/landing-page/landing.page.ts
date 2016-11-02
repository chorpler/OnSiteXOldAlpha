import { Component     } from '@angular/core'                     ;
import { NavController } from 'ionic-angular'                     ;
import { AcctSetupPage } from '../acct-setup-page/acct.setup.page';
import { AcctLoginPage } from '../acct-login-page/acct.login.page';

@Component({
  selector: 'landing-page',
  templateUrl: 'landing.page.html'
})
export class LandingPage {
_page = [AcctSetupPage, AcctLoginPage];
i: number;
  constructor(public navCtrl: NavController) { }

  pushPage(i) { this.navCtrl.push(this._page[i]); }

}
// /src/pages/acct-setup-page/acct.setup.page.ts
