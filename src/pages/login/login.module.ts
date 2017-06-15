import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Login } from './login';
import { TranslateModule } from '@ngx-translate/core';
import { TabsComponentModule } from '../../components/tabs/tabs.module'


@NgModule({
  declarations: [
    Login,
  ],
  imports: [
    IonicPageModule.forChild(Login),
    TranslateModule.forChild(),
    TabsComponentModule,
  ],
  exports: [
    Login,
    TabsComponentModule,
  ]
})
export class LoginModule {}
