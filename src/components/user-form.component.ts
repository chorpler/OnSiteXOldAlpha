import { Component, OnInit                  } from "@angular/core"              ;
import { OnSiteXUser                        } from '../models/onsitexuser.class';
import { FormGroup, FormControl, Validators } from "@angular/forms"             ;
import { AuthSrvc                           } from '../providers/auth.srvc';

@Component({
  selector: 'user-form',
  templateUrl: 'user-form.component.html'
})
export class UserFormComponent implements OnInit {

  onSiteUserForm: FormGroup;
  onSiteUser = new OnSiteXUser(
            this.onSiteUserForm.value.email,
            this.onSiteUserForm.value.password,
            this.onSiteUserForm.value.firstName,
            this.onSiteUserForm.value.lastName
        );

  constructor(private _authSrvc: AuthSrvc) {
    console.log('Hello UserComponent Component');
  }

  onSubmit() {
    this._authSrvc.signup(this.onSiteUser)
        .subscribe(
            data => console.log(data),
            error => console.error(error)
        );
    this.onSiteUserForm.reset();
  };

  // TODO: Remove this when we're done
  get diagnostic() { return JSON.stringify(this.onSiteUser); }

  ngOnInit() {
    this.onSiteUserForm = new FormGroup({
          firstName: new FormControl(null, Validators.required),
          lastName:  new FormControl(null, Validators.required),
          email:     new FormControl(null, [
              Validators.required,
              Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
          ]),
          password:  new FormControl(null, Validators.required)
        });
  }

}
// /src/components/user.component.ts
