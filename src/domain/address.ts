import { Street } from './street';

export class Address {
  public street:Street;
  public street1:string;
  public street2:string;
  public city:string;
  public state:string;
  public zip:string;

  constructor(inStreet:Street, inCity:string, inState:string, inZip:string) {
    this.street = inStreet;
    this.city = inCity;
    this.state = inState;
    this.zip = inZip;
  }

  public toString() {
    let outStreet = this.street.toString();
    let outString = `${outStreet}\n${this.city} ${this.state} ${this.zip}`;
    return outString;
  }
}