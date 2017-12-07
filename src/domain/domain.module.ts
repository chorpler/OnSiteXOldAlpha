import { NgModule      } from '@angular/core'       ;
import { Address       } from './address'           ;
import { Employee      } from './employee'          ;
import { Geolocation   } from './geolocation'       ;
import { Jobsite       } from './jobsite'           ;
import { Street        } from './street'            ;
import { Shift         } from './shift'             ;
import { WorkOrder     } from './workorder'         ;
import { ReportOther   } from './reportother'       ;
import { Message       } from './message'           ;
import { Comment       } from './comment'           ;
import { PayrollPeriod } from './payroll-period'    ;

@NgModule({
  declarations: [
    Address,
    Employee,
    Geolocation,
    Jobsite,
    Street,
    Shift,
    WorkOrder,
    ReportOther,
    Message,
    Comment,
    PayrollPeriod,
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
    WorkOrder,
    ReportOther,
    Message,
    Comment,
    PayrollPeriod,
  ]
})
export class DomainModule {}
