import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PipesModule } from '../../pipes/pipes.module';
import { FancySelectPage } from './fancy-select';

@NgModule({
  declarations: [
    FancySelectPage,
  ],
  imports: [
    IonicPageModule.forChild(FancySelectPage),
    PipesModule
  ],
  exports: [
    FancySelectPage
  ]
})
export class FancySelectPageModule {}
