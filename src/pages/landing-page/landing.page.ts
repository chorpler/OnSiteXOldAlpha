import { Component                          } from '@angular/core'                 ;
import { FormGroup, Validators, FormBuilder } from "@angular/forms"                ;
import { NavController                      } from 'ionic-angular'                 ;
import { EmailValidator                     } from '../../config/validators'       ;
import { PostTmpUser                        } from '../../providers/post.tmp.user' ;

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
    this._postusr.createTmpUser(formData)
      .subscribe(
        data  => console.log( data  ),
        error => console.log( error )
      );
  }
}
// /src/pages/acct-setup-page/acct.setup.page.ts
