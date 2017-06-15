import { NgModule } from '@angular/core';
import { HomePage } from './home';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [HomePage],
  imports: [
    IonicPageModule.forChild(HomePage),
    TranslateModule.forChild(),
  ],
  entryComponents: [
    HomePage
  ],
  exports: [ HomePage ]
})
export class HomePageModule { }