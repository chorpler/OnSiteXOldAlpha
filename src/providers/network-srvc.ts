import { Injectable, NgZone } from '@angular/core'              ;
import { Http               } from '@angular/http'              ;
import { Log, CONSOLE       } from '../config/config.functions' ;
import { Storage            } from '@ionic/storage'             ;
import { NativeStorage      } from 'ionic-native'               ;
import 'rxjs/add/operator/map'                                  ;
import { Network            } from '@ionic-native/network'      ;

@Injectable()
/**
 * @class NetworkStatus
 *        
 */
export class NetworkStatus {

  public static isOnline: boolean = true;
  public static isWiFi  : boolean = true;

constructor(private network: Network) {
  window['netSrvc'] = this;
}

watchForDisconnect() {
  let disconnect = this.network.onDisconnect().subscribe(() => {
    Log.l('Network disconnected');
    NetworkStatus.isOnline = false;
    NetworkStatus.isWiFi = false;
  });
}

isConnected() {
  if(this.network.type == 'wifi') {
    NetworkStatus.isOnline = true;
    NetworkStatus.isWiFi = true;
    return true;
  } else {
    return false;
  }
}

// disconnectSubscription.unsubscribe();
// watch network for a disconnect

// stop disconnect watch

watchForConnection() {
  // watch network for a connection
  let connectSubscription = this.network.onConnect().subscribe(() => {
    console.log('network connected!'); 
    // We just got a connection but we need to wait briefly
     // before we determine the connection type.  Might need to wait 
    // prior to doing any api requests as well.
    setTimeout(() => {
      if (this.network.type === 'wifi') {
        console.log('we got a wifi connection, woohoo!');
        // // stop connect watch
        // connectSubscription.unsubscribe();
      }
    }, 3000);
  });
 
}


}
