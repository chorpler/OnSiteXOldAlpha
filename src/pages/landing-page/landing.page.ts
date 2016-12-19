import { Component                          } from '@angular/core'                 ;
import { FormGroup, Validators, FormBuilder } from "@angular/forms"                ;
import { NavController                      } from 'ionic-angular'                 ;
import { EmailValidator                     } from '../../config/validators'       ;
import { PostTmpUser                        } from '../../providers/post.tmp.user' ;
import { OnSiteXStorage                     } from '../../providers/secure.storage';

@Component({
  selector: 'landing-page',
  templateUrl: 'landing.page.html'
})
export class LandingPage {
  data     : any;
  myForm   : FormGroup;
  username : string;
  email    : string;
  password : string;

  //  private _sStore     : OnSiteXStorage,
  constructor( private _formBuilder: FormBuilder,
               private _postusr    : PostTmpUser,
               public  ss          : OnSiteXStorage,
               public  navCtrl     : NavController   ) {
    
    this.acctCreateForm();
  
  }

  acctCreateForm() {
    this.myForm = this._formBuilder.group({
      'username': ['', Validators.required                                      ],
      'email'   : ['', [Validators.required, Validators.pattern(EmailValidator)]],
      'password': ['', Validators.required                                      ]
    })
  }

  onSubmit(formData: any) {
    const userStor = 'OnSiteUser';
    this.ss.ssCreate(userStor);
    this.ss.ssSet('username', formData.username);
    this.ss.ssSet('email', formData.email);
    this.ss.ssSet('password', formData.password);

    this._postusr.createTmpUser(formData)
      .subscribe(
        data  => console.log( data  ),
        error => console.log( error )
      );
  }
}
// /src/pages/acct-setup-page/acct.setup.page.ts
