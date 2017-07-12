import { Component } from '@angular/core';

/**
 * Generated class for the ClockComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'clock',
  templateUrl: 'clock.html'
})
export class ClockComponent {

  text: string;

  constructor() {
    console.log('Hello ClockComponent Component');
    this.text = 'Hello World';
  }

}
