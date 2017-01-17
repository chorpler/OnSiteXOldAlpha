import { Assignment } from './config.interface.techassignment';

export class TechSelection {
  techSelect: string;
  
  constructor(public assignment: Assignment) {
    this.techSelect = 
    this.assignment.clntCmpny + ' ' + 
    this.assignment.locPrimry + ' ' +
    this.assignment.locScndry + ' ' +
    this.assignment.userClass;
  }
}
