import { Injectable          } from '@angular/core'                  ;
import { Platform, App       } from 'ionic-angular'                  ;
import { Device              } from '@ionic-native/device'           ;
// import { UniqueDeviceID      } from '@ionic-native/unique-device-id' ;
import { HttpClient          } from '@angular/common/http'           ;
import { Log, moment, Moment } from 'domain/onsitexdomain'                 ;
import { AlertService        } from 'providers/alerts'               ;
import { Employee            } from 'domain/onsitexdomain'                 ;
import { Comment             } from 'domain/onsitexdomain'                 ;
import { UserData            } from 'providers/user-data'            ;


@Injectable()
export class CommentService {
  public comment:Comment = null;
  public technician: string = "";
  public username: string = "";
  public subject: string = "";
  public message: string = "";
  public phone: any = {
    cordova: "",
    model: "",
    platform: "",
    uuid: "",
    version: "",
    manufacturer: "",
    virtual: "",
    serial: "",
    uniqueID: "",
  };
  public timestamp: Moment = null;

  constructor(
    // public unique   : UniqueDeviceID ,
    public platform : Platform       ,
    public app      : App            ,
    public device   : Device         ,
    public alert    : AlertService   ,
    public ud       : UserData       ,
  ) {
    Log.l('Hello CommentProvider Provider');
    this.checkPhoneInfo();
  }

  public getComment() {
    return this.comment;
  }

  public setComment(comment:Comment) {
    this.comment = comment;
    return this.comment;
  }

  public setSubject(subject:string) {
    this.comment.setSubject(subject);
  }

  public setMessage(message:string) {
    this.comment.setMessage(message);
  }

  public setTimestamp(timestamp:Moment) {
    this.comment.setTimestamp(timestamp);
  }

  public checkPhoneInfo() {
    this.readPhoneInfo().then(res => {
      Log.l("checkPhoneInfo(): Phone info is fine.");
      let c = new Comment();
      let profile = this.ud.getTechProfile();
      let tech = new Employee();
      tech.readFromDoc(profile);
      let techname = tech.getFullNameNormal();
      c.setTechnician(techname);
      c.setUsername(tech.username);
      c.setPhone(this.phone);
      this.comment = c;
    }).catch(err => {
      Log.l("checkPhoneInfo(): Nope.");
      Log.e(err);
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
      this.phone = phoneinfo;
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
  //     let cordova = this.device.cordova;
  //     let model = this.device.model;
  //     let platform = this.device.platform;
  //     let uuid = this.device.uuid;
  //     let version = this.device.version;
  //     let manufacturer = this.device.manufacturer;
  //     let virtual = this.device.isVirtual;
  //     let serial = this.device.serial;
  //     let uniqueID = "";
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
  //     });
  //   });
  // }
}
