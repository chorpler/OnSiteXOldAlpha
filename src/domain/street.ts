export class Street {
  public street1:string;
  public street2:string = null;

  constructor(inStreet1:string, inStreet2?:string) {
    this.street1 = inStreet1;
    if(inStreet2) {
      this.street2 = inStreet2;
    }
  }

  toString() {
    let outString = '';
    if(this.street2 != null) {
      outString = `${this.street1}\n${this.street2}`;
    } else {
      outString = `${this.street1}`;
    }
    return outString;
  }
}