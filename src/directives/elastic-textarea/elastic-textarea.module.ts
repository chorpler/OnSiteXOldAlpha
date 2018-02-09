import { NgModule } from '@angular/core';

import { ElasticTextDirective } from './elastic-textarea';

@NgModule({
  declarations: [
    ElasticTextDirective,
  ],
  exports: [
    ElasticTextDirective,
  ]
})
export class ElasticTextDirectiveModule { }
