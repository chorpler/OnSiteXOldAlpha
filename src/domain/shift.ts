export class Shift {
  public site_name:string;
  public shift_week:string;
  public shift_time:string = "AM";
  public start_time:string;
  public shift_length:number;
  
  constructor(site_name?, shift_week?, shift_time?, start_time?, shift_length?) {
    this.site_name = site_name || '';
    this.shift_week = shift_week || '';
    this.shift_time = shift_time || 'AM';
    this.start_time = start_time || '';
    this.shift_length = shift_length || -1;
  }

  public readFromDoc(doc) {
    for(let prop in doc) {
      this[prop] = doc[prop];
    }
  }
}