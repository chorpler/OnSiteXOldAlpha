import { Directive                                          }  from  '@angular/core'                   ;
import { USERCLASS, LOCPRIMRY, LOCSCNDRY, CLNTCMPNY         }  from  '../config/user.config.constants' ;
import { PYRLClASS, IDUCLASS, IDLOCPRM, IDLOC2ND, IDCOMPANY }  from  '../config/user.config.constants' ;
import { USER                                               }  from  '../config/user.config.user'      ;


@Directive({
  selector: '[user-component]' // Attribute selector
})
export class UserComponent {
  public userClass: USERCLASS  ;
  public locPrimry: LOCPRIMRY  ;
  public locScndry: LOCSCNDRY  ;
  public clntCmpny: CLNTCMPNY  ;
  public pyrlClass: PYRLClASS  ;
  public idUClass : IDUCLASS   ;
  public idLocPrm : IDLOCPRM   ;
  public idLoc2nd : IDLOC2ND   ;
  public idCompany: IDCOMPANY  ;
// public IDSUFFIX: string = IDCLASS[USR] + IDCITY[USR] + IDLOC2ND[USR] + IDCOMPANY[USR];

  constructor(private onSiteXUser: USER ) { console.log('Hello UserComponent Directive'); }


}
