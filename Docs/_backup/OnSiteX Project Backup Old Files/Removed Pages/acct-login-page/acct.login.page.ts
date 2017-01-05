import { Component     } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NgModule      } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule   } from '@angular/forms';

/*
  Generated class for the AcctLoginPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-acct-login-page',
  templateUrl: 'acct.login.page.html'
})
export class AcctLoginPage {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello AcctLoginPage Page');
  }

}
