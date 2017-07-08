import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { NavParams, LoadingController, PopoverController, ModalController, AlertController, ToastController } from 'ionic-angular';
import { Log                                                     } from '../config/config.functions'           ;
import 'rxjs/add/operator/map';

/*
  Generated class for the AlertService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AlertService {

  public loading         :any               ;
  public alert           :any               ;
  public popover         :any               ;
  public toast           :any               ;
  public static ALERTS   :Array<any> = []   ;
  public static LOADINGS :Array<any> = []   ;
  public static POPOVERS :Array<any> = []   ;
  public static TOASTS   :Array<any> = []   ;
  public alerts          :any               ;
  public loadings        :any               ;
  public popovers        :any               ;
  public toasts          :any               ;
  public popoverData     :any        = null ;

  constructor(public http: Http, public loadingCtrl: LoadingController, public popoverCtrl:PopoverController, public modalCtrl:ModalController, public alertCtrl:AlertController, public toastCtrl:ToastController) {
    Log.l('Hello AlertService Provider');
    this.alerts = AlertService.ALERTS;
    this.loadings = AlertService.LOADINGS;
    this.popovers = AlertService.POPOVERS;
    this.toasts = AlertService.TOASTS;
  }

  showSpinner(text: string) {
    this.loading = this.loadingCtrl.create({
      content: text,
      showBackdrop: false,
    });

    this.loadings.push(this.loading);
    this.loading.present().catch((reason:any) => {Log.l("AlertService: loading.present() error:\n", reason)});
  }

  hideSpinner(milliseconds?:number) {
    if(milliseconds) {
      setTimeout(() => {
        let load = this.loadings.pop();
        load.dismiss().catch((reason: any) => {
          Log.l('AlertService: loading.dismiss() error:\n', reason);
          for(let i in this.loadings) {
            this.loadings.pop().dismiss();
            // oneload.dismissAll();
          }
        });
      }, milliseconds);
    } else {
      let load = this.loadings.pop();
      load.dismiss().catch((reason: any) => {
        Log.l('AlertService: loading.dismiss() error:\n', reason);
        for (let i in this.loadings) {
          this.loadings.pop().dismiss();
          // oneload.dismissAll();
        }
      });
    }
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

  showPopover(contents:any, data:any, event?:any) {
    let _event = null;
    let params = {cssClass: 'popover-template', showBackdrop: true, enableBackdropDismiss: true};
    if(event) {
      _event = event;
      params['ev'] = _event;
    }
    this.popoverData = {};
    // if(data !== undefined && data !== null && typeof data === 'object') {
    //   this.popoverData = data;
    // } else if(data !== undefined && data !== null) {
    //   params['ev'] = data;
    // }
    this.popoverData = data || {};
    this.popoverData.contents = contents;

    Log.l("AlertService.showPopover(): About to create popover with popoverData and params:\n", this.popoverData);
    Log.l(params);

    this.popover = this.popoverCtrl.create('Popover', this.popoverData, params);

    this.popovers.push(this.popover);
    this.popover.present().catch(() => { });
    // let nav = this.app.getActiveNav();

  }

  hidePopover() {
    setTimeout(() => {
      let popover = this.popovers.pop();
      popover.dismiss().catch((reason: any) => {
        Log.l('AlertService: popover.dismiss() error:\n', reason);
        for(let i in this.popovers) {
          this.loadings.pop().dismiss();
        }
      });
    });
  }

  showToast(msg: string, ms?:number) {
    let duration = 3000;
    if(ms) {
      duration = ms;
    }
    this.toast = this.toast.create({
      message: msg,
      duration: duration
    });
    this.toasts.push(this.toast);
    this.toast.present();
  }

  hideToast() {
    let toast = this.toasts.pop();
    toast.dismiss().catch((reason:any) => {
      Log.l("AlertService: toast.dismiss() error:\n", reason);
      for(let i in this.toasts) {
        this.toasts.pop().dismiss();
      }
    })
  }

}

