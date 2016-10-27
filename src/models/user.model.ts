import { UsrCLASS, LOC_CITY, LOC_SCNDRY, CLNT_CMPNY } from '../config/user.config.constants';

export class User {
    constructor( public email       : string    ,
                 public password    : string    ,
                 public firstName?  : string    ,
                 public lastName?   : string    ,
                 public locPrim?    : LOC_CITY  ,
                 public locScnd?    : LOC_SCNDRY,
                 public jobType?    : UsrCLASS  ,
                 public clientCmpny?: CLNT_CMPNY) {}

    techName(firstName, lastName) {
      return (this.lastName + ", " + this.firstName);
    }

    usrClassification(jobType, clientCmpny, locPrim, locScnd) {
      return ( this.clientCmpny + " " +
               this.locPrim + " " +
               this.locScnd + " " +
               this.jobType
               );
    }
}
