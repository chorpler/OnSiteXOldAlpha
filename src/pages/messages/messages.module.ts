import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MessagesPage } from './messages';
import { TabsComponentModule } from '../../components/tabs/tabs.module';
import { Http } from '@angular/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { createTranslateLoader } from '../../config/customTranslateLoader';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    MessagesPage,
  ],
  imports: [
    PipesModule,
    TabsComponentModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
      }
    }),
    IonicPageModule.forChild(MessagesPage)
  ],
  exports: [
    MessagesPage,
    TabsComponentModule
  ]
})
export class MessagesPageModule {}
