import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
// import { PipesModule } from '../../pipes/pipes.module';
import { FancySelectPage } from './fancy-select';
import { TranslateModule } from '@ngx-translate/core';
// import { TabsComponentModule } from '../../components/tabs/tabs.module';


@NgModule({
  declarations: [
    FancySelectPage,
  ],
  imports: [
    IonicPageModule.forChild(FancySelectPage),
    TranslateModule.forChild(),
    // PipesModule
    // TabsComponentModule,
  ],
  exports: [
    FancySelectPage,
    // TabsComponentModule,
  ]
})
export class FancySelectPageModule {}
