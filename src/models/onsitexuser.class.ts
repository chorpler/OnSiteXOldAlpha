export class OnSiteXUser {
  constructor(public firstName: string,
    public lastName: string,
    public name: string,
    public SESAemail: string,
    public password: string) { this.name = this.lastName + ', ' + this.firstName; }
}
