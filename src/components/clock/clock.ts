import { Component, Input                           } from '@angular/core'                ;
import { trigger, state, style, animate, transition } from '@angular/animations'          ;
import { UserData                                   } from '../../providers/user-data'    ;
import { Log, moment, Moment, isMoment              } from '../../config/config.functions';
@Component({
  selector: 'clock',
  templateUrl: 'clock.html',
  // animations: [
  //   trigger('hourHandState', [
  //     state('inactive', style({
  //       transform: 'rotate(0)',
  //     })),
  //     state('active', style({
  //       transform: 'rotate()',
  //       // transform: 'scale(1.1)'
  //     })),
  //     transition('inactive => active', animate('100ms ease-in')),
  //     transition('active => inactive', animate('100ms ease-out'))
  //   ])
  // ]
})
export class ClockComponent {
  @Input('start') start: number;
  public now  :Moment = moment()                        ;
  public hands:any    = UserData.getClockHands(this.now);

  constructor() {
    Log.l('Hello ClockComponent Component');
    // Log.l("ClockComponent: hands is: ", this.hands);
  }

  public rotate(deg:number) {
    let res = `rotate(${deg}deg)`;
    return res;
  }

  rotateLoop() {
    let timoutSececonds: number;
    let i:number;
    for (i=1; i = 0; i--) {
      if (i === 1) {
        // rotate all hands to proper degrees and start animation
        setTimeout(timoutSececonds);
      }
      if (i === 0 ) {
        // run animation...
      }
    }
  }

}
