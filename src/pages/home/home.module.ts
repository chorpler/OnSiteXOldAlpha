import { NgModule } from '@angular/core';
import { HomePage } from './home';
import { IonicPageModule } from 'ionic-angular';
import { Http } from '@angular/http';
import { TabsComponentModule } from '../../components/tabs/tabs.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { createTranslateLoader } from '../../config/customTranslateLoader';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [HomePage],
  imports: [
    IonicPageModule.forChild(HomePage),
    PipesModule,
    TabsComponentModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
      }
    }),
  // ],
  // entryComponents: [
  //   HomePage
  ],
  exports: [
    HomePage,
    TabsComponentModule,
   ]
})
export class HomePageModule { }
