import { NgModule            } from '@angular/core'       ;
import { IonicPageModule     } from 'ionic-angular'       ;
import { LoginFirst          } from './login-first'       ;
import { TranslateModule     } from '@ngx-translate/core' ;


@NgModule({
  declarations: [
    LoginFirst,
  ],
  imports: [
    IonicPageModule.forChild(LoginFirst),
    TranslateModule.forChild(),
    // TabsComponentModule,
  ],
  exports: [
    LoginFirst,
    // TabsComponentModule,
  ]
})
export class LoginFirstModule {}
