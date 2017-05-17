import { Injectable             } from '@angular/core'  ;
import { Events, Platform       } from 'ionic-angular'  ;
import { Storage                } from '@ionic/storage' ;
import { NativeStorage          } from 'ionic-native'   ;
import { DBSrvcs                } from './db-srvcs'     ;


@Injectable()
export class UserData {
  _favorites: string[] = [];
  HAS_LOGGED_IN = 'hasLoggedIn';
  HAS_SEEN_TUTORIAL = 'hasSeenTutorial';

  constructor(public events: Events, public storage: Storage, public platform: Platform) {

  }

  getPlatforms() {
  	return this.platform.platforms();
  }

  getPlatform() {
  	let p = this.platform;
  	return p.is('ios') ? 'ios' : p.is('android') ? 'android' : (p.is('windows') && p.is('mobile')) ? 'winphone' : 'nonphone';
  }

}
