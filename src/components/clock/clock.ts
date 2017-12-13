import { Component, Input, OnInit, OnDestroy,       } from '@angular/core'                ;
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
export class ClockComponent implements OnInit,OnDestroy {
  @Input('start') start: number;
  public get zoomFactor():number { return this.getZoom(); };
  // public get clockStyle():any { return {get zoom() { return this.zoomFactor; } };
  public clockStyle:any = { get zoom():number { return this.getZoom() } };
  public width:number = 360;
  public minWidth:number = 360;
  public intervalHandles:Array<number> = [];
  public timeoutHandle:any;
  public timer:number = 1000;
  public now  :Moment = moment()                        ;
  // public hands:any    = UserData.getClockHands(this.now);
  public hours:number = 0;
  public minutes:number = 0;
  public seconds:number = 0;
  constructor() {
    Log.l('Hello ClockComponent Component');
    window['onsiteclockcomponent'] = this;
    // Log.l("ClockComponent: hands is: ", this.hands);
  }

  ngOnInit() {
    Log.l("ClockComponent: ngOnInit() fired");
    this.startClock();
  }

  ngOnDestroy() {
    Log.l("ClockComponent: ngOnDestroy() fired");
    this.stopClock();
  }

  public getZoom():number {
    // this.width = document && document.documentElement && document.documentElement.clientWidth ? document.documentElement.clientWidth : this.width;
    this.width = document.documentElement.clientWidth;
    if(this.width < this.minWidth) {
      return (this.width / this.minWidth);
    } else {
      return 1;
    }
  }

  public startClock(time?:Moment|Date) {
    let now = time ? moment(time) : moment();
    this.setTimeHands(now);
    let intervalHandle;
    if(this.intervalHandles.length !== 0) {
      this.stopAllClocks();
    }
    intervalHandle = setInterval(() => {
      let time = moment();
      this.setTimeHands(time);
    }, this.timer);
    this.intervalHandles.push(intervalHandle);
  }

  public stopClock() {
    this.stopAllClocks();
    if (this.timeoutHandle) {
      clearTimeout(this.timeoutHandle);
    }
    Log.l("stopClock(): Clock stopped.");
  }

  public stopAllClocks() {
    for(let handle of this.intervalHandles) {
      clearInterval(handle);
    }
  }

  public restartClock() {
    Log.l("restartClock(): Restarting clock....");
    this.stopClock();
    this.startClock();
  }

  public setTimeHands(time?:Moment|Date) {
    let timoutSececonds: number;
    let i:number;
    let now = time ? moment(time) : moment();
    Log.l("setTimeHands(): setting to '%s'", now.format("HH:mm:ss"));
    let hours = now.format("hh");
    let minutes = now.format("mm");
    let seconds = now.format("ss.SSS");
    let hrs = Number(hours);
    let min = Number(minutes);
    let sec = Number(seconds);
    let s = sec * 6;
    let m = (min * 6) + (s / 60);
    let h = 30 * ((hrs % 12) + (min / 60));
    this.hours = h;
    this.minutes = m;
    this.seconds = s;
  }


  public rotate(deg:number) {
    let res = `rotate(${deg}deg)`;
    return res;
  }

}
