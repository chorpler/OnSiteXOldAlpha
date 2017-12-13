// import { createTranslateLoader } from './customTranslateLoader';
import { NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
// import { Http } from '@angular/http';
// import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
// import { TranslateHttpLoader } from '@ngx-translate/http-loader';
// import { createTranslateLoader } from './customTranslateLoader';
import { createTranslateLoader } from './customTranslateLoader';

@NgModule({
  declarations: [],
  imports: [
    HttpClientModule,
    // createTranslateLoader,
    // createJSON5TranslateLoader,
  ],
  exports: [
    // createTranslateLoader
  ]
})
export class CustomTranslateLoaderModule { }
