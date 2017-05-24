import { Injectable, NgZone } from '@angular/core'              ;
import { Http               } from '@angular/http'              ;
import { Log, CONSOLE       } from '../config/config.functions' ;
import { Storage            } from '@ionic/storage'             ;
import { NativeStorage      } from 'ionic-native'               ;
import 'rxjs/add/operator/map'                                  ;
import { Network            } from '@ionic-native/network'      ;
import { AlertsProvider     } from './alerts'                   ;

@Injectable()
/**
 * @class NetworkStatus
 *        
 */
export class NetworkStatus {

  public static isOnline: boolean = true;
  public static isWiFi  : boolean = true;
  public static network : any;

  constructor(public net: Network) {
    window['netSrvc'] = this;
    NetworkStatus.network = net;
  }

  public static watchForDisconnect() {
    let disconnect = NetworkStatus.network.onDisconnect().subscribe(() => {
      Log.l('Network disconnected');
      NetworkStatus.isOnline = false;
      NetworkStatus.isWiFi = false;
      setTimeout(() => {
        disconnect.unsubscribe();
        NetworkStatus.watchForConnection();
      }, 2000);
    });
  }

  public static getNetworkType() {
    return NetworkStatus.network.type;    
  }

  public static isConnected() {
    if(NetworkStatus.network.type == 'wifi') {
      NetworkStatus.isOnline = true;
      NetworkStatus.isWiFi = true;
      return true;
    } else if(this.network.type != 'none') {
      NetworkStatus.isOnline = true;
      NetworkStatus.isWiFi = false;
      return true;
    } else {
      NetworkStatus.isOnline = false;
      NetworkStatus.isWiFi = false;
      return false;
    }
  }

  // disconnectSubscription.unsubscribe();
  // watch network for a disconnect

  // stop disconnect watch

  public static watchForConnection() {
    // watch network for a connection
    let connectSubscription = NetworkStatus.network.onConnect().subscribe(() => {
      Log.l('network connected!');
      // We just got a connection but we need to wait briefly
       // before we determine the connection type.  Might need to wait 
      // prior to doing any api requests as well.
      setTimeout(() => {
        NetworkStatus.isOnline = true;
        if (NetworkStatus.network.type === 'wifi') {
          NetworkStatus.isWiFi = true;
          console.log('we got a wifi connection, woohoo!');
          // // stop connect watch
          connectSubscription.unsubscribe();
          NetworkStatus.watchForDisconnect();
        }
      }, 3000);
    }); 
  }

}
