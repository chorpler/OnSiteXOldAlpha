import { NgModule } from '@angular/core';
import { OrderBy } from "./orderby";
import { SafePipe } from './safe';

@NgModule({
  declarations: [
    SafePipe,
    OrderBy,
  ],
  imports: [

  ],
  exports: [
    SafePipe,
    OrderBy,
  ]
})
export class PipesModule { }
