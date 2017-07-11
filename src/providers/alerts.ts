import { Injectable                                                                                         } from '@angular/core'              ;
import { Http                                                                                               } from '@angular/http'              ;
import { NavParams, LoadingController, PopoverController, ModalController, AlertController, ToastController } from 'ionic-angular'              ;
import { Log                                                                                                } from '../config/config.functions' ;
import { TranslateService                                                                                   } from '@ngx-translate/core'        ;
import 'rxjs/add/operator/map';

/*
  Generated class for the AlertService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AlertService {
  public lang           : any                                            ;
  public loading        : any                                            ;
  public alert          : any                                            ;
  public popover        : any                                            ;
  public toast          : any                                            ;
  public static ALERTS  : Array<any>              =[]                    ;
  public static LOADINGS: Array<any>              =[]                    ;
  public static POPOVERS: Array<any>              =[]                    ;
  public static TOASTS  : Array<any>              =[]                    ;
  public alerts         : any                     =AlertService.ALERTS   ;
  public loadings       : any                     =AlertService.LOADINGS ;
  public popovers       : any                     =AlertService.POPOVERS ;
  public toasts         : any                     =AlertService.TOASTS   ;
  public popoverData    : any                     =null                  ;

  constructor(public http: Http, public loadingCtrl: LoadingController, public popoverCtrl:PopoverController, public modalCtrl:ModalController, public alertCtrl:AlertController, public toastCtrl:ToastController, public translate:TranslateService) {
    Log.l('Hello AlertService Provider');
    window['onsitealerts'] = this;
    this.alerts   = AlertService.ALERTS   ;
    this.loadings = AlertService.LOADINGS ;
    this.popovers = AlertService.POPOVERS ;
    this.toasts   = AlertService.TOASTS   ;
    this.translate.get(['ok', 'cancel', 'yes', 'no']).subscribe((result) => {
      Log.l("AlertService: translated values available!\n", result);
      this.lang = result;
    });
  }

  showSpinner(text: string, returnPromise?:boolean, milliseconds?:number) {
    let options;
    if(milliseconds) {
      options = { content: text, duration: milliseconds, showBackdrop: false};
    } else {
      options = { content: text, showBackdrop: false};
    }
    this.loading = this.loadingCtrl.create({
      content: text,
      showBackdrop: false,
    });
    this.loadings.push(this.loading);
    if(!returnPromise) {
      this.loading.present().then(res => {
        Log.l("showSpinner(): Showed spinner with text: ", text);
      }).catch((reason: any) => {
        Log.l("AlertService: loading.present() error:\n", reason);
        // reject(res);
      });
    } else {
      return new Promise((resolve,reject) => {
        this.loading.present().then(res => {
          Log.l("showSpinner(): Showed spinner with text: ", text);
          resolve(res);
        }).catch((reason:any) => {
          Log.l("AlertService: loading.present() error:\n", reason);
          resolve(reason);
          // reject(res);
        });
      });
    }
  }

  hideSpinner(milliseconds?:number, returnPromise?:boolean) {
    if(returnPromise) {
      return new Promise((resolve,reject) => {
        if(this.loadings && this.loadings.length) {
          if(milliseconds) {
            setTimeout(() => {
              let load = this.loadings.pop();
              load.dismiss().then((res) => {
                Log.l("hideSpinner(): Finished showing spinner:\n", load);
                resolve(res);
              }).catch((reason: any) => {
                Log.l("hideSpinner(): loading.dismiss() error for spinner:\n", load);
                Log.e(reason)
                let len = this.loadings.length;
                for(let i = 0; i < len; i++) {
                  this.loadings[i].dismiss();
                  // oneload.dismissAll();
                }
                this.loadings = [];
                resolve(reason);
              });
            }, milliseconds);
          } else {
            let load = this.loadings.pop();
            load.dismiss().then(res => {
              Log.l("hideSpinner(): Finished showing spinner:\n", load);
              resolve(res);
            }).catch((reason: any) => {
              Log.l('hideSpinner(): loading.dismiss() error:\n', reason);
              let len = this.loadings.length;
              for (let i = 0; i < len; i++) {
                this.loadings[i].dismiss();
              // for (let i in this.loadings) {
                // this.loadings.pop().dismiss();
                // oneload.dismissAll();
              }
              this.loadings = [];
              resolve(reason);
            });
          }
        } else {
          resolve("No spinners found to hide.");
        }
      });
    } else {
      if(this.loadings && this.loadings.length) {
        if(milliseconds) {
          setTimeout(() => {
            let load = this.loadings.pop();
            load.dismiss().catch((reason: any) => {
              Log.l('hideSpinner(): loading.dismiss() error:\n', reason);
              let len = this.loadings.length;
              for(let i = 0; i < len; i++) {
                this.loadings[i].dismiss();
                // oneload.dismissAll();
              }
              this.loadings = [];
            });
          }, milliseconds);
        } else {
          let load = this.loadings.pop();
          load.dismiss().catch((reason: any) => {
            Log.l('hideSpinner(): loading.dismiss() error:\n', reason);
            let len = this.loadings.length;
            for (let i = 0; i < len; i++) {
              this.loadings[i].dismiss();
            // for (let i in this.loadings) {
              // this.loadings.pop().dismiss();
              // oneload.dismissAll();
            }
            this.loadings = [];
          });
        }
      }
    }
  }

  showAlert(title: string, text: string) {
    let lang = this.lang;
    return new Promise((resolve,reject) => {
      this.alert = this.alertCtrl.create({
        title: title,
        message: text,
        buttons: [
          {text: lang['ok'], handler: () => {Log.l("OK clicked."); resolve(true);}}
        ]
      });
      this.alert.present();
    });
  }

  showConfirm(title: string, text: string) {
    let lang = this.translate.instant(['cancel', 'ok']);
    return new Promise((resolve,reject) => {
      this.alert = this.alertCtrl.create({
        title: title,
        message: text,
        buttons: [
          {text: lang['cancel'], handler: () => {Log.l("Cancel clicked."); resolve(false);}},
          {text: lang['ok'], handler: () => {Log.l("OK clicked."); resolve(true);}}
        ]
      });
      this.alert.present();
    });
  }

  showConfirmYesNo(title: string, text: string) {
    let lang = this.translate.instant(['yes', 'no']);
    return new Promise((resolve,reject) => {
      this.alert = this.alertCtrl.create({
        title: title,
        message: text,
        buttons: [
          {text: lang['no'], handler: () => {Log.l("No clicked."); resolve(false);}},
          {text: lang['yes'], handler: () => {Log.l("Yes clicked."); resolve(true);}}
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

