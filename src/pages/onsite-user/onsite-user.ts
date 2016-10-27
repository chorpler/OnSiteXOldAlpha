import { Component                          } from '@angular/core'                   ;
import { NavController                      } from 'ionic-angular'                   ;
import { AuthService                        } from '../../directives/auth.service'   ;
import { FormGroup, FormControl, Validators } from "@angular/forms"                  ;
import { User                               } from "../../models/user.model"         ;
import { OnsiteLogin                        } from '../onsite-login/onsite-login'    ;

@Component({
  selector: 'page-onsite-user',
  templateUrl: 'onsite-user.html'
})
export class OnSiteXUser {
  myForm: FormGroup;

    constructor(public navCtrl: NavController, private authService: AuthService) {}

    onSubmit() {
        const user = new User(
            this.myForm.value.email,
            this.myForm.value.password,
            this.myForm.value.firstName,
            this.myForm.value.lastName
        );
        this.authService.signup(user)
            .subscribe(
                data => console.log(data),
                error => console.error(error),
                this.navCtrl.push(OnsiteLogin)
            );
        this.myForm.reset();
    }

    ngOnInit() {
        this.myForm = new FormGroup({
            firstName: new FormControl(null, Validators.required),
            lastName: new FormControl(null, Validators.required),
            email: new FormControl(null, [
                Validators.required,
                Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
            ]),
            password: new FormControl(null, Validators.required)
        });
    }
}
