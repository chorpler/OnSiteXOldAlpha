import { NgModule } from '@angular/core';
import { Address } from './address';
import { Employee } from './employee';
import { Geolocation } from './geolocation';
import { Jobsite } from './jobsite';
import { Street } from './street';
import { Shift } from './shift';


@NgModule({
  declarations: [
    Address,
    Employee,
    Geolocation,
    Jobsite,
    Street,
    Shift
  ],
  imports: [

  ],
  exports: [
    Address,
    Employee,
    Geolocation,
    Jobsite,
    Street,
    Shift
  ]
})
export class DomainModule {}
