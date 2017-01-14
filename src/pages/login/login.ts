import { Component                } from '@angular/core';
import { Http                     } from '@angular/http';
import { NativeStorage            } from 'ionic-native';
import { NavController, NavParams } from 'ionic-angular';
import { Platform                 } from 'ionic-angular';
import { AuthSrvcs                } from '../../providers/auth-srvcs';
import { HomePage                 } from '../home/home';


@Component({
  selector    : 'page-login',
  templateUrl : 'login.html',
  providers   : [AuthSrvcs]
})

export class LoginPage {
    title    : string  = 'Login';
    username : string;
    password : string;
    constructor(public nav: NavController,public navParams: NavParams, public platform: Platform, public http: Http, public _auth: AuthSrvcs) {
    }

    login() {
        // this._auth.login(this.username, this.password)
        // .subscribe( data => { this.nav.setRoot(HomePage); } )
       }
    }
/**
 * 
import { NativeStorage } from 'ionic-native';

NativeStorage.setItem('myitem', {property: 'value', anotherProperty: 'anotherValue'})
  .then(
    () => console.log('Stored item!'),
    error => console.error('Error storing item', error)
  );

NativeStorage.getItem('myitem')
  .then(
    data => console.log(data),
    error => console.error(error)
  );
 */