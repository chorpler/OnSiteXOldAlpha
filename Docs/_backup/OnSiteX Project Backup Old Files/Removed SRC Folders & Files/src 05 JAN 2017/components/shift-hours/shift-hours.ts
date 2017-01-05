import { Component } from '@angular/core';
import { SHIFTHRS } from '../../config/config.constants.shift';

@Component({
  selector: 'shift-hours',
  templateUrl: 'shift-hours.html'
})
export class ShiftHoursComponent {

  text: string;
  shiftHrsSel: Array<number> = SHIFTHRS;
  shiftHrs   : number;

  constructor() {
    console.log('Hello ShiftHours Component');
  }

}
