import { Component } from '@angular/core';

/*
  Generated class for the OnSiteOption component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'on-site-option',
  templateUrl: 'on-site-option.html'
})
export class OnSiteOptionComponent {

  text: string;

  constructor() {
    console.log('Hello OnSiteOption Component');
    this.text = 'Hello World';
  }

}
