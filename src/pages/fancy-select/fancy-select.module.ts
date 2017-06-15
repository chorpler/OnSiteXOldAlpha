import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
// import { PipesModule } from '../../pipes/pipes.module';
import { FancySelectPage } from './fancy-select';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    FancySelectPage,
  ],
  imports: [
    IonicPageModule.forChild(FancySelectPage),
    TranslateModule.forChild(),
    // PipesModule
  ],
  exports: [
    FancySelectPage
  ]
})
export class FancySelectPageModule {}
