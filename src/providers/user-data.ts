import { Injectable             } from '@angular/core'  ;
import { Events, Platform       } from 'ionic-angular'  ;
import { Storage                } from '@ionic/storage' ;
import { NativeStorage          } from 'ionic-native'   ;
import { DBSrvcs                } from './db-srvcs'     ;
import { Shift                  } from '../domain/shift';

@Injectable()
export class UserData {
  _favorites: string[] = [];
  HAS_LOGGED_IN = 'hasLoggedIn';
  HAS_SEEN_TUTORIAL = 'hasSeenTutorial';
  public shift: any;
  public current_shift_hours: any;

  constructor(public events: Events, public storage: Storage, public platform: Platform) {

  }

  getPlatforms() {
  	return this.platform.platforms();
  }

  getPlatform() {
  	let p = this.platform;
  	return p.is('ios') ? 'ios' : p.is('android') ? 'android' : (p.is('windows') && p.is('mobile')) ? 'winphone' : 'nonphone';
  }

  getShift() {
    return this.shift;
  }

  setShift(shift:Shift) {
    this.shift = shift;
  }

}
