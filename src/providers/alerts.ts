// import * as UUID from 'uuid';
import { Injectable                                        } from '@angular/core'           ;
import { HttpClient                                        } from '@angular/common/http'    ;
import { NavParams, LoadingController, PopoverController,  } from 'ionic-angular'           ;
import { ModalController, AlertController, ToastController } from 'ionic-angular'           ;
import { Log, UUID, SpinnerRecord, Spinners,               } from 'domain/onsitexdomain' ;
import { TranslateService                                  } from '@ngx-translate/core'     ;

@Injectable()
export class AlertService {
  public lang           : any                                            ;
  public loading        : any                                            ;
  public alert          : any                                            ;
  public popover        : any                                            ;
  public toast          : any                                            ;
  // public static ALERTS  : Array<any>              =[]                    ;
  // public static LOADINGS: Array<any>              =[]                    ;
  // public static POPOVERS: Array<any>              =[]                    ;
  // public static TOASTS  : Array<any>              =[]                    ;
  // public alerts         : any                     =AlertService.ALERTS   ;
  // public loadings       : any                     =AlertService.LOADINGS ;
  // public popovers       : any                     =AlertService.POPOVERS ;
  // public toasts         : any                     =AlertService.TOASTS   ;
  public alerts  : Array<any> = [] ;
  public loadings: Array<any> = [] ;
  public popovers: Array<any> = [] ;
  public toasts  : Array<any> = [] ;
  public spinners:Spinners = new Map();
  public popoverData    : any                     =null                  ;
  public UUID           : any                     = UUID                 ;

  constructor(
    public loadingCtrl : LoadingController ,
    public popoverCtrl : PopoverController ,
    public modalCtrl   : ModalController   ,
    public alertCtrl   : AlertController   ,
    public toastCtrl   : ToastController   ,
    public translate   : TranslateService  ,
  ) {
    Log.l('Hello AlertService Provider');
    window['onsitealerts'] = this;
    window['UUID'] = UUID;
    this.translate.get(['ok', 'cancel', 'yes', 'no']).subscribe((result) => {
      Log.l("AlertService: translated values available!\n", result);
      this.lang = result;
    });
  }

  public async showSpinner(text: string, milliSeconds?:number) {
    try {
      let options:any = {
        content: text,
        showBackdrop: false,
      };
      if(milliSeconds) {
        options.duration = milliSeconds;
      }
      const loading = this.loadingCtrl.create(options);

      let id = UUID();
      // let id = loading.id;
      let i = this.spinners.size;
      Log.l(`showSpinner(): Created spinner #${i} '${id}':\n`, loading);
      if(!id) {
        Log.l(`showSpinner(): Spinner ID 'undefined' for spinner, can't add it to Spinners Map:\n`, loading);
      } else {
        this.spinners.set(id, loading);
      }
      Log.l("showSpinner(): Active spinner array:\n", this.spinners);
      try {
        let res = loading.present();
        return id;
      } catch(err) {
        Log.l(`showSpinner(): Error presenting spinner!\n`, loading);
        Log.e(err);
      }
    } catch(err) {
      Log.l(`showSpinner(): Error creating and showing spinner '${text}'`);
      Log.e(err);
      throw new Error(err);
    }
  }

  public async showSpinnerPromise(text: string, milliSeconds?:number) {
    try {
      let options:any = {
        content: text,
        showBackdrop: false,
      };
      if(milliSeconds) {
        options.duration = milliSeconds;
      }
      const loading = this.loadingCtrl.create(options);

      let id = UUID();
      // let id = loading.id;
      let i = this.spinners.size;
      Log.l(`showSpinner(): Created spinner #${i} '${id}':\n`, loading);
      if(!id) {
        Log.l(`showSpinner(): Spinner ID 'undefined' for spinner, can't add it to Spinners Map:\n`, loading);
      } else {
        this.spinners.set(id, loading);
      }
      Log.l("showSpinner(): Active spinner array:\n", this.spinners);
      try {
        let res = await loading.present();
        return id;
      } catch(err) {
        Log.l(`showSpinner(): Error presenting spinner!\n`, loading);
        Log.e(err);
      }
    } catch(err) {
      Log.l(`showSpinner(): Error creating and showing spinner '${text}'`);
      Log.e(err);
      throw new Error(err);
    }
  }

  public getSpinner(spinID?:string) {
    let spinners = this.spinners;
    let length = spinners.size;
    let spinner = undefined;
    if(!length) {
      Log.l("getSpinner(): No spinners found!");
      return spinner;
    }
    let id;
    if(spinID !== undefined) {
      id = spinID;
      spinner = spinners.get(id);
    } else {
      let list = Array.from(spinners);
      let entry = list.pop();
      id = entry[0];
      spinner = spinners.get(id);
      Log.l(`getSpinner(): Called with no ID, returning last added spinner...`);
    }
    return spinner;
  }

  public hideSpinner(spinID?:string) {
    let id = spinID ? spinID : "(no id provided)";
    let spinner = this.getSpinner(spinID);
    let spinners = this.spinners;
    if(spinner) {
      // id = spinner.id;
      Log.l(`hideSpinner(): Hiding spinner '${id}':\n`, spinner);
      spinner.dismiss().catch(err => {Log.l(`hideSpinner(): Error dismissing spinner '${id}'!`); Log.l(err); });
      spinners.delete(id);
    } else {
      Log.l(`hideSpinner(): Could not find spinner '${id}' to hide! Spinners array is:\n`, spinners);
    }
  }

  public async hideSpinnerPromise(spinID?:string) {
    let id = spinID ? spinID : "(no id provided)";
    try {
      let spinner = this.getSpinner(spinID);
      let spinners = this.spinners;
      if(spinner) {
        // id = spinner.id;
        Log.l(`hideSpinnerPromise(): Hiding spinner '${id}':\n`, spinner);
        try {
          let res:any = await spinner.dismiss();
          spinners.delete(id);
          return res;
        } catch(err) {
          Log.l(`hideSpinnerPromise(): Error dismissing spinner '${id}'!`);
          Log.e(err);
          throw new Error(err);
        }
      } else {
        throw new Error(`Could not find spinner '${id}' to hide!`);
      }
    } catch(err) {
      Log.l(`hideSpinnerPromise(): Could not find spinner '${id}' to hide!`);
      Log.e(err);
      // let msg = `Spinner '${id}' not found to be dismissed.`;
      // throw new Error(msg);
    }
  }

  public async clearSpinners() {
    try {
      let spinners = this.spinners;
      Log.l("clearSpinners(): called, spinner array is:\n", spinners);
      let keys = spinners.keys();
      for(let i in keys) {
        let key = keys[i];
        let entry = spinners.get(key);
        let id = entry[0];
        let spinner = entry[1];
        try {
          let res:any = await spinner.dismiss();
          spinners.delete(id);
        } catch(err) {
          Log.l(`clearSpinners(): Error dismissing spinner '${id}':\n`, spinner);
          Log.e(err);
          spinners.delete(id);
        }
      }
      return true;
    } catch(err) {
      Log.l(`clearSpinners(): Error clearing spinners!`);
      Log.e(err);
      throw new Error(err);
    }
  }

  // public showSpinner(text: string, returnPromise?:boolean, milliseconds?:number) {
  //   let options;
  //   if(milliseconds) {
  //     options = { content: text, duration: milliseconds, showBackdrop: false};
  //   } else {
  //     options = { content: text, showBackdrop: false};
  //   }
  //   let loading = this.loadingCtrl.create(options);
  //   this.loadings.push(loading);
  //   loading.present().then(res => {
  //     Log.l("showSpinner(): Showed spinner with text: ", text);
  //     Log.l(this.loading);
  //   }).catch((reason: any) => {
  //     Log.l("AlertService: loading.present() error:\n", reason);
  //     // reject(res);
  //   });
  //   return loading;
  // }

  // public showSpinnerPromise(text: string, returnPromise?:boolean, milliseconds?:number) {
  //   let options;
  //   if(milliseconds) {
  //     options = { content: text, duration: milliseconds, showBackdrop: false};
  //   } else {
  //     options = { content: text, showBackdrop: false};
  //   }
  //   let loading = this.loadingCtrl.create(options);
  //   this.loadings.push(loading);
  //   return new Promise((resolve,reject) => {
  //     loading.present().then(res => {
  //       Log.l("showSpinner(): Showed spinner with text: ", text);
  //       resolve(loading);
  //     }).catch((reason:any) => {
  //       Log.l("AlertService: loading.present() error:\n", reason);
  //       resolve(reason);
  //       // reject(res);
  //     });
  //   });
  // }

  // public hideSpinner(milliseconds?:number, returnPromise?:boolean) {
  //   if(returnPromise) {
  //     return new Promise((resolve,reject) => {
  //       if(this.loadings && this.loadings.length) {
  //         if(milliseconds) {
  //           setTimeout(() => {
  //             let load = this.loadings.pop();
  //             load.dismiss().then((res) => {
  //               Log.l("hideSpinner(): Finished showing spinner:\n", load);
  //               resolve(res);
  //             }).catch((reason: any) => {
  //               Log.l("hideSpinner(): loading.dismiss() error for spinner:\n", load);
  //               Log.e(reason)
  //               let len = this.loadings.length;
  //               for(let i = 0; i < len; i++) {
  //                 this.loadings[i].dismiss();
  //                 // oneload.dismissAll();
  //               }
  //               this.loadings = [];
  //               resolve(reason);
  //             });
  //           }, milliseconds);
  //         } else {
  //           let load = this.loadings.pop();
  //           load.dismiss().then(res => {
  //             Log.l("hideSpinner(): Finished showing spinner:\n", load);
  //             resolve(res);
  //           }).catch((reason: any) => {
  //             Log.l('hideSpinner(): loading.dismiss() error:\n', reason);
  //             let len = this.loadings.length;
  //             for (let i = 0; i < len; i++) {
  //               this.loadings[i].dismiss();
  //             // for (let i in this.loadings) {
  //               // this.loadings.pop().dismiss();
  //               // oneload.dismissAll();
  //             }
  //             this.loadings = [];
  //             resolve(reason);
  //           });
  //         }
  //       } else {
  //         resolve("No spinners found to hide.");
  //       }
  //     });
  //   } else {
  //     if(this.loadings && this.loadings.length) {
  //       if(milliseconds) {
  //         setTimeout(() => {
  //           let load = this.loadings.pop();
  //           load.dismiss().catch((reason: any) => {
  //             Log.l('hideSpinner(): loading.dismiss() error:\n', reason);
  //             let len = this.loadings.length;
  //             for(let i = 0; i < len; i++) {
  //               this.loadings[i].dismiss();
  //               // oneload.dismissAll();
  //             }
  //             this.loadings = [];
  //           });
  //         }, milliseconds);
  //       } else {
  //         let load = this.loadings.pop();
  //         load.dismiss().catch((reason: any) => {
  //           Log.l('hideSpinner(): loading.dismiss() error:\n', reason);
  //           let len = this.loadings.length;
  //           for (let i = 0; i < len; i++) {
  //             this.loadings[i].dismiss();
  //           // for (let i in this.loadings) {
  //             // this.loadings.pop().dismiss();
  //             // oneload.dismissAll();
  //           }
  //           this.loadings = [];
  //         });
  //       }
  //     }
  //   }
  // }

  // public hideSpinnerPromise() {
  //   return new Promise((resolve,reject) => {
  //     if(this.loadings && this.loadings.length) {
  //       let load = this.loadings.pop();
  //       load.dismiss().then(res => {
  //         Log.l("hideSpinner(): Finished showing spinner:\n", load);
  //         resolve(res);
  //       }).catch((reason: any) => {
  //         Log.l('hideSpinner(): loading.dismiss() error:\n', reason);
  //         let len = this.loadings.length;
  //         for (let i = 0; i < len; i++) {
  //           this.loadings[i].dismiss();
  //         // for (let i in this.loadings) {
  //           // this.loadings.pop().dismiss();
  //           // oneload.dismissAll();
  //         }
  //         this.loadings = [];
  //         resolve(reason);
  //       });
  //     } else {
  //       resolve("No spinners found to hide.");
  //     }
  //   });
  // }

  public showAlert(title: string, text: string) {
    let lang = this.lang;
    let uuid = UUID.v4();
    return new Promise((resolve,reject) => {
      let alert = this.alertCtrl.create({
        title: title,
        message: text,
        buttons: [
          {
            text: lang['ok'], handler: () => {
              let thisAlert;
              let i = 0;
              for(let alert of this.alerts) {
                if(alert.id === uuid) {
                  thisAlert = alert.alert;
                  break;
                }
                i++;
              }
              let alert = this.alerts.splice(i, 1)[0];
              Log.l("OK clicked from:\n", alert);
              window['onsitealertdismissed'] = alert;
              resolve(true);
            }
          }
        ]
      });
      let oneAlert = {alert: alert, id: uuid};
      this.alerts.push(oneAlert);
      this.alert = alert;
      alert.present();
    });
  }

  public async showAlertPromise(title: string, text: string) {
    try {
      return new Promise((resolve,reject) => {
        let lang = this.lang;
        let uuid = UUID.v4();
        let alert = this.alertCtrl.create({
          title: title,
          message: text,
          buttons: [
            {
              text: lang['ok'], handler: () => {
                let thisAlert;
                let i = 0;
                for(let alert of this.alerts) {
                  if(alert.id === uuid) {
                    thisAlert = alert.alert;
                    break;
                  }
                  i++;
                }
                let alert = this.alerts.splice(i, 1)[0];
                Log.l("OK clicked from:\n", alert);
                window['onsitealertdismissed'] = alert;
                resolve(true);
              }
            }
          ]
        });
        let oneAlert = {alert: alert, id: uuid};
        this.alerts.push(oneAlert);
        this.alert = alert;
        alert.present();
      });
    } catch(err) {
      Log.l(`showAlertPromise(): Error `);
      Log.e(err);
      throw new Error(err);
    }
  }

  public showConfirm(title: string, text: string) {
    let lang = this.translate.instant(['cancel', 'ok']);
    return new Promise((resolve,reject) => {
      let alert = this.alertCtrl.create({
        title: title,
        message: text,
        buttons: [
          {text: lang['cancel'], handler: () => {Log.l("Cancel clicked."); resolve(false);}},
          {text: lang['ok'], handler: () => {Log.l("OK clicked."); resolve(true);}}
        ]
      });
      this.alert = alert;
      alert.present();
    });
  }

  public showConfirmYesNo(title: string, text: string) {
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

  public showCustomConfirm(title:string, text:string, buttons:Array<any>) {
    return new Promise((resolve) => {
      let buttonArray = [];
      let i = 1;
      for(let button of buttons) {
        let btn:any = {};
        btn.text = button.text;
        btn.handler = button && button.retVal ? () => { Log.l(`Button pressed: '${button.text}'`); resolve(button.retVal); } : () => { Log.l(`Button pressed: '${button.text}'`); resolve(i); };
        if(button && button.cssClass) {
          btn.cssClass = button.cssClass;
        }
        if(button && button.role) {
          btn.role = button.role;
        }
        buttonArray.push(btn);
        i++;
      }
      this.alert = this.alertCtrl.create({
        title: title,
        message: text,
        buttons: buttonArray
      });
      this.alert.present();
    });
  }

  public showPopover(contents:any, data:any, event?:any) {
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

  public hidePopover() {
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

  public showToast(msg: string, ms?:number, position?: string, cssClass?:string) {
    let duration = ms ? ms : 3000;
    // let place = position ? position : 'bottom';
    let place = position ? position : 'middle';
    let css = cssClass ? cssClass : 'onsite-alert-toast';
    let toast = this.toastCtrl.create({
      message: msg,
      duration: duration,
      position: place,
      showCloseButton: false,
      dismissOnPageChange: true,
      cssClass: css
    });
    // this.toasts.push(this.toast);
    toast.present().catch(() => { });;
  }

  public hideToast() {
    let toast = this.toasts.pop();
    toast.dismiss().catch((reason:any) => {
      Log.l("AlertService: toast.dismiss() error:\n", reason);
      for(let i in this.toasts) {
        this.toasts.pop().dismiss().catch(() => { });;
      }
    });
  }

}

