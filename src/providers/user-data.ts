import { Injectable             } from '@angular/core'      ;
import { Events, Platform       } from 'ionic-angular'      ;
import { Storage                } from '@ionic/storage'     ;
import { NativeStorage          } from 'ionic-native'       ;
import { DBSrvcs                } from './db-srvcs'         ;
import { Shift                  } from '../domain/shift'    ;
import { WorkOrder              } from '../domain/workorder';

@Injectable()
export class UserData {
  public static _favorites: string[] = [];
  public static HAS_LOGGED_IN = 'hasLoggedIn';
  public static HAS_SEEN_TUTORIAL = 'hasSeenTutorial';
  public static shift: Shift;
  public static workOrderList: Array<WorkOrder>;
  public static current_shift_hours: any;
  public static circled_numbers:Array<string>;
  public static circled_numbers_chars: Array<string> = ["⓵", "⓶", "⓷", "⓸", "⓹", "⓺", "⓻", "⓼", "⓽"];
  public static userLoggedIn:boolean = false;

  constructor(public events: Events, public storage: Storage, public platform: Platform) { }

  getPlatforms() {
  	return this.platform.platforms();
  }

  getPlatform() {
  	let p = this.platform;
  	return p.is('ios') ? 'ios' : p.is('android') ? 'android' : (p.is('windows') && p.is('mobile')) ? 'winphone' : 'nonphone';
  }

  getShift():Shift {
    return UserData.shift;
  }

  setShift(shift:Shift) {
    UserData.shift = shift;
  }

  getWorkOrderList():Array<WorkOrder> {
    return UserData.workOrderList;
  }

  setWorkOrderList(list:Array<WorkOrder>) {
    UserData.workOrderList = list;
  }

  getWorkOrdersForShift(serial:string):Array<WorkOrder> {
    let result = [];
    for(let wo of UserData.workOrderList) {
      if(wo.shift_serial === serial) {
        result.push(wo);
      }
    }
    return result;
  }

}
