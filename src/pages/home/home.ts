import { Component } from '@angular/core';
import { IonicPage, NavController} from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { AuthSrvcs } from '../../providers/auth-srvcs';

@IonicPage({name: 'OnSiteHome'})

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  userLoggedIn: boolean = false;
  showPage: boolean = false;
  // isFirstItem: string = '';
  title ='OnSite Home';
  
  constructor(public navCtrl: NavController, public plt: Platform, public authServices: AuthSrvcs) { 
    console.log(this.plt.platforms());
    this.authServices.isFirstLogin().then((firstLogin) => {
      if(firstLogin) {
        this.userLoggedIn = false;
      } else {
        this.userLoggedIn = true;
      }
      this.showPage = true;
    });
  }

  onNewWorkOrder() {this.navCtrl.push('Work Order Form', {mode: 'New'});}
  onLogin() {this.navCtrl.push('Login');}
  // onNewJobForm() {this.navCtrl.push('Work Order', {mode: 'New'});}
  onSettings() {this.navCtrl.push('Report Settings');}
  isFirstItem() {
    if(this.userLoggedIn) {
      return 'logged-in';
    } else {
      return '';
    }
  }
}
// 'Work Order Form'