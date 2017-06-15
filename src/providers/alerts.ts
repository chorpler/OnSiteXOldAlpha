import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';                     ;
import { Log, CONSOLE                                            } from '../config/config.functions'           ;
import 'rxjs/add/operator/map';

/*
  Generated class for the AlertService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AlertService {

  public loading :any;
  public alert   :any;
  public static ALERTS:Array<any> = [];
  public static LOADINGS:Array<any> = [];
  public alerts:any;
  public loadings:any;

  constructor(public http: Http, public loadingCtrl: LoadingController, public alertCtrl:AlertController) {
    Log.l('Hello AlertService Provider');
    this.alerts = AlertService.ALERTS;
    this.loadings = AlertService.LOADINGS;
  }

  showSpinner(text: string) {
    this.loading = this.loadingCtrl.create({
      content: text,
      showBackdrop: false,
    });

    this.loadings.push(this.loading);
    this.loading.present().catch(() => {});
  }

  hideSpinner() {
    setTimeout(() => {
      let load = this.loadings.pop();
      load.dismiss().catch((reason: any) => {
        Log.l('AlertService: loading.dismiss() error:\n', reason);
        for(let i in this.loadings) {
          this.loadings.pop().dismiss();
          // oneload.dismissAll();
        }
      });
    });
  }

  showAlert(title: string, text: string) {
    return new Promise((resolve,reject) => {
      this.alert = this.alertCtrl.create({
        title: title,
        message: text,
        buttons: [
          {text: 'OK', handler: () => {Log.l("OK clicked."); resolve(true);}}
        ]
      });
      this.alert.present();
    });
  }

  showConfirm(title: string, text: string) {
    return new Promise((resolve,reject) => {
      this.alert = this.alertCtrl.create({
        title: title,
        message: text,
        buttons: [
          {text: 'Cancel', handler: () => {Log.l("Cancel clicked."); resolve(false);}},
          {text: 'OK', handler: () => {Log.l("OK clicked."); resolve(true);}}
        ]
      });
      this.alert.present();
    });
  }

  showConfirmYesNo(title: string, text: string) {
    return new Promise((resolve,reject) => {
      this.alert = this.alertCtrl.create({
        title: title,
        message: text,
        buttons: [
          {text: 'No', handler: () => {Log.l("Cancel clicked."); resolve(false);}},
          {text: 'Yes', handler: () => {Log.l("OK clicked."); resolve(true);}}
        ]
      });
      this.alert.present();
    });
  }

  showCustomConfirm(title: string, text: string, buttons:any) {
    return new Promise((resolve,reject) => {
      this.alert = this.alertCtrl.create({
        title: title,
        message: text,
        buttons: buttons
      });
      this.alert.present();
    });
  }

}
