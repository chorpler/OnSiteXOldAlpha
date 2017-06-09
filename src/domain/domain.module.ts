import { NgModule } from '@angular/core';
import { Address } from './address';
import { Employee } from './employee';
import { Geolocation } from './geolocation';
import { Jobsite } from './jobsite';
import { Street } from './street';
import { Shift } from './shift';
import { WorkOrder } from './workorder';


@NgModule({
  declarations: [
    Address,
    Employee,
    Geolocation,
    Jobsite,
    Street,
    Shift,
    WorkOrder
  ],
  imports: [

  ],
  exports: [
    Address,
    Employee,
    Geolocation,
    Jobsite,
    Street,
    Shift,
    WorkOrder
  ]
})
export class DomainModule {}
