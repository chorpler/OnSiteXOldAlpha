import { Component, OnInit                                   } from '@angular/core'                  ;
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular'                  ;
import { Platform, App                                       } from 'ionic-angular'                  ;
import { Device                                              } from '@ionic-native/device'           ;
import { AppVersion                                          } from '@ionic-native/app-version'      ;
// import { UniqueDeviceID                                      } from '@ionic-native/unique-device-id' ;
import { TranslateService                                    } from '@ngx-translate/core'            ;
import { Log, moment, isMoment, Moment                       } from 'domain/onsitexdomain'                 ;
import { Comment                                             } from 'domain/onsitexdomain'                 ;
import { Employee                                            } from 'domain/onsitexdomain'                 ;
import { ServerService                                       } from 'providers/server-service'       ;
import { CommentService                                      } from 'providers/comment-service'      ;
import { AlertService                                        } from 'providers/alerts'               ;
import { UserData                                            } from 'providers/user-data'            ;

@IonicPage({name: 'Comment'})
@Component({
  selector: 'page-comment',
  templateUrl: 'comment.html',
})
export class CommentPage implements OnInit {
  public Comment   : any      = Comment ;
  public comment   : Comment            ;
  public user      : Employee           ;
  public technician: string   = ""      ;
  public username  : string   = ""      ;
  public subject   : string   = ""      ;
  public message   : string   = ""      ;
  public phone     : any = {
    cordova     : "",
    model       : "",
    platform    : "",
    uuid        : "",
    version     : "",
    manufacturer: "",
    virtual     : "",
    serial      : "",
    uniqueID    : "",
    appName     : "",
    appVersion  : ""
  };
  public timestamp : Moment   = null   ;
  public lang      : any               ;
  public dataReady : boolean  = false  ;

  constructor(
    public navCtrl   : NavController    ,
    public navParams : NavParams        ,
    public viewCtrl  : ViewController   ,
    public platform  : Platform         ,
    public app       : App              ,
    public device    : Device           ,
    // public unique    : UniqueDeviceID   ,
    public version   : AppVersion       ,
    public server    : ServerService    ,
    public translate : TranslateService ,
    public alert     : AlertService     ,
    public ud        : UserData         ,
  ) {
    window["onsitecomments"] = this;
  }

  ngOnInit() {
    Log.l("CommentsPage: ngOnInit() called...");
    this.lang = this.translate.instant(['submitting_comment', 'error', 'could_not_submit_comment', 'success', 'submitted_comment_successfully', 'could_not_read_phone_info']);
    this.comment = new Comment();
    this.checkPhoneInfo();
  }

  public async submitComment() {
    let lang = this.lang;
    let spinnerID:string;
    try {
      let timestamp = moment();
      this.comment.setTimestamp(timestamp);
      spinnerID = await this.alert.showSpinnerPromise(lang['submitting_comment']);
      let res:any = await this.server.saveComment(this.comment);
      Log.l("submitComment(): Saved comment!");
      let out:any = await this.alert.hideSpinnerPromise(spinnerID)
      out = await this.alert.showAlert(lang['success'], lang['submitted_comment_successfully']);
      this.closeCommentPage();
      return res;
    } catch(err) {
      Log.l("submitComment(): Error submitting comment!");
      Log.e(err);
      let out = await this.alert.hideSpinnerPromise(spinnerID);
      // out = await this.alert.showAlert(lang['error'], lang['could_not_submit_comment']);
    }
  }

  public checkPhoneInfo() {
    let lang    = this.lang                ;
    let c       = this.comment             ;
    let profile = this.ud.getTechProfile() ;
    let tech    = new Employee();
    tech.readFromDoc(profile);
    this.user    = tech ;
    let techname = tech.getFullNameNormal();
    c.setTechnician(techname);
    c.setUsername(tech.username);
    this.readPhoneInfo().then(res => {
      return this.getAppVersion();
    }).then(res => {
      Log.l("checkPhoneInfo(): Phone info is fine.");
      c.setPhone(this.phone);
      this.comment = c;
      this.dataReady = true;
    }).catch(err => {
      Log.l("checkPhoneInfo(): Nope.");
      Log.e(err);
      this.comment = c;
      this.alert.showAlert(lang['error'], lang['could_not_read_phone_info']);
      this.dataReady = true;
    });
  }

  public async readPhoneInfo():Promise<any> {
    let phoneinfo;
    try {
      let cordova = this.device.cordova;
      let model = this.device.model;
      let platform = this.device.platform;
      let uuid = this.device.uuid;
      let version = this.device.version;
      let manufacturer = this.device.manufacturer;
      let virtual = this.device.isVirtual;
      let serial = this.device.serial;
      let uniqueID = uuid;
      phoneinfo = {
        cordova     : cordova,
        model       : model,
        platform    : platform,
        uuid        : uuid,
        version     : version,
        manufacturer: manufacturer,
        virtual     : virtual,
        serial      : serial,
        uniqueID    : uniqueID,
      };
      Log.l("readPhoneInfo(): Got phone data:\n", phoneinfo);
      return phoneinfo;
    } catch(err) {
      Log.l("readPhoneInfo(): Error reading phone info!");
      Log.e(err);
      return phoneinfo;
    }
  }

  // public readPhoneInfo() {
  //   return new Promise((resolve, reject) => {
  //     let cordova      = this.device.cordova      ;
  //     let model        = this.device.model        ;
  //     let platform     = this.device.platform     ;
  //     let uuid         = this.device.uuid         ;
  //     let version      = this.device.version      ;
  //     let manufacturer = this.device.manufacturer ;
  //     let virtual      = this.device.isVirtual    ;
  //     let serial       = this.device.serial       ;
  //     let uniqueID     = ""                       ;
  //     this.unique.get().then(res => {
  //       uniqueID = res;
  //       this.phone = {
  //         cordova: cordova,
  //         model: model,
  //         platform: platform,
  //         uuid: uuid,
  //         version: version,
  //         manufacturer: manufacturer,
  //         virtual: virtual,
  //         serial: serial,
  //         uniqueID: uniqueID,
  //       };
  //       resolve(this.phone);
  //     }).catch(err => {
  //       Log.l("readPhoneInfo(): Error reading phone info!");
  //       Log.e(err);
  //       resolve(this.phone);
  //     });
  //   });
  // }

  public getAppVersion() {
    return new Promise((resolve,reject) => {
      this.version.getAppName().then(res => {
        this.phone.appName = res;
        return this.version.getVersionNumber();
      }).then(res => {
        this.phone.appVersion = res;
        resolve({appName: this.phone.appName, appVersion: this.phone.appVersion});
      }).catch(err => {
        Log.l("Error getting app version.");
        Log.e(err);
        resolve(false);
      });
    });
  }

  public closeCommentPage() {
    this.viewCtrl.dismiss();
  }

  public cancel() {
    this.closeCommentPage();
  }

}
