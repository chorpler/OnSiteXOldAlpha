import { Component                          } from '@angular/core'                   ;
import { NavController                      } from 'ionic-angular'                   ;
import { AuthService                        } from '../../directives/auth.service'   ;
import { FormGroup, FormControl, Validators } from "@angular/forms"                  ;
import { User                               } from "../../models/user.model"         ;
import { TechHome                           } from '../tech-home/tech-home'          ;

//  /src/services/auth.service.ts
@Component({
  selector: 'page-onsite-login',
  templateUrl: 'onsite-login.html'
})
export class OnsiteLogin {
  myForm: FormGroup;

  constructor(public navCtrl: NavController, private authService: AuthService) {}

  onSubmit() {
        const user = new User(this.myForm.value.email, this.myForm.value.password);
        this.authService.signin(user)
            .subscribe(
                data => {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('userId', data.userId);
                    this.navCtrl.push(TechHome);
                },
                error => console.error(error)
            );
        this.myForm.reset();
    }

    ngOnInit() {
        this.myForm = new FormGroup({
            email: new FormControl(null, [
                Validators.required,
                Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
            ]),
            password: new FormControl(null, Validators.required)
        });
    }

  ionViewDidLoad() {
    console.log('Hello OnsiteLogin Page');
  }

}
