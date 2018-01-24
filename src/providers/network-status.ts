// import { HttpClient,        } from '@angular/common/http'         ;
// import { Storage            } from '@ionic/storage'               ;
// import { NativeStorage      } from '@ionic-native/native-storage' ;
import { Subject            } from 'rxjs/Subject'                 ;
import { Subscription       } from 'rxjs/Subscription'            ;
import { Observable         } from 'rxjs/Observable'              ;
import { Injectable, NgZone } from '@angular/core'                ;
import { Log, CONSOLE       } from 'onsitex-domain'      ;
import { Network            } from '@ionic-native/network'        ;
import { AlertService       } from './alerts'                     ;
import { UserData           } from './user-data'                  ;

declare var navigator:any;
@Injectable()
export class NetworkStatus {
  public isOnline: boolean = true;
  public isWiFi  : boolean = true;
  public network : any;
  public disconnectSubscription:Subscription;
  public connectSubscription:Subscription;
  public changeSubscription:Subscription;
  public networkDisconnect:Subject<any> = new Subject<any>();
  public networkConnect:Subject<any> = new Subject<any>();

  constructor(public net: Network, public alert:AlertService, public ud:UserData) {
    Log.l("NetworkStatus constructor called");
    window['netSrvc'] = this;
    // NetworkStatus.network = net;
    this.initializeSubscriptions();
    this.checkInitialConnection();
  }

  public initializeSubscriptions() {
    if(window['cordova'] && this.net && this.net.type) {
      let disconnect = this.net.onDisconnect().subscribe(() => {
        Log.l('Network disconnected');
        this.isOnline = false;
        this.isWiFi = false;
        this.ud.isOnline = false;
        this.ud.isWiFi = false;
        this.networkDisconnect.next(true);
        // setTimeout(() => {
          //   disconnect.unsubscribe();
          //   NetworkStatus.watchForConnection();
          // }, 2000);
        });
        let connect = this.net.onConnect().subscribe(() => {
          Log.l("Network connected");
          this.isOnline = true;
          this.isWiFi = this.net.type === 'wifi' || this.net.type === 'ethernet';
          this.ud.isOnline = true;
          this.ud.isWiFi = this.isWiFi;
          this.networkConnect.next(true);
      });
      this.disconnectSubscription = disconnect;
      this.connectSubscription = connect;
    }
  }

  public stopSubscriptions() {
    if(window['cordova'] && this.net && this.net.type) {
      if(this.disconnectSubscription && !this.disconnectSubscription.closed) {
        this.disconnectSubscription.unsubscribe();
      }
      if(this.connectSubscription && !this.connectSubscription.closed) {
        this.connectSubscription.unsubscribe();
      }
    }
  }

  public checkInitialConnection() {
    if(this.isConnected()) {
      this.ud.isOnline = true;
    }
    // if(this.net && this.net.type && this.net.type === 'wifi') {
    //   this.ud.isWiFi = true;
    // }

  }

  public getNetworkType() {
    return this.net.type;
  }

  public isConnected() {
    if(window && window['cordova'] && window.navigator) {
      Log.l("isConnected(): window['cordova'] found, checking Network plugin.\n", window['cordova']);
      if(this.net.type === 'wifi') {
        this.isOnline = true;
        this.isWiFi = true;
        return true;
      } else if(this.net.type !== 'none') {
        this.isOnline = true;
        this.isWiFi = false;
        return true;
      } else {
        this.isOnline = false;
        this.isWiFi = false;
        return false;
      }
    } else if(navigator.onLine) {
      Log.l("isConnected(): window['cordova'] not found, checking window.navigator instead.");
      this.isOnline = true;
      this.isWiFi = false;
      if(navigator && navigator.connection && navigator.connection.effectiveType) {
        if(navigator.connection.effectiveType === '4g') {
          this.isWiFi = true;
        } else {
          this.isWiFi = true;
        }
      }
      return true;
    }
  }

  // disconnectSubscription.unsubscribe();
  // watch network for a disconnect

  // stop disconnect watch

  // public watchForConnection() {
  //   // watch network for a connection
  //   let connectSubscription = this.net.onConnect().subscribe(() => {
  //     Log.l('network connected!');
  //     // We just got a connection but we need to wait briefly
  //      // before we determine the connection type.  Might need to wait
  //     // prior to doing any api requests as well.
  //     setTimeout(() => {
  //       this.isOnline = true;
  //       if (this.net.type === 'wifi') {
  //         this.isWiFi = true;
  //         console.log('we got a wifi connection, woohoo!');
  //         // // stop connect watch
  //         connectSubscription.unsubscribe();
  //         // this.watchForDisconnect();
  //       }
  //     }, 3000);
  //   });
  // }

}
