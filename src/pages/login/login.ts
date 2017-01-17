import { Component                } from '@angular/core';
import { Http                     } from '@angular/http';
import { NativeStorage            } from 'ionic-native';
import { NavController, NavParams } from 'ionic-angular';
import { Platform                 } from 'ionic-angular';
import { AuthSrvcs                } from '../../providers/auth-srvcs';
import { HomePage                 } from '../home/home';
import { FormBuilder, FormGroup   } from '@angular/forms';
import { AbstractControl          } from '@angular/forms';


@Component({
  selector    : 'page-login',
  templateUrl : 'login.html',
  providers   : [AuthSrvcs]
})

export class LoginPage {
    title      : string           = 'Login'; 
    username   : AbstractControl  ; 
    password   : AbstractControl  ; 
    onSiteLogin: FormGroup        ; 
    idPrefix   = "org.couchdb.user:"      ; 
    docId      : string           ; 

    OSXuserLogin = {
      username: '',
      password: ''
    };

    constructor(  public nav: NavController,
                  public navParams: NavParams, 
                  public platform: Platform, 
                  public http: Http, 
                  public _auth: AuthSrvcs,
                  public fb: FormBuilder) {
       
      this.onSiteLogin = fb.group({
        'username': [''],
        'password': [''] 
      });

      this.username = this.onSiteLogin.controls['username'];
      this.password = this.onSiteLogin.controls['password'];
    }

    onSubmit(docId, OSXuserLogin: { username, password } ) {
      this.OSXuserLogin = OSXuserLogin;
      this.docId = this.idPrefix + this.username;
      console.log('Form Input' + this.OSXuserLogin);
      this._auth.login();
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

  { FormBuilder, FormGroup }
 */