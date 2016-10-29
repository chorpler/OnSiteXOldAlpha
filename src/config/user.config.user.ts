import { USERCLASS, LOCPRIMRY, LOCSCNDRY, CLNTCMPNY         }  from  './user.config.constants' ;
import { PYRLClASS, IDUCLASS, IDLOCPRM, IDLOC2ND, IDCOMPANY }  from  './user.config.constants' ;

export interface OnSiteXUSER {
  firstName : string     ;
  lastName  : string     ;
  email     : string     ;
  userClass : USERCLASS  ;
  locPrimry : LOCPRIMRY  ;
  locScndry : LOCSCNDRY  ;
  clntCmpny : CLNTCMPNY  ;
  pyrlClass : PYRLClASS  ;
  idUClass  : IDUCLASS   ;
  idLocPrm  : IDLOCPRM   ;
  idLoc2nd  : IDLOC2ND   ;
  idCompany : IDCOMPANY  ;

  createUsr(lastName: string, firstName: string) {
  let usr = this.lastName + ", " + this.firstName;
  }
}
