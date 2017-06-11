import { Injectable             } from '@angular/core'  ;
import { Events, Platform       } from 'ionic-angular'  ;
import { Storage                } from '@ionic/storage' ;
import { NativeStorage          } from 'ionic-native'   ;
import { DBSrvcs                } from './db-srvcs'     ;
import { Shift                  } from '../domain/shift';

@Injectable()
export class UserData {
  static _favorites: string[] = [];
  static HAS_LOGGED_IN = 'hasLoggedIn';
  static HAS_SEEN_TUTORIAL = 'hasSeenTutorial';
  public static shift: any;
  public static current_shift_hours: any;
  public static circled_numbers:Array<string>;
  public static circled_numbers_chars: Array<string> = ["⓵", "⓶", "⓷", "⓸", "⓹", "⓺", "⓻", "⓼", "⓽"];

  constructor(public events: Events, public storage: Storage, public platform: Platform) { }

  getPlatforms() {
  	return this.platform.platforms();
  }

  getPlatform() {
  	let p = this.platform;
  	return p.is('ios') ? 'ios' : p.is('android') ? 'android' : (p.is('windows') && p.is('mobile')) ? 'winphone' : 'nonphone';
  }

  getShift() {
    return UserData.shift;
  }

  setShift(shift:Shift) {
    UserData.shift = shift;
  }
}
