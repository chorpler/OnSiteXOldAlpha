import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MessageListPage } from './message-list';
import { TabsComponentModule } from '../../components/tabs/tabs.module';
import { Http } from '@angular/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { createTranslateLoader } from '../../config/customTranslateLoader';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    MessageListPage,
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
    IonicPageModule.forChild(MessageListPage)
  ],
  exports: [
    MessageListPage,
    TabsComponentModule
  ]
})
export class MessageListPageModule {}
