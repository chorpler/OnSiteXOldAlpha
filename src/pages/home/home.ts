import { Component } from '@angular/core';
import { IonicPage, NavController} from 'ionic-angular';
import { Platform } from 'ionic-angular';

@IonicPage({name: 'OnSiteHome'})

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  title ='OnSite Home';
  
  constructor(public navCtrl: NavController, public plt: Platform) { 
    console.log(this.plt.platforms());
  }

  onNewWorkOrder() {this.navCtrl.push('Work Order Form', {mode: 'New'});}
  onLogin() {this.navCtrl.push('Login');}
  // onNewJobForm() {this.navCtrl.push('Work Order', {mode: 'New'});}
  onSettings() {this.navCtrl.push('Report Settings');}

}
// 'Work Order Form'