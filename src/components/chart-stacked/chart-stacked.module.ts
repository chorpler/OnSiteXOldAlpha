import { NgModule              } from '@angular/core'   ;
import { CommonModule          } from '@angular/common' ;
import { ChartStackedComponent } from './chart-stacked' ;

@NgModule({
  declarations: [
    ChartStackedComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    ChartStackedComponent,
  ]
})
export class ChartStackedComponentModule { }
