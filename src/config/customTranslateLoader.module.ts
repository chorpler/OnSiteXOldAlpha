import { NgModule } from '@angular/core';
import { Http } from '@angular/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { createTranslateLoader } from './customTranslateLoader';

@NgModule({
  declarations: [],
  imports: [
    // createTranslateLoader,
  ],
  exports: [
    // createTranslateLoader
  ]
})
export class CustomTranslateLoaderModule { }
