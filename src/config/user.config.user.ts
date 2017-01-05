import { USERCLASS, LOCPRIMRY, LOCSCNDRY, CLNTCMPNY         } from  './user.config.constants' ;
import { PYRLClASS, IDUCLASS, IDLOCPRM, IDLOC2ND, IDCOMPANY } from  './user.config.constants' ;

export interface OSXU {
  firstName       : string;
  lastName        : string;
  middleName?     : string;
  namePrefix?     : string;
  nameSuffix?     : string;
  email           : string;
  avatarName?     : string;
  avtrNameAsUser? : Boolean;
  userClass?      : string;
  loc1?           : string;
  loc2?           : string;
  clntCmpny?      : string;
  pyrlClass?      : string;
  idUClass?       : string;
  idLocPrm?       : string;
  idLoc2nd?       : string;
  idCompany?      : string;
  userClassIndx?  : number;
  locPrimryIndx?  : number;
  locScndryIndx?  : number;
  clntCmpnyIndx?  : number;
  pyrlClassIndx?  : number;
  idUClassIndx?   : string;
  idLocPrmIndx?   : string;
  idLoc2ndIndx?   : string;
  idCompanyIndx?  : string;
}
